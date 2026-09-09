2026-09-08

#Passivity 

[[ThesisProposal.pdf]]

The nominal feedforward compensations is:
$$\tau_{nominal}=\hat{M}(q)\ddot{q}_{r}+\hat{C}(q,\dot{q})\dot{q}_{r}+\hat{g}(q)-K_{d}s$$
Where $\hat{M},\hat{C},\hat{g}$ are obtained from mechanical modeling of the manipulator.
The position tracking error is defined as:
$$e=q-q_{d}$$The we define a virtual reference velocity signal:
$$\dot{q}_{r}=\dot{q}_{d}+\Lambda e$$
If the position error is zero, then the desired velocity it matched the desired velocity, if the joint lags behind the second terms becomes positive and the it indicated that it must move faster.
The filtered error is:
$$s=\dot{e}+\Lambda e$$
The dynamics are given by:
$$M(q)\ddot{q}+C(q,\dot{q})+g(q)+F(\dot{q})+\tau_{d}(t)=\tau$$
Since $\dot{q}=\dot{q}_r+$