%% ===================== CHECK: MATLAB EVALUATOR vs JAX =====================
% Run from the folder holding delan_basis.mat and delan_check_points.mat.
% Every max error should be ~1e-12 or smaller.

load('delan_basis.mat', 'net', 'W0');
P = load('delan_check_points.mat');

n_pts = size(P.Q, 1);
err = zeros(n_pts, 4);
for p = 1:n_pts
    [R, C, gradU, F] = delan_basis_eval(P.Q(p,:)', P.DQ(p,:)', net);
    err(p,1) = max(abs(R(:)     - reshape(P.R(:,:,:,p), [], 1)));
    err(p,2) = max(abs(C(:)     - reshape(P.C(:,:,:,p), [], 1)));
    err(p,3) = max(abs(gradU(:) - reshape(P.gradU(:,:,p), [], 1)));
    err(p,4) = max(abs(F(:)     - reshape(P.F(:,:,p), [], 1)));
end
fprintf('max |MATLAB - JAX| over %d points:\n', n_pts);
fprintf('  R: %.2e   C: %.2e   gradU: %.2e   F: %.2e\n', max(err));
