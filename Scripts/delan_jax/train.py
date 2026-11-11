"""Offline training of the structured residual model with the integral momentum loss.

Usage:  python train.py --mat ../delan_dataset.mat --out run1 [--steps 20000 --lr 3e-3]
"""
import argparse
import json
import os
import pickle
import time
from dataclasses import asdict

import numpy as np
import jax
import jax.numpy as jnp
import optax

import data
import model


def make_loss(cfg, y_scale, l2):
    def loss_fn(params, W):
        lhs = jax.vmap(lambda t, q, dq: model.window_lhs(params, t, q, dq, cfg))(W["t"], W["q"], W["dq"])
        fit = jnp.mean(((lhs - W["y"]) / y_scale) ** 2)
        reg = sum(jnp.sum(layer["W"] ** 2) for net in (params["M"], params["U"], *params["F"]) for layer in net)
        return fit + l2 * reg, fit
    return loss_fn


def train(cfg, W_train, W_val, steps, lr, l2, seed, log_every=500):
    to_jnp = lambda W: {k: jnp.asarray(W[k]) for k in ("t", "q", "dq", "y")}
    Wt, Wv = to_jnp(W_train), to_jnp(W_val)
    y_scale = jnp.asarray(W_train["y"].std(axis=0))
    loss_fn = make_loss(cfg, y_scale, l2)

    params = model.init(jax.random.PRNGKey(seed), cfg)
    sched = optax.warmup_cosine_decay_schedule(0.0, lr, 200, steps, lr * 1e-3)
    opt = optax.chain(optax.clip_by_global_norm(1.0), optax.adam(sched))
    state = opt.init(params)

    @jax.jit
    def step(params, state):
        (loss, fit), g = jax.value_and_grad(loss_fn, has_aux=True)(params, Wt)
        upd, state = opt.update(g, state, params)
        return optax.apply_updates(params, upd), state, fit

    val_fit = jax.jit(lambda p: loss_fn(p, Wv)[1])

    best = (np.inf, params, 0)
    history = []
    t0 = time.time()
    for it in range(1, steps + 1):
        params, state, fit = step(params, state)
        if it % log_every == 0 or it == steps:
            v = float(val_fit(params))
            history.append((it, float(fit), v))
            if v < best[0]:
                best = (v, params, it)
            print(f"step {it:6d}  train {float(fit):.3e}  val {v:.3e}  ({time.time() - t0:.0f}s)", flush=True)
    print(f"best val {best[0]:.3e} at step {best[2]}")
    return best[1], history, y_scale


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mat", default="../delan_dataset.mat", help="delan_dataset.mat (excitation + split)")
    ap.add_argument("--out", default="run")
    ap.add_argument("--steps", type=int, default=8000)
    ap.add_argument("--lr", type=float, default=3e-3)
    ap.add_argument("--l2", type=float, default=1e-6)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--k-cone", type=int, default=3)
    ap.add_argument("--k-U", type=int, default=2)
    ap.add_argument("--k-F", type=int, default=2)
    ap.add_argument("--w-len", type=int, default=20)
    ap.add_argument("--noise", type=float, nargs=3, default=None, metavar=("Q", "DQ", "TAU"),
                    help="std of Gaussian noise added to logged q, dq, tau")
    args = ap.parse_args()

    cfg = model.Config(k_cone=args.k_cone, k_U=args.k_U, k_F=args.k_F)
    coeffs, split, w0, t = data.load_excitation(args.mat)
    print("simulating plant ...", flush=True)
    trajs = data.simulate_all(coeffs, w0, t, noise_std=args.noise, seed=args.seed)
    W = data.build_windows(trajs, args.w_len)
    W_train, W_val = data.subset(W, split["train"]), data.subset(W, split["val"])
    print(f"windows: {len(W_train['y'])} train, {len(W_val['y'])} val", flush=True)

    params, history, y_scale = train(cfg, W_train, W_val, args.steps, args.lr, args.l2, args.seed)

    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, "params.pkl"), "wb") as f:
        pickle.dump(jax.tree_util.tree_map(np.asarray, params), f)
    with open(os.path.join(args.out, "config.json"), "w") as f:
        json.dump(dict(model=asdict(cfg), args=vars(args), history=history), f, indent=1)
    with open(os.path.join(args.out, "trajs.pkl"), "wb") as f:
        pickle.dump(dict(trajs=trajs, split={k: v.tolist() for k, v in split.items()}), f)
    print(f"saved to {args.out}/")


if __name__ == "__main__":
    main()
