%% ===================== ROBUSTNESS SCENARIOS: WHERE LEARNING IS NOT ENOUGH =====================
% PBC, PBC+SMC, PBC+NN and PBC+NN+SMC (same gains as Compare_controllers.m) under:
%   nominal      the residual the basis was trained on (reference case)
%   disturbance  external torque pulse tau_d = [5; 2] N m on 12 <= t < 14 s (contact, push)
%   payload      m2 and I2 x1.5 from t = 10 s (plant changes after training)
%   cold start   online weights start at 0 and leak toward 0 (no offline weights)
%   actuator     unmodeled first-order actuator lag, T_a = 20 ms (out of class for any E-L basis)
% Metrics after the event: RMS and peak ||e||, and RMS ||tau - tau_star||.

clear; clc; close all;
load('delan_basis.mat', 'net', 'W0');

%% ===================== PLANT =====================
P.p_true = [1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.1, 0.1, 9.81];   % [m1 m2 l1 l2 lc1 lc2 I1 I2 g]
P.p_nom  = [0.7, 1.3, 1.0, 1.0, 0.6, 0.4, 0.06, 0.14, 9.81];  % Data_gen.m mismatch
P.fp     = [0.5,0.3, 0.8,0.5, 1.2,0.8, 0.1,0.1];

%% ===================== GAINS (same as Compare_controllers.m) =====================
G.Lambda = diag([5,5]);
G.KD     = diag([20,20]);
G.Gamma  = 0.5;
G.kappa  = 1.0;
G.w_max  = 50;
G.K_smc  = diag([5,5]);
G.phi    = 0.02;

%% ===================== REFERENCE, TIME =====================
R.q   = @(t) [0.5*sin(t); 0.3*cos(0.8*t)];
R.dq  = @(t) [0.5*cos(t); -0.3*0.8*sin(0.8*t)];
R.ddq = @(t) [-0.5*sin(t); -0.3*0.8^2*cos(0.8*t)];
q0 = [0.1; -0.1]; dq0 = [0; 0];
T_end = 20;
tspan = linspace(0, T_end, 2001);
opts = odeset('RelTol',1e-7,'AbsTol',1e-8);

%% ===================== SCENARIOS AND CONTROLLERS =====================
S = struct('name',   {'nominal','disturbance','payload','cold start','actuator'}, ...
           't_event',{10,        12,           10,       0,           10}, ...
           'dist',   {false,     true,         false,    false,       false}, ...
           'payload',{false,     false,        true,     false,       false}, ...
           'cold',   {false,     false,        false,    true,        false}, ...
           'T_a',    {0,         0,            0,        0,           0.02});
C = struct('name',{'PBC','PBC+SMC','PBC+NN','PBC+NN+SMC'}, ...
           'nn',  {false, false,    true,    true}, ...
           'smc', {false, true,     false,   true});

w0 = [W0.wM; W0.wU; W0.wF];
n_d = numel(w0);

%% ===================== SIMULATE =====================
res = struct('scenario',{},'name',{},'t',{},'e',{},'tau',{},'tau_star',{});
for k = 1:numel(S)
    sc = S(k);
    w_init = w0; w_leak = w0;
    if sc.cold, w_init = zeros(n_d,1); w_leak = zeros(n_d,1); end
    for c = 1:numel(C)
        fprintf('%-12s %-11s ...', sc.name, C(c).name); tic;
        x0 = [q0; dq0; w_init; zeros(2,1)];          % last two: actuator torque state
        x0(end-1:end) = 0;
        [t, x] = ode45(@(t,x) closedloop(t,x,C(c),sc,net,w_leak,P,G,R,n_d), tspan, x0, opts);
        tau = zeros(numel(t),2); tau_star = zeros(numel(t),2);
        for i = 1:numel(t)
            [~, tau_i, ts_i] = closedloop(t(i), x(i,:)', C(c), sc, net, w_leak, P, G, R, n_d);
            tau(i,:) = tau_i'; tau_star(i,:) = ts_i';
        end
        qd = cell2mat(arrayfun(R.q, t', 'UniformOutput', false))';
        res(end+1) = struct('scenario',sc.name,'name',C(c).name,'t',t,'e',x(:,1:2)-qd,'tau',tau,'tau_star',tau_star);
        fprintf(' %.1f s\n', toc);
    end
end

%% ===================== METRICS =====================
fprintf('\n%-12s %-11s %12s %12s %12s\n', 'scenario', 'controller', 'RMS e post', 'peak e post', 'RMS dtau*');
fprintf('%-12s %-11s %12s %12s %12s\n', '', '', '[rad]', '[rad]', '[N m]');
metrics = zeros(numel(res), 3);
for r = 1:numel(res)
    sc = S(strcmp({S.name}, res(r).scenario));
    t = res(r).t; post = t >= max(sc.t_event, 2);   % skip the first 2 s (initial-condition transient)
    en = vecnorm(res(r).e, 2, 2);
    metrics(r,:) = [sqrt(mean(en(post).^2)), max(en(post)), ...
                    sqrt(mean(vecnorm(res(r).tau(post,:) - res(r).tau_star(post,:), 2, 2).^2))];
    fprintf('%-12s %-11s %12.3e %12.3e %12.3f\n', res(r).scenario, res(r).name, metrics(r,:));
end
save('robustness_results.mat', 'res', 'metrics', 'S', 'C', 'G');

%% ===================== PLOTS =====================
figure;
for k = 1:numel(S)
    subplot(numel(S),1,k);
    idx = find(strcmp({res.scenario}, S(k).name));
    for r = idx, semilogy(res(r).t, vecnorm(res(r).e,2,2), 'LineWidth', 1.1); hold on; end
    xline(S(k).t_event, '--k'); grid on; ylabel('||e|| [rad]'); title(S(k).name);
end
xlabel('t [s]'); legend({C.name}, 'Location', 'eastoutside');

%% ===================== CLOSED LOOP =====================
function [dx, tau, tau_star] = closedloop(t, x, c, sc, net, w_leak, P, G, R, n_d)
    q = x(1:2); dq = x(3:4); iw = 4 + (1:n_d); ia = 4 + n_d + (1:2);
    dx = zeros(size(x));

    qd = R.q(t); dqd = R.dq(t); ddqd = R.ddq(t);
    e = q - qd; de = dq - dqd;
    dqr = dqd - G.Lambda*e; ddqr = ddqd - G.Lambda*de; s = de + G.Lambda*e;

    pn = P.p_nom;
    tau = M_of(q,pn)*ddqr + C_of(q,dq,pn)*dqr + g_of(q,pn) - G.KD*s;

    if c.nn
        n_gen = 2*net.k_cone; k_U = net.k_U;
        w = x(iw);
        [Rb, Cb, gradU, F] = delan_basis_eval(q, dq, net);
        rM = zeros(2, n_gen);
        for j = 1:n_gen
            rM(:,j) = net.sigma(j)*(Rb(:,:,j)*ddqr + Cb(:,:,j)*dqr);
        end
        reg = [rM, gradU, F];
        tau = tau + reg*w;
        wd = -G.Gamma*(reg.'*s + G.kappa*norm(s)*(w - w_leak));
        proj = true(size(w)); proj(n_gen + (1:k_U)) = false;
        wd(proj & ((w <= 0 & wd < 0) | (w >= G.w_max & wd > 0))) = 0;
        dx(iw) = wd;
    end
    if c.smc
        tau = tau - G.K_smc*sat(s/G.phi);
    end

    % --- true plant: payload change, actuator lag, external disturbance ---
    pt = P.p_true;
    if sc.payload && t >= sc.t_event, pt([2 8]) = 1.5*pt([2 8]); end
    if sc.T_a > 0
        tau_a = x(ia);
        dx(ia) = (tau - tau_a)/sc.T_a;
    else
        tau_a = tau;
    end
    tau_d = [0; 0];
    if sc.dist && t >= sc.t_event && t < sc.t_event + 2, tau_d = [5; 2]; end
    ddq = M_of(q,pt) \ (tau_a + tau_d - C_of(q,dq,pt)*dq - g_of(q,pt) - friction_model(dq,P.fp));
    dx(1:4) = [dq; ddq];

    % torque the current true plant needs on the reference (without the disturbance)
    tau_star = M_of(qd,pt)*ddqd + C_of(qd,dqd,pt)*dqd + g_of(qd,pt) + friction_model(dqd,P.fp);
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
