2026-10-07

#ELsystem

Offline training needs a regression target built from the true dynamics $M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)+F(\dot{q})=\tau$, but $\ddot{q}$ is not directly measured (only $q,\dot{q},\tau$ are logged). Differentiating $\dot{q}$ numerically to get $\ddot{q}$ amplifies sensor noise[^1], so an acceleration-free reformulation is needed before the regression.

## The identity

Define the generalized momentum $p(t):=M(q(t))\dot{q}(t)$. With derivative:
$$\dot{p}=M(q)\ddot{q}+\dot{M}(q)\dot{q}$$
Using the identity $\dot{M}(q)=C(q,\dot{q})+C^T(q,\dot{q})$ (guaranteed by the Christoffel-symbol construction of $C$):
$$\dot{p}=M(q)\ddot{q}+C(q,\dot{q})\dot{q}+C^T(q,\dot{q})\dot{q}=\big(\tau-g(q)-F(\dot{q})\big)+C^T(q,\dot{q})\dot{q}$$
obtained from substituting the equation of motion. Integrating both sides over a window $[t_1,t_2]$:
$$M(q(t_2))\dot{q}(t_2)-M(q(t_1))\dot{q}(t_1)=\int_{t_1}^{t_2}\Big[\tau(t)-g(q(t))-F(\dot{q}(t))+C^T(q,\dot{q})\dot{q}\Big]dt$$
No term on either side involves $\ddot{q}$: the left side only needs the endpoint samples of $q,\dot{q}$, and the right side only needs the intra-window samples of $q,\dot{q},\tau$. Candidate network parameters $\hat{M}_\theta,\hat{C}_\theta,\hat{g}_\theta,\hat{D}_\theta$ are substituted on both sides, and training minimizes the residual of this identity over logged windows.

## Persistent excitation and training windows

The windows used for this regression are built from trajectories designed with Fourier-series persistent excitation, so that the data covers a broad enough region of configuration space for the fitted $\hat{M}_\theta,\hat{C}_\theta,\hat{g}_\theta,\hat{D}_{\theta}$ to generalize beyond the specific paths driven during data collection.[^2]

## References

[^1]: De Luca, A., & Mattone, R. (2003). _Actuator failure detection and isolation using generalized momentum._ IEEE International Conference on Robotics and Automation (ICRA), 634–639.
[^2]: Swevers, J., Ganseman, C., Tukel, D. B., De Schutter, J., & Van Brussel, H. (1997). _Optimal robot excitation and identification._ IEEE Transactions on Robotics and Automation, 13(5), 730–740.
