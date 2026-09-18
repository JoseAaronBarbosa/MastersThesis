2026-09-18

#Lyapunov #SlidingModes 

## Introducing the robust action

Now we can also substitute the control of the robust action into the dynamics:
$$\tau_{sta}=-K_{1}s^{1/2}\mbox{sign}(s)+v$$
$$\dot{v}=-K_{2}\mbox{sign}(s)$$
$$M(q)\dot{s}=-C(q,\dot{q})s-K_{D}s-\tilde{\Delta}-K_{1}s^{1/2}\mbox{sign}(s)+v$$
Since what we can bound with the spectral normalization is the derivative of the residual uncertainty, we need to get an equation with it. Define $\eta=v-\tilde{\Delta}$, then $\dot{\eta}=\dot{v}-\dot{\tilde{\Delta}}=-K_{2}\mbox{sign}(s)-\dot{\tilde{\Delta}}$. 

Consider the Lyapunov candidate function:
$$V(s,\eta,\tilde{W})=\frac{1}{2}s^{T}M(q)s+\sum_{i=1}^n\zeta_{i}^TP_{i}\zeta_{i}+\frac{1}{2}\mbox{tr}\{\tilde{W}^TK_{\omega}^{-1}\tilde{W}\}$$
Where $\zeta_i=[\begin{array}{cc}\sqrt{|s|}\mbox{sign}(s)&\eta_{i}\end{array}]^T$. 

Taking the derivative gives much of the same terms as last time:
$$\dot{V}=-s^{T}K_{D}s-s^T\epsilon+\mbox{tr}\{\tilde{W}^T[s\phi^T(\theta)+K_{\omega}^{-1}\dot{\tilde{W}}]\}-s^TK_{1}s^{1/2}\mbox{sign}(s)+s^Tv+\frac{d}{dt}\sum_{i=1}^n\zeta_{i}^TP_{i}\zeta_{i}$$
If $K_{1}>0$ is diagonal, then we can express the matrix multiplication as a sum of each product.
$$\dot{V}=-s^{T}K_{D}s-s^T\epsilon+\mbox{tr}\{\tilde{W}^T[s\phi^T(\theta)+K_{\omega}^{-1}\dot{\tilde{W}}]\}-\sum_{i=1}^n|s|^{3/2}k_{1_{i}}+s^Tv+\frac{d}{dt}\sum_{i=1}^n\zeta_{i}^TP_{i}\zeta_{i}$$
When trying to take the derivative of the added term by computing first the derivative of $\zeta_{i}$:
$$\frac{d}{dt}\zeta_{i}=\left[ \begin{array}{cc}\frac{1}{2}|s|^{-1/2}\dot{s}_{i}&\dot{\eta}_{i}\end{array} \right]^T$$
For $s_{i}\neq 0$. This is what forces us to use the Filippov sense of the existence of the solution. For $\dot{\eta}_{i}$ we have an expression if $K_{2}>0$ is also diagonal:
$$\frac{d}{dt}\zeta_{i}=\left[ \begin{array}{c}\frac{1}{2}|s|^{-1/2}\dot{s}_{i}\\ -k_{2_{i}}\mbox{sign}(s_{i})-\dot{\tilde{\Delta}}_{i}\end{array} \right]$$
The problem comes when trying to find an expression for $\dot{s}_{i}$. From the dynamics:
$$\dot{s}=M^{-1}(q)[-C(q,\dot{q})s-K_{D}s-\tilde{\Delta}-K_{1}s^{1/2}\mbox{sign}(s)+v]$$
Since $M^{-1}(q)$ is not diagonal, the channels are not decoupled. And therefore we cannot treat $n$ independent scalar STA loops.
