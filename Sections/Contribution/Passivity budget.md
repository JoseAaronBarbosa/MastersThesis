2026-10-28

#Lyapunov #Passivity 


## Notation

We will use the following notation:
- Subscript ${}n{}$ marks the nominal model. Here hats are kept only for learned or adapted quantities.
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
So ${}e{}$ is the output of a stable filter driven by ${}s{}$. Anything that depends on ${}e{}$ (including ${}\dot{q}_{r}{}$ and ${}\ddot{q}_{r}{}$) depends on the past of ${}s{}$, not on its current value.

## Control law

The composite control law is given by:
$$
\tau=M_{n}\ddot{q}_{r}+C_{n}\dot{q}_{r}+g_{n}+F_{n}(\dot{q})-K_{D}s+\hat{\Delta}-K\mbox{sat}(s/\phi)
$$
Where ${}K_{D}>0,K=\mbox{diag}(k_{i}),k_{i}>0,\phi>0{}$.

## Error dynamics

Substituting the control law into the model of the plant gives:
$$
\begin{align}
&M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)+F(\dot{q})+\tau_{d}(t)=\\ &M_{n}\ddot{q}_{r}+C_{n}\dot{q}_{r}+g_{n}+F_{n}(\dot{q})-K_{D}s+\hat{\Delta}-K\mbox{sat}(s/\phi)
\end{align}
$$
Since ${}\dot{q}=s+\dot{q}_{r}{}$ and ${}\ddot{q}=\dot{s}+\ddot{q}_{r}{}$, we get:
$$
\begin{align}
&M(q)\dot{s}+M(q)\ddot{q}_{r}+C(q,\dot{q})s+C(q,\dot{q})\dot{q}_{r}+g(q)+F(\dot{q})+\tau_{d}(t)=\\ &M_{n}\ddot{q}_{r}+C_{n}\dot{q}_{r}+g_{n}+F_{n}(\dot{q})-K_{D}s+\hat{\Delta}-K\mbox{sat}(s/\phi)
\end{align}
$$
Then we use the model mismatch definition: 
$$
M(q)\dot{s}+\tilde{M}(q)\ddot{q}_{r}+C(q,\dot{q})s+\tilde{C}(q,\dot{q})\dot{q}_{r}+\tilde{g}(q)+\tilde{F}(\dot{q})+\tau_{d}(t)=-K_{D}s+\hat{\Delta}-K\mbox{sat}(s/\phi)
$$
We define the model residual as:
$$
\Delta:=\tilde{M}(q)\ddot{q}_{r}+\tilde{C}(q,\dot{q})\dot{q}_{r}+\tilde{g}(q)+\tilde{F}(\dot{q})+\tau_{d}(t)
$$
To obtain the error dynamics:
$$
M(q)\dot{s}+C(q,\dot{q})s+K_{D}s=\hat{\Delta}-\Delta-K\mbox{sat}(s/\phi)
$$
Let ${}x=(q,\dot{q},q_{d},\dot{q}_{d},\ddot{q}_{d}){}$ collect everything ${}\Delta{}$ depends on, apart from ${}\tau_{d}(t){}$. We can see that if there is no model mismatch and we drop the robust action, we obtain the same closed loop of Slotine-Li[^1].

## Learning module

The structured learning module (DeLaN) is trained offline and its generators are frozen. Online, only the output weights move, so the learned term is linear in them [^2]:
$$
\hat{\Delta}=\hat{W}\psi(x)
$$
Offline training supplies the initial value ${}\hat{W}(0)=W_{0}{}$, since it find the best set of basis and the initial best weights for the training data.
The universal approximation theorem tells us that there exists optimum weights on the operating domain to express the residual with an unremovable structural approximation error:
$$
\Delta=W^*\phi(x)+\epsilon(x,t)
$$
The structural approximation error contains:
1. The approximation error of the frozen basis,
2. Non Euler-Lagrange effects that the basis cannot represent,
3. All of ${}\tau_{d}(t){}$, because a function of ${}x{}$ can't represent it.

Then the learned residual mismatch is given by:
$$
\hat{\Delta}-\Delta=\hat{W}\psi(x)-W^*\phi(x)-\epsilon(x,t)=\tilde{W}\psi(x)-\epsilon(x,t)
$$
So that the error dynamics become:
$$
M(q)\dot{s}=-C(q,\dot{q})s-K_{D}s+\tilde{W}\psi(x)-\epsilon(x,t)-K\mbox{sat}(s/\phi)
$$
## The interconnection

If from the error dynamics we define ${}v=\tilde{W}\psi(x)-\epsilon(x,t)-u_{r} {}$ which can be seen as an injected disturbance. The error system with input ${}v{}$ and output ${}s{}$:
$$
M(q)\dot{s}+C(q,\dot{q})s+K_{D}s=v
$$
has an storage function:
$$
V_{P}=\frac{1}{2}s^TM(q)s
$$
with time derivative:
$$
\dot{V}_{P}=\frac{1}{2}s^TM(q)\dot{s}+\frac{1}{2}s^T\dot{M}(q)s
$$
substituting the error dynamics:
$$
\dot{V}_{P}=-s^TC(q,\dot{q})s-s^TK_{D}s+\frac{1}{2}s^T\dot{M}(q)s+s^Tv
$$
Using the skew-symmetry property:
$$
\dot{V}_{P}=s^Tv-s^TK_{D}s\leq s^Tv-\lambda_{min}(K_{D})||s||^2
$$
Meaning that it is **output strictly passive**.

## Lyapunov based adaptation law

We now will try to find an adaptation law for the weights to certify the stability of the system, we will briefly substitute ${}u_{r}=-K\mbox{sat}(s/\phi){}$ for the calculations. Consider the Lyapunov candidate function:
$$
V = \frac{1}{2}s^TM(q)s+\frac{1}{2}\mbox{tr}(\tilde{W}^T\Gamma^{-1}\tilde{W})
$$
With ${}\Gamma>0{}$. Taking the time derivative:
$$
\dot{V} = s^TM(q)\dot{s}+\frac{1}{2}s^T\dot{M}(q)s+\mbox{tr}(\tilde{W}^T\Gamma^{-1}\dot{\tilde{W}})
$$
Substituting the system dynamics:
$$
\dot{V}=-s^TC(q,\dot{q})s-s^TK_{D}s+s^T\tilde{W}\phi(x)-s^T\epsilon(t,x)+s^Tu_{r}+\frac{1}{2}s^T\dot{M}(q)s+\mbox{tr}(\tilde{W}^T\Gamma^{-1}\dot{\tilde{W}})
$$
Since each term is a scalar, it is equal to its trace, and it is invariant under cyclic permutations if the product is defined, so $s^{T}\tilde{W}\phi(x)=\mbox{tr}\{s^{T}\tilde{W}\phi(x)\}=\mbox{tr}\{\tilde{W}^{T}s\phi^{T}(x)\}$. Then:
$$
\dot{V}=\frac{1}{2}s^T(\dot{M}(q)-2C(q,\dot{q}))s-s^TK_{D}s-s^T\epsilon(x,t)+s^Tu_{r}+\mbox{tr}\left(\tilde{W}^T(s\phi^T(x)+\Gamma^{-1}\dot{\tilde{W}})\right)
$$
Using the skew-symmetry property and choosing the adaptation law such that the trace term cancels:
$$
\dot{\tilde{W}}=-\Gamma s\phi^T(x)
$$
The derivative reduces to:
$$
\dot{V}=-s^TK_{D}s-s^T\epsilon(x,t)+s^Tu_{r}\leq-\lambda_{min}(K_{D})||s||^2-s^T\epsilon(x,t)+s^Tu_{r}
$$
## With e-modification

If to prevent parameter drift, we use the robust adaptation law:
$$
\dot{\tilde{W}}=-\Gamma(s\phi^T(x)+\kappa||s||(\hat{W}-W_{0}))
$$
That pushes the weights towards ${}W_{0}{}$. Then the derivative becomes:
$$
\dot{V}\leq-\lambda_{min}(K_{D})||s||^2-s^T\epsilon(x,t)+s^Tu_{r}-\mbox{tr}(\tilde{W}^T\kappa||s||(\hat{W}-W_{0}))
$$
Substituting by the Frobenius norm:
$$
\dot{V}\leq-\lambda_{min}(K_{D})||s||^2-s^T\epsilon(x,t)+s^Tu_{r}-\kappa||s||\langle \tilde{W},(\hat{W}-W_{0})\rangle_{F}
$$
From the expression ${}\hat{W}-W_{0}=\hat{W}-W^*+W^*-W_{0}=\tilde{W}+(W^*-W_{0}){}$, we can work only on the norm. Since the inner product is linear and from Young's inequality:
$$
\begin{align}
\langle \tilde{W},(\hat{W}-W_{0})\rangle_{F}&=\langle \tilde{W},\tilde{W}+(W^*-W_{0})\rangle_{F}= \langle \tilde{W},\tilde{W}\rangle_{F}+\langle \tilde{W}, W^*-W_{0}\rangle_{F} \\
&\geq||\tilde{W}||_{F}^2-\frac{1}{2}||\tilde{W}||_{F}^2-\frac{1}{2}||W^*-W_{0}||^2_{F}=\frac{1}{2}||\tilde{W}||_{F}^2-\frac{1}{2}||W^*-W_{0}||^2_{F}
\end{align}
$$
Then:
$$
-\kappa||s||\langle \tilde{W},(\hat{W}-W_{0})\rangle_{F}\leq-\frac{1}{2}\kappa||s||||\tilde{W}||_{F}^2+\frac{1}{2}\kappa||s||||W^*-W_{0}||^2_{F}
$$
So that the derivative becomes:
$$
\dot{V}\leq-\lambda_{min}(K_{D})||s||^2-s^T\epsilon(x,t)+s^Tu_{r}-\frac{\kappa}{2}||s||||\tilde{W}||_{F}^2+\frac{\kappa}{2}||s||||W^*-W_{0}||^2_{F}
$$
We can see that the e-modification pulls the weights towards ${}W_{0}{}$ to prevent drifting, but adds a bias on the Lyapunov function derivative, meaning that it contributes to the radius of the ball for the UUB (${}\epsilon(x,t){}$ does the same). The magnitude of the contribution is given by ${}||W^*-W_{0}||_{F}^2{}$ which means that a good offline training (${}W_{0}{}$ close to ${}W^*{}$) reduces the ball of the UUB.

## Bounding of epsilon (via Young's)

Using Young's inequality on the ${}\epsilon{}$ term:
$$
-s^T\epsilon(x,t)\leq s^T\Lambda_{1}s+\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon
$$
And then the derivative becomes:
$$
\begin{align}
\dot{V}&\leq-s^TK_{D}s+s^T\Lambda_{1}s+\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon+s^Tu_{r}-\frac{\kappa}{2}||s||||\tilde{W}||_{F}^2+\frac{\kappa}{2}||s||||W^*-W_{0}||^2_{F} \\
&\leq -\lambda_{min}(K_{D}-\Lambda_{1})||s||^2+\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon+s^Tu_{r}-\frac{\kappa}{2}||s||||\tilde{W}||_{F}^2+\frac{\kappa}{2}||s||||W^*-W_{0}||^2_{F}
\end{align}
$$
And by the Raileigh-Ritz inequality, ${}\frac{1}{4}\epsilon^T\Lambda_{1}^{-1}\epsilon\leq \frac{1}{4}\lambda_{max}(\Lambda_{1}^{-1})||\epsilon||^2{}$:
$$
\dot{V}\leq -\lambda_{min}(K_{D}-\Lambda_{1})||s||^2+\frac{1}{4}\lambda_{max}(\Lambda_{1}^{-1})||\epsilon||^2+s^Tu_{r}-\frac{\kappa}{2}||s||||\tilde{W}||_{F}^2+\frac{\kappa}{2}||s||||W^*-W_{0}||^2_{F}
$$
Since the disturbance term of ${}\epsilon{}$ is not linear in ${}||s||{}$, near the origin, this constant term beats all the negative terms and pushes it away from zero. Even with the robust action ${}u_{r}=-K\mbox{sgn}(s){}$ , it's contribution becomes linear in ${}||s||{}$ so it leaves a ball that scales with the disturbance.

## Bounding of epsilon (via bounded modeling error)

We can also make the assumption (performed in most identification with NN papers) that the modeling error is bounded:
$$
||\epsilon||^2_{\Lambda_{\epsilon}}=\epsilon^T\Lambda_{\epsilon}\epsilon\leq\bar{\epsilon}
$$
with ${}\bar{\epsilon}>0{}$.
Then we can apply Cauchy-Schwartz to the Lyapunov derivative:
$$
\begin{align}
\dot{V}&\leq-\lambda_{min}(K_{D})||s||^2+||s||\bar{\epsilon}-k_{i}s^T\mbox{sgn}(s)-\frac{\kappa}{2}||s||||\tilde{W}||_{F}^2+\frac{\kappa}{2}||s||||W^*-W_{0}||^2_{F}  \\
&\leq -\lambda_{min}(K_{D})||s||^2+||s||(\bar{\epsilon}+\frac{\kappa}{2}||W^*-W_{0}||^2_{F}-k_{min})-\frac{\kappa}{2}||s||||\tilde{W}||_{F}^2
\end{align}
$$
Which concludes that if ${}k_{min}>\bar{\epsilon}+\frac{\kappa}{2}||W^*-W_{0}||^2_{F}{}$, then:
$$
\dot{V}< 0
$$
for every ${}s\neq 0{}$.
But in reality ${}\epsilon=\Delta(x,t)-W^*\psi(x){}$ so it is also a function of the state ${}\epsilon(x,t){}$. So we can try to find a bound that exploit the fact that some uncertainty depends on ${}s{}$. (${}||\epsilon||\leq\epsilon_{0}+\nu||s||{}$)





## References

[^1]: Slotine, J.-J. E., & Sastry, S. S. (1983). _Tracking control of non-linear systems using sliding surfaces, with application to robot manipulators._ International Journal of Control, 38(2), 465–492.
[^2]: Lutter, M. and Listmann, K. and Peters, Jan. (2019). _Deep Lagrangian Networks for end-to-end learning of energy-based control for under-actuated systems_. IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS), 5562-5569.

