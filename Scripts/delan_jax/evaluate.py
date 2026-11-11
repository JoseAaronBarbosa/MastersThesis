"""Validation of a trained run on the held-out trajectories (simulation only: uses the true plant).

Usage:  python evaluate.py --run run1 [--split test]
"""
import argparse
import json
import os
import pickle

import numpy as np
import jax
import jax.numpy as jnp

import data
import model
import plant


def load_run(run):
    with open(os.path.join(run, "params.pkl"), "rb") as f:
        params = jax.tree_util.tree_map(jnp.asarray, pickle.load(f))
    with open(os.path.join(run, "config.json")) as f:
        conf = json.load(f)
    m = conf["model"]
    m = {k: tuple(v) if isinstance(v, list) else v for k, v in m.items()}
    return params, model.Config(**m), conf


def plant_ddq(q, dq, tau):
    p = plant.PARAMS_TRUE
    return np.linalg.solve(plant.inertia(q, p), tau - plant.coriolis(q, dq, p) @ dq - plant.gravity(q, p) - plant.friction(dq))


def evaluate(params, cfg, trajs, ids):
    ch = jax.jit(lambda q, dq: model.channels(params, q, dq, cfg))
    tot = jax.jit(lambda q, dq, ddq: model.residual_torque(params, q, dq, ddq, dq, cfg))
    acc = {k: [] for k in ("total", "dM", "dg", "F")}
    for tr in ids:
        d = trajs[tr]
        for q, dq, tau in zip(d["q"], d["dq"], d["tau"]):
            ddq = plant_ddq(q, dq, tau)
            true = data.true_residual(q, dq, ddq)
            c = ch(q, dq)
            acc["total"].append((np.asarray(tot(q, dq, ddq)), true["total"]))
            acc["dM"].append((np.asarray(c["dM"]), true["dM"]))
            acc["dg"].append((np.asarray(c["dg"]), true["dg"]))
            acc["F"].append((np.asarray(c["F"]), true["F"]))
    report = {}
    for k, pairs in acc.items():
        est = np.array([p[0] for p in pairs]).reshape(len(pairs), -1)
        tru = np.array([p[1] for p in pairs]).reshape(len(pairs), -1)
        err = np.linalg.norm(est - tru, axis=1)
        report[k] = dict(rms_err=float(np.sqrt(np.mean(err**2))),
                         rms_true=float(np.sqrt(np.mean(np.linalg.norm(tru, axis=1) ** 2))),
                         max_err=float(err.max()))
        report[k]["rel"] = report[k]["rms_err"] / report[k]["rms_true"]
    return report


def structure_checks(params, cfg, n=500, seed=1):
    rng = np.random.default_rng(seed)
    skew, fric, mineig = 0.0, np.inf, np.inf
    for _ in range(n):
        q, dq, x = (jnp.asarray(rng.uniform(-np.pi, np.pi, 2)) for _ in range(3))
        R, dR = model.generators_and_grad(params, q, cfg)
        N = jnp.einsum("jabi,i->jab", dR, dq) - 2 * model.christoffel(dR, dq)
        skew = max(skew, float(jnp.abs(jnp.einsum("a,jab,b->j", x, N, x)).max()))
        fric = min(fric, float((model.friction_bases(params, dq, cfg) * dq).min()))
        mineig = min(mineig, float(jnp.linalg.eigvalsh(R).min()))
    return dict(max_skew_violation=skew, min_dq_F=fric, min_eig_R=mineig)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", default="run")
    ap.add_argument("--split", default="test")
    args = ap.parse_args()

    params, cfg, conf = load_run(args.run)
    with open(os.path.join(args.run, "trajs.pkl"), "rb") as f:
        tp = pickle.load(f)
    report = evaluate(params, cfg, tp["trajs"], tp["split"][args.split])
    report["structure"] = structure_checks(params, cfg)
    report["weights"] = {k: np.asarray(v).tolist() for k, v in model.output_weights(params).items()}
    print(json.dumps(report, indent=1))
    with open(os.path.join(args.run, f"eval_{args.split}.json"), "w") as f:
        json.dump(report, f, indent=1)


if __name__ == "__main__":
    main()
