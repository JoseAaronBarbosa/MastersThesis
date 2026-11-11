# delan_jax

Offline training of the structured residual basis (DeLaN style) for the 2-DOF sandbox. The output replaces the hand-picked basis in `Passivity_Learning.m`.

## What it learns

The residual between the true plant and the nominal model, as a weighted sum of frozen bases:

$$\hat\Delta=\sum_{j}\sigma_j w_{M,j}\big(R_j(q)\ddot q_r+C_j(q,\dot q)\dot q_r\big)+\sum_i w_{U,i}\nabla U_i(q)+\sum_l w_{F,l}F_l(\dot q)$$

- $R_j=\bar L_j\bar L_j^T$ (positive definite). $\sigma_j=+1$ for the first $k$ generators and $-1$ for the last $k$ (two cones), $w_M\ge0$.
- $C_j$ comes from the Christoffel symbols of $R_j$, so $\dot R_j-2C_j$ is skew-symmetric for any weight.
- $U_i(q)$ are potential bases and $w_U$ is free.
- $F_{l,i}(v)=\tanh(v/\varepsilon)\,\mbox{softplus}(h_{l,i}(|v|))+\mbox{softplus}(d_{l,i})v$, so $\dot q^TF_l\ge0$ and $w_F\ge0$.

The loss is the integral momentum identity on 20-sample windows, so no accelerations are used:

$$\big[\Delta\hat M\dot q\big]_{t_1}^{t_2}-\int_{t_1}^{t_2}\big(\Delta\hat C^T\dot q-\nabla\hat U-\hat F\big)dt=\int_{t_1}^{t_2}\tau\,dt-\big[M_0\dot q\big]_{t_1}^{t_2}+\int_{t_1}^{t_2}\big(C_0^T\dot q-g_0\big)dt$$

## Install (CPU, pip)

```
pip install jax optax numpy scipy
```

## Run

From this folder:

```
python checks.py                                   # structure + true-residual identity checks
python train.py --mat ../delan_dataset.mat --out run1   # 8k steps, ~20 min on a laptop CPU
python evaluate.py --run run1                      # errors vs the true residual on test trajectories
python export.py --run run1                        # writes run1/delan_basis.mat + delan_check_points.mat
```

Then in MATLAB, with `run1/` and this folder on the path:

```
check_export        % MATLAB evaluator vs JAX, errors should be ~1e-15
Passivity_DeLaN     % nominal PBC vs frozen DeLaN vs online adaptation from W0
```

The included `run1/` was trained for 20k steps, but the best validation loss came at step 5000, hence the 8k default. Use `--steps 2000` for a quick run (about 5 min, already usable). `--noise Q DQ TAU` adds Gaussian noise to the logged signals.

## Files

| File | Contents |
| --- | --- |
| `plant.py` | 2-DOF plant, nominal PBC and Fourier trajectories (port of `Data_gen.m`, Christoffel C) |
| `data.py` | re-simulates the trajectories in `delan_dataset.mat`, builds windows and residual targets |
| `model.py` | generators, Christoffel C, potential and friction bases, identity left side |
| `train.py` | full-batch Adam, best-validation checkpoint |
| `evaluate.py` | per-channel errors against the true residual, structure checks |
| `export.py` | `.mat` export and JAX check points |
| `delan_basis_eval.m` | MATLAB evaluator: returns R, C, gradU, F at (q, dq) |
| `check_export.m` | MATLAB vs JAX comparison |
| `Passivity_DeLaN.m` | closed loop with the learned basis and the online law |

## Notes

- The data uses the trajectories and the train/val/test split stored in `delan_dataset.mat`. The plant is re-simulated with the Christoffel C (the old MATLAB C was transposed, fixed 2026-11-05).
- `Passivity_DeLaN.m` uses the `Data_gen.m` mismatch, since that is the residual the basis was trained on. `Passivity_Learning.m` uses a different mismatch ($m_2$ nominal = 4x).
