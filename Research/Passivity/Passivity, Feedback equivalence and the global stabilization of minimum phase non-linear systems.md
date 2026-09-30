2026-09-28

#Passivity [^1]
## Dissipativity and passivity

Consider a nonlinear system: $$\begin{align} \dot{x}&=f(x)+g(x)u\ y&=h(x) \end{align}$$ with $f(0)=0$, $h(0)=0$. The supply rate is $w(u,y)$. A system is dissipative with supply rate $w$ if there exists a $C^0$ nonnegative storage function $V:X\to\mathbb{R}$ such that: $$V(x)-V(x^0)\leq\int_0^tw(s)ds$$ for all admissible $u$, all $x^0$, $t\geq0$ (the dissipation inequality).

The available storage is: $$V_a(x)=\sup_{x^0=x,u,t\geq0}\left\{\int_0^t w(s)ds\right\}$$ If a system with supply rate $w$ is dissipative, $V_a$ is finite for every $x$, and any storage function $V$ satisfies $0\leq V_a(x)\leq V(x)$.

Taking the supply rate as the inner product $w=\langle u,y\rangle=y^Tu$, a system is passive if there exists a $C^0$ nonnegative $V$ with $V(0)=0$ such that: $$V(x)-V(x^0)\leq\int_0^ty^T(s)u(s)ds$$ It is lossless if this holds with equality, and strictly passive if there exists a positive definite $S$ such that: $$V(x)-V(x^0)=\int_0^ty^T(s)u(s)ds-\int_0^tS(x(s))ds$$ Setting $u=0$, $V$ is nonincreasing along unforced trajectories; so passive systems with positive definite storage function are Lyapunov stable, and if strictly passive with positive definite storage, the equilibrium is asymptotically stable.[^1]

## The KYP property

A system has the KYP property if there exists a $C^1$ nonnegative $V$ with $V(0)=0$ such that, for each $x$: $$L_fV(x)\leq0,\qquad L_gV(x)=h^T(x)$$ These are the infinitesimal (differential) version of the dissipation inequality: a system has the KYP property if and only if it is passive with storage function $V$.[^1]

## Stabilization by output feedback

A system is zero-state detectable if $h(\Phi(t,x,0))=0$ for all $t\geq0$ implies $\lim_{t\to\infty}\Phi(t,x,0)=0$; it is zero-state observable if the same hypothesis implies $x=0$.[^1]

**Theorem (stabilization by pure output feedback).** Suppose $\Sigma$ is passive with a positive definite storage function $V$, and locally zero-state detectable. Let $\phi:Y\to U$ be smooth with $\phi(0)=0$ and $y^T\phi(y)>0$ for nonzero $y$. Then $u=-\phi(y)$ asymptotically stabilizes $x=0$; if $\Sigma$ is zero-state detectable and $V$ is proper, the stabilization is global.[^1]

In particular, if $\Sigma$ is passive with proper storage function and zero-state observable, $u=-ky$ globally asymptotically stabilizes the origin for any $k>0$.[^1]

## Relative degree, normal form, and minimum phase

A system has relative degree ${1,\dots,1}$ at $x=0$ if $L_gh(0)$ is nonsingular. If, in addition, the distribution spanned by the columns of $g$ is involutive, there exist new coordinates $(z,y)$ in which the system takes the normal form: $$\dot z=q(z,y),\qquad \dot y=b(z,y)+a(z,y)u$$ with $a(z,y)$ nonsingular near $(0,0)$. The zero dynamics are the internal dynamics consistent with $y\equiv0$, i.e. $\dot z=q(z,0)=:f^*(z)$.

A system of relative degree ${1,\dots,1}$ is:

- minimum phase if $z=0$ is asymptotically stable for $f^*(z)$;
- weakly minimum phase if there exists a $C^r$ ($r\geq2$) positive definite $W^*(z)$, $W^*(0)=0$, with $L_{f^*}W^*(z)\leq0$ for all $z$ near $0$ (Lyapunov stability of the zero dynamics, not necessarily asymptotic).

**Theorem (relative degree and zero dynamics of passive systems).** If $\Sigma$ is passive with a $C^2$ positive definite storage function $V$, and $x=0$ is a regular point (or $V$ is nondegenerate at $x=0$), then $L_gh(0)$ is nonsingular, $\Sigma$ has relative degree ${1,\dots,1}$ at $x=0$, and $\Sigma$ is weakly minimum phase.

## Feedback equivalence to a passive system

**Theorem (main equivalence result).** Suppose $x=0$ is a regular point for $\Sigma$. Then $\Sigma$ is locally feedback equivalent (via $u=\alpha(x)+\beta(x)v$, $\beta$ invertible) to a passive system with a $C^2$ positive definite storage function $V$ **if and only if** $\Sigma$ has relative degree ${1,\dots,1}$ at $x=0$ and is weakly minimum phase.

This is proved by transforming the system into normal form, then, using a Lyapunov function $W^*$ for the (weakly minimum phase) zero dynamics, constructing the feedback: $$u=[I+M(z,y)]^{-1}[-(L_{p(z,y)}W^*(z))^T+w]$$ so that $\dot V(z,y)=L_{f^*}W^*(z)+y^Tw\leq0$ with output $y$, establishing the KYP property for the closed loop.

Global versions of this result hold under the additional regularity conditions **H1–H3** (non-singularity of $L_gh(x)$ everywhere, completeness, and involutivity/commutativity of the associated vector fields $\tilde g_1,\dots,\tilde g_m$), giving global feedback equivalence to a passive (respectively strictly passive) system iff $\Sigma$ is globally weakly minimum phase (respectively globally minimum phase).

## Cascade interconnections and global stabilization

For a cascade of a driving system $\dot x=f(x)+g(x)u,\ y=h(x)$ and a driven system $\dot\zeta=f_0(\zeta)+f_1(\zeta,y)y$:

**Theorem.** If the unforced driven dynamics $\dot\zeta=f_0(\zeta)$ is globally asymptotically stable, ${f,g,h}$ is passive with a proper positive definite storage function, and the detectability-type set $S={0}$, then the full cascade is globally asymptotically stabilizable by smooth state feedback.

This unifies and extends earlier results on stabilization of minimum phase systems and cascade-interconnected configurations, and recovers, as special cases, results on rendering linear systems positive real via state feedback (a linear system is feedback equivalent to a positive real system iff $CB$ is nonsingular and the system is weakly minimum phase).

## References

[^1]: Byrnes, C. I., Isidori, A., & Willems, J. C. (1991). _Passivity, Feedback Equivalence, and the Global Stabilization of Minimum Phase Nonlinear Systems_. IEEE Transactions on Automatic Control, 36(11), 1228–1240.