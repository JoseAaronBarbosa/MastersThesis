"""Sanity checks: Christoffel construction, skew-symmetry, friction sign, and the
residual momentum identity with the TRUE residual plugged in (quadrature floor)."""
import time
import numpy as np
import jax, jax.numpy as jnp
import plant, data, model

def M_jax(q, p=plant.PARAMS_TRUE):
    m1, m2, l1, _, lc1, lc2, I1, I2, _ = p
    c2 = jnp.cos(q[1])
    M11 = m1*lc1**2 + I1 + m2*(l1**2 + lc2**2 + 2*l1*lc2*c2) + I2
    M12 = m2*(lc2**2 + l1*lc2*c2) + I2
    return jnp.array([[M11, M12], [M12, m2*lc2**2 + I2]])

def main(mat="delan_dataset.mat"):
    rng = np.random.default_rng(0)
    # 1. model.christoffel on the true M reproduces plant.coriolis
    err = 0
    for _ in range(100):
        q, dq = rng.uniform(-3, 3, 2), rng.uniform(-3, 3, 2)
        dR = jax.jacfwd(M_jax)(jnp.array(q))
        err = max(err, np.abs(model.christoffel(dR, jnp.array(dq)) - plant.coriolis(q, dq, plant.PARAMS_TRUE)).max())
    print(f"christoffel vs plant C, max err: {err:.2e}")

    # 2. skew-symmetry of dR_j/dt - 2C_j and friction sign on a random network
    cfg = model.Config()
    params = model.init(jax.random.PRNGKey(0), cfg)
    sk, fr = 0, np.inf
    for _ in range(100):
        q, dq, x = (jnp.array(rng.uniform(-3, 3, 2)) for _ in range(3))
        R, dR = model.generators_and_grad(params, q, cfg)
        Rdot = jnp.einsum("jabi,i->jab", dR, dq)
        N = Rdot - 2 * model.christoffel(dR, dq)
        sk = max(sk, float(jnp.abs(jnp.einsum("a,jab,b->j", x, N, x)).max()))
        fr = min(fr, float((model.friction_bases(params, dq, cfg) * dq).min()))
    print(f"max |x^T (dR/dt - 2C) x|: {sk:.2e}   min dq_i F_l,i: {fr:.2e} (>= 0)")

    # 3. identity with the true residual
    coeffs, split, w0, t = data.load_excitation(mat)
    trajs = data.simulate_all(coeffs, w0, t)
    W = data.build_windows(trajs)
    errs = []
    for tt, q, dq, y in zip(W["t"], W["q"], W["dq"], W["y"]):
        res = [data.true_residual(qi, dqi, np.zeros(2)) for qi, dqi in zip(q, dq)]
        integ = np.array([r["dC"].T @ dqi - r["dg"] - r["F"] for r, dqi in zip(res, dq)])
        lhs = res[-1]["dM"] @ dq[-1] - res[0]["dM"] @ dq[0] - np.trapezoid(integ, tt, axis=0)
        errs.append(np.linalg.norm(lhs - y))
    errs = np.array(errs)
    print(f"{len(W['y'])} windows; |y| mean {np.linalg.norm(W['y'],axis=1).mean():.3e}; "
          f"true-residual identity error: mean {errs.mean():.2e}, max {errs.max():.2e}")

if __name__ == "__main__":
    import sys
    main(*sys.argv[1:])
