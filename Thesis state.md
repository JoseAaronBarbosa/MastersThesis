
*Last updated: 2026-10-20*

---

## 1. Identity

- **Title:** Passivity-Based Control with Physics-Informed Structured Learning for Robot Manipulators
- **Program:** Master's thesis, Departamento de Control Automático, CINVESTAV-IPN
- **Student:** Jose Aaron Barbosa Mercado
- **Advisors:**
  - Dr. Wen Yu Liu (neural networks)
  - Dr. Fernando Castaños Luna (passivity / sliding modes)
- **Companion documents in this Project:** thesis proposal, progress presentation (Beamer), notes files, articles of interest

---

## 2. Core idea

The manipulator is an Euler–Lagrange system with uncertain dynamics. A **nominal passivity-based controller (PBC)** is designed on the nominal model. A **physics-informed structured learning module** (DeLaN-style) learns the residual dynamics while preserving Lagrangian structure and passivity properties. A **robust action** (super-twisting, or a simpler SMC) handles whatever residual the learning leaves behind.

### Architecture

| Layer | Role | Structure |
|---|---|---|
| Nominal PBC | Stabilize the nominal E–L model | Passivity / energy shaping; IDA-PBC under evaluation |
| Structured learning | Learn residual Δ_el + Δ_dis | M̂ = L̂L̂ᵀ + εI (positive definite by construction); Ĉ from Christoffel symbols of M̂; gravity as ∇Û; friction D̂ |
| Robust action | Reject the remaining bounded residual | STA (original plan) or simple SMC (current leaning) |

---

## 3. Target theorem

> Structured learning + PBC drives the tracking error to a ball whose radius shrinks as learning improves (UUB). The robust action then drives the error to zero. The passivity properties of the nominal controller are maintained with the learning.

**Supporting pieces:**
- Composite Lyapunov function (PBC energy + learning-error terms + sliding/STA terms)
- Solutions in the Filippov sense for the discontinuous robust action
- Lipschitz certification of the network via spectral normalization (idea taken from Neural Lander, Shi et al. 2019), used to bound the learned residual, not only to stabilize training
- Explicit relation between the residual bound and the UUB radius
- Passive mappings for each component of the control
- Stability is guaranteed via the passivity properties

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
	- Composite Lyapunov function for PBC + learning + STA
	- Time-derivative up to the coupling of ${}M^{-1}(q){}$ in ${}\dot{s}{}$
- **Missing**:
	- Passivity properties of the whole system
	- Finite time and asymptotic convergence of the full controller
	- Convergence radius of the feasible full controller (boundary-layer of the SMC)
	- Full controller improves tracking performance

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
- MATLAB 2-DOF planar sandbox:
  - Symbolic M(q), C(q,q̇), g(q), derived by hand (transformation matrices, COM Jacobians, Christoffel construction)
  - Converted to `matlabFunction` handles; simulated with `ode45`
  - Friction model: viscous + Coulomb + Stribeck, tanh-smoothed (raw `sign()` slowed the solver)
  - Nominal and mismatched-parameter cases, used to validate the baseline UUB residual radius
  - Online learning of the output-layer
  - Tracking performance under heavy mismatched-parameters with full learning and nominal PBC controller
- Progress presentation prepared for both advisors

### In progress / remaining

- [ ] DeLaN offline training on the sandbox residual
- [ ] Robust action: implement the chosen variant (SMC or STA)
- [ ] Full closed-loop simulation: PBC + learning + robust action

---

## 5. Open decisions

| Decision | Options | Current leaning | Notes |
|---|---|---|---|
| Keep the robust action? | Keep / defer / drop | Keep a simpler version | An advisor recommends dropping or deferring it because it gets complicated |
| Robust action type | Simple SMC vs STA | Simple SMC as a compromise | STA gives continuous control and finite-time convergence but a harder proof |
| Nominal controller formulation | Classic PBC vs IDA-PBC (port-Hamiltonian, Ortega et al. 2002) | Evaluating | Plan: design on nominal model, learn residual, SMC for remaining bounded error |
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

1. Add Integral momentum method DeLuca(2003).
2. Present the state of the thesis with bibliography research to advisors
3. Search tools to implement offline DeLaN training on the sandbox
4. Understand the passivity argument of the nominal PBC + learning controller (why do we need passivity and structured learning of the network)
5. Add simple SMC to the controller and derive stability proof

---

## 9. Decision log

- 2026-10-20: Thesis work organized into a Project; one chat per focused task.
