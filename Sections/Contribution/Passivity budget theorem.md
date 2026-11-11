2026-11-10

#Lyapunov #Passivity #SlidingModes

This note states and proves the closed-loop result for nominal PBC + DeLaN learning (e-mod toward $W_{0}$) + boundary-layer SMC. It builds on [[Passivity budget]] (Contribution/Passivity budget.md), which has the control law, the error dynamics, the adaptation law and the sector bound. The foundations of the split at $s=0$ are in [[Split at the sliding surface - foundations and precedents]] (Research/Passivity/). Here those pieces are put together as one theorem with explicit assumptions, so every constant has a definition and every step has a reason.

**Summary of the result.** On a region $\Omega_{c}$, if $\lambda_{min}(K_{D})>\nu$ (the PBC surplus pays the shortage) and $k_{min}>\epsilon_{0}+\frac{\kappa}{2}||W^*-W_{0}||_{F}^2$ (the SMC pays the offset), then:
1. the trajectories never leave $\Omega_{c}$ and all signals are bounded,
2. the filtered error is small in the mean square sense, with size $\frac{\gamma^2\phi}{4\rho k_{min}}$, which vanishes as $\phi\to0$,
3. with the ideal SMC ($\phi=0$) the tracking is asymptotic,
4. with frozen weights (offline DeLaN only) the tracking error is UUB with radius $\sqrt{\lambda_{M}/\lambda_{m}}\;\frac{\epsilon_{0}}{\rho+k_{min}/\phi}$.

There is one honest change from the claim "UUB with radius $\sim\phi$" for the adaptive case. It is explained in Remark 1: with e-mod the composite $\dot{V}$ is only $\leq0$ (not $<0$) on the surface $s=0$, so without persistent excitation the weights are bounded but not ultimately small. Mean-square smallness is what can actually be proved.

---

## 1. Setting

Everything below uses the notation of [[Passivity budget]].

**Plant.** $M(q)\ddot{q}+C(q,\dot{q})\dot{q}+g(q)+F(\dot{q})+\tau_{d}(t)=\tau$, with properties P1 ($\lambda_{m}I\leq M\leq\lambda_{M}I$), P2 ($\dot{M}-2C$ skew-symmetric, true $C$), P4 ($||\tau_{d}||\leq\bar{\tau}_{d}$) and P5 (bounded reference).

**Errors.** $e=q-q_{d}$, $\dot{q}_{r}=\dot{q}_{d}-\Lambda e$, $s=\dot{e}+\Lambda e$, with $\Lambda=\Lambda^T>0$. So $\dot{e}=-\Lambda e+s$.

**Control law.**
$$
\tau=M_{n}\ddot{q}_{r}+C_{n}\dot{q}_{r}+g_{n}+F_{n}(\dot{q})-K_{D}s+\hat{W}\psi(x)-K\mbox{sat}(s/\phi)
$$
with $K_{D}>0$, $K=\mbox{diag}(k_{i})$, $k_{min}=\min_{i}k_{i}>0$, $\phi>0$, and $\mbox{sat}$ applied componentwise.

**Learning.** The DeLaN generators are trained offline and frozen, so $\psi$ is a fixed $C^1$ map (smooth activations). Online only the output weights move, with the e-mod law leaking toward the offline weights:
$$
\dot{\hat{W}}=-\Gamma\left(s\psi^T(x)+\kappa||s||(\hat{W}-W_{0})\right),\qquad\hat{W}(0)=W_{0}
$$
with $\Gamma=\Gamma^T>0$ and $\kappa>0$.

**Residual.** For a fixed matrix $W^*$, $\epsilon(x,t):=\Delta(x,t)-W^*\psi(x)$ and $\tilde{W}=\hat{W}-W^*$. The error dynamics are
$$
M(q)\dot{s}+C(q,\dot{q})s+K_{D}s=\tilde{W}\psi(x)-\epsilon(x,t)-K\mbox{sat}(s/\phi)
$$

**Standing assumptions.** These are A1–A4 of the foundations note:
- **A1.** $\xi(t)=(q_{d},\dot{q}_{d},\ddot{q}_{d})(t)\in\Xi$, $\Xi$ compact. $\tau_{d}$ is piecewise continuous with $||\tau_{d}||\leq\bar{\tau}_{d}$.
- **A2.** $M$, $M_{n}$ and the inertia generators are $C^2$ in $q$. $g$, $g_{n}$, the gravity generators and $\psi$ are $C^1$. The friction mismatch splits as $E_{F}=E_{F}^{L}+E_{F}^{C}$, where $E_{F}^{L}$ is $C^1$ and $||E_{F}^{C}||\leq\bar{f}_{c}$ (Coulomb jumps). For existence and uniqueness of solutions take the plant friction locally Lipschitz (tanh-smoothed, as in the sandbox); a true $\mbox{sgn}$ needs Filippov solutions and changes nothing in the bounds.
- **A3.** $\Omega_{c}=\lbrace(e,s):||e||\leq\bar{e},\;||s||\leq\bar{s}\rbrace$.
- **A4.** $W^*$ is a fixed matrix. The natural choice is the best weight on $\Omega_{c}\times\Xi$, but the proof works for any fixed $W^*$ (Remark 4).

## 2. Constants

All constants are fixed once $\Omega_{c}$ is fixed. They do not depend on $K_{D}$, $K$, $\phi$, $\Gamma$ or $\kappa$.
$$
\epsilon_{0}=\sup_{\Omega_{c}\times\Xi}||E^{L}(e,0,\xi)||+\bar{\tau}_{d}+\bar{f}_{c},\qquad\nu=\sup_{\Omega_{c}\times\Xi}\left|\left|\frac{\partial E^{L}}{\partial s}(e,s,\xi)\right|\right|
$$
where $E^{L}$ is the residual written in $(e,s,\xi)$ coordinates without $\tau_{d}$ and $E_{F}^{C}$. From them define:
$$
\rho=\lambda_{min}(K_{D})-\nu\quad\text{(surplus left after paying the shortage)}
$$
$$
\gamma=\epsilon_{0}+\frac{\kappa}{2}||W^*-W_{0}||_{F}^2\quad\text{(offset the SMC has to pay)}
$$
$$
r_{\phi}=\frac{\gamma\,\phi}{k_{min}+\rho\phi}=\frac{\gamma}{\rho+k_{min}/\phi}\quad\text{(offset divided by the total damping in the layer)}
$$
$$
V_{S}=\frac{1}{2}\lambda_{M}r_{\phi}^2+\frac{\gamma}{\kappa}\lambda_{max}(\Gamma^{-1})
$$

## 3. Lemmas

### Lemma 1 (sector bound, existence)

Under A1–A4, for all $(e,s)\in\Omega_{c}$ and $t\geq0$:
$$
||\epsilon(x,t)||\leq\epsilon_{0}+\nu||s||,\qquad\epsilon_{0},\nu<\infty
$$

*Proof.* This is the existence lemma of the foundations note; the steps are repeated so the theorem is self-contained.
1. Write every argument of $\epsilon$ in $(e,s,\xi)$: $q=q_{d}+e$, $\dot{q}=\dot{q}_{d}-\Lambda e+s$, $\dot{q}_{r}=\dot{q}_{d}-\Lambda e$, $\ddot{q}_{r}=\ddot{q}_{d}+\Lambda^2e-\Lambda s$. Time enters only through $\xi(t)$ and $\tau_{d}(t)$, so $\epsilon=E^{L}(e,s,\xi)+E_{F}^{C}+\tau_{d}$.
2. $E^{L}$ is $C^1$ (A2, Christoffel symbols are first derivatives of $C^2$ matrices). $\Omega_{c}$ is a product of balls, so the segment from $(e,0)$ to $(e,s)$ stays in $\Omega_{c}$. Hadamard's lemma gives
$$
E^{L}(e,s,\xi)-E^{L}(e,0,\xi)=\left(\int_{0}^{1}\frac{\partial E^{L}}{\partial s}(e,\theta s,\xi)\,d\theta\right)s
$$
3. $\partial E^{L}/\partial s$ is continuous on the compact set $\Omega_{c}\times\Xi$, so its norm has a finite maximum $\nu$ (Weierstrass), and $E^{L}(e,0,\xi)$ has a finite maximum norm. Hence $||E^{L}(e,s,\xi)||\leq\sup||E^{L}(e,0,\xi)||+\nu||s||$.
4. $E_{F}^{C}$ and $\tau_{d}$ are not split at all: they are bounded directly, $||E_{F}^{C}||\leq\bar{f}_{c}$ and $||\tau_{d}||\leq\bar{\tau}_{d}$, and both go into $\epsilon_{0}$. (Splitting $E_{F}^{C}$ at $s=0$ would cost $\bar{f}_{c}$ in $\epsilon_{a}$ plus $2\bar{f}_{c}$ in $\epsilon_{b}$, which is worse.)
5. Triangle inequality on $\epsilon=E^{L}(e,0,\xi)+[E^{L}(e,s,\xi)-E^{L}(e,0,\xi)]+E_{F}^{C}+\tau_{d}$. $\blacksquare$

With the structured residual of [[Passivity budget]], $\nu\leq\lambda_{max}(\Lambda)\sup||E_{M}||+k_{E}\sup||\dot{q}_{r}||+\mbox{Lip}(E_{F}^{L})$, with $\sup_{\Omega_{c}}||\dot{q}_{r}||\leq\sup||\dot{q}_{d}||+\lambda_{max}(\Lambda)\bar{e}$. Note that $\mbox{Lip}$ is only taken on the smooth friction part; the Coulomb jump is in $\epsilon_{0}$.

### Lemma 2 (componentwise saturation)

For every $s\in\mathbb{R}^n$:
$$
s^TK\mbox{sat}(s/\phi)\geq k_{min}\,||s||\,\min\left(\frac{||s||}{\phi},1\right)
$$
So outside the layer ($||s||\geq\phi$) the SMC gives at least $k_{min}||s||$, and inside it ($||s||<\phi$) it acts as a damping $k_{min}/\phi$.

*Proof.* For each component, $s_{i}\mbox{sat}(s_{i}/\phi)=\frac{s_{i}^2}{\max(\phi,|s_{i}|)}$: if $|s_{i}|\leq\phi$ it is $s_{i}^2/\phi$, otherwise it is $|s_{i}|=s_{i}^2/|s_{i}|$. Since $|s_{i}|\leq||s||$,
$$
s^TK\mbox{sat}(s/\phi)=\sum_{i}k_{i}\frac{s_{i}^2}{\max(\phi,|s_{i}|)}\geq\frac{k_{min}}{\max(\phi,||s||)}\sum_{i}s_{i}^2=k_{min}\frac{||s||^2}{\max(\phi,||s||)}
$$
which is the claim. $\blacksquare$

This is sharper than using $\sum_{i}k_{i}|s_{i}|\geq k_{min}||s||$ outside the layer and $\frac{1}{\phi}s^TKs$ inside: it covers the mixed case where only some components are saturated.

### Lemma 3 (Lyapunov inequality on $\Omega_{c}$)

Let
$$
V=\frac{1}{2}s^TM(q)s+\frac{1}{2}\mbox{tr}(\tilde{W}^T\Gamma^{-1}\tilde{W})
$$
While $(e,s)\in\Omega_{c}$:
$$
\dot{V}\leq-||s||\,G(s,\tilde{W}),\qquad G(s,\tilde{W})=\rho||s||+k_{min}\min\left(\frac{||s||}{\phi},1\right)+\frac{\kappa}{2}||\tilde{W}||_{F}^2-\gamma \tag{L3a}
$$
and, if $k_{min}\geq\gamma$,
$$
\dot{V}\leq-\rho||s||^2+\frac{\gamma^2\phi}{4k_{min}}-\frac{\kappa}{2}||s||\,||\tilde{W}||_{F}^2 \tag{L3b}
$$

*Proof.* The derivation in [[Passivity budget]] (sections "Lyapunov based adaptation law" and "With e-modification") gives, using P2 and the cancellation of the trace term,
$$
\dot{V}\leq-\lambda_{min}(K_{D})||s||^2-s^T\epsilon-s^TK\mbox{sat}(s/\phi)-\frac{\kappa}{2}||s||\,||\tilde{W}||_{F}^2+\frac{\kappa}{2}||s||\,||W^*-W_{0}||_{F}^2
$$
Lemma 1 gives $-s^T\epsilon\leq\epsilon_{0}||s||+\nu||s||^2$ and Lemma 2 bounds the SMC term. Collecting terms gives (L3a).

For (L3b), drop nothing but bound the scalar function $h(r)=\gamma r-k_{min}r\min(r/\phi,1)$, $r=||s||$. For $r\geq\phi$, $h(r)=r(\gamma-k_{min})\leq0$. For $r<\phi$, $h(r)=\gamma r-\frac{k_{min}}{\phi}r^2$ has its maximum $\frac{\gamma^2\phi}{4k_{min}}$ at $r=\frac{\gamma\phi}{2k_{min}}\leq\frac{\phi}{2}$. $\blacksquare$

---

## 4. Theorem (passivity budget)

Consider the closed loop of Section 1 under A1–A4, with the constants of Section 2. Assume:
- **(B1) Budget.** $\lambda_{min}(K_{D})>\nu$, i.e. $\rho>0$.
- **(B2) Offset.** $k_{min}>\gamma=\epsilon_{0}+\frac{\kappa}{2}||W^*-W_{0}||_{F}^2$.
- **(B3) Region.** With $\bar{V}=\max(V(0),V_{S})$ and $s_{\infty}=\sqrt{2\bar{V}/\lambda_{m}}$:
$$
s_{\infty}<\bar{s},\qquad||e(0)||+\frac{s_{\infty}}{\lambda_{min}(\Lambda)}<\bar{e}
$$

Then the solution exists for all $t\geq0$ and:

1. **Invariance and boundedness.** $(e(t),s(t))\in\Omega_{c}$ for all $t\geq0$, and
$$
||s(t)||\leq s_{\infty},\qquad||e(t)||\leq||e(0)||e^{-\lambda_{min}(\Lambda)t}+\frac{s_{\infty}}{\lambda_{min}(\Lambda)},\qquad||\tilde{W}(t)||_{F}\leq\sqrt{2\bar{V}\lambda_{max}(\Gamma)}
$$
2. **Where $V$ can grow.** $\dot{V}>0$ is only possible in the bounded set $S=\lbrace(s,\tilde{W}):||s||\leq r_{\phi},\;\frac{\kappa}{2}||\tilde{W}||_{F}^2\leq\gamma\rbrace$, which lies inside the boundary layer ($r_{\phi}<\phi$).
3. **Mean-square tracking.** For every $t_{0}\geq0$ and $T>0$:
$$
\frac{1}{T}\int_{t_{0}}^{t_{0}+T}||s||^2dt\leq\frac{\gamma^2\phi}{4\rho\,k_{min}}+\frac{\bar{V}}{\rho T}
$$
$$
\frac{1}{T}\int_{t_{0}}^{t_{0}+T}||e||^2dt\leq\frac{2}{\lambda_{min}(\Lambda)^2}\,\frac{1}{T}\int_{t_{0}}^{t_{0}+T}||s||^2dt+\frac{||e(t_{0})||^2}{\lambda_{min}(\Lambda)T}
$$
so $\limsup_{T\to\infty}\frac{1}{T}\int_{0}^{T}||s||^2dt\leq\frac{\gamma^2\phi}{4\rho k_{min}}$.
4. **Ideal SMC.** With $\phi\to0$ (control $-K\mbox{sgn}(s)$, Filippov solutions) and $k_{min}\geq\gamma$, $s(t)\to0$ and $e(t)\to0$.

### Proof

**Step 1 (well-posedness).** The right-hand side is locally Lipschitz in the state ($\mbox{sat}$, $||s||$ and $\psi$ are locally Lipschitz, $M^{-1}$ exists by P1) and piecewise continuous in $t$. So a unique solution exists on a maximal interval $[0,t_{max})$, and $t_{max}=\infty$ if the state stays bounded.

**Step 2 (level set).** While $(e,s)\in\Omega_{c}$, (L3a) holds. If $V>V_{S}$, the state is not in $S$: on $S$, by (B2), $\rho||s||+k_{min}\min(||s||/\phi,1)\leq\gamma<k_{min}$ forces $||s||<\phi$, hence $(\rho+k_{min}/\phi)||s||\leq\gamma$, i.e. $||s||\leq r_{\phi}$, and $\frac{\kappa}{2}||\tilde{W}||_{F}^2\leq\gamma$; then $V\leq\frac{1}{2}\lambda_{M}||s||^2+\frac{1}{2}\lambda_{max}(\Gamma^{-1})||\tilde{W}||_{F}^2\leq V_{S}$. Outside $S$, $G>0$ and $\dot{V}\leq0$. So $V$ cannot cross $\bar{V}$ upward:
$$
V(t)\leq\bar{V}\quad\text{as long as }(e,s)\in\Omega_{c}
$$
This also proves item 2.

**Step 3 (first exit, invariance of $\Omega_{c}$).** Let $T^*=\sup\lbrace t<t_{max}:(e(\tau),s(\tau))\in\mbox{int}\,\Omega_{c}\;\forall\tau\in[0,t]\rbrace$. At $t=0$ the state is in the interior: $||s(0)||\leq\sqrt{2V(0)/\lambda_{m}}\leq s_{\infty}<\bar{s}$ and $||e(0)||<\bar{e}$ by (B3). On $[0,T^*)$, Step 2 gives
- $s$: $\frac{1}{2}\lambda_{m}||s||^2\leq V\leq\bar{V}$, so $||s(t)||\leq s_{\infty}$.
- $e$: the filter $\dot{e}=-\Lambda e+s$ with $\Lambda=\Lambda^T>0$ has $||e^{-\Lambda t}||\leq e^{-\lambda_{min}(\Lambda)t}$, so
$$
||e(t)||\leq||e(0)||e^{-\lambda_{min}(\Lambda)t}+\int_{0}^{t}e^{-\lambda_{min}(\Lambda)(t-\tau)}||s(\tau)||d\tau\leq||e(0)||+\frac{s_{\infty}}{\lambda_{min}(\Lambda)}
$$
- $q_{r}$ derivatives: $||\dot{q}_{r}||\leq\sup||\dot{q}_{d}||+\lambda_{max}(\Lambda)||e||$ and $||\ddot{q}_{r}||\leq\sup||\ddot{q}_{d}||+\lambda_{max}(\Lambda)^2||e||+\lambda_{max}(\Lambda)||s||$ are bounded, so $x$ stays in a compact set and $\psi(x)$ is bounded.

If $T^*<t_{max}$, by continuity the same non-strict bounds hold at $T^*$, and by (B3) they are strictly inside $\Omega_{c}$, so the state stays in the interior on $[T^*,T^*+\delta)$ for some $\delta>0$. That contradicts the definition of $T^*$. Hence $T^*=t_{max}$. All signals are bounded on $[0,t_{max})$ (including $\tilde{W}$, from $V\leq\bar{V}$), so $t_{max}=\infty$. This proves item 1.

**Step 4 (mean square).** Integrate (L3b) on $[t_{0},t_{0}+T]$ and drop the last (nonpositive) term:
$$
\rho\int_{t_{0}}^{t_{0}+T}||s||^2dt\leq V(t_{0})-V(t_{0}+T)+\frac{\gamma^2\phi}{4k_{min}}T\leq\bar{V}+\frac{\gamma^2\phi}{4k_{min}}T
$$
and divide by $\rho T$. For $e$, write $e(t)=e^{-\Lambda(t-t_{0})}e(t_{0})+\int_{t_{0}}^{t}e^{-\Lambda(t-\tau)}s(\tau)d\tau$. The first term has $L_{2}$ norm on $[t_{0},t_{0}+T]$ at most $||e(t_{0})||/\sqrt{2\lambda_{min}(\Lambda)}$; the second, by Young's convolution inequality, at most $||s||_{L_{2}}/\lambda_{min}(\Lambda)$. Square with $(a+b)^2\leq2a^2+2b^2$. This proves item 3.

**Step 5 (ideal SMC).** With $-K\mbox{sgn}(s)$, every Filippov selection satisfies $s^TK\mbox{SGN}(s)=\sum_{i}k_{i}|s_{i}|\geq k_{min}||s||$, so
$$
\dot{V}\leq-\rho||s||^2-(k_{min}-\gamma)||s||-\frac{\kappa}{2}||s||\,||\tilde{W}||_{F}^2\leq-\rho||s||^2
$$
for almost all $t$ (smooth $V$, nonsmooth analysis of Shevitz & Paden). Steps 2 and 3 apply with $\bar{V}=V(0)$. Then $s\in\mathcal{L}_{2}\cap\mathcal{L}_{\infty}$, and $\dot{s}\in\mathcal{L}_{\infty}$ because every term of the error dynamics is bounded on $\Omega_{c}$. So $s$ is uniformly continuous and Barbalat's lemma gives $s\to0$. Since $e$ is the output of an exponentially stable filter driven by $s$, $e\to0$. This proves item 4. $\blacksquare$

---

## 5. Corollaries

### Corollary 1 (frozen weights: UUB with explicit radius)

Take $\Gamma=0$, so $\hat{W}\equiv W_{0}$ (offline DeLaN only). Apply Lemma 1 with $W^*=W_{0}$, giving constants $\epsilon_{0}'$, $\nu'$, $\rho'=\lambda_{min}(K_{D})-\nu'>0$, and assume $k_{min}>\epsilon_{0}'$. Let
$$
r_{\phi}'=\frac{\epsilon_{0}'}{\rho'+k_{min}/\phi}<\phi
$$
If $\sqrt{\lambda_{M}/\lambda_{m}}\max(||s(0)||,r_{\phi}')<\bar{s}$ and $||e(0)||+\sqrt{\lambda_{M}/\lambda_{m}}\max(||s(0)||,r_{\phi}')/\lambda_{min}(\Lambda)<\bar{e}$, then $\Omega_{c}$ is invariant and the tracking error is uniformly ultimately bounded:
$$
\limsup_{t\to\infty}||s(t)||\leq\sqrt{\frac{\lambda_{M}}{\lambda_{m}}}\;\frac{\epsilon_{0}'}{\lambda_{min}(K_{D})-\nu'+k_{min}/\phi},\qquad\limsup_{t\to\infty}||e(t)||\leq\frac{1}{\lambda_{min}(\Lambda)}\limsup_{t\to\infty}||s(t)||
$$

*Proof.* With $V_{P}=\frac{1}{2}s^TMs$ the residual is $\Delta-W_{0}\psi$ (no $\tilde{W}$ term, no e-mod bias), so Lemma 3 becomes $\dot{V}_{P}\leq-||s||\,g(||s||)$ with $g(r)=\rho'r+k_{min}\min(r/\phi,1)-\epsilon_{0}'$, increasing and positive for $r>r_{\phi}'$. Invariance follows as in Steps 2–3 with $\bar{V}=\max(V_{P}(0),\frac{1}{2}\lambda_{M}r_{\phi}'^2)$. For any $r>r_{\phi}'$: whenever $V_{P}\geq\frac{1}{2}\lambda_{M}r^2$ we have $||s||\geq r$, so $\dot{V}_{P}\leq-r\,g(r)<0$. $V_{P}$ reaches $\lbrace V_{P}\leq\frac{1}{2}\lambda_{M}r^2\rbrace$ in a time at most $V_{P}(0)/(r\,g(r))$ and stays there, so $||s||\leq\sqrt{\lambda_{M}/\lambda_{m}}\,r$. Let $r\to r_{\phi}'$. The $e$ bound follows from the filter, whose initial condition is forgotten exponentially. $\blacksquare$

This is the "radius $\sim\epsilon_{0}\phi/k$" statement: the offset divided by the total damping $\rho'+k_{min}/\phi$ that the budget leaves in the layer.

### Corollary 2 (semi-global)

For any compact set of initial conditions $(e(0),s(0))$ there are gains for which the theorem applies. Pick $\bar{s}$ and $\bar{e}$ with margin over the initial set; this fixes $\nu$ and $\epsilon_{0}$, which do not depend on the gains. Then pick $K_{D}$ with $\lambda_{min}(K_{D})>\nu$, $k_{min}>\gamma$, $\phi$ small and $\Gamma$ large, so that $V_{S}$ and $\frac{1}{2}\lambda_{max}(\Gamma^{-1})||W_{0}-W^*||_{F}^2$ (the weight part of $V(0)$) are small enough for (B3). The order matters: region first, then constants, then gains. Larger regions give larger $\nu$ (through $\sup||\dot{q}_{r}||$), so the required $K_{D}$ grows with the region. The result is regional/semi-global, not global, because the true $\tilde{C}\dot{q}_{r}$ term is quadratic in velocity.

---

## 6. Remarks

### Remark 1. Why the adaptive case gives mean-square smallness and not UUB of $\tilde{W}$

In (L3a) the e-mod term $-\frac{\kappa}{2}||s||\,||\tilde{W}||_{F}^2$ is multiplied by $||s||$. On $s=0$, $\dot{V}=0$ whatever $\tilde{W}$ is, so $\dot{V}$ is not negative outside a compact set in $(s,\tilde{W})$; it is only $\leq0$. A trajectory can approach $s=0$ with a large $\tilde{W}$ that happens to satisfy $\tilde{W}\psi(x(t))\approx\epsilon(t)$ along it (no persistent excitation). So:
- $\tilde{W}$ is bounded (item 1), but not ultimately in the e-mod ball $||\tilde{W}||_{F}^2\leq2\gamma/\kappa$.
- $s$ is small in the mean square sense (item 3), the standard robust adaptive control result (Ioannou & Sun, ch. 8).
- Pointwise UUB with radius $\sim\phi$ holds for frozen weights (Corollary 1), and with adaptation under persistent excitation of $\psi$ along the trajectory (not proved here).

Lewis, Yesildirek & Liu (1996) is the reference to compare with. They show that plain gradient tuning of a multilayer network needs PE for the weights to stay bounded, and they remove that need with the e-mod term $\kappa||r||\hat{W}$ plus a robust term $-K_{z}(||\hat{Z}||_{F}+Z_{M})r$. That robust term handles the higher-order Taylor terms of the hidden layer, which we do not have, because our generators are frozen and $\hat{\Delta}$ is linear in $\hat{W}$. What their e-mod removes is the PE requirement for **boundedness**, and item 1 above gets the same without PE. They also state UUB of the weights, from a bound of the same form $\dot{V}\leq-||r||(\dots)$. That step needs $\dot{V}<0$ outside a compact set, which the $||r||$ factor does not give on $r=0$. So: cite them for boundedness without PE, and state the ultimate bound on $\tilde{W}$ with care.

The mean-square bound still shows the budget at work: $\frac{\gamma^2\phi}{4\rho k_{min}}$ needs $\rho>0$ (B1), shrinks with the offset $\gamma$ (good learning and good $W_{0}$), and vanishes with $\phi$.

### Remark 2. Reading the theorem as a passivity budget


The budget is: surplus pays shortage, $\lambda_{min}(K_{D})>\nu$ (B1), and SMC pays the biases, $k_{min}>\epsilon_{0}+\frac{\kappa}{2}||W^*-W_{0}||_{F}^2$ (B2). With $\epsilon_{0}=0$ and $W_{0}=W^*$ this is the index theorem for feedback connections (Khalil, sec. 6.5) and gives passivity and $\mathcal{L}_{2}$ stability. With biases it gives semi-passivity (Pogromsky) and the bounds above, not strict passivity.

**External port.** Adding a torque $d$ at the plant input adds $s^Td$ to $\dot{V}$, so $d\to s$ is semi-passive on $\Omega_{c}$ (dissipative outside a ball). Caveat: $s\neq\dot{q}$, so this is not passivity with respect to the physical power port $\dot{q}^Td$.

### Remark 3. Split vs lumped: gains needed for the same error bound

A lumped bound uses $||\epsilon||\leq\bar{\epsilon}=\sup_{\Omega_{c}}||\epsilon||$ with the full $\lambda_{min}(K_{D})$ as damping. On $\Omega_{c}$, $\bar{\epsilon}\leq\epsilon_{0}+\nu\bar{s}$.

Using Corollary 1 (frozen weights, $\mu=\sqrt{\lambda_{M}/\lambda_{m}}$), the gain needed for an ultimate bound $||s||\leq r^*$ (with $r^*/\mu<\phi$) is:
$$
k_{split}=\max\left(\epsilon_{0}',\;\phi\left(\frac{\mu\,\epsilon_{0}'}{r^*}-\lambda_{min}(K_{D})+\nu'\right)\right),\qquad k_{lumped}=\max\left(\bar{\epsilon}',\;\phi\left(\frac{\mu\,\bar{\epsilon}'}{r^*}-\lambda_{min}(K_{D})\right)\right)
$$
(with strict inequality on the first argument). When the second arguments are active,
$$
k_{lumped}-k_{split}=\phi\left(\frac{\mu(\bar{\epsilon}'-\epsilon_{0}')}{r^*}-\nu'\right)
$$
and when the first arguments are active the saving is $\bar{\epsilon}'-\epsilon_{0}'\leq\nu'\bar{s}$. The split wins when the residual really grows off the surface ($\bar{\epsilon}'-\epsilon_{0}'>\nu'r^*/\mu$), which is the case for small target radii. The price is (B1): the split needs $\lambda_{min}(K_{D})>\nu'$, the lumped bound only $K_{D}>0$. The comparison is fair only at the same $K_{D}$ satisfying (B1). This is the formula the simulation should evaluate with the true $\nu'$, $\epsilon_{0}'$ and $\bar{\epsilon}'$ computed in the sandbox ($M$ known), for no learning ($W_{0}=0$), MLP and DeLaN.

Note the comparison is against a lumped bound, not against the split at $z=0$ of Xian et al. and Patre et al., whose offset $N_{d}$ (taken at $e=0$) is smaller than $\epsilon_{0}$.

### Remark 4. $W^*$ is an analysis parameter

Nothing in the proof uses optimality of $W^*$. Any fixed $W^*$ gives valid constants $\epsilon_{0}(W^*)$, $\nu(W^*)$ and $\gamma(W^*)=\epsilon_{0}(W^*)+\frac{\kappa}{2}||W^*-W_{0}||_{F}^2$, so the best guarantee minimizes $\gamma$ over $W^*$ subject to $\nu(W^*)<\lambda_{min}(K_{D})$. In particular $W^*=W_{0}$ is admissible: then the e-mod bias vanishes and $\gamma=\epsilon_{0}(W_{0})$, which is computable in the sandbox from the trained network alone. This is where DeLaN enters the guarantee: a better offline model shrinks $\epsilon_{0}(W_{0})$ and $\nu(W_{0})$ (through $E_{M}=\tilde{M}-\hat{M}^*$), not the stability mechanism.

### Remark 5. Coulomb friction

$\mbox{Lip}(E_{F})$ does not exist for a $\mbox{sgn}$ mismatch. The Coulomb part is bounded directly and moved into $\epsilon_{0}$ as $\bar{f}_{c}$ (A2, Lemma 1 step 4); it is never differenced, so the jump costs nothing extra. Using the tanh-smoothed model instead would put a Lipschitz constant $\sim1/v_{s}$ into $\nu$, which is much worse for the budget.

### Remark 6. Spectral normalization

Spectral normalization of the generators gives a certified upper bound on $\nu$ by the triangle inequality. It is not used in the theorem: the certified $\nu$ does not shrink as learning improves and gives DeLaN no certified edge over an SN-MLP. The true $\nu$ and $\epsilon_{0}$ are computed in the sandbox instead.

### Remark 7. Vertical sandbox vs horizontal lab robot

$E_{g}(q)$ does not depend on $s$, so a gravity mismatch only enters $\epsilon_{0}$, never $\nu$. In the vertical-plane sandbox it inflates $\epsilon_{0}$; on the horizontal lab robot $g\approx0$ and it drops out. The theorem is unchanged.


### Remark 8. When the budget is not admissible: DeLaN vs MLP

(B1) is a real restriction, and it separates the two learners. In the sandbox gain study (Scripts/delan_jax/results/Gain comparison and no-gravity results.md), with $\lambda_{min}(K_{D})=20$, DeLaN has $\nu'=0.31$ while the MLP has $\nu'\approx52$. So for the MLP the split design is **not admissible** at this $K_{D}$: it would need $\lambda_{min}(K_{D})>52$, and only the lumped design is available. The reason is structural. For DeLaN, $\nu'$ inherits the form $\lambda_{max}(\Lambda)\sup||E_{M}||+k_{E}\sup||\dot{q}_{r}||+\mbox{Lip}(E_{F}^{L})$, so it only grows with the inertia and friction errors left after learning. The MLP's output is an arbitrary function of $(\dot{q},\ddot{q}_{r})$, so its sensitivity to $s$ off the training data is unconstrained. This is the honest version of "structure matters": it does not change the stability mechanism, but it is what makes the budget condition (B1) satisfiable at moderate $K_{D}$. Caveat: this is one MLP architecture trained one way; the claim is that nothing in an MLP keeps $\nu$ small, not that every MLP has $\nu=52$.

---

## References

- Slotine, J.-J. E., & Li, W. (1987). On the adaptive control of robot manipulators. IJRR, 6(3), 49–59.
- Ortega, R., & Spong, M. W. (1989). Adaptive motion control of rigid robots: A tutorial. Automatica, 25(6), 877–888.
- Narendra, K. S., & Annaswamy, A. M. (1987). A new adaptive law for robust adaptation without persistent excitation. IEEE TAC, 32(2), 134–145.
- Ioannou, P. A., & Sun, J. (1996). Robust Adaptive Control. Prentice Hall. Ch. 8.
- Lewis, F. L., Yesildirek, A., & Liu, K. (1996). Multilayer neural-net robot controller with guaranteed tracking performance. IEEE TNN, 7(2), 388–399.
- Xian, B., Dawson, D. M., de Queiroz, M. S., & Chen, J. (2004). A continuous asymptotic tracking control strategy for uncertain nonlinear systems. IEEE TAC, 49(7), 1206–1211.
- Patre, P. M., MacKunis, W., Kaiser, K., & Dixon, W. E. (2008). Asymptotic tracking for uncertain dynamic systems via a multilayer neural network feedforward and RISE feedback control structure. IEEE TAC, 53(9), 2180–2185.
- Corless, M. J., & Leitmann, G. (1981). Continuous state feedback guaranteeing uniform ultimate boundedness for uncertain dynamic systems. IEEE TAC, 26(5), 1139–1144.
- Khalil, H. K. (2002). Nonlinear Systems (3rd ed.). Prentice Hall. Sec. 3.1, Thm 4.18, sec. 6.5, Lemma 8.2, ch. 9.
- Sepulchre, R., Janković, M., & Kokotović, P. V. (1997). Constructive Nonlinear Control. Springer.
- Pogromsky, A. Yu. (1998). Passivity based design of synchronizing systems. Int. J. Bifurcation and Chaos, 8(2), 295–319.
- Filippov, A. F. (1988). Differential Equations with Discontinuous Righthand Sides. Kluwer.
- Shevitz, D., & Paden, B. (1994). Lyapunov stability theory of nonsmooth systems. IEEE TAC, 39(9), 1910–1914.
