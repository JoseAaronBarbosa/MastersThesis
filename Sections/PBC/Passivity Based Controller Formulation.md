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