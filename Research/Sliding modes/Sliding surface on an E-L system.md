2026-09-10

#SlidingModes #ELsystem 

## Sliding surface

If we define the tracking error as:
$$e=q-q_{d}$$
and its derivative as:
$$\dot{e}=\dot{q}-\dot{q}_{d}$$
What we are trying to achieve is to drive both errors to zero, so the Sloting approach combines them intro a single variable:
$$s=\dot{e}+\Lambda e$$
If we could somehow force $s=0$ then the error dynamics would be:
$$\dot{e}=-\Lambda e$$
Which is an exponentially stable first order system. $\Lambda$ is a positive definite matrix that will give us the convergence rate on the sliding surface, and it is treated as a design parameter, limited by the physical restrictions of the actuators and the dynamics.
If we take the derivative of the sliding surface:
$$\dot{s}=\ddot{q}-(\ddot{q}_{d}-\Lambda \dot{e})$$
If we define the reference acceleration as:
$$\ddot{q}_{r}=\ddot{q}_{d}-\Lambda \dot{e}$$
Then:
$$\dot{s}=\ddot{q}-\ddot{q}_{r}$$
Meaning that if we drive $s=0$, then $\ddot{q}=\ddot{q}_{r}$. So it essentially transform a tracking problem into a problem of controlling the robot acceleration.
From the robot dynamics model we can substitute the acceleration dynamics in terms of the sliding surface:
$$\begin{align}
 M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)&=\tau  \\
 \ddot{q}&=M^{-1}(\tau-C(q,\dot{q})\dot{q}-g(q))  \\
 \dot{s}+\ddot{q}_{r}&=M^{-1}(\tau-C(q,\dot{q})\dot{q}-g(q)) \\
 M(q)\dot{s}&=\tau-C(q,\dot{q})\dot{q}-g(q)-M(q)\ddot{q}_{r}
\end{align}$$
If we knew the exact dynamics, then we can perform an exact cancelation and force the dynamics of s to be those of an stable linear system:
$$\begin{align}
 \tau&=M(q)\ddot{q}_{r}+C(q,\dot{q})\dot{q}+g(q)-M(q)Ks  \\
 M(q)\dot{s}&=M(q)\ddot{q}_{r}+C(q,\dot{q})\dot{q}+g(q)-M(q)Ks-C(q,\dot{q})\dot{q}-g(q)-M(q)\ddot{q}_{r}  \\
 M(q)\dot{s}&=-M(q)Ks  \\
 \dot{s}&=-Ks
\end{align}$$
Which drives $s\to0$  and consequently $e\to0$. But since the exact dynamics are not known, we have to add a discontinuous term:
$$\tau=M(q)\ddot{q}_{r}+C(q,\dot{q})\dot{q}+g(q)-M(q)Ks+M(q)K_{s}\mbox{sgn}(s)$$
So that when we have perturbations (that can be external or due to parametric deviation):
$$M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)=\tau+d$$
The sliding surface still reaches zero:
$$\begin{align} M(q)\dot{s}&=-M(q)Ks-M(q)K_{s}\mbox{sgn}(s)+d \\ 
\dot{s} &=-Ks-K_{s}\mbox{sgn}(s)+d
\end{align}
$$
Always that $K_{s}>d$.

## Adaptive part

Since we can write the robot dynamics as a combination of a regressor and a parameter vector:
$$M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)=M(q)\dot{s}+M(q)\ddot{q}_{r}+C(q,\dot{q})\dot{q}_{r}+C(q,\dot{q})s+g(q)=\tau$$
$$M(q)\ddot{q}_{r}+C(q,\dot{q})\dot{q}_{r}+g(q)=Y(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\theta$$
$$M(q)\dot{s}=\tau-C(q,\dot{q})s-Y(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\theta$$
We can use an estimation of the parameters in the control law instead of each individual component:
$$\tau=Y(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\hat{\theta}-Ks$$
Substituting into the robot dynamics:
$$M(q)\dot{s}=Y(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\hat{\theta}-Ks-C(q,\dot{q})s-Y(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\theta$$
And defining $\tilde{(\cdot)}=(\cdot)-\hat{(\cdot)}$:
$$M(q)\dot{s}=-Ks-C(q,\dot{q})s-Y(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\tilde{\theta}$$
Now we can do a Lyapunov analysis for the stability of the close-loop system:
$$V=\frac{1}{2}s^TM(q)s+\frac{1}{2}\tilde{\theta}^T\Gamma^{-1}\tilde{\theta}$$
Its derivative:
$$\dot{V}=s^TM(q)\dot{s}+\frac{1}{2}s^T\dot{M}(q)s+\tilde{\theta}^T\Gamma^{-1}\dot{\tilde{\theta}}$$
$$\dot{V}=-s^TKs-s^TC(q,\dot{q})s-s^TY(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\tilde{\theta}+\frac{1}{2}s^T\dot{M}(q)s+\tilde{\theta}^T\Gamma^{-1}\dot{\tilde{\theta}}$$
$$\dot{V}=-s^TKs-s^TY(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\tilde{\theta}+\frac{1}{2}s^T[\dot{M}(q)-2C(q,\dot{q})]s+\tilde{\theta}^T\Gamma^{-1}\dot{\tilde{\theta}}$$
$$\dot{V}=-s^TKs-s^TY(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})\tilde{\theta}+\tilde{\theta}^T\Gamma^{-1}\dot{\tilde{\theta}}$$
$$\dot{V}=-s^TKs-\tilde{\theta}^TY^T(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})s+\tilde{\theta}^T\Gamma^{-1}\dot{\tilde{\theta}}$$
$$\dot{V}=-s^TKs-\tilde{\theta}^T[Y^T(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})s+\Gamma^{-1}\dot{\tilde{\theta}}]$$
since every term is an scalar. Then if we set the extra terms to zero:
$$\dot{\tilde{\theta}}=\Gamma Y^T(q,\dot{q},\dot{q}_{r},\ddot{q}_{r})s$$
Which is the adaptation law. If the parametric error gets to zero:
$$\dot{V}=-s^TKs$$ and we can use Barbalat's lemma or La Salle's principle to verify asymptotic convergence of $s\to0$.








