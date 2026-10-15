2026-10-08

#Theorems 

Let ${}a,b\in\mathbb{R}^n{}$ be real vectors and ${}\epsilon>0{}$ a scalar, $\Lambda_{1}\in\mathbb{R}^{n\times n}$ a symmetric positive-definite matrix. Then:
$$
-a^Tb\leq \frac{1}{2\epsilon}a^T\Lambda_{1}a+\frac{\epsilon}{2}b^T\Lambda_{1}^{-1}b
$$

**Proof**:
$$
\left|\left|\frac{1}{\sqrt{\epsilon}}\Lambda^{1/2}_{1}a+\sqrt{\epsilon}\Lambda_{1}^{-1/2}b\right|\right|\geq0
$$
Due to the positivity of vector norms. Expanding the inner product expansion:
$$
\left(\frac{1}{\sqrt{\epsilon}}\Lambda^{1/2}_{1}a+\sqrt{\epsilon}\Lambda_{1}^{-1/2}b\right)^T\left(\frac{1}{\sqrt{\epsilon}}\Lambda^{1/2}_{1}a+\sqrt{\epsilon}\Lambda_{1}^{-1/2}b\right)\geq 0
$$
$$
\frac{1}{\epsilon}a^T(\Lambda_{1}^{1/2})^T\Lambda_{1}^{1/2}a+\epsilon b^T(\Lambda_{1}^{-1/2})^T\Lambda_{1}^{-1/2}b+2a^T(\Lambda_{1}^{1/2})^T\Lambda_{1}^{-1/2}b\geq 0
$$
Then, since ${}\Lambda_{1}{}$ is symmetric and positive definite: 
$$
\frac{1}{\epsilon}a^T\Lambda_{1}a+\epsilon b^T\Lambda^{-1}b+2a^Tb\geq 0
$$
Moving the last term to the right and dividing by ${}2{}$:
$$
\frac{1}{2\epsilon}a^T\Lambda_{1}a+\frac{\epsilon}{2}b^T\Lambda^{-1}b\geq-a^Tb\quad\quad[-]
$$

Since this works for arbitrary epsilon and Lambda_1, we can choose them are our convenience and obtain useful results, like:
$$
-a^Tb\leq \frac{1}{4}a^Ta+b^Tb
$$