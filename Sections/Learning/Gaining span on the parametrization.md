2026-09-23

#DeLaN 

If we just use $\hat{M}(q)=\hat{w}_{M}\hat{L}(q;\theta)\hat{L}^T(q;\theta)+\epsilon I$ for the parametrization of the matrices,[^1] you can see that the basis ${}\hat{L}(q;\theta){}$ formed in the offline training could not have enough richness to produce the correct adjustment needed for the online learning. 
This will cause another error related to the matrix span, additional to the error due to the universal approximation.
To solve this, we could form a richer basis. Not just learn one basis ${}\hat{L}(q;\theta){}$, but $k$ independent frozen matrices offline and combine them online as:
$$
\hat{M}_{\theta}(q)=\sum_{j=1}^{k}\hat{\omega}_{M,j}\bar{L}_{j}(q)\bar{L}_{j}(q)^T+\epsilon I
$$
Note that the ${}\epsilon{}$ term is not adapted, it is fixed and obtained from the actual manipulator. It is added after the learning.
Since the gains are non-negative the conic combination of positive semidefinite matrices gives another positive semidefinite matrix.[^2] With enough frozen matrices, the parametrization can produce an approximation arbitrarily close to the real ones (with precision limited by scale) for different scenarios.
Using training data that contains the possible scenarios that the robot could encounter, can ensure that the necessary basis elements are present for the online training.
For the inertia and dissipative channel, we use this trick to gain span on the parametrization, and just enforce positive weights during the online learning. For the gravity vector there is no sign restriction since the negative gradient is equal to the gradient of the negative potential field, both gradients.

## References

[^1]: Lutter, M. and Listmann, K. and Peters, Jan. (2019). _Deep Lagrangian Networks for end-to-end learning of energy-based control for under-actuated systems_. IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS), 5562-5569.
[^2]: Horn, R. A., & Johnson, C. R. (1985). _Matrix Analysis_. Cambridge University Press.

Note: the conic-combination construction itself (extending DeLaN's single-basis parametrization to a $k$-generator sum to recover span) is this thesis's own methodological contribution, not something drawn from [^1] or [^2] directly — those two references support only the base parametrization it extends and the underlying linear-algebra fact used to justify it.
