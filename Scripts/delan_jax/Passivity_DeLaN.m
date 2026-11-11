%% ===================== PBC + ONLINE LEARNING ON THE OFFLINE DeLaN BASIS =====================
% Same online law as Passivity_Learning.m, but the hand-picked basis is replaced by the
% basis trained offline in delan_jax (delan_basis.mat), and a friction channel is added.
%   Delta_hat = sum_j sigma_j wM_j (R_j*ddqr + C_j*dqr) + gradU*wU + F*wF
%   wM >= 0 and wF >= 0 (projected), wU free, all starting from the offline weights W0.
% The parameter mismatch is the one in Data_gen.m, i.e. the residual the basis was trained on.

clear; clc; close all;
load('delan_basis.mat', 'net', 'W0');

%% ===================== PLANT (numeric, Christoffel C) =====================
params_true = [1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.1, 0.1, 9.81];   % [m1 m2 l1 l2 lc1 lc2 I1 I2 g]
params_nom  = [0.7, 1.3, 1.0, 1.0, 0.6, 0.4, 0.06, 0.14, 9.81];  % Data_gen.m mismatch
fparams     = [0.5,0.3, 0.8,0.5, 1.2,0.8, 0.1,0.1];              % [fv1,fv2,fc1,fc2,fs1,fs2,dqs1,dqs2]

%% ===================== GAINS =====================
Lambda  = diag([5,5]);
KD      = diag([20,20]);
n_gen = 2*net.k_cone; k_U = net.k_U; k_F = net.k_F;
KomegaM = 0.5*ones(n_gen,1);   % small: W0 is already close, larger gains mostly add drift
KomegaU = 0.5*ones(k_U,1);
KomegaF = 0.5*ones(k_F,1);
wM_max  = 50; wF_max = 50;

%% ===================== TRAJECTORY, IC =====================
qd_func   = @(t) [0.5*sin(t); 0.3*cos(0.8*t)];
dqd_func  = @(t) [0.5*cos(t); -0.3*0.8*sin(0.8*t)];
ddqd_func = @(t) [-0.5*sin(t); -0.3*0.8^2*cos(0.8*t)];
q0=[0.1;-0.1]; dq0=[0;0];

tspan = linspace(0,10,1001);
opts = odeset('RelTol',1e-7,'AbsTol',1e-8);
gains = struct('Lambda',Lambda,'KD',KD,'KM',KomegaM,'KU',KomegaU,'KF',KomegaF,'wM_max',wM_max,'wF_max',wF_max);
ref = struct('q',qd_func,'dq',dqd_func,'ddq',ddqd_func);
plant = struct('p_true',params_true,'p_nom',params_nom,'fp',fparams);
W0v = [W0.wM; W0.wU; W0.wF];

%% ===================== SIMULATIONS =====================
% 1) nominal PBC only, 2) frozen offline basis + W0 (no adaptation), 3) online adaptation from W0
[t_b, x_b] = ode45(@(t,x) closedloop(t,x,net,plant,gains,ref,'none'),   tspan, [q0;dq0],     opts);
[t_f, x_f] = ode45(@(t,x) closedloop(t,x,net,plant,gains,ref,'frozen'), tspan, [q0;dq0;W0v], opts);
[t_a, x_a] = ode45(@(t,x) closedloop(t,x,net,plant,gains,ref,'adapt'),  tspan, [q0;dq0;W0v], opts);

e_of = @(t,x) x(:,1:2) - cell2mat(arrayfun(qd_func,t','UniformOutput',false))';
e_b = e_of(t_b,x_b); e_f = e_of(t_f,x_f); e_a = e_of(t_a,x_a);
late = t_b >= 5;   % after the initial transient
fprintf('RMS tracking error after t=5 s [rad]:\n');
fprintf('  nominal PBC        %.3e\n', sqrt(mean(sum(e_b(late,:).^2,2))));
fprintf('  frozen DeLaN (W0)  %.3e\n', sqrt(mean(sum(e_f(late,:).^2,2))));
fprintf('  adaptive from W0   %.3e\n', sqrt(mean(sum(e_a(late,:).^2,2))));

figure;
semilogy(t_b, vecnorm(e_b,2,2), t_f, vecnorm(e_f,2,2), t_a, vecnorm(e_a,2,2), 'LineWidth',1.5); grid on;
xlabel('t [s]'); ylabel('||e|| [rad]'); legend('nominal PBC','frozen DeLaN (W_0)','adaptive from W_0');
title('Tracking error');

figure;
plot(t_a, x_a(:,5:end), 'LineWidth',1.2); grid on;
xlabel('t [s]'); ylabel('weights'); title('Online weights [w_M; w_U; w_F]');

%% ===================== CLOSED LOOP =====================
function dx = closedloop(t,x,net,plant,g,ref,mode)
    q=x(1:2); dq=x(3:4);
    qd=ref.q(t); dqd=ref.dq(t); ddqd=ref.ddq(t);
    e=q-qd; de=dq-dqd;
    dqr=dqd-g.Lambda*e; ddqr=ddqd-g.Lambda*de; s=de+g.Lambda*e;

    pn = plant.p_nom;
    tau = M_of(q,pn)*ddqr + C_of(q,dq,pn)*dqr + g_of(q,pn) - g.KD*s;

    n_gen = 2*net.k_cone; k_U = net.k_U; k_F = net.k_F;
    if ~strcmp(mode,'none')
        w = x(5:end);
        wM = w(1:n_gen); wU = w(n_gen+1:n_gen+k_U); wF = w(n_gen+k_U+1:end);
        [R, C, gradU, F] = delan_basis_eval(q, dq, net);
        rM = zeros(2,n_gen);                    % regressor, cone sign included
        for j=1:n_gen
            rM(:,j) = net.sigma(j)*(R(:,:,j)*ddqr + C(:,:,j)*dqr);
        end
        tau = tau + rM*wM + gradU*wU + F*wF;
    end

    pt = plant.p_true;
    ddq = M_of(q,pt) \ (tau - C_of(q,dq,pt)*dq - g_of(q,pt) - friction_model(dq,plant.fp));
    dx = [dq; ddq];

    if strcmp(mode,'adapt')
        wMdot = proj(wM, -g.KM.*(rM.'*s), g.wM_max);
        wUdot = -g.KU.*(gradU.'*s);             % gravity channel is sign-free
        wFdot = proj(wF, -g.KF.*(F.'*s), g.wF_max);
        dx = [dx; wMdot; wUdot; wFdot];
    elseif strcmp(mode,'frozen')
        dx = [dx; zeros(n_gen+k_U+k_F,1)];
    end
end

function wd = proj(w, wd, w_max)
    % keep each weight in [0, w_max], as in Passivity_Learning.m
    wd((w<=0 & wd<0) | (w>=w_max & wd>0)) = 0;
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
