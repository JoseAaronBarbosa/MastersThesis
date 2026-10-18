2026-10-18

#DeLaN #Lyapunov 

L-Learning learns a Lagrangian with a DeLaN-type network and builds a Slotine-Li-type tracking controller from the learned matrices. The stability proof only needs the structural properties of the learned matrices.

- **Learned objects:** $\hat D=\hat R_\vartheta\hat R_\vartheta^\top+\tau I$ (inertia) and a potential $\hat P_\xi(q)$, inside $\hat{\mathcal L}=\tfrac12\dot q^\top\hat D\dot q-\hat P$. The matrices $\hat C$ and $\hat G$ come from $\hat{\mathcal L}$ by automatic differentiation.
- **No friction channel.** The model is a conservative Lagrangian. Everything non-conservative is treated as modelling error $d$.
- **Training signal:** inverse dynamics. The loss compares the torque $\hat u=\frac{\partial^2\hat{\mathcal L}}{\partial\dot q^2}\ddot q+\frac{\partial^2\hat{\mathcal L}}{\partial q\partial\dot q}\dot q-\frac{\partial\hat{\mathcal L}}{\partial q}$ with the applied $u$. It **needs $\ddot q$ in the data** $(q,\dot q,\ddot q,u)$.
- **No Lyapunov-based weight law.** The Lyapunov function is used to design the controller, not the learning law. The weights are trained by gradient descent in batches.

## Controller and proof

Sliding variable:
$$\dot q_r=\dot q_d+\Lambda\tilde q,\qquad s=\dot{\tilde q}+\Lambda\tilde q=\dot q_r-\dot q,\qquad \tilde q=q_d-q .$$

Model with error: $\hat D\ddot q+\hat C\dot q+\hat G=u-d$, with $d=\tilde D\ddot q+\tilde C\dot q+\tilde G$.

Controller, with $H\succ0$ ($K_D$):

$$u=\hat D\ddot q_r+\hat C\dot q_r+\hat G+\hat d+Hs,\qquad \hat d=\int A^{-1}s\,dt,\quad z\triangleq\hat d-d .$$

Lyapunov function: $V=\tfrac12 s^\top\hat Ds+\tfrac12 z^\top Az$. Using $\dot{\hat D}-2\hat C$ skew-symmetric:

$$\dot V=-s^\top Hs-s^\top z+z^\top A\dot z .$$

Since $\dot z=\dot{\hat d}-\dot d=A^{-1}s-\dot d$, assuming $\dot d\approx0$ gives $z^\top A\dot z=z^\top s$, which cancels $-s^\top z$:

$$\dot V=-s^\top Hs<0\ \Rightarrow\ s\to0\ (\text{LaSalle}),\ q\to q_d .$$

The Slotine-Li trick is used for the controller: $\dot q_r,\ddot q_r$ come from the reference, so the control needs no measured acceleration. Only training does.

### How the compensator works

- The learned modeling error $\hat d$ is pure integral action on $s$. In the $s$-dynamics, $\hat D\dot s+\hat Cs=-Hs-z$, so a persistent mismatch accelerates $s$ and $\hat d$ integrates $s$ until it stops.
- At rest ($s=0$, $\dot s=0$) this forces $z=0$, i.e. $\hat d=d$. It is the same idea as the equivalent control in sliding modes.
- It is a coupled second-order loop: $\hat d$ can overshoot $d$ before settling, and it only tracks slowly varying $d$ (error grows with $\|\dot d\|$).
- The variable $z$ is never implemented. It is an analysis variable because it contains the unknown $d$. Only $\hat d$ runs in the controller.
- The robust modification $\dot z=-\alpha(t)z+A^{-1}s$, giving $\dot V=-s^\top Hs-\alpha z^\top Az$. As written it cannot be implemented, since it is in terms of $z$, and does not appear in the control.
## Training loop

1. Start from an initialized controller.
2. At each iteration $k$: add noise to the current controller (with standard deviation $I_k=I_0(1-k/K)$), collect $(q,\dot q,\ddot q,\tau)$ into a replay buffer $\mathcal M\leftarrow\mathcal M\cup\mathcal D_k$, train on batches, extract $\hat D,\hat C,\hat G$, rebuild the controller, test the tracking error $E_k$.
3. Stop when $E_k<E_{\min}$; otherwise continue (up to $K$ iterations). Then the controller is frozen.

## Remarks:
- The stopping rule is performance-based with a fixed iteration budget.
- The noise is for exploration. It is not persistent excitation in the adaptive-control sense.
- The buffer accumulates data across iterations. The controller is only frozen while testing and collecting.
- It is a training phase before deployment, not online adaptation. The stability proof holds for a frozen model.
- The whole network is retrained. Not only the last layer.

## Critical points

1. $\dot d\approx0$ has no explicit foundation. $d$ depends on $q,\dot q,\ddot q$, so it is not constant along trajectories. The paper argues that $d$ shrinks as the model improves, but that does not make $\dot d$ small. Without $\dot d=0$ the honest result is an ultimate bound that scales with $\|\dot d\|_\infty$.
2. Expanding $\dot d$:

$$\dot d=\dot{\tilde D}\ddot q+\tilde D\dddot q+\dot{\tilde C}\dot q+\tilde C\ddot q+\dot{\tilde G}.$$

   Bounding it needs derivative bounds on the learned matrices (Lipschitz constants on $\hat D$, second-derivative bounds for $\hat C$ since it comes from $\partial\hat D/\partial q$) and bounded jerk. This is exactly the certificate our STA analysis requires, and the paper leaves it implicit.
3. The loss forces the conservative $\hat u$ to match $u$, so any friction torque in the data is absorbed into $\hat D$ and $\hat P$.
4. Training needs $\ddot q$, while the controller does not.
5. Stability is certified for each frozen model, not along weight updates.
6. The only network certificates used are the structural ones (SPD $\hat D$, skew $\dot{\hat D}-2\hat C$), which hold by construction. The quality of the model enters only through the unquantified bound on $d$ and $\dot d$.

## Modifications we plan on doing

- **Acceleration-free loss.** Use the momentum identity of the learned Lagrangian over a window $[t_1,t_2]$ for the loss equation:

$$\frac{\partial\hat{\mathcal L}}{\partial\dot q}\Big|_{t_2}-\frac{\partial\hat{\mathcal L}}{\partial\dot q}\Big|_{t_1}=\int_{t_1}^{t_2}\Big(\frac{\partial\hat{\mathcal L}}{\partial q}+u\Big)dt$$

  (add the dissipative term inside the integral if a friction channel is included). It needs only $q,\dot q,u$. This is the same integral-momentum idea we already use.
- **Separate dissipative channel.** Add a monotone, non-negative-weight network $\hat F(\dot q)$ and fit $u$ against $\hat u+\hat F$, so friction cannot bias $\hat D,\hat P$. Excitation must cover many velocities, including sign changes through zero (Stribeck), to separate friction from the other terms.
- **Online Lyapunov weight law.** Replace batch retraining by an output-layer law with a trace term in the storage (our learning law with projection and e-mod). This certifies the weights along the run and gives OSP and an $\mathcal L_2$ gain.
- **Stronger robust action.** The integral compensator $\hat d$ is the linear counterpart of the STA integral term $v=-\int K_2\,\mathrm{sign}(s)$. The STA handles Lipschitz $d$ rigorously and gives exact convergence, but needs the same derivative bound as above. A first-order SMC needs only a bound on $\bar\varepsilon$.
- **State the bound honestly.** Replace "asymptotic with $\dot d\approx0$" by an ultimate bound in terms of $\bar\varepsilon$ and $\|\dot d\|_\infty$, with the derivative certificate stated explicitly.

## Comparison

|                   | L-Learning[^1]                                        | Our thesis                                                                       |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| Learned objects   | $\hat D$, $\hat P$ (conservative)                     | $\hat M$ (conic basis), $\hat C$ slaved, dissipative $\hat F$, optional $\hat g$ |
| Training          | Gradient descent on inverse dynamics, needs $\ddot q$ | Offline with integral-momentum windows (no $\ddot q$), then online output layer  |
| Online weight law | None (batch retraining)                               | Lyapunov law with projection and e-mod                                           |
| Compensation      | Integral action $\hat d$ (assumes $\dot d\approx0$)   | Learned residual plus robust action (SMC, STA as extension)                      |
| Passivity         | Not used                                              | OSP, $\mathcal L_2$ gain, modular certificates                                   |
| Friction          | Not modelled                                          | Separate dissipative channel                                                     |
| Guarantee         | Asymptotic under idealized assumption                 | UUB radius in $\bar\varepsilon$; $s\to0$ with SMC gain above the bound           |
## References

[^1]: Quan, Q., & Li, H. (2026). _L-Learning: A Lyapunov-Based Approach Leveraging Lagrangian Mechanics for Efficient and Stable Robot Tracking_. arXiv:2605.26648.
