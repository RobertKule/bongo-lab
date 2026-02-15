# GitHub Issues — Ready to Create

Copy each section below as a separate GitHub issue.

---

## Issue 1: Implement Pendulum Simulation (Pendule Simple)

**Labels**: `feature`, `simulation`, `priority:high`

### Description
Implement the Simple Pendulum (Pendule Simple) interactive simulation using Konva.js for rendering and Matter.js for physics.

### Acceptance Criteria
- [ ] Pendulum swings realistically using the formula `T = 2π √(L/g)`
- [ ] User can drag the bob to set initial angle
- [ ] Slider to adjust string length (0.1m to 3m)
- [ ] Play, Pause, and Reset buttons functional
- [ ] Real-time display of: period (s), current angle (°), angular velocity
- [ ] All labels in French (Longueur, Angle initial, Période, Vitesse)
- [ ] Responsive canvas that fills available width
- [ ] Smooth animation at 30+ FPS on low-end devices

### Technical Requirements
- Use `react-konva` for canvas rendering (Line for string, Circle for bob)
- Physics calculations in `src/utils/physics.js` (pendulumPeriod function exists)
- Component location: `src/simulations/Pendulum.jsx`
- Mobile-first: controls below canvas, touch-friendly sliders

### UI Reference
See [docs/UI_MOCKUPS.md](../docs/UI_MOCKUPS.md) and [docs/SIMULATIONS.md](../docs/SIMULATIONS.md)

### Estimated Time
1 day

---

## Issue 2: Implement Inclined Plane Simulation (Plan Incliné)

**Labels**: `feature`, `simulation`, `priority:high`

### Description
Implement the Inclined Plane (Plan Incliné) interactive simulation showing an object sliding down a slope with configurable angle and friction.

### Acceptance Criteria
- [ ] Object slides down plane with realistic acceleration: `a = g(sin θ - μ cos θ)`
- [ ] Force vector arrows displayed (weight, normal, friction)
- [ ] Slider for plane angle (0° to 60°)
- [ ] Slider for friction coefficient (0 to 1)
- [ ] Slider for object mass (0.1kg to 10kg)
- [ ] Play, Pause, and Reset buttons functional
- [ ] Real-time display of acceleration, velocity, and forces
- [ ] All labels in French (Angle, Coefficient de frottement, Masse, Accélération)

### Technical Requirements
- Use `react-konva` for rendering (plane, object, force vectors)
- Use Matter.js for physics simulation
- Physics helpers in `src/utils/physics.js` (inclinedPlaneAcceleration exists)
- Component location: `src/simulations/InclinedPlane.jsx`

### UI Reference
See [docs/UI_MOCKUPS.md](../docs/UI_MOCKUPS.md) and [docs/SIMULATIONS.md](../docs/SIMULATIONS.md)

### Estimated Time
1 day

---

## Issue 3: Implement Electric Circuit Simulation (Circuit Électrique)

**Labels**: `feature`, `simulation`, `priority:medium`

### Description
Implement the Electric Circuit (Circuit Électrique) simulation where users can build simple series and parallel circuits and observe Ohm's law in action.

### Acceptance Criteria
- [ ] Drag-and-drop circuit components: battery, resistors, lamp, switch
- [ ] Toggle between series and parallel circuit configurations
- [ ] Adjustable voltage source (1V to 24V)
- [ ] Adjustable resistance values per resistor
- [ ] Real-time current calculation using Ohm's law (V = IR)
- [ ] Visual feedback: lamp brightness changes with current
- [ ] Switch toggles circuit on/off
- [ ] All labels in French (Tension, Courant, Résistance, Interrupteur, Pile)

### Technical Requirements
- Use `react-konva` for circuit component rendering
- Physics helpers in `src/utils/physics.js` (seriesResistance, parallelResistance exist)
- Component location: `src/simulations/Circuit.jsx`
- No Matter.js needed — purely electrical calculations

### UI Reference
See [docs/UI_MOCKUPS.md](../docs/UI_MOCKUPS.md) and [docs/SIMULATIONS.md](../docs/SIMULATIONS.md)

### Estimated Time
1 day

---

## Issue 4: Implement Optics Simulation (Réflexion de la Lumière)

**Labels**: `feature`, `simulation`, `priority:medium`

### Description
Implement the Light Reflection (Réflexion de la Lumière) simulation demonstrating reflection and refraction laws with interactive ray tracing.

### Acceptance Criteria
- [ ] Light ray reflects off a mirror surface following the law of reflection
- [ ] Angle of incidence = Angle of reflection, visually annotated
- [ ] Drag light ray to adjust incidence angle
- [ ] Toggle mirror types: flat (plan), concave, convex
- [ ] Optional refraction mode with Snell's law: `n₁ sin θ₁ = n₂ sin θ₂`
- [ ] Adjustable refractive indices for two media
- [ ] Total internal reflection visualized when applicable
- [ ] Normal line displayed at point of incidence
- [ ] All labels in French (Angle d'incidence, Angle de réflexion, Miroir plan, Indice de réfraction)

### Technical Requirements
- Use `react-konva` for ray drawing and mirror rendering
- Physics helpers in `src/utils/physics.js` (reflectionAngle, refractionAngle exist)
- Component location: `src/simulations/Optics.jsx`
- Geometric calculations only — no Matter.js needed

### UI Reference
See [docs/UI_MOCKUPS.md](../docs/UI_MOCKUPS.md) and [docs/SIMULATIONS.md](../docs/SIMULATIONS.md)

### Estimated Time
1 day

---

## Issue 5: Implement Lever Simulation (Levier Mécanique)

**Labels**: `feature`, `simulation`, `priority:medium`

### Description
Implement the Mechanical Lever (Levier Mécanique) simulation demonstrating the lever principle and equilibrium of moments.

### Acceptance Criteria
- [ ] Visual beam balanced on a draggable fulcrum
- [ ] Lever principle: `F₁ × d₁ = F₂ × d₂`
- [ ] Sliders for effort force and load force
- [ ] Draggable fulcrum to change arm lengths
- [ ] Visual tilt indicating balance or imbalance
- [ ] Display mechanical advantage: `MA = d₁ / d₂`
- [ ] Toggle between lever classes (1st, 2nd, 3rd class)
- [ ] All labels in French (Force d'effort, Force de charge, Bras d'effort, Point d'appui, Avantage mécanique)

### Technical Requirements
- Use `react-konva` for beam, fulcrum, and weight rendering
- Use Matter.js for realistic tilting physics
- Physics helpers in `src/utils/physics.js` (leverLoad exists)
- Component location: `src/simulations/Lever.jsx`

### UI Reference
See [docs/UI_MOCKUPS.md](../docs/UI_MOCKUPS.md) and [docs/SIMULATIONS.md](../docs/SIMULATIONS.md)

### Estimated Time
1 day
