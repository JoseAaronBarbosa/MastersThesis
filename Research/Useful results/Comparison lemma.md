2026-10-08

#Theorems

Consider the scalar differential equation:
$$
\dot{u}=f(t,u),\quad u(t_{0})=u_{0}
$$
where ${}f(t,u){}$ is continuous in ${}t{}$ and locally Lipschitz in ${}u{}$ for all ${}t\geq 0{}$ and all ${}u\in J\subset \mathbb{R}{}$. Let ${}[t_{0,T}){}$ where $T$ could be infinity, be the maximal interval of existence of the solution ${}u(t){}$, and suppose ${}u(T)\in J{}$ for all ${}t\in[t_{0,T}){}$. Let $v(t)$ be a continuous function whose upper right-hand derivative ${}D^{+}v(t)$ satisfies the differential inequality:
$$
D^{+}v(t)\leq f(t,r(t)),\quad v_{0}\leq u_{0}
$$
with ${}v(t)\in J{}$ for all  ${}t\in[t_{0,T}){}$. Then ${}v(t)\leq u(t){}$ for all ${}t\in[t_{0,T}){}$.[^1]

	-As a recipe, to plot a bound for a differential equation x(t) without knowing the solution u(t). Define a function v(t) that depends on x(t) in such a way that dv(t) appears as a differential inequality in terms of v(t) and whose initial condition is less or equal than that of the solution. Substitue the solution u(t) as the equality case of v(t). Compute the solution of u(t). Then v(t) is upper bounded by u(t) whose solution we know, and since v(t) is defined in terms of x(t) we can find a bound of x(t) in terms of the solution of equal case of the differential inequality. 
## References

[^1]: H. K. Khalil, _“Nonlinear Systems,”_ 3rd Edition, Prentice Hall, Upper Saddle River, 2002.