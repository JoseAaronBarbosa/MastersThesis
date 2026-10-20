2026-10-20

#Passivity 
## Main idea

Set-point regulation achieved reshaping the potential energy so its minimum is at the target, then inject damping. The closed-loop Hamiltonian is the Lyapunov function. No $M$, no $C$, no inverse dynamics needed.[^1]

## Model

- $T = \tfrac12 \dot x^\top R(x)\,\dot x$, $\quad p = R(x)\dot x$, $\quad H = T + V(x)$
- $\dot x = \dfrac{\partial H}{\partial p}$, $\quad \dot p = -\dfrac{\partial H}{\partial x} + u$ $\quad (B = I)$

## Result

1. Potential shaping: $u = -\nabla V^0(x) + \nabla V(x)$ gives $\bar H = T + V^0$.
2. Damping: $w = -Q\dot x$ gives
$$\dot{\bar H} = -\dot x^\top Q \dot x \le 0 \quad \text{(only semidefinite).}$$
3. LaSalle: $\dot{\bar H} = 0 \Rightarrow \dot x = 0 \Rightarrow \nabla V^0 = 0 \Rightarrow x = \bar x$. (This is the zero state-detectability step.)
4. $w = -Q\dot x$ is optimal for $\displaystyle\int_0^\infty \tfrac12\left(\dot x^\top Q\dot x + w^\top Q^{-1}w\right)dt$ for any $V^0$ (Hamilton-Jacobi-Bellman with $\lambda = \bar H$).
5. Simplest $V^0$:
$$V^0(x) = V(x) - V(\bar x) - \nabla V(\bar x)^\top (x-\bar x) + \tfrac12 (x-\bar x)^\top W (x-\bar x).$$
With $W + \nabla^2 V > 0$ it is strictly convex, so the global minimum is $\bar x$.

**Control law:**
$$u = \nabla V(\bar x) - W(x-\bar x) - Q\dot x$$
→ PD + constant gravity term at the target, $g(\bar x)$ (not $g(x)$). Diagonal $W, Q$ give decentralized joint PD.

## Extensions

- **Task space**: $y = f(x)$, $J = \partial f/\partial x$, generalized force $v = J^{-\top}u$ (power-conserving: $u^\top \dot x = v^\top \dot y$).
$$u = \nabla V(x) - J^\top\!\left[ W(y-\bar y) + Q\dot y \right].$$
Needs only $f$ and $J$ (no $J^{-1}$). Local result. Redundant or singular case ($m<n$): add slack variables $y_s = f_s(x)$ and damp with $-Q\dot x$; stability is proved for the linearized system.
- **Constraints**: $\Psi(x) = 0$, reduce to independent coordinates $x_I$ with $\delta x_D = D\,\delta x_I$, and generalized force $u_c = u_I + D^\top u_D$. Feedback only on $x_I$:
$$u = \nabla V(x) - \begin{bmatrix} W(x_I - \bar x_I) + Q\dot x_I \\ 0 \end{bmatrix},\qquad \frac{\partial^2 V_c}{\partial x_I \partial x_I} + W > 0.$$

## Why it matters for the thesis

- Origin of **energy shaping + damping injection**, and of PD + gravity compensation. Same structure as PBC and IDA-PBC.
- Passivity reading: port $(w, \dot x)$ with storage $\bar H$. Where $-Q\dot x$ plays the role of $-K_D s$.
- Only model dependence is **$g(\bar x)$**. A learned $\hat g = \nabla \hat U$ has error at $\bar x$, which gives a steady-state offset (hence an integral or robust term).
- Regulation only. For tracking, $\bar H$ is not a Lyapunov function; we need the $s$-variable, skew-symmetry of $\dot M - 2C$, and the regressor/learning structure.

## Limitations

- Set-point only; no tracking.
- Global result is limited by the torus; the task-space result is local.
- Redundant case: only linearized stability.
- No transient or robustness analysis.[^2] [^3]

## References
[^1]: M. Takegaki and S. Arimoto, *"A New Feedback Method for Dynamic Control of Manipulators,"* ASME J. Dyn. Syst., Meas., Control, vol. 103, no. 2, pp. 119–125, Jun. 1981.
[^2]: S. Arimoto and F. Miyazaki, *"Stability and Robustness of PID Feedback Control for Robot Manipulators of Sensory Capability,"* in Robotics Research: The First International Symposium, M. Brady and R. Paul, Eds. Cambridge, MA: MIT Press, 1984, pp. 783–799.
[^3]: R. Kelly, *"PD Control with Desired Gravity Compensation of Robotic Manipulators: A Review,"* Int. J. Robotics Research, vol. 16, no. 5, pp. 660–672, 1997.
