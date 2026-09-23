2026-09-22

#ELsystem 

## Transformation matrices

For a planar 2 DOF manipulator, we define the homogenous transformation matrices:
$$
T_{1}^0=\left(\begin{array}{cccc}
c_{1} & -s_{1} & 0 & 0 \\
s_{1} & c_{1} & 0 & 0  \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{array}\right)
$$
$$
T_{2}^1=\left(\begin{array}{cccc}
c_{2} & -s_{2} & 0 & l_{1} \\
s_{2} & c_{2} & 0 & 0  \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{array}\right)
$$
$$
T_{e}^2=\left(\begin{array}{cccc}
1 & 0 & 0 & l_{2} \\
0 & 1 & 0 & 0  \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{array}\right)
$$
The the composition:
$$
T_{2}^0=\left(\begin{array}{cccc}
c_{12} & -s_{12} & 0 & c_{1}l_{1} \\
s_{12} & c_{12} & 0 & s_{1}l_{1} \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{array}\right)
$$
$$
T_{e}^0=\left(\begin{array}{cccc}
c_{12} & -s_{12} & 0 & c_{12}l_{2}+c_{1}l_{1} \\
s_{12} & c_{12} & 0 & s_{12}l_{2}+s_{1}l_{1} \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{array}\right)
$$
## Jacobian

Now we can obtain the Jacobian at each center of mass for the links:
$$
J_{v,c_{1}}=\left(\begin{array}{cc}
z_{0}\times(o_{c_{1}}-o_{0}) & 0
\end{array}\right)= \left(\begin{array}{cc}
-s_{1}l_{c_{1}} & 0\\
c_{1}l_{c_{1}} & 0 \\
0 & 0
\end{array}\right)
$$
$$
J_{\omega,1}= \left(\begin{array}{cc}
0 & 0\\
0 & 0 \\
1 & 0
\end{array}\right)
$$
$$
J_{v,c_{2}}=\left(\begin{array}{cc}
z_{0}\times(o_{c_{2}}-o_{0}) & z_{1}\times(o_{c_{2}}-o_{1})
\end{array}\right)= \left(\begin{array}{cc}
-s_{12}l_{c_{2}}-s_{1}l_{1} & -s_{12}l_{c_{2}}\\
c_{12}l_{c_{2}}+c_{1}l_{1} &  c_{12}l_{c_{2}}\\
0 & 0
\end{array}\right)
$$
$$
J_{\omega,2}= \left(\begin{array}{cc}
0 & 0\\
0 & 0 \\
1 & 1
\end{array}\right)
$$
## Inertia matrix

Now we can compute the inertia matrix:
$$
M(q)=\sum_{i}[m_{1}J_{v,c_{i}}^TJ_{v,c_{i}}+J_{\omega,i}^TI_{i}J_{\omega,i}]
$$

$$
m_{1}J_{v,c_{1}}^TJ_{v,c_{1}}=m_{1}\left(\begin{array}{ccc}
-s_{1}l_{c_{1}} & c_{1}l_{c_{1}} & 0\\
0 & 0 & 0
\end{array}\right)\left(\begin{array}{cc}
-s_{1}l_{c_{1}} & 0\\
c_{1}l_{c_{1}} & 0 \\
0 & 0
\end{array}\right)=m_{1}\left(\begin{array}{cc}
s_{1}^2l_{c_{1}}^2+c_{1}^2l_{c_{1}}^2 & 0\\
0 & 0
\end{array}\right)=\left(\begin{array}{cc}
m_{1}l_{c_{1}}^2 & 0\\
0 & 0
\end{array}\right)
$$
$$
J_{\omega,1}^TI_{1}J_{\omega,1}=I_{1}\left(\begin{array}{ccc}
0 & 0 & 1\\
0 & 0 & 0
\end{array}\right)\left(\begin{array}{cc}
0 & 0\\
0 & 0 \\
1 & 0
\end{array}\right)=\left(\begin{array}{cc}
I_{1} & 0\\
0 & 0
\end{array}\right)
$$
$$
m_{2}J_{v,c_{2}}^TJ_{v,c_{2}}=m_{2}\left(\begin{array}{ccc}
-s_{12}l_{c_{2}}-s_{1}l_{1} & c_{12}l_{c_{2}}+c_{1}l_{1} & 0\\
-s_{12}l_{c_{2}} &  c_{12}l_{c_{2}} & 0
\end{array}\right)\left(\begin{array}{cc}
-s_{12}l_{c_{2}}-s_{1}l_{1} & -s_{12}l_{c_{2}}\\
c_{12}l_{c_{2}}+c_{1}l_{1} &  c_{12}l_{c_{2}}\\
0 & 0
\end{array}\right)
$$

$$
=m_{2}\left(\begin{array}{cc}
s_{12}^2l_{c_{2}}^2+2s_{1}s_{12}l_{1}l_{c_{2}}+s_{1}^2l_{1}^2+c_{12}^2l_{c_{2}}^2+c_{1}^2l_{1}^2+2c_{1}c_{12}l_{1}l_{c_{2}} & s_{12}^2l_{c_{2}}^2+s_{1}l_{1}s_{12}l_{c_{2}}+c_{12}^2l_{c_{2}}^2+c_{1}l_{1}c_{12}l_{c_{2}} \\
s_{12}^2l_{c_{2}}^2+s_{1}l_{1}s_{12}l_{c_{2}}+c_{12}^2l_{c_{2}}^2+c_{1}l_{1}c_{12}l_{c_{2}} & s_{12}^2l_{c_{2}}^2+c_{12}^2l_{c_{2}}^2
\end{array}\right)
$$
$$
=m_{2}\left(\begin{array}{cc}
l_{1}^2+l_{c_{2}}^2+2s_{1}s_{12}l_{1}l_{c_{2}}+2c_{1}c_{12}l_{1}l_{c_{2}}& l_{c_{2}}^2+s_{1}l_{1}s_{12}l_{c_{2}}+c_{1}l_{1}c_{12}l_{c_{2}} \\
l_{c_{2}}^2+s_{1}l_{1}s_{12}l_{c_{2}}+c_{1}l_{1}c_{12}l_{c_{2}} & l_{c_{2}}^2
\end{array}\right) = m_{2}\left(\begin{array}{cc}
l_{1}^2+l_{c_{2}}^2+2l_{1}l_{c_{2}}c_{2} & l_{c_{2}}^2+l_{1}l_{c_{2}}c_{2} \\
l_{c_{2}}^2+l_{1}l_{c_{2}}c_{2} & l_{c_{2}}^2
\end{array}\right)
$$
$$
J_{\omega,2}^TI_{2}J_{\omega,2}=I_{2}\left(\begin{array}{ccc}
0 & 0 & 1\\
0 & 0 & 1
\end{array}\right)\left(\begin{array}{cc}
0 & 0\\
0 & 0 \\
1 & 1
\end{array}\right)=\left(\begin{array}{cc}
I_{2} & I_{2}\\
I_{2} & I_{2}
\end{array}\right)
$$
Gathering all the terms we arrive at:
$$
M(q)=\left(\begin{array}{cc}
m_{1}l_{c_{1}}^2+m_{2}(l_{1}^2+l_{c_{2}}^2+2l_{1}l_{c_{2}}c_{2})+I_{1}+I_{2} & m_{2}(l_{c_{2}}^2+l_{1}l_{c_{2}}c_{2})+I_{2}  \\
m_{2}(l_{c_{2}}^2+l_{1}l_{c_{2}}c_{2})+I_{2}  & m_{2}l_{c_{2}}^2+I_{2}
\end{array}\right)
$$

## Coriolis matrix

For each entry of the Coriolis matrix:
$$
C_{kj}(q,\dot{q})=\sum_{i=1}^nc_{ijk}\dot{q}_{i}
$$

$$
c_{ijk}=\frac{1}{2}\left(\frac{ \partial M_{kj} }{ \partial q_{i} }+\frac{ \partial M_{ki} }{ \partial q_{j} }-\frac{ \partial M_{ij} }{ \partial q_{k} }   \right)
$$
It is important to note that only ${}q_{2}{}$ appears in the inertia matrix so a lot of partial derivatives disappear. Also, the term ${}M_{22}{}$ has no dependence on the angle so it also disappears.
$$
C_{11}=c_{111}\dot{q}_{1}+c_{211}\dot{q}_{2}=-m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{2}
$$
$$
C_{12}=c_{112}\dot{q}_{1}+c_{212}\dot{q}_{2}=m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{2}
$$
$$
C_{21}=c_{121}\dot{q}_{1}+c_{221}\dot{q}_{2}=-m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{1}-m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{2}
$$
$$
C_{22}=c_{122}\dot{q}_{1}+c_{222}\dot{q}_{2}=0
$$
Which gives:
$$
C(q,\dot{q})=\left(\begin{array}{cc}
-m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{2} & m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{1} \\
-m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{1}-m_{2}l_{1}l_{c_{2}}s_{2}\dot{q}_{2} & 0
\end{array}\right)
$$

## Gravitational vector

The center of mass heights are:
$$
y_{c_{1}}=l_{c_{1}}s_{1}
$$
$$
y_{c_{2}}=l_{1}s_{1}+l_{c_{2}}s_{12}
$$
So the potential energy is:
$$
P(q)=m_{1}gl_{c_{1}}s_{1}+m_{2}g(l_{1}s_{1}+l_{c_{2}}s_{12})
$$
We take the gradient to obtain the gravity vector:
$$
g(q)=\nabla_{q}P(q)=\left(\begin{array}{c}
g(m_{1}l_{c_{1}}+m_{2}l_{1})c_{1}+gm_{2}l_{c_{2}}c_{12}\\
gm_{2}l_{c_{2}}c_{12}
\end{array}\right)
$$
