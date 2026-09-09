2026-09-08

#Passivity

[Reference](https://arxiv.org/pdf/2608.15222)
# Introduction

The controller is an energy-transforming and dissipating device that, once interconnected to the plant, ensures that the dissipation and energy of the overall system have a desired shape. The energy-based perspective has the advantage over the traditional signal-processing viewpoint that, the typically nonlinear physical phenomena can be accounted for in the control design process, giving the resulting controller a physical interpretation. Also, this perspective does not rely on canceling non-linearities, making them more robust and energy-efficient.

# Passivity and Passive Systems

Given the system:
$$\begin{align}
\textcolor{#a882ff}{\dot{x}}&\textcolor{white}{=}\textcolor{#027aff}{f}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}t\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}+\textcolor{#027aff}{g}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}t\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}\textcolor{#027aff}{u}\textcolor{#e0af68}{(}t\textcolor{#e0af68}{)}\\ 
\textcolor{#027aff}{y}\textcolor{#e0af68}{(}t\textcolor{#e0af68}{)}&\textcolor{white}{=}\textcolor{#027aff}{h}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}t\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}+\textcolor{#027aff}{j}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}t\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}\textcolor{#027aff}{u}\textcolor{#e0af68}{(}t\textcolor{#e0af68}{)}
\end{align}$$
The inner product between the input and output $u^\textcolor{#027aff}{T}\textcolor{#e0af68}{(}t\textcolor{#e0af68}{)}\textcolor{#027aff}{y}\textcolor{#e0af68}{(}t\textcolor{#e0af68}{)}$ is called the supply rate and has power units. 

***Definition***: The systems is passive if there exists an storage function <span style="color:rgb(255, 192, 0)">S</span> satisfying:
$$\textcolor{#027aff}{S}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}t\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}\textcolor{white}{\leq} \textcolor{#027aff}{S}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}\textcolor{#e9973f}{0}\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}+\textcolor{#e9973f}{\int_\textcolor{#44cf6e}{0}^\textcolor{#a882ff}{t}}u^\textcolor{#027aff}{T}\textcolor{#e0af68}{(}\textcolor{#a882ff}{\tau}\textcolor{#e0af68}{)}\textcolor{#027aff}{y}\textcolor{#e0af68}{(}\textcolor{#a882ff}{\tau}\textcolor{#e0af68}{)}d\textcolor{#a882ff}{\tau}$$
It is also said to be:
- ***Input strictly passive*** if there exists $\textcolor{#a882ff}{\delta}\textcolor{white}{>}0$ such that:
$$\textcolor{#027aff}{S}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}t\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}\textcolor{white}{\leq} \textcolor{#027aff}{S}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}\textcolor{#e9973f}{0}\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}+\textcolor{#e9973f}{\int_\textcolor{#44cf6e}{0}^\textcolor{#a882ff}{t}}\textcolor{#e0af68}{[}u^\textcolor{#027aff}{T}\textcolor{#7aa2f7}{(}\textcolor{#a882ff}{\tau}\textcolor{#7aa2f7}{)}\textcolor{#027aff}{y}\textcolor{#7aa2f7}{(}\textcolor{#a882ff}{\tau}\textcolor{#7aa2f7}{)}-\textcolor{#a882ff}{\delta}||\textcolor{#027aff}{u}\textcolor{#7aa2f7}{(}\textcolor{#a882ff}{\tau}\textcolor{#7aa2f7}{)}||^\textcolor{#a882ff}{2}\textcolor{#e0af68}{]}d\textcolor{#a882ff}{\tau}$$
- ***Output strictly passive*** if there exists $\textcolor{#a882ff}{\epsilon}\textcolor{white}{>}0$ such that 
$$\textcolor{#027aff}{S}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}t\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}\textcolor{white}{\leq} \textcolor{#027aff}{S}\textcolor{#e0af68}{(}\textcolor{#a882ff}{x}\textcolor{#7aa2f7}{(}\textcolor{#e9973f}{0}\textcolor{#7aa2f7}{)}\textcolor{#e0af68}{)}+\textcolor{#e9973f}{\int_\textcolor{#44cf6e}{0}^\textcolor{#a882ff}{t}}\textcolor{#e0af68}{[}u^\textcolor{#027aff}{T}\textcolor{#7aa2f7}{(}\textcolor{#a882ff}{\tau}\textcolor{#7aa2f7}{)}\textcolor{#027aff}{y}\textcolor{#7aa2f7}{(}\textcolor{#a882ff}{\tau}\textcolor{#7aa2f7}{)}-\textcolor{#a882ff}{\epsilon}||\textcolor{#027aff}{y}\textcolor{#7aa2f7}{(}\textcolor{#a882ff}{\tau}\textcolor{#7aa2f7}{)}||^\textcolor{#a882ff}{2}\textcolor{#e0af68}{]}d\textcolor{#a882ff}{\tau}$$
An interpretation is that we cannot extract from a passive system more energy than the it originally stored. If the storage functions is differentiable then we can write it as:
$$\textcolor{#a882ff}{\dot{S}}\textcolor{white}{\leq} u^\textcolor{#027aff}{T}\textcolor{#e0af68}{(}t\textcolor{#e0af68}{)}\textcolor{#027aff}{y}\textcolor{#e0af68}{(}t\textcolor{#e0af68}{)}$$
The negative feedback interconnection of two passive system yields another passive system.

# Passivity-based control, energy shaping and damping injection

The design of a passivity-based controller consists of two steps:
- Energy shaping: The storage function for the regulated systems is designed. This functions must have a strict minimum at $x^\textcolor{#a882ff}{*}$. The storage function will be used as a Lyapunov function.
- Damping injection: Damping is injected to guarantee the system loses energy until the states converge to the minimum of the storage function ($x^\textcolor{#a882ff}{*}$).

The first step ensures the existence of a function $S_\textcolor{#027aff}{d}\textcolor{#e0af68}{(}x\textcolor{#e0af68}{)}$ that is locally positive definite at the desired equilibrium:
$$\begin{align}
S_{d}^* &= 0  \\
S_{d}(x) &> 0
\end{align}$$
Because of the passivity property $\dot{S}_{d} \leq u_{di}^Ty$. Then we can select:
$$u_{di}=-K_{di}y$$
with $K_{di}$ positive definite so the derivative of the storage function is $\dot{S}_{d}\leq ||y||^2K_{di}\leq 0$. These properties make the storage function a valid Lyapunov function and therefore $x^*$ is a locally stable equilibrium for the closed-loop system. The detectability condition then ensures asymptotical stability and if the storage function is radially unbounded then the stability properties are global.

