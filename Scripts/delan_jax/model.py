"""Structured residual model: two-cone inertia generators, Christoffel Coriolis,
potential bases and dissipative friction bases.

Residual torque (the quantity the online law adapts, one weight per basis):
    Delta = sum_j sigma_j w_Mj (R_j(q) ddq_r + C_j(q,dq) dq_r) + sum_i w_Ui grad U_i(q) + sum_l w_Fl F_l(dq)
with R_j = Lbar_j Lbar_j^T, sigma_j = +1 for the first k generators and -1 for the last k,
w_M >= 0, w_F >= 0 and w_U free.
"""
from dataclasses import dataclass

import jax
import jax.numpy as jnp

jax.config.update("jax_enable_x64", True)

N_DOF = 2


@dataclass(frozen=True)
class Config:
    k_cone: int = 3          # inertia generators per cone (2*k_cone in total)
    k_U: int = 2             # potential bases
    k_F: int = 2             # friction bases
    hidden_M: tuple = (64, 64)
    hidden_U: tuple = (32, 32)
    hidden_F: tuple = (16,)
    diag_eps: float = 1e-3   # added to the softplus diagonal of Lbar_j
    fric_eps: float = 0.01   # tanh smoothing of the Coulomb term, same as the plant
    fric_vscale: float = 1.0 # |dq| is divided by this before entering the friction net


def _mlp_init(key, sizes):
    params = []
    for k, (n_in, n_out) in zip(jax.random.split(key, len(sizes) - 1), zip(sizes[:-1], sizes[1:])):
        params.append(dict(W=jax.random.normal(k, (n_out, n_in)) * jnp.sqrt(1.0 / n_in), b=jnp.zeros(n_out)))
    return params


def _mlp(params, x):
    for layer in params[:-1]:
        x = jnp.tanh(layer["W"] @ x + layer["b"])
    return params[-1]["W"] @ x + params[-1]["b"]


def features(q):
    return jnp.concatenate([jnp.sin(q), jnp.cos(q)])


def init(key, cfg: Config):
    kM, kU, kF = jax.random.split(key, 3)
    n_gen = 2 * cfg.k_cone
    n_tri = N_DOF * (N_DOF + 1) // 2
    return dict(
        M=_mlp_init(kM, (2 * N_DOF, *cfg.hidden_M, n_gen * n_tri)),
        U=_mlp_init(kU, (2 * N_DOF, *cfg.hidden_U, cfg.k_U)),
        # one small net per joint mapping |v| to k_F shape values; viscous slopes d_l,i
        F=[_mlp_init(k, (1, *cfg.hidden_F, cfg.k_F)) for k in jax.random.split(kF, N_DOF)],
        F_visc=jnp.full((cfg.k_F, N_DOF), -2.0),
        # raw output weights: w_M = softplus, w_F = softplus, w_U free (these become W0)
        wM_raw=jnp.full(n_gen, 0.5413),   # softplus(0.5413) = 1
        wU=jnp.ones(cfg.k_U) * 0.1,
        wF_raw=jnp.full(cfg.k_F, 0.5413),
    )


def cone_signs(cfg: Config):
    return jnp.concatenate([jnp.ones(cfg.k_cone), -jnp.ones(cfg.k_cone)])


def output_weights(params):
    return dict(wM=jax.nn.softplus(params["wM_raw"]), wU=params["wU"], wF=jax.nn.softplus(params["wF_raw"]))


# ---------------- inertia channel ----------------

def lbar(params, q, cfg: Config):
    """Lower-triangular factors Lbar_j(q), shape (2k, n, n), positive diagonal."""
    out = _mlp(params["M"], features(q)).reshape(2 * cfg.k_cone, 3)
    d1 = jax.nn.softplus(out[:, 0]) + cfg.diag_eps
    d2 = jax.nn.softplus(out[:, 2]) + cfg.diag_eps
    z = jnp.zeros_like(d1)
    return jnp.stack([jnp.stack([d1, z], -1), jnp.stack([out[:, 1], d2], -1)], -2)


def generators(params, q, cfg: Config):
    """R_j(q) = Lbar_j Lbar_j^T, shape (2k, n, n)."""
    L = lbar(params, q, cfg)
    return L @ jnp.swapaxes(L, -1, -2)


def generators_and_grad(params, q, cfg: Config):
    """R_j(q) and dR_j/dq, the latter with shape (2k, n, n, n) (last index = q_i)."""
    R = generators(params, q, cfg)
    dR = jax.jacfwd(generators, argnums=1)(params, q, cfg)
    return R, dR


def christoffel(dR, dq):
    """C_j(q,dq) from dR_j/dq: C[k,j] = sum_i 1/2 (dR[k,j,i] + dR[k,i,j] - dR[i,j,k]) dq_i."""
    term1 = jnp.einsum("...kji,i->...kj", dR, dq)
    term2 = jnp.einsum("...kij,i->...kj", dR, dq)
    term3 = jnp.einsum("...ijk,i->...kj", dR, dq)
    return 0.5 * (term1 + term2 - term3)


def ctrans_dq(dR, dq):
    """C_j^T dq, k-th entry = 1/2 dq^T (dR_j/dq_k) dq, shape (2k, n)."""
    return 0.5 * jnp.einsum("...abk,a,b->...k", dR, dq, dq)


# ---------------- potential channel ----------------

def potentials(params, q):
    return _mlp(params["U"], features(q))


def grad_potentials(params, q):
    """grad U_i(q), shape (k_U, n)."""
    return jax.jacrev(potentials, argnums=1)(params, q)


# ---------------- friction channel ----------------

def friction_bases(params, dq, cfg: Config):
    """F_l(dq), shape (k_F, n). F_l,i(v) = tanh(v/eps) softplus(h_l,i(|v|)) + softplus(d_l,i) v,
    so v * F_l,i(v) >= 0 for every basis and joint."""
    cols = []
    for i in range(N_DOF):
        v = dq[i]
        h = _mlp(params["F"][i], jnp.abs(v)[None] / cfg.fric_vscale)
        cols.append(jnp.tanh(v / cfg.fric_eps) * jax.nn.softplus(h) + jax.nn.softplus(params["F_visc"][:, i]) * v)
    return jnp.stack(cols, -1)


# ---------------- assembled residual ----------------

def delta_M(params, q, cfg):
    w = output_weights(params)["wM"] * cone_signs(cfg)
    return jnp.einsum("j,jab->ab", w, generators(params, q, cfg))


def channels(params, q, dq, cfg):
    """Per-sample quantities used by the momentum identity."""
    w = output_weights(params)
    sw = w["wM"] * cone_signs(cfg)
    R, dR = generators_and_grad(params, q, cfg)
    return dict(
        dM=jnp.einsum("j,jab->ab", sw, R),
        dCt_dq=jnp.einsum("j,jk->k", sw, ctrans_dq(dR, dq)),
        dg=w["wU"] @ grad_potentials(params, q),
        F=w["wF"] @ friction_bases(params, dq, cfg),
    )


def residual_torque(params, q, dq, ddq_r, dq_r, cfg):
    """Delta_hat as the controller uses it (with dq_r = dq, ddq_r = ddq it is the plant residual)."""
    w = output_weights(params)
    sw = w["wM"] * cone_signs(cfg)
    R, dR = generators_and_grad(params, q, cfg)
    C = christoffel(dR, dq)
    inertial = jnp.einsum("j,jab,b->a", sw, R, ddq_r) + jnp.einsum("j,jab,b->a", sw, C, dq_r)
    return inertial + w["wU"] @ grad_potentials(params, q) + w["wF"] @ friction_bases(params, dq, cfg)


def window_lhs(params, t, q, dq, cfg):
    """Left side of the residual momentum identity for one window (arrays of shape (T, n))."""
    ch = jax.vmap(lambda qi, dqi: channels(params, qi, dqi, cfg))(q, dq)
    dp = ch["dM"][-1] @ dq[-1] - ch["dM"][0] @ dq[0]
    integrand = ch["dCt_dq"] - ch["dg"] - ch["F"]
    return dp - jnp.trapezoid(integrand, t, axis=0)
