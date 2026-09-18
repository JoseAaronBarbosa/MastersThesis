2026-09-17

#DeLaN #Lyapunov

## First Lyapunov candidate

Using the composite Lyapunov candidate function:
$$V_{l}(s,\tilde{W})=\frac{1}{2}s^{T}M(q)s+\frac{1}{2}\mbox{tr}\{\tilde{W}^TK_{\omega}^{-1}\tilde{W}\}$$
Which is always positive, since $M(q)>0,K_{\omega}>0$. We take the derivative:
$$\dot{V}_{l}=s^TM(q)\dot{s}+\frac{1}{2}s^{T}\dot{M}(q)s+\frac{1}{2}\mbox{tr}\{\dot{\tilde{W}}^TK_{\omega}^{-1}\tilde{W}+\tilde{W}^TK_{\omega}^{-1}\dot{\tilde{W}}\}$$
Since the trace is just a sum of scalar functions we can put the derivative inside of the trace operator, then using properties of the trace we can separate the terms. We can also substitute the manipulator dynamics:
$$\dot{V}_{l}=-s^{T}C(q,\dot{q})s-s^{T}K_{D}s-s^{T}\tilde{\Delta}+\frac{1}{2}s^{T}\dot{M}(q)s+\mbox{tr}\{\tilde{W}^TK_{\omega}^{-1}\dot{\tilde{W}}\}+s^{T}\tau_{sta}$$
$$\dot{V}_{l}=-\frac{1}{2}s^{T}[\dot{M}(q)-2C(q,\dot{q})]s-s^{T}K_{D}s-s^{T}\tilde{\Delta}+\mbox{tr}\{\tilde{W}^TK_{\omega}^{-1}\dot{\tilde{W}}\}+s^{T}\tau_{sta}$$
The first term cancels due to the skew-symmetry. Then by the universal approximation theorem we can write $\tilde{\Delta}=\Delta-\hat{\Delta}=W^{*}\phi(\theta)+\epsilon-\hat{W}\phi(\theta)=\tilde{W}\phi(\theta)+\epsilon$ which we can substitute in our equation:
$$\dot{V}_{l}=-s^{T}K_{D}s-s^{T}\tilde{W}\phi(\theta)-s^T\epsilon+\mbox{tr}\{\tilde{W}^TK_{\omega}^{-1}\dot{\tilde{W}}\}+s^{T}\tau_{sta}$$
Since each term is a scalar, it is equal to its trace, and it is invariant under cyclic permutations if the product is defines, so $s^{T}\tilde{W}\phi(\theta)=\mbox{tr}\{s^{T}\tilde{W}\phi(\theta)\}=\mbox{tr}\{\tilde{W}^{T}s\phi^{T}(\theta)\}$ which allows us to put this term inside the trace:
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]+\mbox{tr}\{\tilde{W}^Ts\phi^T(\theta)+\tilde{W}^TK_{\omega}^{-1}\dot{\tilde{W}}\}$$
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]+\mbox{tr}\{\tilde{W}^T[s\phi^T(\theta)+K_{\omega}^{-1}\dot{\tilde{W}}]\}$$
Finally we can pick an adaptation law for the output layer such that the trace term cancels, that is:
$$\dot{\tilde{W}}=\dot{\hat{W}}=-K_{\omega}s\phi^T(\theta)$$
From which we get:
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]$$
If we had no robust action then we could arrive at a ISS argument if the $\epsilon$ remains bounded. But for the robust action we need an extended Lyapunov learning law that combines the second order dynamics of the robust action.

## Robust modification

For the rest of the system we need a certification on the boundedness of the weights. The robust modification to the learning law will provide this and also prevent parameter drift.
Consider the modified adaptation law:
$$\dot{\hat{W}}=-K_{\omega}[s\phi^T(\theta)+\kappa||s||\hat{W}]$$
With $\kappa>0$. Then the Lyapunov derivative gives:
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]+\mbox{tr}\{\tilde{W}^T[s\phi^T(\theta)-s\phi^T(\theta)-\kappa||s||\hat{W}]\}$$
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]-\kappa||s||\mbox{tr}\{\tilde{W}^T\hat{W}\}$$
Remembering that $\tilde{W}=W^*-\hat{W}$:
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]-\kappa||s||\mbox{tr}\{W^{*^T}\hat{W}-\hat{W}^T\hat{W}\}$$
The Frobenius inner product can be applied to the traces of the matrix multiplication:
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]-\kappa||s||\left(\langle W^{*},\hat{W}\rangle_{F}-\langle \hat{W},\hat{W}\rangle_{F}\right)$$
And applying Cauchy-Schwartz:
$$\dot{V}_{l}\leq-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]-\kappa||s||\left(||W^*||_{F}||\hat{W}||_{F}-||\hat{W}||_{F}^2\right)$$
We can complete the square of the term inside the brackets:
$$\left(||W^*||_{F}||\hat{W}||_{F}-||\hat{W}||_{F}^2\right)=-\left(||\hat{W}||_{F}-\frac{1}{2}||W^*||_{F}\right)^2+\frac{1}{4}||W^*||_{F}^2\leq\frac{1}{4}||W^*||_{F}^2$$
Going back to out Lyapunov function:
$$\dot{V}_{l}\leq-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]+\frac{\kappa}{4}||W^*||_{F}^2||s||$$
We can now bound the quadratic term with the Rayleigh-Ritz inequality:
$$\dot{V}_{l}\leq-\lambda_{min}(K_{D})||s||^2+s^T[\tau_{sta}-\epsilon]+\frac{\kappa}{4}||W^*||_{F}^2||s||$$
$$\dot{V}_{l}\leq-\left(\lambda_{min}(K_{D})||s||-\frac{\kappa}{4}||W^*||_{F}^2\right)||s||+s^T[\tau_{sta}-\epsilon]$$
Which gives us a UUB type conclusion.



