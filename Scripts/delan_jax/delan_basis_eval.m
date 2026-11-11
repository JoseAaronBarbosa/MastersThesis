function [R, C, gradU, F] = delan_basis_eval(q, dq, net)
%DELAN_BASIS_EVAL  Frozen basis learned offline by delan_jax (2-DOF).
%   [R, C, gradU, F] = delan_basis_eval(q, dq, net), with net loaded from
%   delan_basis.mat (load('delan_basis.mat','net','W0')).
%
%   R(:,:,j)   inertia generator R_j(q) = Lbar_j Lbar_j'          (2 x 2 x 2k)
%   C(:,:,j)   Christoffel matrix of R_j                          (2 x 2 x 2k)
%   gradU(:,i) gradient of potential basis U_i(q)                 (2 x k_U)
%   F(:,l)     friction basis F_l(dq), dq'*F(:,l) >= 0            (2 x k_F)
%
%   The first k generators enter with sign +1 and the last k with -1 (net.sigma):
%   Delta_hat = sum_j sigma_j wM_j (R_j*ddqr + C_j*dqr) + gradU*wU + F*wF,
%   with wM >= 0, wF >= 0 (projected) and wU free. W0 holds the offline weights.

q = q(:); dq = dq(:);
n = 2;
n_gen = 2*net.k_cone;

%% --- inertia generators and their q-derivatives ---
[out, Jout] = mlp_jac(net.M, q);          % out: 3*n_gen x 1, Jout: 3*n_gen x n
out  = reshape(out, 3, n_gen);
Jout = reshape(Jout, 3, n_gen, n);

R  = zeros(n, n, n_gen);
dR = zeros(n, n, n, n_gen);               % dR(:,:,i,j) = dR_j/dq_i
for j = 1:n_gen
    L = [softplus(out(1,j)) + net.diag_eps, 0; out(2,j), softplus(out(3,j)) + net.diag_eps];
    R(:,:,j) = L*L.';
    for i = 1:n
        dL = [sigmoid(out(1,j))*Jout(1,j,i), 0; Jout(2,j,i), sigmoid(out(3,j))*Jout(3,j,i)];
        dR(:,:,i,j) = dL*L.' + L*dL.';
    end
end

%% --- Christoffel symbols, same formula as Passivity_Learning.m ---
C = zeros(n, n, n_gen);
for j = 1:n_gen
    for kk = 1:n
        for jj = 1:n
            for ii = 1:n
                c_ijk = 0.5*( dR(kk,jj,ii,j) + dR(kk,ii,jj,j) - dR(ii,jj,kk,j) );
                C(kk,jj,j) = C(kk,jj,j) + c_ijk*dq(ii);
            end
        end
    end
end

%% --- potential bases ---
[~, JU] = mlp_jac(net.U, q);              % k_U x n
gradU = JU.';

%% --- friction bases (per joint, independent) ---
F = zeros(n, net.k_F);
for i = 1:n
    v = dq(i);
    h = mlp_fwd(net.F{i}, abs(v)/net.fric_vscale);
    F(i,:) = (tanh(v/net.fric_eps)*softplus(h) + softplus(net.F_visc(:,i))*v).';
end
end

%% ===================== HELPERS =====================
function [y, J] = mlp_jac(layers, q)
% tanh MLP on features [sin q; cos q], with the Jacobian dy/dq by the chain rule
x = [sin(q); cos(q)];
J = [diag(cos(q)); -diag(sin(q))];
for k = 1:numel(layers)-1
    x = tanh(layers{k}.W*x + layers{k}.b);
    J = (1 - x.^2) .* (layers{k}.W*J);
end
y = layers{end}.W*x + layers{end}.b;
J = layers{end}.W*J;
end

function y = mlp_fwd(layers, x)
for k = 1:numel(layers)-1
    x = tanh(layers{k}.W*x + layers{k}.b);
end
y = layers{end}.W*x + layers{end}.b;
end

function y = softplus(x)
y = max(x, 0) + log1p(exp(-abs(x)));
end

function y = sigmoid(x)
y = 1 ./ (1 + exp(-x));
end
