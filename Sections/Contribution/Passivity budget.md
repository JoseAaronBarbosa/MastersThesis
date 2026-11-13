2026-10-28

#Lyapunov #Passivity 


## Notation

We will use the following notation:
- Subscript ${}n{}$ marks the nominal model. 
- ${}\hat{(\cdot)}{}$ are kept only for learned quantities.
- ${}\tilde{(\cdot)}=(\cdot)-(\cdot)_n{}$ is the model mismatch.
- ${}\tilde{W}=\hat{W}-W^*{}$ is the weight error.
## Plant

The Euler-Lagrange system has the following model:
$$
M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)+F(\dot{q})+\tau_{d}(t)=\tau
$$
And it fulfills the properties:
- **P1**. ${}\lambda_{m}I\leq M(q)\leq\lambda_{M}I{}$ for all ${}q{}$.
- **P2**. ${}\dot{M}(q)-2C(q,\dot{q}){}$ is skew-symmetric. This is the true plant's ${}C{}$, built from the Christoffel symbols of the true ${}M{}$.
- **P3**. ${}\dot{q}F(\dot{q})\geq 0{}$ (dissipative friction).
- **P4**. ${}||\tau_{d}(t)||\leq\bar{\tau}_{d}{}$.
- **P5**. The reference ${}q_{d}{}$ and its derivatives ${}\dot{q}_{d},\ddot{q}_{d}{}$ are bounded.

## Errors

The errors are defined as follows:
- ${}e=q-q_{d}{}$
- ${}\dot{q}_{r}=\dot{q}_{d}-\Lambda e{}$
- ${}s=\dot{q}-\dot{q}_{r}=\dot{e}+\Lambda e{}$

The third one is the filtered error used in (Slotine, 1983)[^1], which can be seen as the stable filter:
$$
\dot{e}=-\Lambda e+s
$$
So ${}e{}$ is the output of a stable filter driven by ${}s{}$.

## Control law

The composite control law is given by:
$$
\tau=M_{n}(q)\ddot{q}_{r}+C_{n}(q,\dot{q})\dot{q}_{r}+g_{n}(q)-K_{D}s+\hat{\Delta}-K\mbox{sgn}(s)
$$
Where ${}K_{D}>0,K=\mbox{diag}(k_{i}),k_{i}>0{}$. 
The control law contains the nominal model (without friction), damping injections, a learned neural network torque and a robust action.
The structure of this control law pretends to divide the task each controller is charged with, and achieving better performance as each part is attached.

## Error dynamics

Substituting the control law into the model of the plant gives:
$$
\begin{align}
&M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)+F(\dot{q})+\tau_{d}(t)=\\ &M_{n}(q)\ddot{q}_{r}+C_{n}(q,\dot{q})\dot{q}_{r}+g_{n}(q)-K_{D}s+\hat{\Delta}-K\mbox{sgn}(s)
\end{align}
$$
Since ${}\dot{q}=s+\dot{q}_{r}{}$ and ${}\ddot{q}=\dot{s}+\ddot{q}_{r}{}$, we get:
$$
\begin{align}
&M(q)\dot{s}+M(q)\ddot{q}_{r}+C(q,\dot{q})s+C(q,\dot{q})\dot{q}_{r}+g(q)+F(\dot{q})+\tau_{d}(t)=\\ &M_{n}(q)\ddot{q}_{r}+C_{n}(q,\dot{q})\dot{q}_{r}+g_{n}(q)-K_{D}s+\hat{\Delta}-K\mbox{sgn}(s)
\end{align}
$$
Then we use the model mismatch definition: 
$$
M(q)\dot{s}+\tilde{M}(q)\ddot{q}_{r}+C(q,\dot{q})s+\tilde{C}(q,\dot{q})\dot{q}_{r}+\tilde{g}(q)+F(\dot{q})+\tau_{d}(t)=-K_{D}s+\hat{\Delta}-K\mbox{sgn}(s)
$$
We define the model residual as:
$$
\Delta:=\tilde{M}(q)\ddot{q}_{r}+\tilde{C}(q,\dot{q})\dot{q}_{r}+\tilde{g}(q)+F(\dot{q})+\tau_{d}(t)
$$
To obtain the error dynamics:
$$
M(q)\dot{s}+C(q,\dot{q})s+K_{D}s=\hat{\Delta}-\Delta-K\mbox{sgn}(s)
$$
Let ${}x=(q,\dot{q},q_{d},\dot{q}_{d},\ddot{q}_{d}){}$ collect everything ${}\Delta{}$ depends on, apart from ${}\tau_{d}(t){}$. 
Which is what the network must learn to compensate. We can see that if there is no learned residual model mismatch (${}\hat{\Delta}-\Delta=0{}$) and we drop the robust action, we obtain the same closed loop of Slotine-Li[^1][^5].

## Learning module

The structured learning module (DeLaN) is trained offline and its generators are frozen. 
Define the generalized momentum $p(t):=M(q(t))\dot{q}(t)$. With derivative:
$$\dot{p}=M(q)\ddot{q}+\dot{M}(q)\dot{q}$$
Using the identity $\dot{M}(q)=C(q,\dot{q})+C^T(q,\dot{q})$ and substituting the model dynamics:
$$\dot{p}=M(q)\ddot{q}+C(q,\dot{q})\dot{q}+C^T(q,\dot{q})\dot{q}=\big(\tau-g(q)-F(\dot{q})\big)+C^T(q,\dot{q})\dot{q}$$
Integrating both sides over a window $[t_1,t_2]$:
$$M(q(t_2))\dot{q}(t_2)-M(q(t_1))\dot{q}(t_1)=\int_{t_1}^{t_2}\Big[\tau(t)-g(q(t))-F(\dot{q}(t))+C^T(q,\dot{q})\dot{q}\Big]dt$$
No term on either side involves $\ddot{q}$: the left side only needs the endpoint samples of $q,\dot{q}$, and the right side only needs the intra-window samples of $q,\dot{q},\tau$. Candidate network parameters $\hat{M}_\theta,\hat{C}_\theta,\hat{g}_\theta,\hat{D}_\theta$ are substituted on both sides, and offline training minimizes the residual of this identity over logged windows. 
Online, only the output weights move, so the learned term is linear in them [^2][^7][^8]:
$$
\hat{\Delta}=\hat{W}\psi(x)
$$
The neural network module learns:
$$
\hat{\Delta}=\hat{W}\psi(x)=\hat{M}(q)\ddot{q}_{r}+\hat{C}(q,\dot{q})+\hat{g}(q)+\hat{F}(\dot{q})
$$
Offline training supplies the initial value ${}\hat{W}(0)=W_{0}{}$, since it find the best set of basis and the initial best weights for the training data.
The universal approximation theorem[^6] tells us that there exists optimum weights on the operating domain to express the residual with an unremovable structural approximation error:
$$
\Delta=W^*\psi(x)+\epsilon(x,t)
$$
The optimum weights are calculated when there is no dependency of ${}\epsilon(x,t){}$ on the measurement noise, that is ${}\epsilon(x){}$. In reality the best weights for an ${}\epsilon(x,t){}$ could be time-variant.
The structural approximation error contains:
1. The approximation error of the frozen basis,
2. Non Euler-Lagrange effects that the basis cannot represent,
3. All of ${}\tau_{d}(t){}$, because a function of ${}x{}$ can't represent it.

Then the learned residual mismatch is given by:
$$
\hat{\Delta}-\Delta=\hat{W}\psi(x)-W^*\psi(x)-\epsilon(x,t)=\tilde{W}\psi(x)-\epsilon(x,t)
$$
So that the error dynamics become:
$$
M(q)\dot{s}=-C(q,\dot{q})s-K_{D}s+\tilde{W}\psi(x)-\epsilon(x,t)-K\mbox{sgn}(s)
$$
The goal then is to minimize:
$$
H(x)=\hat{\Delta}-\Delta=\tilde{W}\psi(x)+\epsilon(x)
$$
*What restrictions exist?*
## The interconnection

If from the error dynamics we define ${}v=\tilde{W}\psi(x)-\epsilon(x,t)-K\mbox{sgn}(s) {}$ which can be seen as an injected disturbance. The error system with input ${}v{}$ and output ${}s{}$:
$$
M(q)\dot{s}+C(q,\dot{q})s+K_{D}s=v
$$
has an storage function:
$$
V_{P}=\frac{1}{2}s^TM(q)s
$$
with time derivative:
$$
\dot{V}_{P}=s^TM(q)\dot{s}+\frac{1}{2}s^T\dot{M}(q)s
$$
substituting the error dynamics:
$$
\dot{V}_{P}=-s^TC(q,\dot{q})s-s^TK_{D}s+\frac{1}{2}s^T\dot{M}(q)s+s^Tv
$$
Using the skew-symmetry property:
$$
\dot{V}_{P}=s^Tv-s^TK_{D}s\leq s^Tv-\lambda_{min}(K_{D})\|s\|^2
$$
Meaning that it is **output strictly passive**.[^3][^4]

## Lyapunov based adaptation law

We will now try to find an adaptation law for the weights to certify the stability of the system, we will briefly substitute ${}u_{r}=-K\mbox{sgn}(s){}$ for the calculations. Consider the Lyapunov candidate function:
$$
V = \frac{1}{2}s^TM(q)s+\frac{1}{2}\mbox{tr}(\tilde{W}^T\Gamma^{-1}\tilde{W})
$$
With ${}\Gamma>0{}$. Taking the time derivative:
$$
\dot{V} = s^TM(q)\dot{s}+\frac{1}{2}s^T\dot{M}(q)s+\mbox{tr}(\tilde{W}^T\Gamma^{-1}\dot{\tilde{W}})
$$
Substituting the system dynamics:
$$
\dot{V}=-s^TC(q,\dot{q})s-s^TK_{D}s+s^T\tilde{W}\psi(x)-s^T\epsilon(t,x)+s^Tu_{r}+\frac{1}{2}s^T\dot{M}(q)s+\mbox{tr}(\tilde{W}^T\Gamma^{-1}\dot{\tilde{W}})
$$
Since each term is a scalar, it is equal to its trace, and it is invariant under cyclic permutations if the product is defined, so $s^{T}\tilde{W}\psi(x)=\mbox{tr}\{s^{T}\tilde{W}\psi(x)\}=\mbox{tr}\{\tilde{W}^{T}s\phi^{T}(x)\}$. Then:
$$
\dot{V}=\frac{1}{2}s^T(\dot{M}(q)-2C(q,\dot{q}))s-s^TK_{D}s-s^T\epsilon(x,t)+s^Tu_{r}+\mbox{tr}\left(\tilde{W}^T(s\psi^T(x)+\Gamma^{-1}\dot{\tilde{W}})\right)
$$
Using the skew-symmetry property and choosing the adaptation law such that the trace term cancels:
$$
\dot{\tilde{W}}=-\Gamma s\psi^T(x)
$$
The derivative reduces to:
$$
\dot{V}=-s^TK_{D}s-s^T\epsilon(x,t)+s^Tu_{r}\leq-\lambda_{min}(K_{D})\|s\|^2-s^T\epsilon(x,t)+s^Tu_{r}
$$
## With e-modification

If to prevent parameter drift, we use the robust adaptation law[^9][^10]:
$$
\dot{\tilde{W}}=-\Gamma(s\psi^T(x)+\kappa\|s\|(\hat{W}-W_{0}))
$$
That pushes the weights towards ${}W_{0}{}$. Then the derivative becomes:
$$
\dot{V}\leq-\lambda_{min}(K_{D})\|s\|^2-s^T\epsilon(x,t)+s^Tu_{r}-\mbox{tr}(\tilde{W}^T\kappa\|s\|(\hat{W}-W_{0}))
$$
Substituting by the Frobenius norm:
$$
\dot{V}\leq-\lambda_{min}(K_{D})\|s\|^2-s^T\epsilon(x,t)+s^Tu_{r}-\kappa\|s\|\langle \tilde{W},(\hat{W}-W_{0})\rangle_{F}
$$
From the expression ${}\hat{W}-W_{0}=\hat{W}-W^*+W^*-W_{0}=\tilde{W}+(W^*-W_{0}){}$, we can work only on the norm. Since the inner product is linear and from Young's inequality:
$$
\begin{align}
\langle \tilde{W},(\hat{W}-W_{0})\rangle_{F}&=\langle \tilde{W},\tilde{W}+(W^*-W_{0})\rangle_{F}= \langle \tilde{W},\tilde{W}\rangle_{F}+\langle \tilde{W}, W^*-W_{0}\rangle_{F} \\
&\geq\|\tilde{W}\|_{F}^2-\frac{1}{2}\|\tilde{W}\|_{F}^2-\frac{1}{2}\|W^*-W_{0}\|^2_{F}=\frac{1}{2}\|\tilde{W}\|_{F}^2-\frac{1}{2}\|W^*-W_{0}\|^2_{F}
\end{align}
$$
Then:
$$
-\kappa\|s\|\langle \tilde{W},(\hat{W}-W_{0})\rangle_{F}\leq-\frac{1}{2}\kappa\|s\|\|\tilde{W}\|_{F}^2+\frac{1}{2}\kappa\|s\|\|W^*-W_{0}\|^2_{F}
$$
So that the derivative becomes:
$$
\dot{V}\leq-\lambda_{min}(K_{D})\|s\|^2-s^T\epsilon(x,t)+s^Tu_{r}-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}
$$
We can see that the e-modification pulls the weights towards ${}W_{0}{}$ to prevent drifting, but adds a bias on the Lyapunov function derivative, meaning that it contributes to the radius of the ball for the UUB, along with ${}\epsilon(x,t){}$. The magnitude of the contribution is given by ${}\|W^*-W_{0}\|_{F}^2{}$ which means that a good offline training (${}W_{0}{}$ close to ${}W^*{}$) reduces the ball of the UUB.

## Bounding of epsilon (via Young's)

Using Young's inequality on the ${}\epsilon{}$ term:
$$
-s^T\epsilon(x,t)\leq s^T\Lambda_{1}s+\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon
$$
And then the derivative becomes:
$$
\begin{align}
\dot{V}&\leq-s^TK_{D}s+s^T\Lambda_{1}s+\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon+s^Tu_{r}-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F} \\
&\leq -\lambda_{min}(K_{D}-\Lambda_{1})\|s\|^2+\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon+s^Tu_{r}-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}
\end{align}
$$
And by the Raileigh-Ritz inequality, ${}\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon\leq \frac{1}{4}\lambda_{max}(\Lambda_{1}^{-1})\|\epsilon\|^2{}$:
$$
\dot{V}\leq -\lambda_{min}(K_{D}-\Lambda_{1})\|s\|^2+\frac{1}{4}\lambda_{max}(\Lambda_{1}^{-1})\|\epsilon\|^2+s^Tu_{r}-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}
$$
Since the disturbance term of ${}\epsilon{}$ is not linear in ${}\|s\|{}$, near the origin, this constant term beats all the negative terms and pushes it away from zero. Even with the robust action ${}u_{r}=-K\mbox{sgn}(s){}$ , it's contribution becomes linear in ${}\|s\|{}$ so it leaves a ball that scales with the disturbance.

## Bounding of epsilon (via bounded modeling error)

We can also make the assumption (performed in most identification with NN papers[^7][^11]) that the modeling error is bounded:
$$
\|\epsilon(x,t)\|\leq\bar{\epsilon}\quad\text{for all }x\in D
$$
with ${}\bar{\epsilon}>0{}$ and ${}D{}$ the compact set where the approximation holds.
Since $K$ is diagonal and $\mbox{sgn}$ acts component-wise,
$$s^TK\,\mbox{sgn}(s)=\sum_{i=1}^{n}k_{i}s_{i}\mbox{sgn}(s_{i})=\sum_{i=1}^{n}k_{i}|s_{i}|$$
Using $k\_i\geq k\_{min}$:
$$
\begin{align}
\sum_{i=1}^{n}k_{i}|s_{i}|&\geq\sum_{i=1}^nk_{min}|s_{i}| \\
&=k_{min}\sum_{i=1}^n|s_{i}| \\
&=k_{min}\|s\|_{1}
\end{align}
$$
Then:
$$
\begin{align}
\|s\|_{1}^2&=\left(\sum_{i=1}^n|s_{i}|\right)^2=\sum_{i=1}^ns_{i}^2+2\sum_{1\leq i<j\leq n}|s_{i}||s_{j}| \\
&\geq\sum_{i=1}^ns_{i}^2=\|s\|_{2}^2
\end{align}
$$
And both norm are non-negative. So ${}\|s\|_{1}\geq\|s\|_{2}{}$:
$$
s^TK\mbox{sgn}(s)\geq k_{min}\|s\|_{1}\geq k_{min}\|s\|_{2}
$$
Then we can substitute the robust control and apply Cauchy-Schwartz to the Lyapunov derivative:
$$
\begin{align}
\dot{V}&\leq-\lambda_{min}(K_{D})\|s\|^2-s^T\epsilon(x,t)-Ks^T\mbox{sgn}(s)-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F} \\
&\leq-\lambda_{min}(K_{D})\|s\|^2+\bar{\epsilon}\|s\|-k_{min}\|s\|-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}  \\
&\leq -\lambda_{min}(K_{D})\|s\|^2+\|s\|(\bar{\epsilon}+\frac{\kappa}{2}\|W^*-W_{0}\|^2_{F}-k_{min})-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2
\end{align}
$$
for the robust action with the ${}\mbox{sign}{}$ function. 
This allows us to conclude that if ${}k_{min}>\bar{\epsilon}+\frac{\kappa}{2}\|W^*-W_{0}\|^2_{F}{}$, then:
$$
\dot{V}< 0
$$
for every ${}s\neq 0{}$.
But in reality ${}\epsilon=\Delta(x,t)-W^*\psi(x){}$ so it is also a function of the state ${}\epsilon(x,t){}$. So we can try to find a bound that exploit the fact that some uncertainty depends on ${}s{}$. 

## Sector bound

The plants surplus of passivity[^12] (${}\lambda_{min}(K_{D}){}$), needs to be compared with the shortage produced by the residual. So we need to know how ${}\epsilon{}$ changes when ${}s{}$ changes.
We write every argument of ${}\epsilon{}$ in terms of ${}e{}$,${}s{}$ and the reference:
$$
\begin{align}
q&=q_{d}+e \\
\dot{q}_{r}&=\dot{q}_{d}-\Lambda e \\
\dot{q}&=\dot{q}_{r}+s=\dot{q}_{d}-\Lambda e+s \\
\ddot{q}_{r}&=\ddot{q}_{d}-\Lambda\dot{e}=\ddot{q}_{d}-\Lambda(s-\Lambda e)=\ddot{q}_{d}+\Lambda^{2}e-\Lambda s
\end{align}
$$
So only two signals carry the error ${}(s){}$ instantaneously, the other do it with a filtered version of the error ${}(e){}$. 
We define the residual in these coordinates as ${}E(e,s,t):=\epsilon(x,t){}$. We then add and subtract the residual at the sliding surface (${}s=0{}$):
$$
E(e,s,t)=E(e,0,t)+E(e,s,t)-E(e,0,t)
$$
The first term is the residual (${}\epsilon_{a}{}$) at the sliding surface , the last two terms are the residual (${}\epsilon_{b}{}$) caused by being off the surface. 
$$
E(e,s,t)=\epsilon_{a}+\epsilon_{b}
$$
As in [^29][^30], on the surface the residual is bounded by a constant:
$$
\epsilon_{0}=\sup_{(e,t)\in\Omega_{c}}\|\epsilon_{a}\|=\sup_{(e,t)\in\Omega_{c}}\|E(e,0,t)\|
$$
and the residual off the surface can be bounded in a region using the Mean Value Theorem as:
$$
\|\epsilon_{b}\|\leq \nu(\|s\|)\|s\|
$$
where ${}\nu(\|s\|)\in\mathbb{R}{}$ is a positive globally invertible nondecreasing function. Now using the triangle inequality:
$$
\|\epsilon\|\leq\|\epsilon_{a}\|+\|\epsilon_{b}\|\leq\epsilon_{0}+\nu(\|s\|)\|s\|
$$
Which is the sector bound we were looking for.[^13][^14][^15]

## Sector bounding of epsilon

Going back at the Lyapunov derivative:
$$
\dot{V}\leq-\lambda_{min}(K_{D})\|s\|^2-s^T\epsilon(x,t)+s^Tu_{r}-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}
$$
We can now replace the bound and the robust action:
$$
\begin{align}
\dot{V}&\leq-\lambda_{min}(K_{D})\|s\|^2+\|s\|\|\epsilon\|-k_{min}\|s\|-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}  \\
&\leq-\lambda_{min}(K_{D})\|s\|^2+\|s\|\epsilon_{0}+\nu(\|s\|)\|s\|^{2}-k_{min}\|s\|-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}   \\
&\leq-(\lambda_{min}(K_{D})-\nu(\|s\|))\|s\|^2+\|s\|(\epsilon_{0}-k_{min}+\frac{\kappa}{2}\|W^*-W_{0}\|^2_{F} )-\frac{\kappa}{2}\|s\|\|\tilde{W}\|_{F}^2
\end{align}
$$
Then if ${}\lambda_{min}(K_{D})-\nu(\|s\|)>0{}$ we maintain the semi-passivity argument[^18], and additionally if ${}k_{min}>\epsilon_{0}+\frac{\kappa}{2}\|W^*-W_{0}\|^2_{F}{}$, then that term is negative as well and the trajectories converge to a ball (UUB).
Note here that the sector bound allows us to pay for the part that is linear in ${}||s||{}$ of the residual (${}\nu(\|s\|){}$) with the passivity surplus, and the constant part (${}\epsilon_{0}{}$) to be paid for with the SMC gain, and since ${}\epsilon_{0}<\bar{\epsilon}{}$ this allows us to lower the robust gain. 
Since ${}s,\tilde{W}\in\mathcal{L}_{\infty}{}$ and ${}s\in\mathcal{L}_{2}{}$, a Barbalat argument[^4] provides asymptotic tracking, with solutions understood in the Filippov sense[^19][^20].

## Persistent excitation

For input to state stability, we have ${}\|\tilde{W}\|_{F}^2{}$ multiplied by ${}\|s\|{}$, so ${}\tilde{W}{}$ does not necessarily go to zero. Additionally we need, persistent excitation to for this to happen.

This is also why keeps us from an ISS argument.

## Structure of the residual

The residual and the learned model share the same structure. If we define the best learned matrices from the frozen generators:
$$
\hat{M}^*(q)=\sum_{j}\omega_{j}^*\bar{M}_{j}(q)
$$
and likewise for ${}\hat{C}^*,\hat{g}^*$ and $\hat{F}^*{}$. Then the residual:
$$
\begin{align}
\epsilon&=(\tilde{M}-\hat{M}^*)\ddot{q}_{r}+(\tilde{C}-\hat{C}^*)\dot{q}_{r}+(\tilde{g}-\hat{g}^*)+(\tilde{F}-\hat{F}^*)(\dot{q})+\tau_{d}(t) \\
&=E_{M}(q)\ddot{q}_{r}+C_{E}(q,\dot{q})\dot{q}_{r}+E_{g}(q)+E_{F}(\dot{q})+\tau_{d}(t)=E(e,s,t)
\end{align}
$$
The Christoffel construction is linear in the inertia matrix, so $C_{E}$​ is the Christoffel matrix[^16] of $E_{M}$​. We can now calculate both $\epsilon_{a}$ and $\epsilon_{b}$:
$$
\begin{align}
E(e,s,t)=E_{M}(q)(\ddot{q}_{d}+\Lambda^{2}e-\Lambda s)+C_{E}(q_{d}+e,\dot{q}_{d}-\Lambda e+s )(\dot{q}_{d}-\Lambda e)+E_{g}(q_{d}+e)+E_{F}(\dot{q}_{d}-\Lambda e+s )+\tau_{d}(t)
\end{align}
$$
So:
$$
\begin{align}
\epsilon_{a}&=E(e,0,t) \\
&=E_{M}(q)(\ddot{q}_{d}+\Lambda^{2}e)+C_{E}(q_{d}+e,\dot{q}_{d}-\Lambda e)(\dot{q}_{d}-\Lambda e)+E_{g}(q_{d}+e)+E_{F}(\dot{q}_{d}-\Lambda e)+\tau_{d}(t)  \\
&=E_{M}(q)(\ddot{q}_{d}+\Lambda^{2}e)+C_{E}(q,\dot{q}_{r})(\dot{q}_{r})+E_{g}(q)+E_{F}(\dot{q}_{r})+\tau_{d}(t) 
\end{align}
$$
And:
$$
\begin{align}
\epsilon_{b}&=E(e,s,t)-E(e,0,t) \\
&=E_{M}(q)(\ddot{q}_{d}+\Lambda^{2}e-\Lambda s)+C_{E}(q,\dot{q}_{r}+s)(\dot{q}_{r})+E_{g}(q)+E_{F}(\dot{q}_{r}+s)+\tau_{d}(t) \\
&\quad-E_{M}(q)(\ddot{q}_{d}+\Lambda^{2}e)-C_{E}(q,\dot{q}_{r})(\dot{q}_{r})-E_{g}(q)-E_{F}(\dot{q}_{r})-\tau_{d}(t)  \\
&=-E_{M}(q)\Lambda s+C_{E}(q,s)\dot{q}_{r}+E_{F}(\dot{q}_{r}+s)-E_{F}(\dot{q}_{r})
\end{align} 
$$
We see here that both ${}\tau_{d}(t){}$ and $E_{g}(q)$ are the same in or off the surface so they cancel out. We also use the fact that the Christoffel construction is linear in its second argument. 

## Passivity properties and ports

The plant with the nominal controller is output strictly passive with surplus ${}\lambda_{min}(K_{D}){}$, has storage ${}V_{P}=\frac{1}{2}s^TM(q)s{}$  and the port is ${}v\to s{}$. 
The adaptation law block has with storage function ${}V_{L}=\frac{1}{2}\mbox{tr}(\tilde{W}^T\Gamma^{-1}\tilde{W}){}$. It's derivative:
$$
\begin{align}
\dot{V}_{L}&=\mbox{tr}(\tilde{W}^T\Gamma^{-1}\dot{\tilde{W}})=-\mbox{tr}(\tilde{W}^T\Gamma^{-1}\Gamma(s\psi^T(x)+\kappa\|s\|(\hat{W}-W_{0}))) \\
&\leq-s^T\tilde{W}\psi+\frac{\kappa}{2}\|s\|\|W^*-W_{0}\|^2_{F}
\end{align}$$
so the port is ${}s\to \tilde{W}\psi{}$, and the block is lossless with bias ${}\frac{\kappa}{2}\|W^*-W_{0}\|^2_{F}{}$. 
The residual block is an static map:
$$
s^T\epsilon\leq s^T\epsilon_{0}+\nu(\|s\|)s^T\|s\|\leq\epsilon_{0}\|s\|+\nu(\|s\|)\|s\|^2
$$
So:
$$
0\leq-s^T\epsilon+\epsilon_{0}\|s\|+\nu(\|s\|)\|s\|^2
$$
Meaning that it has no storage function, the block has port ${}s\to-\epsilon{}$ and it is IFP with shortage ${}\nu(\|s\|){}$ and bias ${}\epsilon_{0}{}$.
Finally the robust block with port ${}s\to K\mbox{sgn}(s){}$, has no storage function since it is an static map, 
$$
s^TK\mbox{sgn}(s)\geq k_{min}\|s\|\geq0
$$
so it is a passive static sector. 
Since ${}v{}$ is made of the sum of the rest of modules, we can think of it as a plant in negative feedback with three blocks in parallel. The learner is passive, but the residual has a passivity shortage, which is compensated with the nominal controller's surplus, while the robust term pays for the biases. The interconnection is **semi-passive** with index ${}\lambda_{min}(K_{D}-\nu(\|s\|)){}$. 

## References

[^1]: Slotine, J.-J. E., & Sastry, S. S. (1983). _Tracking control of non-linear systems using sliding surfaces, with application to robot manipulators._ International Journal of Control, 38(2), 465–492.
[^2]: Lutter, M. and Listmann, K. and Peters, Jan. (2019). _Deep Lagrangian Networks for end-to-end learning of energy-based control for under-actuated systems_. IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS), 5562-5569.
[^3]: Ortega, R., & Spong, M. W. (1989). _Adaptive motion control of rigid robots: A tutorial._ Automatica, 25(6), 877–888.
[^4]: Khalil, H. K. (2002). _Nonlinear Systems_ (3rd ed.). Prentice Hall. Ch. 6 (passivity, feedback connections), Lemma 8.2 (Barbalat).
[^5]: Slotine, J.-J. E., & Li, W. (1987). _On the adaptive control of robot manipulators._ International Journal of Robotics Research, 6(3), 49–59.
[^6]: Hornik, K., Stinchcombe, M., & White, H. (1989). _Multilayer feedforward networks are universal approximators._ Neural Networks, 2(5), 359–366.
[^7]: Lewis, F. L., Yesildirek, A., & Liu, K. (1996). _Multilayer neural-net robot controller with guaranteed tracking performance._ IEEE Transactions on Neural Networks, 7(2), 388–399.
[^8]: Sanner, R. M., & Slotine, J.-J. E. (1992). _Gaussian networks for direct adaptive control._ IEEE Transactions on Neural Networks, 3(6), 837–863.
[^9]: Narendra, K. S., & Annaswamy, A. M. (1987). _A new adaptive law for robust adaptation without persistent excitation._ IEEE Transactions on Automatic Control, 32(2), 134–145.
[^10]: Ioannou, P. A., & Sun, J. (1996). _Robust Adaptive Control._ Prentice Hall. Ch. 8 (leakage, σ- and e-modification).
[^11]: Yu, W., & Li, X. (2001). _Some new results on system identification with dynamic neural networks._ IEEE Transactions on Neural Networks, 12(2), 412–417.
[^12]: Sepulchre, R., Janković, M., & Kokotović, P. V. (1997). _Constructive Nonlinear Control._ Springer. Ch. 2 (excess and shortage of passivity).
[^13]: Corless, M. J., & Leitmann, G. (1981). _Continuous state feedback guaranteeing uniform ultimate boundedness for uncertain dynamic systems._ IEEE Transactions on Automatic Control, 26(5), 1139–1144.
[^14]: Spong, M. W. (1992). _On the robust control of robot manipulators._ IEEE Transactions on Automatic Control, 37(11), 1782–1786.
[^15]: Qu, Z., & Dawson, D. M. (1996). _Robust Tracking Control of Robot Manipulators._ IEEE Press.
[^16]: Spong, M. W., Hutchinson, S., & Vidyasagar, M. (2006). _Robot Modeling and Control._ Wiley.
[^17]: Kelly, R., Santibáñez, V., & Loría, A. (2005). _Control of Robot Manipulators in Joint Space._ Springer.
[^18]: Pogromsky, A. Yu. (1998). _Passivity based design of synchronizing systems._ International Journal of Bifurcation and Chaos, 8(2), 295–319.
[^19]: Filippov, A. F. (1988). _Differential Equations with Discontinuous Righthand Sides._ Kluwer.
[^20]: Shevitz, D., & Paden, B. (1994). _Lyapunov stability theory of nonsmooth systems._ IEEE Transactions on Automatic Control, 39(9), 1910–1914.
[^21]: Li, P. Y., & Horowitz, R. (1999). _Passive velocity field control of mechanical manipulators._ IEEE Transactions on Robotics and Automation, 15(4), 751–763.
[^22]: Slotine, J.-J. E. (1984). _Sliding controller design for non-linear systems._ International Journal of Control, 40(2), 421–434.
[^23]: Slotine, J.-J. E., & Li, W. (1991). _Applied Nonlinear Control._ Prentice Hall. Ch. 7 (sliding control, boundary layer).
[^24]: Utkin, V., Guldner, J., & Shi, J. (2009). _Sliding Mode Control in Electro-Mechanical Systems_ (2nd ed.). CRC Press.
[^25]: Ortega, R., Loría, A., Nicklasson, P. J., & Sira-Ramírez, H. (1998). _Passivity-Based Control of Euler-Lagrange Systems._ Springer.
[^26]: Miyato, T., Kataoka, T., Koyama, M., & Yoshida, Y. (2018). _Spectral normalization for generative adversarial networks._ ICLR.
[^27]: Shi, G., Shi, X., O'Connell, M., Yu, R., Azizzadenesheli, K., Anandkumar, A., Yue, Y., & Chung, S.-J. (2019). _Neural Lander: Stable drone landing control using learned dynamics._ IEEE ICRA, 9784–9790.
[^28]: Szegedy, C., Zaremba, W., Sutskever, I., Bruna, J., Erhan, D., Goodfellow, I., & Fergus, R. (2014). _Intriguing properties of neural networks._ ICLR.
[^29]: Xian, B.; Dawson, D.M.; deQueiroz, M.S.; Chen, J. . (2004). _A Continuous Asymptotic Tracking Control Strategy for Uncertain Nonlinear Systems._ IEEE Transactions on Automatic Control, 49(7), 1206–1206.
[^30]: Patre, P.M.; MacKunis, W.; Kaiser, K.; Dixon, W.E.. (2008). _Asymptotic Tracking for Uncertain Dynamic Systems Via a Multilayer Neural Network Feedforward and RISE Feedback Control Structure._, 53(9), 2180–2185. 
