2026-09-28

#Passivity [^1]
## Dissipativity and passivity

Consider a nonlinear system: $$\begin{align} \dot{x}&=f(x)+g(x)u\\ y&=h(x) \end{align}$$with $f(0)=0$, $h(0)=0$. The supply rate is $w(u,y)$. A system is dissipative with supply rate $w$ if there exists a $C^0$ nonnegative storage function $V:X\to\mathbb{R}$ such that: $$V(x)-V(x^0)\leq\int_0^tw(s)ds$$for all admissible $u$, all $x^0$, $t\geq0$ (the dissipation inequality).

The available storage is: $$V_a(x)=\sup_{x^0=x,u,t\geq0}\left\{-\int_0^t w(s)ds\right\}$$
If a system with supply rate $w$ is dissipative, $V_a$ is finite for every $x$, and any storage function $V$ satisfies $0\leq V_a(x)\leq V(x)$.

Taking the supply rate as the inner product $w=\langle u,y\rangle=y^Tu$, a system is passive if there exists a $C^0$ nonnegative $V$ with $V(0)=0$ such that: $$V(x)-V(x^0)\leq\int_0^ty^T(s)u(s)ds$$It is lossless if this holds with equality, and strictly passive if there exists a positive definite $S$ such that: $$V(x)-V(x^0)=\int_0^ty^T(s)u(s)ds-\int_0^tS(x(s))ds$$Setting $u=0$, $V$ is nonincreasing along unforced trajectories; so passive systems with positive definite storage function are Lyapunov stable, and if strictly passive with positive definite storage, the equilibrium is asymptotically stable.

A system is said to be positive real if for every admissible ${}u{}$ and ${}t\geq 0{}$:
$$
0\leq\int_{0}^t y^T(s)u(s)ds
$$
whenever ${}x(0)=0{}$. A positive real system in which any state is reachable from the origin and in which its available storage is finite, its passive.

## The KYP property

A system has the KYP property if there exists a $C^1$ nonnegative $V$ with $V(0)=0$ such that, for each $x$: $$L_fV(x)\leq0,\qquad L_gV(x)=h^T(x)$$These are the infinitesimal (differential) version of the dissipation inequality: a system has the KYP property if and only if it is passive with storage function $V$.

## Stabilization by output feedback

A system is zero-state detectable if $h(\Phi(t,x,0))=0$ for all $t\geq0$ implies $\lim_{t\to\infty}\Phi(t,x,0)=0$; it is zero-state observable if the same hypothesis implies $x=0$.

Suppose a system is passive with a positive definite storage function $V$, and locally zero-state detectable. Let $\phi:Y\to U$ be smooth with $\phi(0)=0$ and $y^T\phi(y)>0$ for nonzero $y$. Then $u=-\phi(y)$ asymptotically stabilizes $x=0$; if the system is zero-state detectable and $V$ is proper, the stabilization is global.

In particular, if the system is passive with proper storage function and zero-state observable, $u=-ky$ globally asymptotically stabilizes the origin for any $k>0$.

## Relative degree, normal form, and minimum phase

A system has relative degree ${1,\dots,1}$ at $x=0$ if $L_gh(0)$ is nonsingular. If, in addition, the distribution spanned by the columns of $g$ is involutive, there exist new coordinates $(z,y)$ in which the system takes the normal form: $$\dot z=q(z,y),\qquad \dot y=b(z,y)+a(z,y)u$$with $a(z,y)$ nonsingular near $(0,0)$. The zero dynamics are the internal dynamics consistent with $y\equiv0$, i.e. $\dot z=q(z,0)=:f^*(z)$.

A system of relative degree ${1,\dots,1}$ is:
- minimum phase if $z=0$ is asymptotically stable for $f^*(z)$;
- weakly minimum phase if there exists a $C^r$ ($r\geq2$) positive definite $W^*(z)$, $W^*(0)=0$, with $L_{f^*}W^*(z)\leq0$ for all $z$ near $0$ (Lyapunov stability of the zero dynamics, not necessarily asymptotic).

If a system is passive with a $C^2$ positive definite storage function $V$, and $x=0$ is a regular point (or $V$ is nondegenerate at $x=0$), then $L_gh(0)$ is nonsingular, the system has relative degree ${1,\dots,1}$ at $x=0$, and it is weakly minimum phase.

## Feedback equivalence to a passive system

Suppose $x=0$ is a regular point for a system. Then then system is locally feedback equivalent (via $u=\alpha(x)+\beta(x)v$, $\beta$ invertible) to a passive system with a $C^2$ positive definite storage function $V$ if and only if it has relative degree ${1,\dots,1}$ at $x=0$ and is weakly minimum phase.

Global versions of this result hold under the additional regularity conditions of non-singularity of $L_gh(x)$ everywhere, completeness, and involutivity/commutativity of the associated vector fields $\tilde g_1,\dots,\tilde g_m$; giving global feedback equivalence to a passive/strictly passive system if and only if the system is globally weakly minimum phase/globally minimum phase.

## Cascade interconnections and global stabilization

For a cascade of a driving system $\dot x=f(x)+g(x)u,\ y=h(x)$ and a driven system $\dot\zeta=f_0(\zeta)+f_1(\zeta,y)y$:

If the unforced driven dynamics $\dot\zeta=f_0(\zeta)$ is globally asymptotically stable, the driving system is passive with a proper positive definite storage function, and the detectability-type set $S={0}$, then the full cascade is globally asymptotically stabilizable by smooth state feedback.

## References

[^1]: Byrnes, C. I., Isidori, A., & Willems, J. C. (1991). _Passivity, Feedback Equivalence, and the Global Stabilization of Minimum Phase Nonlinear Systems_. IEEE Transactions on Automatic Control, 36(11), 1228–1240.