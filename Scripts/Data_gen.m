%% ===================== SECTION 1: CLEAN (fresh script, reuses symbolic setup) =====================
clear; clc; close all;

% NOTE: re-run Sections 2-5 from your earlier sandbox script first
% (symbolic M_func, C_func, g_func, friction_model, params_true, params_nom, fparams)
% so they exist in the workspace before running this.

%% ===================== SECTION 2: SYMBOLIC M, C, g, F =====================
syms q1 q2 dq1 dq2 real
syms m1 m2 l1 l2 lc1 lc2 I1 I2 g_acc real

h_term = m2*l1*lc2*sin(q2);

M11 = m1*lc1^2 + I1 + m2*(l1^2 + lc2^2 + 2*l1*lc2*cos(q2)) + I2;
M12 = m2*(lc2^2 + l1*lc2*cos(q2)) + I2;
M = [M11, M12; M12, m2*lc2^2+I2];

C = [-h_term*dq2, h_term*dq1; -h_term*dq1-h_term*dq2, 0];

P = m1*g_acc*lc1*sin(q1) + m2*g_acc*(l1*sin(q1)+lc2*sin(q1+q2));
gq = [diff(P,q1); diff(P,q2)];

params_sym = [m1,m2,l1,l2,lc1,lc2,I1,I2,g_acc];

function F = friction_model(dq, fparams)
    fv=fparams(1:2); fc=fparams(3:4); fs=fparams(5:6); dqs=fparams(7:8);
    fv=fv(:); fc=fc(:); fs=fs(:); dqs=dqs(:); dq=dq(:);
    eps_smooth = 0.01;
    Str = fc + (fs-fc).*exp(-(dq./dqs).^2);
    F = fv.*dq + Str.*tanh(dq/eps_smooth);
end

%% ===================== SECTION 5: TRUE vs NOMINAL PARAMETERS (unmatched case) =====================
p_true.m1=1.0; p_true.m2=1.0; p_true.l1=1.0; p_true.l2=1.0;
p_true.lc1=0.5; p_true.lc2=0.5; p_true.I1=0.1; p_true.I2=0.1; p_true.g_acc=9.81;
params_true = [p_true.m1,p_true.m2,p_true.l1,p_true.l2,p_true.lc1,p_true.lc2,p_true.I1,p_true.I2,p_true.g_acc];

p_nom = p_true;
p_nom.m1  = 0.7*p_true.m2;    % 30% mass underestimate, link 1
p_nom.m2  = 1.3*p_true.m2;    % 30% mass overestimate, link 2
p_nom.lc1 = 1.2*p_true.lc1;   % COM estimation error
p_nom.lc2 = 0.8*p_true.lc2;   % COM estimation error
p_nom.I1 = 0.6*p_true.I1;   % Inertia estimation error
p_nom.I2 = 1.4*p_true.I2;   % Inertia estimation error
params_nom = [p_nom.m1,p_nom.m2,p_nom.l1,p_nom.l2,p_nom.lc1,p_nom.lc2,p_nom.I1,p_nom.I2,p_nom.g_acc];

fparams = [0.5,0.3, 0.8,0.5, 1.2,0.8, 0.1,0.1];  % [fv1,fv2,fc1,fc2,fs1,fs2,dqs1,dqs2]

%% ===================== NUMERIC FUNCTIONS (for ODE sim) =====================

params_sym = [m1, m2, l1, l2, lc1, lc2, I1, I2, g_acc]; % symbolic parameter list

M_func = matlabFunction(M,  'Vars', {q1, q2, params_sym});
C_func = matlabFunction(C,  'Vars', {q1, q2, dq1, dq2, params_sym});
g_func = matlabFunction(gq, 'Vars', {q1, q2, params_sym});

%% --- Desired trajectory (smooth, C^2) ---
qd_func   = @(t) [0.5*sin(t); 0.3*cos(0.8*t)];
dqd_func  = @(t) [0.5*cos(t); -0.3*0.8*sin(0.8*t)];
ddqd_func = @(t) [-0.5*sin(t); -0.3*0.8^2*cos(0.8*t)];

%% --- Initial conditions (with tracking error, to see convergence) ---
q0  = [0.1; -0.1];
dq0 = [0; 0];
x0  = [q0; dq0];

%% ===================== SECTION 6: GAINS =====================
Lambda = diag([5,5]);
KD     = diag([20,20]);

%% ===================== SECTION A: FOURIER TRAJECTORY DESIGN =====================
% q_i(t) = q0_i + sum_k [a_ik*sin(k*w0*t) + b_ik*cos(k*w0*t)]
% Random coefficients per trajectory, same w0 (so all trajectories share one period T = 2*pi/w0
% and are differentiable to any order needed).

n_dof  = 2;
N_harm = 4;           % harmonics per joint
T_period = 10;        % seconds, one full period
w0 = 2*pi/T_period;

n_traj = 12;           % number of independent excitation trajectories to generate
amp_scale = [0.6, 0.6]; % max per-joint amplitude budget, rad (keeps q,dq,ddq physically reasonable)

rng(1);  % reproducible dataset

traj_coeffs = struct('q0',{},'a',{},'b',{});
for tr = 1:n_traj
    q0_i = 0.3*(2*rand(n_dof,1)-1);
    a = zeros(n_dof,N_harm);
    b = zeros(n_dof,N_harm);
    for i = 1:n_dof
        raw = (2*rand(1,N_harm)-1) ./ (1:N_harm);   % energy decays with harmonic index -> smoother curves
        raw = raw / sum(abs(raw)) * amp_scale(i);    % normalize total amplitude budget
        a(i,:) = raw .* (2*rand(1,N_harm)-1);
        raw2 = (2*rand(1,N_harm)-1) ./ (1:N_harm);
        raw2 = raw2 / sum(abs(raw2)) * amp_scale(i);
        b(i,:) = raw2 .* (2*rand(1,N_harm)-1);
    end
    traj_coeffs(tr).q0 = q0_i;
    traj_coeffs(tr).a  = a;
    traj_coeffs(tr).b  = b;
end

function [qd,dqd,ddqd] = fourier_traj(t, coeffs, w0, N_harm)
    n_dof = size(coeffs.a,1);
    qd = coeffs.q0; dqd = zeros(n_dof,1); ddqd = zeros(n_dof,1);
    for k = 1:N_harm
        wk = k*w0;
        s_ = sin(wk*t); c_ = cos(wk*t);
        qd   = qd   + coeffs.a(:,k)*s_        + coeffs.b(:,k)*c_;
        dqd  = dqd  + coeffs.a(:,k)*wk*c_      - coeffs.b(:,k)*wk*s_;
        ddqd = ddqd - coeffs.a(:,k)*wk^2*s_    - coeffs.b(:,k)*wk^2*c_;
    end
end

%% ===================== SECTION B: SIMULATE "TRUE" PLANT UNDER NOMINAL PBC, LOG DATA =====================
% Purpose here is ONLY to produce physically plausible (q,dq,tau) triples the way a logged
% experiment would -- the nominal PBC controller is just what keeps the arm moving along
% qd_fourier(t); it is NOT part of what gets learned later.

Lambda = diag([5,5]);
KD     = diag([20,20]);
dt_log = 0.01;                 % sample period for logged data (~100 Hz, typical encoder rate)
tspan_log = 0:dt_log:T_period;

opts = odeset('RelTol',1e-9,'AbsTol',1e-9);

dataset = struct('t',{},'q',{},'dq',{},'tau',{},'traj_id',{});

for tr = 1:n_traj
    coeffs = traj_coeffs(tr);
    qd_func_tr   = @(t) local_q(t,coeffs,w0,N_harm);
    dqd_func_tr  = @(t) local_dq(t,coeffs,w0,N_harm);
    ddqd_func_tr = @(t) local_ddq(t,coeffs,w0,N_harm);

    q0  = qd_func_tr(0);
    dq0 = dqd_func_tr(0);
    x0  = [q0;dq0];

    [t_sim, x_sim] = ode45(@(t,x) plant_with_nominal_pbc(t,x,params_nom,params_true,fparams, ...
                    Lambda,KD,M_func,C_func,g_func,qd_func_tr,dqd_func_tr,ddqd_func_tr), ...
                    tspan_log, x0, opts);

    % recompute tau at each logged sample (ode45 doesn't return it directly)
    tau_log = zeros(length(t_sim),2);
    for k = 1:length(t_sim)
        [~, tau_k] = plant_with_nominal_pbc(t_sim(k), x_sim(k,:)', params_nom,params_true,fparams, ...
                        Lambda,KD,M_func,C_func,g_func,qd_func_tr,dqd_func_tr,ddqd_func_tr);
        tau_log(k,:) = tau_k';
    end

    dataset(tr).t   = t_sim;
    dataset(tr).q   = x_sim(:,1:2);
    dataset(tr).dq  = x_sim(:,3:4);
    dataset(tr).tau = tau_log;
    dataset(tr).traj_id = tr;
end

% --- helper trajectory wrappers (needed because fourier_traj returns 3 outputs) ---
function qd = local_q(t,coeffs,w0,N_harm)
    [qd,~,~] = fourier_traj(t,coeffs,w0,N_harm);
end
function dqd = local_dq(t,coeffs,w0,N_harm)
    [~,dqd,~] = fourier_traj(t,coeffs,w0,N_harm);
end
function ddqd = local_ddq(t,coeffs,w0,N_harm)
    [~,~,ddqd] = fourier_traj(t,coeffs,w0,N_harm);
end

%% ===================== PLANT + NOMINAL PBC (returns tau too, for logging) =====================
function [dx, tau] = plant_with_nominal_pbc(t,x,params_nom,params_true,fparams,Lambda,KD, ...
                        M_func,C_func,g_func,qd_func,dqd_func,ddqd_func)
    q=x(1:2); dq=x(3:4);
    qd=qd_func(t); dqd=dqd_func(t); ddqd=ddqd_func(t);
    e=q-qd; de=dq-dqd;
    dqr=dqd-Lambda*e; ddqr=ddqd-Lambda*de; s=de+Lambda*e;

    Mhat=M_func(q(1),q(2),params_nom); Chat=C_func(q(1),q(2),dq(1),dq(2),params_nom); ghat=g_func(q(1),q(2),params_nom);
    tau = Mhat*ddqr + Chat*dqr + ghat - KD*s;

    Mtrue=M_func(q(1),q(2),params_true); Ctrue=C_func(q(1),q(2),dq(1),dq(2),params_true); gtrue=g_func(q(1),q(2),params_true);
    Ff=friction_model(dq,fparams);
    ddq = Mtrue\(tau - Ctrue*dq - gtrue - Ff);
    dx=[dq;ddq];
end

%% ===================== SECTION C: SPLIT TRAIN / VAL / TEST, SAVE =====================
idx = randperm(n_traj);
n_train = round(0.7*n_traj);
n_val   = round(0.15*n_traj);

train_ids = idx(1:n_train);
val_ids   = idx(n_train+1:n_train+n_val);
test_ids  = idx(n_train+n_val+1:end);

save('delan_dataset.mat','dataset','traj_coeffs','train_ids','val_ids','test_ids', ...
     'w0','N_harm','T_period','dt_log');

fprintf('Generated %d trajectories: %d train, %d val, %d test.\n', ...
    n_traj, numel(train_ids), numel(val_ids), numel(test_ids));

%% ===================== SECTION D: SANITY-CHECK PLOTS =====================
figure; hold on;
for tr = train_ids
    plot(dataset(tr).q(:,1), dataset(tr).q(:,2));
end
xlabel('q_1'); ylabel('q_2'); grid on;
title('Configuration-space coverage of training trajectories');

figure;
subplot(3,1,1); plot(dataset(1).t, dataset(1).q); ylabel('q'); grid on;
subplot(3,1,2); plot(dataset(1).t, dataset(1).dq); ylabel('dq'); grid on;
subplot(3,1,3); plot(dataset(1).t, dataset(1).tau); ylabel('\tau'); xlabel('t [s]'); grid on;
sgtitle('Example logged trajectory #1');

%% ===================== SECTION E: BUILD INTEGRAL/MOMENTUM REGRESSION WINDOWS =====================
% Non-overlapping windows over each logged trajectory.
% Each window stores: endpoints (q,dq) for the momentum difference,
% and the FULL intra-window (t,q,dq,tau) series, needed later to
% numerically integrate the candidate model's own C'*dq, g, D*dq terms.

w_len = 20;   % samples per window (0.2 s at dt_log=0.01s) -- tune: longer windows average out
              % more noise but reduce the number of independent training examples

windows = struct('traj_id',{},'t',{},'q',{},'dq',{},'tau',{}, ...
                  'q1',{},'dq1',{},'q2',{},'dq2',{},'tau_int',{});

win_count = 0;
for tr = 1:n_traj
    Nt = length(dataset(tr).t);
    n_full_windows = floor((Nt-1)/w_len);
    for w = 1:n_full_windows
        idx1 = (w-1)*w_len + 1;
        idx2 = w*w_len + 1;

        win_count = win_count + 1;
        windows(win_count).traj_id = tr;
        windows(win_count).t   = dataset(tr).t(idx1:idx2);
        windows(win_count).q   = dataset(tr).q(idx1:idx2,:);
        windows(win_count).dq  = dataset(tr).dq(idx1:idx2,:);
        windows(win_count).tau = dataset(tr).tau(idx1:idx2,:);

        windows(win_count).q1  = dataset(tr).q(idx1,:)';
        windows(win_count).dq1 = dataset(tr).dq(idx1,:)';
        windows(win_count).q2  = dataset(tr).q(idx2,:)';
        windows(win_count).dq2 = dataset(tr).dq(idx2,:)';

        % tau integral is precomputable NOW (doesn't depend on the candidate network theta)
        windows(win_count).tau_int = trapz(windows(win_count).t, windows(win_count).tau, 1)';
    end
end

fprintf('Built %d regression windows from %d trajectories (%d samples/window).\n', ...
    win_count, n_traj, w_len);

% --- propagate train/val/test split from trajectories to windows ---
win_traj = [windows.traj_id];
win_train_ids = find(ismember(win_traj, train_ids));
win_val_ids   = find(ismember(win_traj, val_ids));
win_test_ids  = find(ismember(win_traj, test_ids));

fprintf('Windows: %d train, %d val, %d test.\n', ...
    numel(win_train_ids), numel(win_val_ids), numel(win_test_ids));

save('delan_dataset_filtered.mat','windows','win_train_ids','win_val_ids','win_test_ids','w_len');

%% ===================== SECTION F: SANITY CHECK -- VERIFY THE IDENTITY WITH TRUE PARAMS =====================
% Since we DO happen to know params_true in simulation, we can verify the momentum
% identity holds EXACTLY (up to integration/quadrature error) before trusting it as
% a training target. This is a pure numerical sanity check -- the real pipeline
% will never have access to params_true.

check_errs = zeros(win_count,1);
for k = 1:win_count
    w = windows(k);
    M1 = M_func(w.q1(1),w.q1(2),params_true);
    M2 = M_func(w.q2(1),w.q2(2),params_true);
    lhs = M2*w.dq2 - M1*w.dq1;

    n_pts = length(w.t);
    integrand = zeros(n_pts,2);
    for i = 1:n_pts
        qi=w.q(i,:)'; dqi=w.dq(i,:)';
        Ctrue = C_func(qi(1),qi(2),dqi(1),dqi(2),params_true);
        gtrue = g_func(qi(1),qi(2),params_true);
        Ftrue = friction_model(dqi,fparams);
        integrand(i,:) = (Ctrue'*dqi - gtrue - Ftrue)';
    end
    rhs = w.tau_int + trapz(w.t, integrand, 1)';
    check_errs(k) = norm(lhs-rhs);
end

figure;
plot(check_errs,'.'); grid on;
xlabel('window index'); ylabel('||LHS - RHS||');
title('Sanity check: momentum identity residual using TRUE params (should be \approx 0)');
fprintf('Max identity residual (true params, numerical-quadrature error only): %.3e\n', max(check_errs));