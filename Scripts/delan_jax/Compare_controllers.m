%% ===================== CONTROLLER COMPARISON: ERRORS AND CONTROL EFFORT =====================
% Same plant, mismatch and reference for every controller. The linear feedback is the same
% everywhere: Kp = KD*Lambda, Kd = KD, so PD-type and PBC-type laws share the same s-feedback.
%
%   PD+G          tau = -Kp e - Kd de + g0(q)                      (Takegaki-Arimoto, nominal gravity)
%   Neural PD     tau = -Kp e - Kd de + W*sigma(q,dq)              (Yu & Rosen 2012, eq. 16, 26)
%   Neural PID    neural PD + sat(Ki int(-e)), conditional integration (eq. 19, 36)
%   PBC           Slotine-Li on the nominal model
%   PBC+NN        PBC + DeLaN basis, online weights with e-mod leaking toward W0
%   +SMC          any of the above - K sat(s/phi), with the same s = de + Lambda e
% Since Kp = KD*Lambda and Kd = KD, -Kp e - Kd de = -KD s: PD+G+SMC and PBC+SMC differ only by
% the nominal feedforward M0*ddqr + C0*dqr, which isolates what the PBC structure contributes.
%
% Neural PD/PID are model-free: one hidden layer of fixed sigmoid features on [q; dq] and an
% adapted output layer starting from zero, as in Yu & Rosen. Their sign convention q~ = qd - q
% is rewritten here with e = q - qd.

clear; clc; close all;
load('delan_basis.mat', 'net', 'W0');

%% ===================== PLANT =====================
P.p_true = [1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.1, 0.1, 9.81];   % [m1 m2 l1 l2 lc1 lc2 I1 I2 g]
P.p_nom  = [0.7, 1.3, 1.0, 1.0, 0.6, 0.4, 0.06, 0.14, 9.81];  % Data_gen.m mismatch
P.fp     = [0.5,0.3, 0.8,0.5, 1.2,0.8, 0.1,0.1];              % [fv1,fv2,fc1,fc2,fs1,fs2,dqs1,dqs2]

%% ===================== GAINS =====================
G.Lambda = diag([5,5]);
G.KD     = diag([20,20]);
G.Kp     = G.KD*G.Lambda;          % PD-type laws: same feedback as PBC
G.Kd     = G.KD;
% DeLaN online law (PBC+NN): wdot = -Gamma (r's + kappa ||s|| (w - W0)), projected
G.Gamma  = 0.5;
G.kappa  = 1.0;
G.w_max  = 50;
% Neural PD/PID (Yu & Rosen): What_dot = -Kw s sigma', s = de + alpha e
G.m_rbf  = 20;
G.Kw     = 20;
G.alpha  = 5;
G.Ki     = diag([50,50]);
G.nu_max = 20;                     % integral saturation [N m]
% Boundary-layer SMC
G.K_smc  = diag([5,5]);
G.phi    = 0.02;

% fixed hidden layer of the neural PD/PID: deterministic quasi-random weights (same in MATLAB/Octave)
kron_seq = [0.7548776662, 0.5698402910, 0.4142135624, 0.3141592654, 0.2360679775];
H = 2*mod((1:G.m_rbf)'*kron_seq, 1) - 1;
G.V  = 2*H(:,1:4)*diag([1, 1, 0.5, 0.5]);   % input scaling: q [rad], dq [rad/s]
G.bV = 2*H(:,5);

%% ===================== REFERENCE, IC, TIME =====================
R.q   = @(t) [0.5*sin(t); 0.3*cos(0.8*t)];
R.dq  = @(t) [0.5*cos(t); -0.3*0.8*sin(0.8*t)];
R.ddq = @(t) [-0.5*sin(t); -0.3*0.8^2*cos(0.8*t)];
q0 = [0.1; -0.1]; dq0 = [0; 0];
T_end = 20; t_ss = 10;             % metrics on t >= t_ss (steady state)
tspan = linspace(0, T_end, 2001);
opts = odeset('RelTol',1e-7,'AbsTol',1e-8);

%% ===================== CONTROLLERS =====================
%            name           law    nominal  nn       integral smc
C = struct('name',{'PD+G','PD+G+SMC','Neural PD','Neural PD+SMC','Neural PID','Neural PID+SMC', ...
                   'PBC','PBC+SMC','PBC+NN','PBC+NN+SMC'}, ...
           'law', {'pd',  'pd',      'pd',       'pd',           'pd',        'pd', ...
                   'pbc', 'pbc',     'pbc',      'pbc'}, ...
           'nn',  {'none','none',    'rbf',      'rbf',          'rbf',       'rbf', ...
                   'none','none',    'delan',    'delan'}, ...
           'integral',{false,false,  false,      false,          true,        true, ...
                   false, false,     false,      false}, ...
           'smc', {false, true,      false,      true,           false,       true, ...
                   false, true,      false,      true});

n_d = numel(W0.wM) + numel(W0.wU) + numel(W0.wF);
x0 = [q0; dq0; W0.wM; W0.wU; W0.wF; zeros(2*G.m_rbf,1); zeros(2,1)];
L = struct('n_d', n_d, 'm', G.m_rbf);

%% ===================== SIMULATE ALL =====================
res = struct('name',{},'t',{},'e',{},'tau',{},'w',{});
for c = 1:numel(C)
    fprintf('simulating %-12s ...', C(c).name); tic;
    [t, x] = ode45(@(t,x) closedloop(t,x,C(c),net,W0,P,G,R,L), tspan, x0, opts);
    tau = zeros(numel(t),2);
    for k = 1:numel(t)
        [~, tau_k] = closedloop(t(k), x(k,:)', C(c), net, W0, P, G, R, L);
        tau(k,:) = tau_k';
    end
    qd = cell2mat(arrayfun(R.q, t', 'UniformOutput', false))';
    res(c).name = C(c).name; res(c).t = t; res(c).e = x(:,1:2) - qd; res(c).tau = tau;
    res(c).w = x(:,5:end);
    fprintf(' %.1f s\n', toc);
end

%% ===================== METRICS =====================
% tau_star: torque the TRUE plant needs to follow the reference exactly (inverse dynamics on qd).
% RMS ||tau - tau_star|| is the effort spent beyond what the task needs (transient, chattering, mismatch).
fprintf('\n%-12s %11s %11s %11s %11s %11s %11s\n', 'controller', 'RMS e_ss', 'max e_ss', 'RMS tau', 'int tau^2', 'RMS dtau*', 'TV tau/T');
fprintf('%-12s %11s %11s %11s %11s %11s %11s\n', '', '[rad]', '[rad]', '[N m]', '[N2 m2 s]', '[N m]', '[N m/s]');
metrics = zeros(numel(res), 6);
for c = 1:numel(res)
    t = res(c).t; ss = t >= t_ss;
    en = vecnorm(res(c).e, 2, 2); tn = vecnorm(res(c).tau, 2, 2);
    tau_star = zeros(numel(t), 2);
    for k = 1:numel(t)
        qd = R.q(t(k)); dqd = R.dq(t(k)); pt = P.p_true;
        tau_star(k,:) = (M_of(qd,pt)*R.ddq(t(k)) + C_of(qd,dqd,pt)*dqd + g_of(qd,pt) + friction_model(dqd,P.fp))';
    end
    metrics(c,:) = [sqrt(mean(en(ss).^2)), max(en(ss)), sqrt(mean(tn.^2)), trapz(t, tn.^2), ...
                    sqrt(mean(vecnorm(res(c).tau - tau_star, 2, 2).^2)), sum(vecnorm(diff(res(c).tau), 2, 2))/t(end)];
    fprintf('%-12s %11.3e %11.3e %11.3f %11.1f %11.3f %11.2f\n', res(c).name, metrics(c,:));
end
save('compare_results.mat', 'res', 'metrics', 'G', 'C');

%% ===================== PLOTS =====================
names = {res.name};
figure;
for c = 1:numel(res), semilogy(res(c).t, vecnorm(res(c).e,2,2), 'LineWidth', 1.2); hold on; end
grid on; xlabel('t [s]'); ylabel('||e|| [rad]'); legend(names, 'Location', 'eastoutside');
title('Tracking error');

figure;
for j = 1:2
    subplot(2,1,j);
    for c = 1:numel(res), plot(res(c).t, res(c).tau(:,j), 'LineWidth', 1.0); hold on; end
    grid on; ylabel(sprintf('\\tau_%d [N m]', j));
end
xlabel('t [s]'); legend(names, 'Location', 'eastoutside'); sgtitle('Control torque');

figure;
subplot(1,2,1); bar(metrics(:,1)); set(gca,'YScale','log','XTick',1:numel(res),'XTickLabel',names); xtickangle(45);
ylabel('RMS ||e|| [rad], t \geq 10 s'); grid on;
subplot(1,2,2); bar(metrics(:,5)); set(gca,'XTick',1:numel(res),'XTickLabel',names); xtickangle(45);
ylabel('RMS ||\tau - \tau^*|| [N m]'); grid on;

%% ===================== CLOSED LOOP =====================
function [dx, tau] = closedloop(t, x, c, net, W0, P, G, R, L)
    q = x(1:2); dq = x(3:4);
    iw = 4 + (1:L.n_d);                    % DeLaN weights
    iW = 4 + L.n_d + (1:2*L.m);            % neural PD/PID output layer
    ix = 4 + L.n_d + 2*L.m + (1:2);        % integral state
    dx = zeros(size(x));

    qd = R.q(t); dqd = R.dq(t); ddqd = R.ddq(t);
    e = q - qd; de = dq - dqd;
    dqr = dqd - G.Lambda*e; ddqr = ddqd - G.Lambda*de; s = de + G.Lambda*e;

    % --- feedback + model part ---
    if strcmp(c.law, 'pd')
        tau = -G.Kp*e - G.Kd*de;
        if strcmp(c.nn, 'none'), tau = tau + g_of(q, P.p_nom); end
    else
        pn = P.p_nom;
        tau = M_of(q,pn)*ddqr + C_of(q,dq,pn)*dqr + g_of(q,pn) - G.KD*s;
    end

    % --- neural PD/PID (Yu & Rosen): f_hat = W sigma(V [q; dq] + bV) ---
    if strcmp(c.nn, 'rbf')
        sig = 1 ./ (1 + exp(-(G.V*[q; dq] + G.bV)));
        W = reshape(x(iW), 2, L.m);
        tau = tau + W*sig;
        r = de + G.alpha*e;
        dx(iW) = reshape(-G.Kw*r*sig.', [], 1);
    end
    if c.integral
        xi = x(ix);
        tau = tau + xi;
        dxi = -G.Ki*e;                     % Ki int(qd - q)
        dxi(abs(xi) >= G.nu_max & sign(dxi) == sign(xi)) = 0;   % conditional integration
        dx(ix) = dxi;
    end

    % --- DeLaN basis with online weights (e-mod toward W0) ---
    if strcmp(c.nn, 'delan')
        n_gen = 2*net.k_cone; k_U = net.k_U;
        w = x(iw); w0 = [W0.wM; W0.wU; W0.wF];
        [Rb, Cb, gradU, F] = delan_basis_eval(q, dq, net);
        rM = zeros(2, n_gen);
        for j = 1:n_gen
            rM(:,j) = net.sigma(j)*(Rb(:,:,j)*ddqr + Cb(:,:,j)*dqr);
        end
        reg = [rM, gradU, F];
        tau = tau + reg*w;
        wd = -G.Gamma*(reg.'*s + G.kappa*norm(s)*(w - w0));
        signed = n_gen + (1:k_U);          % gravity weights are sign-free
        proj = true(size(w)); proj(signed) = false;
        wd(proj & ((w <= 0 & wd < 0) | (w >= G.w_max & wd > 0))) = 0;
        dx(iw) = wd;
    end

    % --- boundary-layer SMC ---
    if c.smc
        tau = tau - G.K_smc*sat(s/G.phi);
    end

    % --- true plant ---
    pt = P.p_true;
    ddq = M_of(q,pt) \ (tau - C_of(q,dq,pt)*dq - g_of(q,pt) - friction_model(dq,P.fp));
    dx(1:4) = [dq; ddq];
end

function y = sat(x)
    y = min(max(x, -1), 1);
end

%% ===================== MODEL (same as Data_gen.m, numeric) =====================
function M = M_of(q,p)
    m1=p(1); m2=p(2); l1=p(3); lc1=p(5); lc2=p(6); I1=p(7); I2=p(8);
    M11 = m1*lc1^2 + I1 + m2*(l1^2 + lc2^2 + 2*l1*lc2*cos(q(2))) + I2;
    M12 = m2*(lc2^2 + l1*lc2*cos(q(2))) + I2;
    M = [M11, M12; M12, m2*lc2^2+I2];
end

function C = C_of(q,dq,p)
    h = p(2)*p(3)*p(6)*sin(q(2));
    C = [-h*dq(2), -h*(dq(1)+dq(2)); h*dq(1), 0];
end

function g = g_of(q,p)
    m1=p(1); m2=p(2); l1=p(3); lc1=p(5); lc2=p(6); ga=p(9);
    g = [m1*ga*lc1*cos(q(1)) + m2*ga*(l1*cos(q(1)) + lc2*cos(q(1)+q(2))); m2*ga*lc2*cos(q(1)+q(2))];
end

function F = friction_model(dq, fparams)
    fv=fparams(1:2); fc=fparams(3:4); fs=fparams(5:6); dqs=fparams(7:8);
    fv=fv(:); fc=fc(:); fs=fs(:); dqs=dqs(:); dq=dq(:);
    eps_smooth = 0.01;
    Str = fc + (fs-fc).*exp(-(dq./dqs).^2);
    F = fv.*dq + Str.*tanh(dq/eps_smooth);
end
