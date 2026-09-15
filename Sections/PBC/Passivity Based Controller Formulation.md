2026-09-08

#Passivity 

[[Thesis Proposal V2.pdf]]

The control action is given by:
$$\tau =\hat{M}(q)\ddot{q}_{r}+\hat{C}(q,\dot{q})\dot{q}_{r}+\hat{g}(q)-K_{d}s+\hat{\Delta}$$
Where $\hat{M},\hat{C},\hat{g}$ are obtained from mechanical modeling of the manipulator, and represent the nominal feed-forward compensation.
The position tracking error is defined as:
$$e=q-q_{d}$$The we define a virtual reference velocity signal:
$$\dot{q}_{r}=\dot{q}_{d}-\Lambda e$$
If the position error is zero, then the desired velocity it matched the desired velocity, if the joint lags behind the second terms becomes positive and the it indicated that it must move faster.
The filtered error is:
$$\begin{align}
 s&=\dot{q}-\dot{q}_{r}= \dot{q}-\dot{q}_{d}+\Lambda e \\
 s&=\dot{e}+\Lambda e
\end{align}$$
The dynamics are given by:
$$M(q)\ddot{q}+C(q,\dot{q})+g(q)+F(\dot{q})+\tau_{d}(t)=\tau$$
Since $\dot{q}=s+\dot{q}_r$ and $\ddot{q}=\dot{s}+\ddot{q}_{r}$, we substitute the control to obtain the closed-loop dynamics:
$$\begin{align}
 M(q)(\dot{s}+\ddot{q}_{r})-\hat{M}(q)\ddot{q}_{r}+C(q,\dot{q})(s+\dot{q}_{r})-\hat{C}(q,\dot{q})\dot{q}_{r}+g(q)-\hat{g}(q)+F(\dot{q})+\tau_{d}(t)+K_{D}s=\hat{\Delta} \\
 M(q)\dot{s}+C(q,\dot{q})s+K_{D}s=-(\tilde{M}(q)\ddot{q}_{r}+\tilde{C}(q,\dot{q})\dot{q}_{r}+\tilde{g}(q)+F(\dot{q})+\tau_{d}(t))+\hat{\Delta}
\end{align}
$$
Where $\tilde{(\cdot)}=(\cdot)-\hat{(\cdot)}$. We define the residual uncertainty $\Delta=\tilde{M}(q)\ddot{q}_{r}+\tilde{C}(q,\dot{q})\dot{q}_{r}+\tilde{g}(q)+F(\dot{q})+\tau_{d}(t)$, then we arrive at:
$$M(q)\dot{s}=-C(q,\dot{q})s-K_{D}s-\tilde{\Delta}$$
From here we can define a candidate Lyapunov function in terms of the filtered error as:
$$V(s)=\frac{1}{2}s^{T}M(q)s$$
When the derivative is obtained:
$$\begin{align}
 \dot{V}(s)&=s^{T}M(q)\dot{s}+\frac{1}{2}\dot{M}(q)s  \\
 &=-s^{T}C(q,\dot{q})s-s^{T}K_{D}s-s^{T}\tilde{\Delta}+\frac{1}{2}s^{T}\dot{M}(q)s \\
 &=-\frac{1}{2}s^{T}(\dot{M}(q)-2C(q,\dot{q}))s-s^{T}K_{D}s-s^{T}\tilde{\Delta} \\
 &=-s^{T}K_{D}s-s^{T}\tilde{\Delta}
\end{align}$$
The cancellation was due to the skew-symmetry property of $\dot{M}(q)-2C(q,\dot{q})$. Since $K_{D}$ is positive definite:
$$\dot{V}(s)\leq-s^{T}\tilde{\Delta}$$
Which is the passivity property. Then we can say that the mapping $-\tilde{\Delta}\to s$ is passive. Moreover from:
$$\dot{V}(s)=-s^{T}K_{D}s-s^{T}\tilde{\Delta}$$
We can bound the right side:
$$\begin{align}
\dot{V}(s)\leq s^T(-\tilde{\Delta})-s^T(\lambda_{min}(K_{D})s)
\end{align}$$
Since $\lambda_{min}(K_{D})s>0$ for all $s\neq0$ , then the mapping $-\tilde{\Delta}\to s$ is output strictly passive, with passivity index $K_D$.

## Baseline radius

If instead of using an estimate of the uncertainty we use the controller only with the energy shaping and damping injection we arrive at the closed loop error dynamics:
$$M(q)\dot{s}=-C(q,\dot{q})s-K_{D}s-\Delta$$
Doing the same analysis with the same Lyapunov candidate function:
$$V(s)=\frac{1}{2}s^{T}M(q)s$$
The derivative is:
$$\dot{V}(s)=-s^{T}K_{D}s-s^{T}\Delta$$
The Youngs inequality states that:
$$-a^{T}b\leq \frac{1}{2\epsilon}a^{T}\Lambda_{1}a+\frac{\epsilon}{2}b^{T}\Lambda_{1}^{-1}b$$
for $\epsilon>0$, $\Lambda_{1}>0$, and vector $a,b\in\mathbb{R}^n$. Applying this to $-s^T\Delta$ and setting $\epsilon=0.5$ without loss of generality:
$$\begin{align}
 \dot{V}(s)&\leq -s^TK_{D}s-s^T\Lambda_{1}s+\frac{1}{4}\Delta^T\Lambda_{1}^{-1}\Delta  \\
 &=-s^{T}(K_{D}-\Lambda_{1})s+\frac{1}{4}\Delta^T\Lambda_{1}^{-1}\Delta 
\end{align}$$
Since both $K_D$ and $\Lambda_{1}$ are arbitrary, we can choose them such that $(K_{D}-\Lambda_{1})>0$. Then we can bound the uncertainty term as the supremum over the whole evolution of the dynamics:
$$\bar{\eta}_{1}:=\sup_{t\geq 0}\left(\frac{1}{4}\Delta^T\Lambda_{1}^{-1}\Delta\right)$$
Lastly we can bound the first term by the Rayleigh-Ritz inequality, giving:
$$\dot{V}(s)\leq-\lambda_{min}(K_{D}-\Lambda_{1})||s||^{2}+\bar{\eta}_{1}$$
Recalling that the Lyapunov function is given by:
$$V(s)=\frac{1}{2}s^{T}M(q)s$$
We know that the inertia matrix is bounded, and positive definite, so we can use Rayleigh-Ritz again:
$$\frac{1}{2}\lambda_{m}||s||^{2}\leq \frac{1}{2}s^{T}M(q)s\leq \frac{1}{2}\lambda_{M}||s||^2$$
multiplying by $-1$ and isolating $||s||^2$:
$$-V(s)\geq-\frac{1}{2}\lambda_{M}||s||^{2}$$
$$-||s||^{2}\leq -\frac{2V(s)}{\lambda_{M}}$$
Substituting into the derivative result:
$$\dot{V}(s)\leq-\frac{2\lambda_{min}(K_{D}-\Lambda_{1})}{\lambda_{M}}V(s)+\bar{\eta}_{1}$$
Then defining $\alpha:=\frac{2\lambda_{min}(K_{D}-\Lambda_{1})}{\lambda_{M}}>0$, since both eigenvalues are positive, we get:
$$\dot{V}(s)\leq-\alpha V(s)+\bar{\eta}_{1}$$
Consider the differential equation:
$$\dot{y}(t)=-\alpha y(t)+\bar{\eta}_{1}$$
$$y(0)=V(s(0))$$
By the comparison Lemma [reference](https://drive.google.com/file/d/1KJiT2MT9VMvMBMRmH9i0t0xmSWWo4vc3/view?usp=drive_link), it is guaranteed that:
$$V(s)\leq y(t)$$
So we just need to obtain the solution of the differential equation to obtain the estimate:
$$e^{\alpha t}\dot{y}(t)+e^{\alpha t}\alpha y(t)=e^{\alpha t}\bar{\eta}_{1}$$
$$\frac{d}{dt}(e^{\alpha t}y(t))=e^{\alpha t}\bar{\eta}_{1}$$
$$e^{\alpha t}y(t)-y(0)=\bar{\eta}_{1}\int_{0}^{t}e^{\alpha \tau}d\tau$$
$$y(t)=e^{-\alpha t}y(0)+\frac{\bar{\eta}_{1}e^{-\alpha t}}{\alpha}\int_{0}^{\alpha t}e^{s}ds$$
With the variable change $s:=\alpha\tau$.
$$y(t)=e^{-\alpha t}y(0)+\frac{\bar{\eta}_{1}e^{-\alpha t}}{\alpha}(e^{\alpha t}-1)$$
$$y(t)=e^{-\alpha t}y(0)+\frac{\bar{\eta}_{1}}{\alpha}(1-e^{-\alpha t})$$
Then we can make the comparison.
$$V(s(t))\leq e^{-\alpha t}y(0)+\frac{\bar{\eta}_{1}}{\alpha}(1-e^{-\alpha t})$$
Taking the limit and checking for the supremum:
$$\lim_{t\to \infty}\sup V(s(t))\leq {\frac{\bar{\eta}_1}{\alpha}}$$
Recovering the definition of $\alpha$:
$$\lim_{t\to \infty}\sup V(s(t))\leq {\frac{\bar{\eta}_1\lambda_{M}}{2\lambda_{min}(K_{D}-\Lambda_{1})}}$$
Taking the other direction of the Rayleigh-Ritz inequality:
$$\frac{1}{2}\lambda_{m}||s||^{2}\leq V(s)$$
$$\frac{1}{2}\lambda_{m}\lim_{t\to \infty}\sup||s(t)||^{2}\leq\lim_{t\to \infty}\sup V(s(t))\leq {\frac{\bar{\eta}_1\lambda_{M}}{2\lambda_{min}(K_{D}-\Lambda_{1})}}$$
Isolating the error:
$$||s(t)||\leq\sqrt{\frac{\bar{\eta}_{1}\lambda_{M}}{\lambda_{min}(K_{D}-\Lambda_{1})\lambda_{m}}}:=\rho_{1}$$
We see that the in order to reduce the radius we could optimally choose $\Lambda_{1}$ to see the smallest possible certificate that the Young inequality can give us. But also that in reality, $K_D$ is the only thing we can increase to reduce the radius. But the high gain amplifies encoder noise and causes other problems. 
The next step is to introduce the uncertainty residual as a way to reduce the radius.
