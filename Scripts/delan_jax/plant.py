"""2-DOF planar manipulator in a vertical plane: port of Scripts/Data_gen.m.

The plant is M(q) ddq + C(q,dq) dq + g(q) + F(dq) = tau, with C built from the
Christoffel symbols of M. Setting coriolis="script" reproduces the transposed C
used in the MATLAB sandbox, only to check this port against delan_dataset.mat.
"""
import numpy as np
from scipy.integrate import solve_ivp

# [m1, m2, l1, l2, lc1, lc2, I1, I2, g_acc]
PARAMS_TRUE = np.array([1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.1, 0.1, 9.81])
PARAMS_NOM = np.array([0.7, 1.3, 1.0, 1.0, 0.6, 0.4, 0.06, 0.14, 9.81])
# [fv1, fv2, fc1, fc2, fs1, fs2, dqs1, dqs2]
FPARAMS = np.array([0.5, 0.3, 0.8, 0.5, 1.2, 0.8, 0.1, 0.1])
FRICTION_EPS = 0.01

LAMBDA = np.diag([5.0, 5.0])
KD = np.diag([20.0, 20.0])


def inertia(q, p):
    m1, m2, l1, _, lc1, lc2, I1, I2, _ = p
    c2 = np.cos(q[1])
    M11 = m1 * lc1**2 + I1 + m2 * (l1**2 + lc2**2 + 2 * l1 * lc2 * c2) + I2
    M12 = m2 * (lc2**2 + l1 * lc2 * c2) + I2
    M22 = m2 * lc2**2 + I2
    return np.array([[M11, M12], [M12, M22]])


def coriolis(q, dq, p, kind="christoffel"):
    m2, l1, lc2 = p[1], p[2], p[5]
    h = m2 * l1 * lc2 * np.sin(q[1])
    C = np.array([[-h * dq[1], -h * (dq[0] + dq[1])], [h * dq[0], 0.0]])
    return C.T if kind == "script" else C


def gravity(q, p):
    m1, m2, l1, _, lc1, lc2, _, _, g = p
    c1, c12 = np.cos(q[0]), np.cos(q[0] + q[1])
    return np.array([m1 * g * lc1 * c1 + m2 * g * (l1 * c1 + lc2 * c12), m2 * g * lc2 * c12])


def friction(dq, fp=FPARAMS):
    fv, fc, fs, dqs = fp[0:2], fp[2:4], fp[4:6], fp[6:8]
    stribeck = fc + (fs - fc) * np.exp(-(dq / dqs) ** 2)
    return fv * dq + stribeck * np.tanh(dq / FRICTION_EPS)


def fourier_traj(t, q0, a, b, w0):
    """Desired q, dq, ddq of a finite Fourier series (same as fourier_traj in Data_gen.m)."""
    k = np.arange(1, a.shape[1] + 1)
    wk = k * w0
    s, c = np.sin(wk * t), np.cos(wk * t)
    qd = q0 + a @ s + b @ c
    dqd = a @ (wk * c) - b @ (wk * s)
    ddqd = -a @ (wk**2 * s) - b @ (wk**2 * c)
    return qd, dqd, ddqd


def nominal_pbc(t, q, dq, traj, p_nom, kind):
    """Slotine-Li PBC on the nominal model, as in plant_with_nominal_pbc."""
    qd, dqd, ddqd = traj(t)
    e, de = q - qd, dq - dqd
    dqr, ddqr, s = dqd - LAMBDA @ e, ddqd - LAMBDA @ de, de + LAMBDA @ e
    return inertia(q, p_nom) @ ddqr + coriolis(q, dq, p_nom, kind) @ dqr + gravity(q, p_nom) - KD @ s


def simulate(traj, t_eval, p_true=PARAMS_TRUE, p_nom=PARAMS_NOM, fp=FPARAMS, kind="christoffel"):
    """Simulate the true plant under the nominal PBC and log (q, dq, tau) at t_eval."""
    def rhs(t, x):
        q, dq = x[:2], x[2:]
        tau = nominal_pbc(t, q, dq, traj, p_nom, kind)
        ddq = np.linalg.solve(inertia(q, p_true),
                              tau - coriolis(q, dq, p_true, kind) @ dq - gravity(q, p_true) - friction(dq, fp))
        return np.concatenate([dq, ddq])

    qd0, dqd0, _ = traj(t_eval[0])
    sol = solve_ivp(rhs, (t_eval[0], t_eval[-1]), np.concatenate([qd0, dqd0]),
                    t_eval=t_eval, method="DOP853", rtol=1e-10, atol=1e-10)
    q, dq = sol.y[:2].T, sol.y[2:].T
    tau = np.array([nominal_pbc(t, q[i], dq[i], traj, p_nom, kind) for i, t in enumerate(t_eval)])
    return q, dq, tau
