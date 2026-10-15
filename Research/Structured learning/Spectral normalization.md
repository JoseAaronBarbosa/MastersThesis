2026-10-15

#Lyapunov #Learning

## Problem and idea

The paper addresses precision quadrotor landing, where unmodeled ground-effect aerodynamics produce an unknown disturbance force $f_{a}$ in the translational dynamics: $$m\dot{v}=mg+Rf_{u}+f_{a}$$The approach is to keep a nominal model, learn $f_{a}$ offline with a ReLU network whose Lipschitz constant is constrained by spectral normalization, and cancel the learned estimate $\hat{f}_{a}$ inside a feedback-linearization controller. The stability proof relies on the Lipschitz bound of the network and on a bounded learning error.[^1]

## Network and spectral normalization

The ReLU network has weights $\theta=\{W^{1},\dots,W^{L+1}\}$ and no activation on the output layer:
$$f(x,\theta)=W^{L+1}\phi(W^{L}\phi(\cdots\phi(W^{1}x)\cdots))$$
The Lipschitz constant of a differentiable $f$ is the supremum of the largest singular value of its gradient:
$$\|f\|_{Lip}=\sup_{x}\sigma(\nabla f(x))$$
ReLU is 1-Lipschitz and the Lipschitz constant of a composition is at most the product of the constants, so:
$$\|f\|_{Lip}\leq\prod_{l=1}^{L+1}\sigma(W^{l})$$
Here $\sigma(W)$ is the spectral norm (largest singular value) of the matrix $W$. Spectral normalization rescales each layer so that all layers have the same spectral norm and the product equals the desired constant $\gamma$: [^2]
$$\bar{W}=\frac{W}{\sigma(W)}\gamma^{\frac{1}{L+1}}\quad\Rightarrow\quad\|f(x,\bar{\theta})\|_{Lip}\leq\gamma$$
Training is done offline with stochastic gradient descent, minimizing the prediction error of the observed disturbance subject to $\|f\|_{Lip}\leq\gamma$, applying the normalization to the weights during training. The paper also presents spectral normalization as a way to stabilize gradient-based training; inside the proof its role is to provide the constant $L_{a}$.

## Controller

The composite variable plays the same role as the filtered error $s$ of the thesis:

$$s=\dot{\tilde{p}}+\Lambda\tilde{p}=\dot{p}-v_{r},\qquad v_{r}=\dot{p}_{d}-\Lambda\tilde{p}$$

The desired force includes the learned feedforward cancellation:

$$f_{d}=\bar{f}_{d}-\hat{f}_{a},\qquad \bar{f}_{d}=m\dot{v}_{r}-K_{v}s-mg$$

which gives the closed loop $m\dot{s}+K_{v}s=\epsilon$, with $\epsilon=f_{a}-\hat{f}_{a}$ the approximation error.

Since $\hat{f}_{a}(\zeta,u)$ depends on the control input $u$, the allocation of the desired wrench $B_{0}u=\eta_{d}(u)$ is non-affine in $u$ and is solved by fixed-point iteration:

$$u_{k}=B_{0}^{-1}\eta_{d}(u_{k-1})$$

If $\hat{f}_{a}$ is $L_{a}$-Lipschitz and $\sigma(B_{0}^{-1})L_{a}<1$, the map is a contraction and the iteration converges to a unique solution (Lemma 5.1). [^1]
## Stability result

The proof uses three assumptions: (1) the desired trajectory and its first two derivatives are bounded; (2) the one-step change of the control signal satisfies $\|u_{k}-u_{k-1}\|\leq\rho\|s\|$, justified by the time-scale separation between the fast attitude/motor loops and the slower position loop; (3) the learning error is bounded, $\|\epsilon(\zeta,u)\|\leq\epsilon_{m}$, on the compact operating sets.

Take $V=\frac{1}{2}m\|s\|^2$ and $\lambda=\lambda_{min}(K_{v})$. The controller computes $f_{d}$ with the previous input $u_{k-1}$, while the true disturbance corresponds to $u_{k}$, so:$$\dot{V}=s^{T}\left(-K_{v}s+\hat{f}_{a}(\zeta_{k},u_{k})-\hat{f}_{a}(\zeta_{k},u_{k-1})+\epsilon(\zeta_{k},u_{k})\right)$$$$\dot{V}\leq-s^{T}K_{v}s+\|s\|\left(\|\hat{f}_{a}(\zeta_{k},u_{k})-\hat{f}_{a}(\zeta_{k},u_{k-1})\|+\epsilon_{m}\right)$$Using the Lipschitz constant with respect to the input $u$ and then Assumption 2:

$$\|\hat{f}_{a}(\zeta_{k},u_{k})-\hat{f}_{a}(\zeta_{k},u_{k-1})\|\leq L_{a}\|u_{k}-u_{k-1}\|\leq L_{a}\rho\|s\|$$

Therefore:

$$\dot{V}\leq-(\lambda-L_{a}\rho)\|s\|^{2}+\epsilon_{m}\|s\|\quad\Rightarrow\quad\dot{V}\leq-\frac{2(\lambda-L_{a}\rho)}{m}V+\sqrt{\frac{2V}{m}}\epsilon_{m}$$

Applying the comparison lemma to $\sqrt{V}$:[^3]

$$\|s(t)\|\leq\|s(t_{0})\|e^{-\frac{\lambda-L_{a}\rho}{m}(t-t_{0})}+\frac{\epsilon_{m}}{\lambda-L_{a}\rho}$$

which requires $\lambda_{min}(K_{v})>L_{a}\rho$ and gives input-to-state stability. Through the hierarchy $s=\dot{\tilde{p}}+\Lambda\tilde{p}$ the position error converges exponentially to the ball:

$$\lim_{t\to\infty}\|\tilde{p}(t)\|=\frac{\epsilon_{m}}{\lambda_{min}(\Lambda)\left(\lambda_{min}(K_{v})-L_{a}\rho\right)}$$
## Relevance for the thesis

What maintains:

- Same structure of the argument: nominal model plus learned feedforward cancellation, with the residual $\epsilon$ entering the error dynamics through the same channel as the control, and a damping gain that must dominate the learned module's sensitivity ($\lambda_{min}(K_{v})>L_{a}\rho$, analogous to the role of $K_{D}$ against the learning error).
- Spectral normalization as the mechanism that turns "the network is Lipschitz" into a number computed from the weights.
- The type of result is an ISS/ultimate-bound ball. The super-twisting action in the thesis is what is meant to remove that ball.

What differs:

- The network in the paper depends on the control input $u$, which forces the fixed-point iteration, the contraction condition and Assumption 2. The thesis regressor depends only on $q,\dot{q},\dot{q}_{r},\ddot{q}_{r}$, so none of that is needed.
- The paper uses the Lipschitz constant to bound a difference of network outputs at two inputs. The super-twisting algorithm needs a bound on a time derivative. It is the same fact seen through the chain rule, $\|\frac{d}{dt}f(x(t))\|\leq\|f\|_{Lip}\|\dot{x}\|$ almost everywhere, and this is how it feeds the network term of the derivative certificate.
- The network is frozen in the paper. There is no online weight adaptation, so there is no adaptation-rate term.
- The activation is ReLU, which is Lipschitz but not differentiable, so there is no control over second derivatives.

Open point for the thesis: The Coriolis channel and the gravity channel of the regressor are built from first derivatives of networks (Christoffel symbols of $\hat{L}$, gradient of $\hat{U}$). Bounding the time derivative of those channels requires a bound on the second derivatives of the networks, which the spectral norms of the weights alone do not provide. This needs smooth activations and an additional bound that involves the curvature of the activation.

## References

[^1]: Shi, G., Shi, X., O'Connell, M., Yu, R., Azizzadenesheli, K., Anandkumar, A., Yue, Y., & Chung, S.-J. (2019). _Neural Lander: Stable drone landing control using learned dynamics_. IEEE International Conference on Robotics and Automation (ICRA), 9784–9790.
[^2]: Miyato, T., Kataoka, T., Koyama, M., & Yoshida, Y. (2018). _Spectral normalization for generative adversarial networks_. International Conference on Learning Representations (ICLR), arXiv:1802.05957.
[^3]: Khalil, H. K. (2002). _Nonlinear Systems_, 3rd Edition, Prentice Hall, Upper Saddle River.