
*Last updated: 2026-10-29*

---

## 1. Identity

- **Title:** Passivity-Based Control with Structured Learning and a Robust Action for Euler-Lagrange Systems
- **Program:** Master's thesis, Departamento de Control Automático, CINVESTAV-IPN
- **Student:** Jose Aaron Barbosa Mercado
- **Advisors:**
  - Dr. Wen Yu Liu (neural networks)
  - Dr. Fernando Castaños Luna (passivity / sliding modes)
- **Companion documents in this Project:** thesis proposal, progress presentation (Beamer), notes files, articles of interest

---

## 2. Core idea

The manipulator is an Euler–Lagrange system with uncertain dynamics. A **nominal passivity-based controller (PBC)** is designed on the nominal model. A **structured learning module** (DeLaN-style) learns the residual dynamics while preserving Lagrangian structure and passivity properties. A **robust action** (a first-order SMC) handles whatever residual the learning leaves behind.

### Architecture

| Layer               | Role                                           | Structure                                                                                                                                                                                      |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nominal PBC         | Stabilize the nominal E–L model                | Passivity / energy shaping                                                                                                                                                                     |
| Structured learning | Learn residual ${}\Delta_{e-l}+\Delta_{dis}{}$ | ${}\hat{M}=\hat{L}\hat{L}^T+\epsilon I{}$ (positive definite by construction); ${}\hat{C}{}$ from Christoffel symbols of ${}\hat{M}{}$; gravity as ${}\nabla\hat{U}{}$; friction ${}\hat{D}{}$ |
| Robust action       | Reject the remaining bounded residual          | First-Order SMC (with boundary layer)                                                                                                                                                          |

---

## 3. Contribution and target theorem

**Contribution: passivity-budget theorem.**

> The learning residual is treated as a block with a **passivity shortage** ${}\nu{}$, certified from the network's Lipschitz constant via spectral normalization. The nominal PBC provides a **passivity surplus** ${}\lambda_{min}(K_{D}){}$, and the boundary-layer SMC adds **effective damping** inside the layer. If ${}\lambda_{min}(K_{D})+(SMC\;damping)>\lambda_{max}(sym\;N){}$,on the operating region (${}N{}$ the matrix shortage), the closed loop PBC + learning + SMC stays (semi-)passive and the tracking error is UUB, with a radius set by the residual offset ${}\epsilon_{0}{}$ and the e-mod ball. The budget also gives a rule for lowering the gains as learning improves.

**Why this is the contribution:** a plain Lyapunov proof, or a standard MLP with the same adaptation law, would also give stability. The contribution is the type of guarantee: a certified passivity budget across the three blocks, not stability alone.

**Role of DeLaN:** it is the offline prior, not what ensures stability. A good ${}W_{0}{}$ shrinks ${}v{}$ and ${}||W^*-W_{0}||{}$ (e-mod leaks toward ${}W_{0}{}$), so the e-mod ball shrinks too. Claim smaller ${}\epsilon{}$ only for residuals that are mostly E–L plus dissipative friction.

**Caveat:** ${}\epsilon{}$ contains the true ${}\tilde{C}\dot{q}_{r}{}$ term (quadratic in velocity), so the sector bound and the theorem are regional, not global.

**Supporting pieces:**
- Per-block lemmas: plant OSP (${}-\tilde{\Delta}\to s{}$, index ${}\lambda_{min}(K_{D}){}$); adaptation lossless, semi-passive with e-mod leaking toward W₀; boundary-layer SMC as a static sector block (${}s^T\mbox{sat}\left( s/\phi \right)\geq 0{}$)
- Interconnection theorem, then composite storage (${}\frac{1}{2}s^TM(q)s+\frac{1}{2}\mbox{tr}(\tilde{W}^TK^{-1}\tilde{W}){}$) for the UUB / boundary-layer radius
- Lipschitz certification of the network via spectral normalization (Neural Lander, Shi et al. 2019) for the network half of ${}\nu{}$; plant half of ${}\nu{}$ from physics
- Filippov solutions only needed for the ideal (discontinuous) SMC; the boundary-layer version is continuous
- Future work (STA): the same Lipschitz certificate gives ${}||\dot{\epsilon}||\leq L||\dot{x}||{}$, the derivative bound variable-gain STA needs (Gonzalez et al. 2012)

**Open in the proof:** 

- **Done:**
	- Nominal dynamics derivation for a 2-DOF planar manipulator
	- Nominal PBC controller stability proof (Slotine-Li)
	- Nominal PBC controller output strictly passive (${}-\tilde{\Delta}\to s{}$) with passivity index (${}\lambda_{min}(K_{D}){}$)
	- Nominal PBC controller baseline ball radius (${}\rho_{1}{}$)
	- Composite Lyapunov function for PBC + learning
	- Output-layer-only gradient adaptation law
	- Output strictly passive mapping of the learning law (${}\epsilon\to s{}$) with passivity index (${}\lambda_{min}(K_{D}){}$)
	- E-modification of the learning law with convergence radius
	- Semi-passivity of learning law with e-modification
- **Sketched:**
	- Passivity budget, step 1: problem statement (Sections/Passivity budget/1. Problem statement.md)
	- Passivity budget, step 2: passivity shortage ν (Sections/Passivity budget/2. Passivity shortage.md)
	- Time-derivative up to the coupling of ${}M^{-1}(q){}$ in ${}\dot{s}{}$ (avoided with a static SMC on s)
- **Missing**:
	- Passivity budget, step 3: effective damping of the SMC inside the boundary layer
	- Passivity budget, step 4: the budget inequality
	- Passivity budget, step 5: theorem statement and proof (passivity of the whole system)
	- Convergence radius of the feasible full controller (boundary-layer of the SMC)
	- Full controller improves tracking performance (simulation)

---

## 4. Current status

### Done

- Notes files written:
  - Introduction to passivity-based control
  - A new feedback method for dynamic control of manipulators
  - Adaptive motion control of rigid robots (A tutorial)
  - Port Hamiltonian systems and IDA-PBC
  - Sliding surface on an E–L system
  - Solutions in the Filippov sense
  - Deep Lagrangian Networks
  - Integral momentum method for acceleration free regression
  - L-learning
  - Spectral normalization of NN
  - Comparison lemma
  - Young's inequality
  - Gaining span on the parametrization
  - Online learning law
  - Nominal dynamics
  - Passivity Based Controller Formulation
  - Composite Lyapunov function
  - Passivity budget
	  - Control definition
	  - Error dynamics
	  - Adaptation law derived from Lyapunov analysis
	  - E-modification leaking towards ${}W_{0}{}$
- MATLAB 2-DOF planar sandbox:
  - Symbolic ${}M(q){}$, ${}C(q,\dot{q}){}$, ${}g(q){}$, derived by hand (transformation matrices, COM Jacobians, Christoffel construction)
  - Converted to `matlabFunction` handles; simulated with `ode45`
  - Friction model: viscous + Coulomb + Stribeck, tanh-smoothed (raw `sign()` slowed the solver)
  - Nominal and mismatched-parameter cases, used to validate the baseline UUB residual radius
  - Online learning of the output-layer
  - Tracking performance under heavy mismatched-parameters with full learning and nominal PBC controller
- Progress presentation prepared for both advisors
- Scope settled with advisors (2026-10-28)

### In progress / remaining

- [ ] DeLaN offline training on the sandbox residual
- [ ] Spectral normalization in the DeLaN training, to certify the network half of ${}\nu{}$
- [ ] ${}W_{0}{}$ from offline training (optionally ridge refit on the frozen features)
- [ ] Robust action: implement first-order SMC with boundary layer
- [ ] Full closed-loop simulation: PBC + learning + robust action
- [ ] DeLaN vs MLP comparison on held-out trajectories

---

## 5. Decisions

### Settled

| Decision           | Choice                                                                                      | Notes                          |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------ |
| Nominal controller | Classic PBC with nominal M, C, g, F and damping injection                                   | IDA-PBC dropped                |
| Learning           | DeLaN trained offline; online output-layer adaptation with e-mod leaking toward ${}W_{0}{}$ |                                |
| Robust action      | First-order SMC with boundary layer                                                         | STA deferred to future work    |
| Contribution       | Passivity-budget theorem                                                                    | Port-passivity framing dropped |

### Open

| Decision | Options | Current leaning | Notes |
|---|---|---|---|
| Extension | None / human-robot interaction / under-actuated systems via IDA-PBC | Undecided | Scope risk for a master's thesis |
| Experimental validation | Simulation only / partial experiment / full experiment | Papers + simulation likely enough | See platform below |

---

## 6. Experimental platform

- 2-DOF robot with 4 links in a closed chain; motors on the outer links
- Moves in a horizontal plane, so gravity has little or no effect
- Sensors: encoder + tachometer
- Input: motor voltage, so actuator dynamics sit between the controller and the torque. The motors are connected to a gear reduction system then to the bars
- The lab has already run model-based controllers on it
- Unclear how much validation is feasible

---

## 7.  References

- **Key references**
	- Byrnes, Isidori & Willems (1991): passivity, feedback equivalence, global stabilization of minimum-phase nonlinear systems. *Passivity argument and condition for feedback equivalence and stabilization*
	- Lutter et al. (2019): Deep Lagrangian Networks (DeLaN). *Structured learning for Inertia matrix and Gravity vector*
	- Quan (2026): L-Learning: A Lyapunov-Based Approach Leveraging Lagrangian Mechanics for Efficient and Stable Robot Tracking. *Dynamics model learning and Lyapunov based controller*
	- Yu & Li (2001): Some New Results on System Identification with Dynamic Neural Networks. *Passivity approach to dynamic neural networks*
- **Support references**
	- Ortega & Spong (1989): Adaptive motion control of rigid robots: A tutorial. *Adaptive laws of inverse dynamics and passivity approach*
	- Guanya et al. (2019): Neural Lander, spectral normalization. *Lipschitz certificate of a network*
	- Ortega et al. (2002): IDA-PBC, port-Hamiltonian systems. *IDA-PBC, morphing controller and stabilization*
	- Gonzalez, Moreno & Fridman (2012): Variable Gain Super-Twisting Sliding Mode Control. *Variable gains of the STA to reduce them as learning improves and residual decreases*
	- Pantoja et al. (2025): Robust Neuro-sliding Mode Control for Position Servo-actuated Robot Manipulators. *Neuro-integral sliding mode controller*

---

## 8. Next steps (short horizon)

1. Finish the passivity budget derivation (steps 3 to 5): SMC effective damping, budget inequality, theorem and proof
2. Add spectral normalization to the offline DeLaN training and compute the certified ${}\nu{}$
3. Implement the first-order SMC with boundary layer in the sandbox
4. Full closed-loop simulation and DeLaN vs MLP comparison
5. Decide the experimental validation scope

---

## 9. Decision log

- 2026-10-20: Thesis work organized into a Project; one chat per focused task.
- 2026-10-28: Scope confirmed with advisors: classic PBC (M, C, g, F) with damping injection, DeLaN structured learning, first-order SMC with boundary layer.
- 2026-10-28: Contribution settled as the passivity-budget theorem. Port-passivity framing dropped: with online adaptation a standard MLP has the same semi-passivity, so DeLaN's advantage is the offline prior (${}W_{0}{}$, smaller ${}v{}$), made lasting by e-mod leaking toward ${}W_{0}{}$.
