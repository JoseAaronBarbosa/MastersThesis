%% ===================== SECTION 1: CLEAN =====================
clear; clc; close all;

%% ===================== SECTION 2: SYMBOLIC M, C, g =====================
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
M_func = matlabFunction(M,  'Vars', {q1,q2,params_sym});
C_func = matlabFunction(C,  'Vars', {q1,q2,dq1,dq2,params_sym});
g_func = matlabFunction(gq, 'Vars', {q1,q2,params_sym});

%% ===================== SECTION 3: LEARNING BASIS (stand-in for offline-trained DeLaN net) =====================
% R_j(q) = Lbar_j(q) * Lbar_j(q)'  — three fixed, q-dependent PSD shapes
% NOTE: in the finished architecture these come from offline training (Sec. 5.2 of the proposal);
% here they are hand-specified so the online mechanism can be validated end-to-end first.

function R = basis_matrix(q2, idx)
    switch idx
        case 1, L = [1,0; 0.5*cos(q2), 0.8];
        case 2, L = [0.6,0; 0.3*sin(q2), 1];
        case 3, L = [1.2+0.3*cos(q2),0; 0.4, 0.7];
    end
    R = L*L';
end

%% ===================== SECTION 3 (extended): BASIS MATRICES + CHRISTOFFEL CHANNELS =====================
% R_j(q) = Lbar_j(q)*Lbar_j(q)'  (inertia basis, same 3 as before)
% C_j(q,qdot) = Christoffel symbols of R_j  (derived symbolically, NOT independently chosen —
%               this is what keeps dR_j/dt - 2*C_j skew-symmetric for ANY scalar weight on R_j)
% U_i(q) = scalar potential basis (gravity channel): chosen here as sin(q1), sin(q1+q2) —
%          these are literally the two terms in the TRUE potential energy, so a 2-term linear
%          combination can in principle reconstruct true gravity exactly (a clean validation case)

k_basis = 3;   % inertia/Coriolis channel
k_grav  = 2;   % gravity channel

% --- symbolic basis matrices and their Christoffel C_j ---
Lb = cell(1,k_basis); Rb = cell(1,k_basis); Cb = cell(1,k_basis);
Lb{1} = [1,0; 0.5*cos(q2), 0.8];
Lb{2} = [0.6,0; 0.3*sin(q2), 1];
Lb{3} = [1.2+0.3*cos(q2),0; 0.4, 0.7];

qsyms  = [q1,q2];
dqsyms = [dq1,dq2];

R_func = cell(1,k_basis);
C_func_basis = cell(1,k_basis);
for j=1:k_basis
    Rb{j} = Lb{j}*Lb{j}.';
    % Christoffel symbols of Rb{j}, exactly the same formula used for the true M(q)
    Ctmp = sym(zeros(2,2));
    for kk=1:2
        for jj=1:2
            for ii=1:2
                c_ijk = 0.5*( diff(Rb{j}(kk,jj),qsyms(ii)) + diff(Rb{j}(kk,ii),qsyms(jj)) - diff(Rb{j}(ii,jj),qsyms(kk)) );
                Ctmp(kk,jj) = Ctmp(kk,jj) + c_ijk*dqsyms(ii);
            end
        end
    end
    Cb{j} = Ctmp;

    R_func{j}        = matlabFunction(Rb{j}, 'Vars', {q1,q2});
    C_func_basis{j}  = matlabFunction(Cb{j}, 'Vars', {q1,q2,dq1,dq2});
end

% --- gravity basis: U_i(q) and their gradients, closed-form (no need for matlabFunction, trivial) ---
% U1 = sin(q1)      -> grad = [cos(q1); 0]
% U2 = sin(q1+q2)   -> grad = [cos(q1+q2); cos(q1+q2)]
gradU_func = cell(1,k_grav);
gradU_func{1} = @(q1_,q2_) [cos(q1_); 0];
gradU_func{2} = @(q1_,q2_) [cos(q1_+q2_); cos(q1_+q2_)];

%% ===================== SECTION 4: FRICTION (tanh-smoothed) =====================
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
p_nom.m2  = 4*p_true.m2;    % 30% mass overestimate, link 2
p_nom.lc1 = 1.2*p_true.lc1;   % COM estimation error
p_nom.lc2 = 0.8*p_true.lc2;   % COM estimation error
p_nom.I1 = 0.6*p_true.I1;   % Inertia estimation error
p_nom.I2 = 1.4*p_true.I2;   % Inertia estimation error
params_nom = [p_nom.m1,p_nom.m2,p_nom.l1,p_nom.l2,p_nom.lc1,p_nom.lc2,p_nom.I1,p_nom.I2,p_nom.g_acc];

fparams = [0.5,0.3, 0.8,0.5, 1.2,0.8, 0.1,0.1];  % [fv1,fv2,fc1,fc2,fs1,fs2,dqs1,dqs2]

%% ===================== SECTION 6: GAINS =====================
Lambda = diag([5,5]);
KD     = diag([20,20]);
Komega = [50;50;50];      % one learning gain per basis
w_max  = 50;              % projection bound

%% ===================== SECTION 6b: LEARNING GAINS (extended) =====================
KomegaM = [50;50;50];   % inertia/Coriolis channel, projected >=0
KomegaU = [30;30];      % gravity channel, unprojected (sign-free)
wM_max  = 50;

%% ===================== SECTION 7: TRAJECTORY, IC =====================
qd_func   = @(t) [0.5*sin(t); 0.3*cos(0.8*t)];
dqd_func  = @(t) [0.5*cos(t); -0.3*0.8*sin(0.8*t)];
ddqd_func = @(t) [-0.5*sin(t); -0.3*0.8^2*cos(0.8*t)];

q0=[0.1;-0.1]; dq0=[0;0];
x0_base = [q0;dq0];
x0_learn = [q0;dq0; zeros(k_basis,1)];  % weights start at zero
x0_learn2 = [q0;dq0; zeros(k_basis,1); zeros(k_grav,1)];

tspan = linspace(0,10,2001);  % shared evaluation grid for fair MSE comparison
opts = odeset('RelTol',1e-9,'AbsTol',1e-9);

%% ===================== SECTION 8a: BASELINE (passivity only, no learning) =====================
[t_b, x_b] = ode45(@(t,x) closedloop_baseline(t,x,params_nom,params_true,fparams, ...
                Lambda,KD,M_func,C_func,g_func,qd_func,dqd_func,ddqd_func), tspan, x0_base, opts);

%% ===================== SECTION 8b: WITH LEARNING =====================
[t_l, x_l] = ode45(@(t,x) closedloop_learning(t,x,params_nom,params_true,fparams, ...
                Lambda,KD,Komega,w_max,k_basis,M_func,C_func,g_func,qd_func,dqd_func,ddqd_func), ...
                tspan, x0_learn, opts);

%% ===================== SECTION 8c: SIMULATE WITH FULL (M,C,g) LEARNING =====================
[t_l2, x_l2] = ode45(@(t,x) closedloop_learning_full(t,x,params_nom,params_true,fparams, ...
                Lambda,KD,KomegaM,KomegaU,wM_max,k_basis,k_grav, ...
                M_func,C_func,g_func,R_func,C_func_basis,gradU_func, ...
                qd_func,dqd_func,ddqd_func), tspan, x0_learn2, opts);

%% ===================== CLOSED-LOOP FUNCTIONS =====================
function dx = closedloop_baseline(t,x,params_nom,params_true,fparams,Lambda,KD, ...
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

function dx = closedloop_learning(t,x,params_nom,params_true,fparams,Lambda,KD,Komega,w_max,k_basis, ...
                                    M_func,C_func,g_func,qd_func,dqd_func,ddqd_func)
    q=x(1:2); dq=x(3:4); w=x(5:4+k_basis);
    qd=qd_func(t); dqd=dqd_func(t); ddqd=ddqd_func(t);
    e=q-qd; de=dq-dqd;
    dqr=dqd-Lambda*e; ddqr=ddqd-Lambda*de; s=de+Lambda*e;

    Mhat=M_func(q(1),q(2),params_nom); Chat=C_func(q(1),q(2),dq(1),dq(2),params_nom); ghat=g_func(q(1),q(2),params_nom);

    Delta_hat = zeros(2,1);
    r = zeros(2,k_basis);
    for j=1:k_basis
        Rj = basis_matrix(q(2), j);
        r(:,j) = Rj*ddqr;
        Delta_hat = Delta_hat + w(j)*r(:,j);
    end

    tau = Mhat*ddqr + Chat*dqr + ghat - KD*s + Delta_hat;

    Mtrue=M_func(q(1),q(2),params_true); Ctrue=C_func(q(1),q(2),dq(1),dq(2),params_true); gtrue=g_func(q(1),q(2),params_true);
    Ff=friction_model(dq,fparams);
    ddq = Mtrue\(tau - Ctrue*dq - gtrue - Ff);

    % adaptation law: wdot_j = -Komega_j * (s' * r_j), projected to [0, w_max]
    wdot = zeros(k_basis,1);
    for j=1:k_basis
        wd = -Komega(j)*(s'*r(:,j));
        if (w(j)<=0 && wd<0) || (w(j)>=w_max && wd>0)
            wd = 0;
        end
        wdot(j)=wd;
    end
    dx=[dq;ddq;wdot];
end

function dx = closedloop_learning_full(t,x,params_nom,params_true,fparams,Lambda,KD, ...
                KomegaM,KomegaU,wM_max,k_basis,k_grav, ...
                M_func,C_func,g_func,R_func,C_func_basis,gradU_func, ...
                qd_func,dqd_func,ddqd_func)

    q=x(1:2); dq=x(3:4);
    wM = x(5:4+k_basis);
    wU = x(5+k_basis:4+k_basis+k_grav);

    qd=qd_func(t); dqd=dqd_func(t); ddqd=ddqd_func(t);
    e=q-qd; de=dq-dqd;
    dqr=dqd-Lambda*e; ddqr=ddqd-Lambda*de; s=de+Lambda*e;

    Mhat=M_func(q(1),q(2),params_nom); Chat=C_func(q(1),q(2),dq(1),dq(2),params_nom); ghat=g_func(q(1),q(2),params_nom);

    % --- inertia + Coriolis channel (same weight for both, per channel j) ---
    Delta_M = zeros(2,1);
    rM = zeros(2,k_basis);     % regressor: R_j*ddqr + C_j*dqr
    for j=1:k_basis
        Rj = R_func{j}(q(1),q(2));
        Cj = C_func_basis{j}(q(1),q(2),dq(1),dq(2));
        rM(:,j) = Rj*ddqr + Cj*dqr;
        Delta_M = Delta_M + wM(j)*rM(:,j);
    end

    % --- gravity channel ---
    Delta_U = zeros(2,1);
    rU = zeros(2,k_grav);      % regressor: grad U_i(q)
    for i=1:k_grav
        rU(:,i) = gradU_func{i}(q(1),q(2));
        Delta_U = Delta_U + wU(i)*rU(:,i);
    end

    Delta_hat = Delta_M + Delta_U;
    tau = Mhat*ddqr + Chat*dqr + ghat - KD*s + Delta_hat;

    Mtrue=M_func(q(1),q(2),params_true); Ctrue=C_func(q(1),q(2),dq(1),dq(2),params_true); gtrue=g_func(q(1),q(2),params_true);
    Ff=friction_model(dq,fparams);
    ddq = Mtrue\(tau - Ctrue*dq - gtrue - Ff);

    % --- adaptation laws ---
    wMdot = zeros(k_basis,1);
    for j=1:k_basis
        wd = -KomegaM(j)*(s'*rM(:,j));
        if (wM(j)<=0 && wd<0) || (wM(j)>=wM_max && wd>0)
            wd = 0;
        end
        wMdot(j)=wd;
    end

    wUdot = zeros(k_grav,1);
    for i=1:k_grav
        wUdot(i) = -KomegaU(i)*(s'*rU(:,i));   % no projection: gravity channel is sign-free
    end

    dx=[dq;ddq;wMdot;wUdot];
end

%% ===================== POST-PROCESSING =====================
q_b=x_b(:,1:2); e_b = q_b - cell2mat(arrayfun(qd_func,t_b','UniformOutput',false))';
q_l=x_l(:,1:2); e_l = q_l - cell2mat(arrayfun(qd_func,t_l','UniformOutput',false))';
w_l = x_l(:,5:4+k_basis);

% --- Identification error: ||M_tilde(q)*qddot_r - Delta_hat|| over time ---
id_err = zeros(length(t_l),1);
for k=1:length(t_l)
    tk=t_l(k); qk=x_l(k,1:2)'; dqk=x_l(k,3:4)'; wk=x_l(k,5:4+k_basis)';
    qd=qd_func(tk); dqd=dqd_func(tk); ddqd=ddqd_func(tk);
    e=qk-qd; de=dqk-dqd; dqr=dqd-Lambda*e; ddqr=ddqd-Lambda*de;

    Mtrue=M_func(qk(1),qk(2),params_true); Mhat=M_func(qk(1),qk(2),params_nom);
    Mtilde = Mtrue - Mhat;
    Delta_M_true = Mtilde*ddqr;

    Delta_hat=zeros(2,1);
    for j=1:k_basis
        Rj=basis_matrix(qk(2),j);
        Delta_hat = Delta_hat + wk(j)*Rj*ddqr;
    end
    id_err(k)=norm(Delta_M_true-Delta_hat);
end

%% ===================== POST-PROCESSING (extended) =====================
wM_l2 = x_l2(:,5:4+k_basis);
wU_l2 = x_l2(:,5+k_basis:4+k_basis+k_grav);
q_l2  = x_l2(:,1:2);
e_l2  = q_l2 - cell2mat(arrayfun(qd_func,t_l2','UniformOutput',false))';

% --- MSE comparison (same time grid, so this is a fair comparison) ---
mse_baseline = mean(sum(e_b.^2,2));
mse_learning = mean(sum(e_l.^2,2));

id_err2 = zeros(length(t_l2),1);
for k=1:length(t_l2)
    tk=t_l2(k); qk=x_l2(k,1:2)'; dqk=x_l2(k,3:4)';
    wMk=x_l2(k,5:4+k_basis)'; wUk=x_l2(k,5+k_basis:4+k_basis+k_grav)';
    qd=qd_func(tk); dqd=dqd_func(tk); ddqd=ddqd_func(tk);
    e=qk-qd; de=dqk-dqd; dqr=dqd-Lambda*e; ddqr=ddqd-Lambda*de;

    Mtrue=M_func(qk(1),qk(2),params_true); Mhat=M_func(qk(1),qk(2),params_nom);
    Ctrue=C_func(qk(1),qk(2),dqk(1),dqk(2),params_true); Chat=C_func(qk(1),qk(2),dqk(1),dqk(2),params_nom);
    gtrue=g_func(qk(1),qk(2),params_true); ghat=g_func(qk(1),qk(2),params_nom);

    Delta_true = (Mtrue-Mhat)*ddqr + (Ctrue-Chat)*dqr + (gtrue-ghat);

    Delta_hat = zeros(2,1);
    for j=1:k_basis
        Rj=R_func{j}(qk(1),qk(2)); Cj=C_func_basis{j}(qk(1),qk(2),dqk(1),dqk(2));
        Delta_hat = Delta_hat + wMk(j)*(Rj*ddqr+Cj*dqr);
    end
    for i=1:k_grav
        Delta_hat = Delta_hat + wUk(i)*gradU_func{i}(qk(1),qk(2));
    end
    id_err2(k) = norm(Delta_true-Delta_hat);
end

figure;
plot(t_l2,id_err2,'LineWidth',1.5); grid on;
xlabel('t [s]'); ylabel('||\Delta - \Delta_{hat}||');
title('Identification error: full M,C,g residual vs learned compensation');

figure;
plot(t_l, vecnorm(w_l,2,2),'LineWidth',1.5); grid on;
xlabel('t [s]'); ylabel('||w_{hat}||');
title('Inertia channel weights');

figure;
plot(t_l2,wM_l2,'LineWidth',1.5); grid on; legend('w_{M,1}','w_{M,2}','w_{M,3}');
title('Inertia/Coriolis channel weights');

figure;
plot(t_l2,wU_l2,'LineWidth',1.5); grid on; legend('w_{U,1}','w_{U,2}');
title('Gravity channel weights');

true_wU1 = (p_true.m1*p_true.lc1 + p_true.m2*p_true.l1)*p_true.g_acc;
true_wU2 = p_true.m2*p_true.g_acc*p_true.lc2;
fprintf('True gravity weights to converge toward: w_U1=%.4f, w_U2=%.4f\n', true_wU1, true_wU2);

mse_full_learning = mean(sum(e_l2.^2,2));
figure;
bar([mse_baseline, mse_learning, mse_full_learning]);
set(gca,'xticklabel',{'Passivity only','+ inertia learning','+ full M,C,g learning'});
ylabel('MSE of tracking error');
title('Tracking error MSE comparison');

figure;
plot(t_b,q_b,'b--','LineWidth',1.2); grid on; hold on;
plot(t_l,q_l,'r--','LineWidth',1.2);
plot(t_l2,q_l2,'g--','LineWidth',1.2);
plot(t_l,cell2mat(arrayfun(qd_func,t_b','UniformOutput',false))','k','LineWidth',1.2)
xlabel('t [s]'); ylabel('Trajectories');
title('Trajectory following');
legend({'Passivity only (q1)','Passivity only (q2)','Passivity + learning (q1)','Passivity + learning (q2)', ...
    'Full learning (q1)','Full learning (q1)','Desired trajectory (q1)','Desired trajectory (q2)'}, ...
       'Location','best');
