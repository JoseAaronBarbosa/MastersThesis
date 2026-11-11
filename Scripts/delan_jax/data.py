"""Trajectories, regression windows and residual targets for offline DeLaN training.

The excitation trajectories reuse the Fourier coefficients and the train/val/test
split stored in delan_dataset.mat, but the plant is re-simulated with the
Christoffel Coriolis matrix (see plant.py).
"""
import numpy as np
import scipy.io as sio

import plant


def load_excitation(mat_path):
    """Fourier coefficients and 0-based trajectory split from delan_dataset.mat."""
    d = sio.loadmat(mat_path, squeeze_me=True, struct_as_record=False)
    coeffs = [(np.atleast_1d(c.q0), np.atleast_2d(c.a), np.atleast_2d(c.b)) for c in d["traj_coeffs"]]
    split = {k: np.atleast_1d(d[f"{k}_ids"]) - 1 for k in ("train", "val", "test")}
    t = np.arange(0.0, float(d["T_period"]) + 1e-9, float(d["dt_log"]))
    return coeffs, split, float(d["w0"]), t


def simulate_all(coeffs, w0, t, noise_std=None, seed=0, **plant_kw):
    """Simulate each trajectory; optionally add Gaussian noise (q, dq, tau) to the logs."""
    rng = np.random.default_rng(seed)
    trajs = []
    for q0, a, b in coeffs:
        ref = lambda tt, q0=q0, a=a, b=b: plant.fourier_traj(tt, q0, a, b, w0)
        q, dq, tau = plant.simulate(ref, t, **plant_kw)
        if noise_std is not None:
            q = q + noise_std[0] * rng.standard_normal(q.shape)
            dq = dq + noise_std[1] * rng.standard_normal(dq.shape)
            tau = tau + noise_std[2] * rng.standard_normal(tau.shape)
        trajs.append(dict(t=t, q=q, dq=dq, tau=tau))
    return trajs


def nominal_target(t, q, dq, tau, p_nom=plant.PARAMS_NOM):
    """Right side of the residual momentum identity for one window:
    int tau dt - [M0(q) dq]_{t1}^{t2} + int (C0^T dq - g0) dt."""
    integrand = np.array([plant.coriolis(qi, dqi, p_nom).T @ dqi - plant.gravity(qi, p_nom)
                          for qi, dqi in zip(q, dq)])
    dp0 = plant.inertia(q[-1], p_nom) @ dq[-1] - plant.inertia(q[0], p_nom) @ dq[0]
    return np.trapezoid(tau, t, axis=0) - dp0 + np.trapezoid(integrand, t, axis=0)


def build_windows(trajs, w_len=20):
    """Non-overlapping windows of w_len+1 samples (shared endpoints), as in Data_gen.m Section E."""
    out = {k: [] for k in ("t", "q", "dq", "tau", "y", "traj")}
    for tr, d in enumerate(trajs):
        n_win = (len(d["t"]) - 1) // w_len
        for w in range(n_win):
            sl = slice(w * w_len, w * w_len + w_len + 1)
            for k in ("t", "q", "dq", "tau"):
                out[k].append(d[k][sl])
            out["y"].append(nominal_target(d["t"][sl], d["q"][sl], d["dq"][sl], d["tau"][sl]))
            out["traj"].append(tr)
    return {k: np.asarray(v) for k, v in out.items()}


def subset(windows, traj_ids):
    mask = np.isin(windows["traj"], traj_ids)
    return {k: v[mask] for k, v in windows.items()}


def true_residual(q, dq, ddq, p_true=plant.PARAMS_TRUE, p_nom=plant.PARAMS_NOM):
    """Per-channel true residual at one sample (only available in simulation)."""
    dM = plant.inertia(q, p_true) - plant.inertia(q, p_nom)
    dC = plant.coriolis(q, dq, p_true) - plant.coriolis(q, dq, p_nom)
    dg = plant.gravity(q, p_true) - plant.gravity(q, p_nom)
    F = plant.friction(dq)
    return dict(dM=dM, dC=dC, dg=dg, F=F, total=dM @ ddq + dC @ dq + dg + F)
