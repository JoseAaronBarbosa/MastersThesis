2026-09-26

#Passivity #ELsystem [^1]

## Dynamics of rigid robots

The matrix form of the Euler-Lagrange equations for rigid robots is:
$$
D(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)=\tau
$$
### Fundamental properties

- Property 1. The inertia matrix ${}D(q){}$ is symmetric, positive definite, and both ${}D(q){}$ an ${}D^{-1}(q){}$ are uniformly bounded as a function of ${}q\in\mathbb{R}^n{}$. The boundedness, requires in general that all joints be revolute.
- Property 2. There is an independent control input for each degree of freedom.
- Property 3. The equation is linear in the parameters, meaning we can define a regressor and parameter vector: ${}Y(q,\dot{q},\ddot{q})\theta=\tau{}$
- Property 4. If the Coriolis matrix is defined using the Christoffel symbols, then ${}\dot{q}^T(\dot{D}(q)-2C(q,\dot{q}))\dot{q}=0{}$ for any ${}\dot{q}\in\mathbb{R}^n{}$, meaning that ${}\dot{D}(q)-2C(q,\dot{q}){}$ is skew-symmetric. 

Moreover, the dynamic equations of a rigid robot define a passive mapping ${}\tau\to q{}$, which is to say that ${}\int_{0}^T\dot{q}^T\tau\,dt\geq-\beta{}$ for some ${}\beta>0{}$ and for all ${}T{}$.

## Inverse dynamics based control

Most control algorithms can be implemented as non-linear state feedback control law as an inner loop, and then linear compensator driven by the tracking error as the outer loop.

### Known parameter case

If the control is chosen as:
$$\tau = D(q)a+C(q,\dot{q})\dot{q}+g(q)$$then by substituting into the dynamics we get:
$$
D(q)(\dot{q}-a)=0
$$
Since $D(q)>0$ it implies that:
$$
\ddot{q}=a
$$
Then we can define ${}a{}$ as an outer loop control law with units of acceleration, in terms of a linear dynamic compensator:
$$
a=\ddot{q}_{d}-K(s)e
$$
where ${}e=q-q_{d}{}$. Substituting gives:
$$
\ddot{e}+K(s)e=0
$$
Then the dynamic compensator could be a PD-compensator which leads to a second order error equation:
$$
\ddot{e}+K_{v}\dot{e}+K_{p}e=0
$$
And if ${}K_{v},K_{p}{}$ are diagonal matrices with positive elements, then the closed-loop is linear, decoupled, and globally exponentially stable, with arbitrary natural frequency and damping ratio. 
The choice of ${}K(s){}$ can be made to shape error transients or improve robustness, etc.

### Adaptive case

#### With acceleration measurement and boundedness of the inverse of the estimated inertia

Just replacing the matrices with their estimates in the control:
$$
\tau=\hat{D}(q)a+\hat{C}(q,\dot{q})\dot{q}+\hat{g}(q)
$$
And substituting into the rigid robot dynamics gives:
$$
\ddot{e}+K_{v}\dot{e}+K_{p}e=\hat{D}^{-1}Y(q,\dot{q},\ddot{q})\tilde{\theta}=\Phi\tilde{\theta}
$$
Were ${}\tilde{\theta}=\hat{\theta}-\theta{}$. We need a measurement of the acceleration to build the regressor ${}Y(q,\dot{q},\ddot{q}){}$, and the invertibility of ${}\hat{D}{}$ for the regressor ${}\Phi{}$. In state space ${}x=[e,\dot{e}]^T{}$:
$$
\dot{x}=Ax+B\Phi\tilde{\theta}
$$
with:
$$
A = \left[\begin{array}{cc}
0 & I \\
-K_{p} & -K_{v}
\end{array}\right],\quad B=\left[\begin{array}{c}
0\\
I
\end{array}\right]
$$
then ${}A{}$ can be chose Hurwitz.
A Lyapunov function candidate, quadratic in its terms, the error and the residual estimates:
$$
V=x^TPx+\tilde{\theta}^T\Gamma\tilde{\theta} 
$$
Has derivative:
$$
\dot{V}=-x^TQx+2x^TPB\Phi\tilde{\theta}+2\tilde{\theta}^T\Gamma\dot{\tilde{\theta}}
$$
Using the fact that ${}A^TP+PA=-Q{}$. Then we can rearrange as:
$$
\dot{V}=-x^TQx+2\tilde{\theta}^T[\Phi^TB^TPx+\Gamma\dot{\tilde{\theta}}]
$$
Since ${}\dot{\tilde{\theta}}=\dot{\hat{\theta}}{}$, we can choose the adaptation law:
$$
\dot{\hat{\theta}}=-\Gamma^{-1}\Phi^TB^TPx
$$
Then the derivative becomes:
$$
\dot{V}=-x^TQx\leq 0
$$
Using Barbalat's lemma, since ${}e\in\mathcal{L}_{2},e\in\mathcal{L}_{\infty},\dot{e}\in\mathcal{L}_{\infty}{}$, then ${}e\to 0{}$ as ${}t\to\infty{}$. And the residual estimates remain bounded.

#### With acceleration measurement

If we apply a nominal control plus the estimated part:
$$
\tau=D_{0}(q)(a+\delta a)+C_{0}(q,\dot{q})\dot{q}+g_{0}(q)
$$
Where ${}()_{0}{}$ are prior estimates of the matrices, and ${}\delta a{}$ is an additional outer loop control that compensates for the deviations ${}\Delta()=()_{0}-(){}$, that is chosen adaptively. Since the prior estimates are not updated we can ensure invertibility.
For the error dynamics:
$$
\ddot{e}+K_{v}\dot{e}+K_{p}e={D}_{0}^{-1}Y(q,\dot{q},\ddot{q})\Delta\theta+\delta a=\Phi_{0}\Delta\theta+\delta a
$$
Choosing the extra control as:
$$
\delta a=-\Phi_{0}\Delta\hat{\theta}
$$
gives:
$$
\ddot{e}+K_{v}\dot{e}+K_{p}e=\Phi_{0}\Delta\tilde{\theta}
$$
Since ${}\Delta\tilde{\theta}=\tilde{\theta}{}$, we can use the same Lyapunov candidate function and obtain an update law:
$$
\Delta\dot{\hat{\theta}}=-\Gamma^{-1}\Phi_{0}^TB^TPx
$$

We obtain the same stability result.

	- In my thesis we use a similar result. We introduce a term epsilon*I in the inertia matrix to ensure that it is invertible.
#### Without acceleration measurement

We can remove the acceleration measurement using a filtering:
$$
\tau_{f}=Y_{f}(q,\dot{q})\theta
$$
Were ${}()_{f}=\frac{\omega}{s+\omega}(){}$, with ${}\omega>0{}$. 
We can define the prediction error ${}\epsilon=Y_{f}\hat{\theta}-\tau_{f}=Y_{f}\hat{\theta}-Y_{f}\theta=Y_{f}\tilde{\theta}{}$, which already is bounded with any standard gradient parameter update law. But it does not ensure that the tracking error goes to zero.
The parameter estimation was obtained from the filtered regressor, but the control law acts on the real unfiltered plant. The estimates in the controller need to be replaced with:
$$
W^{-1}\hat{\theta}W=\hat{\theta}+\frac{1}{\omega}\dot{\hat{\theta}}\omega
$$
which only needs knowledge of ${}\hat{\theta},\dot{\hat{\theta}}{}$. 
Also, since ${}\hat{D}^{-1}(q(t)){}$ is a time-varying operator, it does not commute with the filtering operator in general. But they can be interchanged with the swapping property:
$$
W^{-1}(\hat{D}^{-1}\epsilon)=\frac{1}{\omega}\left[ \frac{d}{dt}(\hat{D}^{-1}) \right]\epsilon+\hat{D}^{-1}W^{-1}(\epsilon)$$
Then the controller is given by:
$$
\tau=\hat{D}a+\hat{C}\dot{q}+\hat{g}+\left\{ \frac{1}{\omega}Y_{f}\dot{\hat{\theta}}+\frac{1}{\omega}\hat{D}\left[\frac{d}{dt}(\hat{D}^{-1})\epsilon\right] \right\}
$$
And it can be proven that ${}e\to 0{}$ as ${}t\to\infty{}$.

	- In my thesis, the online update law is driven by s directly, and this family of controllers does not have the problem of e -> 0 when the prediction error is bounded. Also, the filtering is done offline so it does not face the same swapping of operators problem. It only filters the data before the regression.
## Passivity based control

### General theorem

With a reference trajectory ${}q^d\in\mathcal{C}^2{}$, and error ${}e(t)=q(t)-q^d(t){}$. Consider the differential equation:
$$
D(q)\dot{r}+C(q,\dot{q})r+K_{v}r=\Psi
$$
Where ${}r{}$ is given by:
$$
r=F(s)^{-1}e
$$
Where ${}F(s){}$ is strictly proper, stable, and the mapping ${}-r\to\Psi{}$ is passive. Then $\dot{e},e\to 0$ as ${}t\to\infty{}$, because ${}r\to 0{}$.
For this theorem it is important to use the particular choice of $C$ that makes ${}\dot{D}+2C{}$ skew-symmetric. Also, since ${}F(s){}$ is strictly proper, then ${}r{}$ contains derivatives of ${}e{}$ and therefore derivatives of ${}q{}$. If ${}F(s){}$ is of relative degree one, then it only contains the first derivative and therefore it does not depend on the acceleration.

### Known parameter case

The control:
$$
\tau=D(q)a+C(q,\dot{q})v+g(q)-K_{v}(q-v)
$$
when substituting into the dynamics of the differential equation gives:
$$
D(q)\dot{r}+C(q,\dot{q})r+K_{v}r=0
$$
Where ${}r=\dot{q}-v{}$. Defining also ${}v=\dot{q}^d-sK(s)e{}$, ${}a=\dot{v}=\ddot{q}-K(s)e{}$ for a given compensator ${}K(s){}$. Then ${}r=F(s)^{-1}e{}$. And the stability follows form the above theorem.

### Adaptive version

Using the control law with the estimated matrices:
$$
\tau=\hat{D}(q)a+\hat{C}(q,\dot{q})v+\hat{g}(q)-K_{v}r
$$
Substituting into the dynamics we obtain:
$$
D(q)\dot{r}+C(q,\dot{q})r+K_{v}r=\tilde{D}(q)a+\tilde{C}(q,\dot{q})v+\tilde{g}
$$
Given the linearity in the parameters condition, then we can write:
$$
D(q)\dot{r}+C(q,\dot{q})r+K_{v}r=Y(q,\dot{q},v,a)\tilde{\theta}:=\Psi
$$
The regressor does not depend on acceleration measurements.
The parameter update law is calculated in a way that makes the mapping passive, and from the general theorem the stability follows. This parameter update law is:
$$
\dot{\tilde{\theta}}=-\Gamma^{-1}Y^Tr
$$
for a given ${}\Gamma>0{}$.

#### Special cases

The algorithm of Slotine and Li follows from the choice:
$$
K(s)=\frac{1}{s}\Lambda
$$
The Sadegh-Horowitz scheme follows from:
$$
K(s)=K_{p}+K_{d}s+\frac{K_i}{s}
$$

	- The passive mapping obtained in the learning law is from epsilon to the variable s. In this paper, epsilon does not exist since they assume the system is linear in the parameters, so the adaptive controller can be formulated. We assume (due to the friction) that the system is not linear in the parameters and therefore the usage of the DeLaN to approximate the friction, carries an approximation error (epsilon). 

## References

[^1]: Ortega, R., & Spong, M. W. (1989). _Adaptive motion control of rigid robots: a tutorial._ Automatica, 25(6), 877–888.





