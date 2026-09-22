2026-09-21

#SlidingModes 

## Filippov solutions

To have solutions of systems of the form $\dot{x}=f(x)$ in the classical (Picard-Lindelöf) sense, it is required for the right-hand side to be Lipschitz, or at least continuous in $x$
But when the right-hand side contains a ${}\mbox{sign}{(s)}{}$ function, the expression ${}\mbox{sign}{(s)}{}$ is not defined at ${}s=0{}$, so an equilibrium cannot be properly defined.

The solutions consists on treating the ${}\mbox{sign}{(s)}{}$ function as a set-valued map.
$$
\mbox{SIGN}(x)=\left\{\begin{array}{cc} \{+1\} & x>0 \\ [-1,+1] & x=0 \\  \{-1\} & x<0 \end{array}\right.
$$
At every point where sign is discontinuous, we replace the single value with the closed convex hull of all the limiting values of the function from every direction of approach. The solutions is in the sense of the differential inclusion:
$$
\dot{x}\in F(x)
$$
A Filippov solutions is an absolutely continuous curve ${}x(t){}$ satisfying ${}\dot{x}(t)\in F(x(t)){}$ for almost every ${}t{}$.

## Equivalent control

Once the trajectories converge to the sliding surface, the motion is governed by whichever element of the set valued map keeps the trajectory on the sliding surface. The equivalent control is the practical device that allows us to find that motion without leaving the Filippov formalism. 
Once sliding occurs you must also have ${}\dot{s}=0{}$, so:
$$
\dot{s}= \frac{ \partial s }{ \partial x }\dot{x}=\frac{ \partial s }{ \partial x } [f(x)+g(x)u_{eq}]=0 
$$
If ${}\frac{ \partial s }{ \partial x }g(x){}$ is invertible then we can solve for the equivalent control:
$$
u_{eq}=-\left[ \frac{ \partial s }{ \partial x } g(x) \right]^{-1}\frac{ \partial s }{ \partial x } f(x)
$$
The equivalent control is not the real discontinuous control being applied on the system, it's the average that the real switching control effectively produces and coincides exactly with the Filippov set values map that makes ${}s=0{}$ consistent.

## Utkin's first chapter

After introducing the sliding dynamics, solutions in the Filippov sense and the equivalent control.
The resulting sliding dynamics has order reduced by the number of independent switching surfaces.
Any uncertainty/disturbance that enter through the same channel as the control is completely rejected by the equivalent control once sliding happens.
