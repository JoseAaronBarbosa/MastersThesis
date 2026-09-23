%% ===================== NOMINAL PBC CONTROLLER — CLOSED-LOOP SIM =====================
% tau = Mhat(q)*ddqr + Chat(q,dq)*dqr + ghat(q) - KD*s
% Matched case: Mhat=M, Chat=C, ghat=g (no friction, no learning, no STA)
% Plant: M(q)*ddq + C(q,dq)*dq + g(q) = tau

clear; clc; close all;

%% --- Symbolic matrices ---

syms q1 q2 dq1 dq2 real
syms m1 m2 l1 l2 lc1 lc2 I1 I2 g_acc real 

q  = [q1; q2];
dq = [dq1; dq2];

% --- Inertia matrix M(q) ---
h = m2*l1*lc2*sin(q2); 

M11 = m1*lc1^2 + I1 + m2*(l1^2 + lc2^2 + 2*l1*lc2*cos(q2)) + I2;
M12 = m2*(lc2^2 + l1*lc2*cos(q2)) + I2;
M21 = M12;
M22 = m2*lc2^2 + I2;

M = [M11, M12;
     M21, M22];

% --- Coriolis/centrifugal matrix C(q,qdot), Christoffel construction ---
C = [ -h*dq2,        h*dq1;
      -h*dq1 - h*dq2,  0  ];

% --- Gravity vector g(q) ---
P = m1*g_acc*lc1*sin(q1) + m2*g_acc*(l1*sin(q1) + lc2*sin(q1+q2));
gq = [diff(P,q1); diff(P,q2)];  

%% ===================== NUMERIC FUNCTIONS (for ODE sim) =====================

params_sym = [m1, m2, l1, l2, lc1, lc2, I1, I2, g_acc]; % symbolic parameter list

M_func = matlabFunction(M,  'Vars', {q1, q2, params_sym});
C_func = matlabFunction(C,  'Vars', {q1, q2, dq1, dq2, params_sym});
g_func = matlabFunction(gq, 'Vars', {q1, q2, params_sym});


%% ===================== SECTION 4: TWO PARAMETER SETS =====================
p_true.m1=1.0; p_true.m2=1.0; p_true.l1=1.0; p_true.l2=1.0;
p_true.lc1=0.5; p_true.lc2=0.5; p_true.I1=0.1; p_true.I2=0.1; p_true.g_acc=9.81;
params_true = [p_true.m1,p_true.m2,p_true.l1,p_true.l2,p_true.lc1,p_true.lc2,p_true.I1,p_true.I2,p_true.g_acc];

p_nom = p_true;
p_nom.m2  = 1.2 * p_true.m2;    % 20% mass overestimate on link 2
p_nom.lc2 = 0.9 * p_true.lc2;   % COM estimation error
params_nom = [p_nom.m1,p_nom.m2,p_nom.l1,p_nom.l2,p_nom.lc1,p_nom.lc2,p_nom.I1,p_nom.I2,p_nom.g_acc];

%% --- Controller gains ---
Lambda = diag([5, 5]);     % Lambda > 0, from s = edot + Lambda*e
KD     = diag([20, 20]);   % KD > 0

%% --- Desired trajectory (smooth, C^2) ---
qd_func   = @(t) [0.5*sin(t); 0.3*cos(0.8*t)];
dqd_func  = @(t) [0.5*cos(t); -0.3*0.8*sin(0.8*t)];
ddqd_func = @(t) [-0.5*sin(t); -0.3*0.8^2*cos(0.8*t)];

%% --- Initial conditions (with tracking error, to see convergence) ---
q0  = [0.1; -0.1];
dq0 = [0; 0];
x0  = [q0; dq0];

%% --- Simulate ---
tspan = [0, 10];
opts = odeset('RelTol',1e-9,'AbsTol',1e-9);
[t, x] = ode45(@(t,x) closedloop_ode_unmatched(t, x, params_nom, params_true, Lambda, KD, ...
                M_func, C_func, g_func, qd_func, dqd_func, ddqd_func), ...
                tspan, x0, opts);

%% --- Extract results ---
q  = x(:,1:2);
dq = x(:,3:4);

qd  = cell2mat(arrayfun(qd_func,  t', 'UniformOutput', false))';
e   = q - qd;

%% --- Plot tracking error ---
figure;
plot(t, e(:,1), 'LineWidth',1.5); hold on;
plot(t, e(:,2), 'LineWidth',1.5);
xlabel('t [s]'); ylabel('tracking error [rad]');
legend('e_1','e_2'); grid on;
title('Nominal PBC — unmatched case, error with residual \rho');

%% ===================== UNMATCHED CLOSED-LOOP FUNCTION =====================
function dx = closedloop_ode_unmatched(t, x, params_nom, params_true, Lambda, KD, ...
                                        M_func, C_func, g_func, qd_func, dqd_func, ddqd_func)
    q  = x(1:2);
    dq = x(3:4);

    qd   = qd_func(t);
    dqd  = dqd_func(t);
    ddqd = ddqd_func(t);

    e  = q - qd;
    de = dq - dqd;

    dqr  = dqd  - Lambda*e;
    ddqr = ddqd - Lambda*de;
    s    = de + Lambda*e;

    % --- Controller uses NOMINAL (hat) matrices ---
    Mhat = M_func(q(1), q(2), params_nom);
    Chat = C_func(q(1), q(2), dq(1), dq(2), params_nom);
    ghat = g_func(q(1), q(2), params_nom);

    tau = Mhat*ddqr + Chat*dqr + ghat - KD*s;

    % --- Plant uses TRUE matrices ---
    Mtrue = M_func(q(1), q(2), params_true);
    Ctrue = C_func(q(1), q(2), dq(1), dq(2), params_true);
    gtrue = g_func(q(1), q(2), params_true);

    ddq = Mtrue \ (tau - Ctrue*dq - gtrue);

    dx = [dq; ddq];
end