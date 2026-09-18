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
Finally we can pick an adaptation law for the output layer such tat the trace term cancels, that is:
$$\dot{\tilde{W}}=-K_{\omega}s\phi^T(\theta)$$
From which we get:
$$\dot{V}_{l}=-s^{T}K_{D}s+s^T[\tau_{sta}-\epsilon]$$
If we had no robust action then we could arrive at a ISS argument if the $\epsilon$ remains bounded. But for the robust action we need an extended Lyapunov learning law that combines the second order dynamics of the robust action.

## Composite Lyapunov candidate

Now consider the Lyapunov candidate function:
$$V(s,v,\tilde{W})=\frac{1}{2}s^{T}M(q)s+\sum_{i=1}^n\zeta_{i}^TP_{i}\zeta_{i}+\frac{1}{2}\mbox{tr}\{\tilde{W}^TK_{\omega}^{-1}\tilde{W}\}$$
Where $\zeta_i=[\begin{array}{cc}\sqrt{|s|}\mbox{sign}(s),v_{i}\end{array}]^T$. Taking the derivative gives much of the same terms as last time:


