"""Export a trained run to MATLAB: delan_basis.mat (network weights, W0, config) and
delan_check_points.mat (JAX outputs at random points, for check_export.m).

Usage:  python export.py --run run1 [--out ../delan_basis.mat]
"""
import argparse
import os

import numpy as np
import jax
import jax.numpy as jnp
import scipy.io as sio

import model
from evaluate import load_run


def _layers(net):
    """MLP as a MATLAB cell array of structs {W, b} (b as a column vector)."""
    cell = np.empty((len(net),), dtype=object)
    for i, layer in enumerate(net):
        cell[i] = dict(W=np.asarray(layer["W"], dtype=float), b=np.asarray(layer["b"], dtype=float).reshape(-1, 1))
    return cell


def export(params, cfg, path):
    w = model.output_weights(params)
    fnets = np.empty((model.N_DOF,), dtype=object)
    for i in range(model.N_DOF):
        fnets[i] = _layers(params["F"][i])
    net = dict(
        M=_layers(params["M"]), U=_layers(params["U"]), F=fnets,
        F_visc=np.asarray(params["F_visc"], dtype=float),          # k_F x n (raw, softplus applied in MATLAB)
        k_cone=float(cfg.k_cone), k_U=float(cfg.k_U), k_F=float(cfg.k_F),
        diag_eps=cfg.diag_eps, fric_eps=cfg.fric_eps, fric_vscale=cfg.fric_vscale,
        sigma=np.asarray(model.cone_signs(cfg), dtype=float).reshape(-1, 1),
    )
    W0 = dict(wM=np.asarray(w["wM"]).reshape(-1, 1), wU=np.asarray(w["wU"]).reshape(-1, 1),
              wF=np.asarray(w["wF"]).reshape(-1, 1))
    sio.savemat(path, dict(net=net, W0=W0))


def check_points(params, cfg, path, n=1000, seed=0):
    rng = np.random.default_rng(seed)
    Q = rng.uniform(-np.pi, np.pi, (n, 2))
    DQ = rng.uniform(-3, 3, (n, 2))
    DQ[:50] *= 0.01  # include the Coulomb/Stribeck region near zero velocity

    def one(q, dq):
        R, dR = model.generators_and_grad(params, q, cfg)
        return R, model.christoffel(dR, dq), model.grad_potentials(params, q), model.friction_bases(params, dq, cfg)

    R, C, gU, F = jax.vmap(one)(jnp.asarray(Q), jnp.asarray(DQ))
    # MATLAB layout: R(:,:,j,p), C(:,:,j,p), gradU(:,i,p), F(:,l,p)
    sio.savemat(path, dict(
        Q=Q, DQ=DQ,
        R=np.transpose(np.asarray(R), (2, 3, 1, 0)),
        C=np.transpose(np.asarray(C), (2, 3, 1, 0)),
        gradU=np.transpose(np.asarray(gU), (2, 1, 0)),
        F=np.transpose(np.asarray(F), (2, 1, 0)),
    ))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", default="run")
    ap.add_argument("--out", default=None, help="default: <run>/delan_basis.mat")
    args = ap.parse_args()
    params, cfg, _ = load_run(args.run)
    out = args.out or os.path.join(args.run, "delan_basis.mat")
    export(params, cfg, out)
    check_points(params, cfg, os.path.join(os.path.dirname(out) or ".", "delan_check_points.mat"))
    print(f"wrote {out} and delan_check_points.mat")


if __name__ == "__main__":
    main()
