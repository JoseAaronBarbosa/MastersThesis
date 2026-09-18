2026-09-14

#DeLaN

[Reference](https://drive.google.com/file/d/1Qe_jE0gJ9nfRwxg3FxhKLtH0wlNdNL0f/view?usp=drive_link)

## Model of the system

They use the knowledge from Lagrangian mechanics and encode this prior within a deep learning architecture.
Let the Lagrangian be defined as:
$$\mathcal{L}=T-U$$
Where $T=\frac{1}{2}\dot{q}^TM(q)\dot{q}$ is the kinetic energy and $V$ is the potential energy. We wish to substitute this in the Euler-Lagrange differential equation, so we will calculate each term:
$$\frac{\partial \mathcal{L}}{\partial \dot{q}}=M(q)\dot{q}-\frac{\partial U}{\partial\dot{q}}$$
$$\frac{d}{dt}\left(\frac{\partial \mathcal{L}}{\partial \dot{q}}\right)= M(q)\ddot{q}+\dot{M}(q)\dot{q}$$
The partial derivate of $U$ disappears since the potential energy does not depend on $\dot{q}$.
$$\frac{\partial L}{\partial q}=\frac{1}{2}\left(\frac{\partial}{\partial q}(\dot{q}^TM(q)\dot{q})\right)-\frac{\partial U}{\partial q}$$
Finally:
$$M(q)\ddot{q}+\dot{M}(q)\dot{q}-\frac{1}{2}\left(\frac{\partial}{\partial q}(\dot{q}^TM(q)\dot{q})\right)+\frac{\partial U}{\partial q}=\sum_{i}\tau_{i}$$
We combine the middle terms into the Coriolis matrix, and the third them is the gravitational torque.
$$M(q)\ddot{q}+C(q,\dot{q})+\frac{\partial U}{\partial q}=\sum_{i}\tau_{i}$$
We can see that the Coriolis matrix is calculated from the Inertia matrix. Therefore we do not have to learn it, we can just derivate it from $M(q)$. Moreover, if we use the Christoffel symbols, we can calculate $C(q,\dot{q})$ such that $(\dot{M}(q)-2C(q,\dot{q}))$ is skew-symmetric. 

## Structured learning

We can use deep networks to learn this matrices, but they have to fulfill certain properties:
$$\lambda_{m}I<M(q)<\lambda_{M}I,\quad 0<\lambda_{m}<\lambda_{M}<\infty$$
$$x^{T}(\dot{M}(q)-2C(q,\dot{q}))x=0,\quad\forall x\in\mathbb{R}^n$$
$$\dot{q}^{T}F(\dot{q})\geq 0$$
The last one is referred to the friction property and is not included in the nominal model. These properties can be enforced via a parametrization of the matrices, for example:
$$\hat{M}(q)=\hat{L}(q;\theta)\hat{L}^T(q;\theta)+\epsilon I$$
$$\hat{U}=\hat{U}(q;\psi)$$
Where $\hat{L}$ is a lower triangular matrix with a non-negative diagonal, $\theta$ and $\psi$ are the network parameters and $\epsilon$ is a small positive constant.
It is important to notice that in the calculation of the gravitational torque and the Coriolis matrix, we need to take the derivatives with respect to certain inputs. Full differentiation of the neural networks is what allows us to take this derivatives. The network will compute a single scalar value for the potential energy, and we can use automatic differentiation with respect to each input coordinate to obtain each entry of the gravitational vector. Meaning that we don't have to use an additional architecture to perform the numeric calculations.

The learning becomes a two step process. The decomposition into inertial, Coriolis and gravitational forces is learned offline with unsupervised learning. Then, the superposition of the different forces is learned supervised, with a learning function obtained from a Lyapunov analysis, trying to minimize the norm between the prediction of the network and the observed motor torque.

## Introducing friction

The friction can come from various physical effects. Defining a general case for all types of friction in compliance with the Lagrangian mechanics is challenging.
For friction caused by the actuators, it is assumed that the friction only depends on the joint velocity and is independent from joint to joint. 
For example, a combination of static, viscous or Stribeck friction can be assumed as a model prior and the superposition is described by:
$$\tau_{f_{i}}=-\left( \tau_{C_{v}}+\tau_{C_{s}}\mbox{exp}\left( -\frac{\dot{q}_{i}^2}{v} \right)\right)\mbox{sign}(\dot{q}_{i})-d\dot{q}_{i}$$
Where the coefficients are of static friction $\tau_{C_{v}}$, viscous friction $d$, and Stribeck friction $\tau_{C_{v}},v$. 
It is important to note that the frictional force is already a function of the generalized coordinates and therefore can enter the model as it is.
$$M(q)\ddot{q}+C(q,\dot{q})+\frac{\partial U}{\partial q}+\tau_{{f_{i}}}=\sum_{i}\tau_{i}$$
Using this friction model we can just learn the friction coefficients by treating them as network weights.
We can also note that this modeling ensures the fulfillment of the property $\dot{q}^{T}F(\dot{q})\geq 0$.