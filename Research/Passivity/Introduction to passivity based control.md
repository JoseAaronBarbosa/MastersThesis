2026-09-08

#Passivity

[Reference](https://arxiv.org/pdf/2608.15222)
# Introduction

The controller is an energy-transforming and dissipating device that, once interconnected to the plant, ensures that the dissipation and energy of the overall system have a desired shape. The energy-based perspective has the advantage over the traditional signal-processing viewpoint that, the typically nonlinear physical phenomena can be accounted for in the control design process, giving the resulting controller a physical interpretation. Also, this perspective does not rely on canceling non-linearities, making them more robust and energy-efficient.

# Passivity and Passive Systems

Given the system:
$$\begin{align}
\dot{x}&=f(x(t))+g(x(t))u(t)\\ 
y(t)&=h(x(t))+j(x(t))u(t)
\end{align}$$
The inner product between the input and output $u^{T}y(t)$ is called the supply rate and has power units. 

***Definition***: The systems is passive if there exists an storage function S satisfying:
$$S(x(t))\leq S(x(0))+\int_0^tu^T(\tau)y(\tau)d\tau$$
It is also said to be:
- ***Input strictly passive*** if there exists $\delta$ such that:
$$S(x(t))\leq S(x(0))+\int_0^t[u^T(\tau)y(\tau)-\delta||u(\tau)||^2]d\tau$$
- ***Output strictly passive*** if there exists $\epsilon$ such that 
$$S(x(t))\leq S(x(0))+\int_0^t[u^T(\tau)y(\tau)-\epsilon||y(\tau)||^2]d\tau$$
An interpretation is that we cannot extract from a passive system more energy than the it originally stored. If the storage functions is differentiable then we can write it as:
$$\dot{S}\leq u^T(t)y(t)$$
The negative feedback interconnection of two passive system yields another passive system.

# Passivity-based control, energy shaping and damping injection

The design of a passivity-based controller consists of two steps:
- Energy shaping: The storage function for the regulated systems is designed. This functions must have a strict minimum at $x^*$*. The storage function will be used as a Lyapunov function.
- Damping injection: Damping is injected to guarantee the system loses energy until the states converge to the minimum of the storage function ($x^*$).

The first step ensures the existence of a function $S_{d}(x)$ that is locally positive definite at the desired equilibrium:
$$\begin{align}
S_{d}^* &= 0  \\
S_{d}(x) &> 0
\end{align}$$
Because of the passivity property $\dot{S}_{d} \leq u_{di}^Ty$. Then we can select:
$$u_{di}=-K_{di}y$$
with $K_{di}$ positive definite so the derivative of the storage function is $\dot{S}_{d}\leq ||y||^2K_{di}\leq 0$. These properties make the storage function a valid Lyapunov function and therefore $x^*$ is a locally stable equilibrium for the closed-loop system. The detectability condition then ensures asymptotical stability and if the storage function is radially unbounded then the stability properties are global.

