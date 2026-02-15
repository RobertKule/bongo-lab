# Simulation Specifications — Bongo-Lab

Each simulation targets the physics curriculum for secondary schools in the DRC (programme national). All labels, descriptions, and units must be in French.

---

## 1. Pendule Simple (Simple Pendulum)

**Subject**: Mécanique — Oscillations

**Physics**:
- Period: `T = 2π √(L / g)`
- Small angle approximation (θ < 15°)
- Variables: length (L), initial angle (θ₀), gravity (g)

**Interactions**:
- Drag pendulum bob to set initial angle
- Slider for string length (0.1m to 3m)
- Play/Pause/Reset controls
- Real-time display of period, angle, and velocity

**Localization**:
- Longueur (m), Angle initial (°), Période (s), Vitesse (m/s)

---

## 2. Plan Incliné (Inclined Plane)

**Subject**: Mécanique — Forces et mouvement

**Physics**:
- Acceleration: `a = g (sin θ - μ cos θ)`
- Forces: weight (mg), normal (N), friction (f)
- Variables: angle (θ), friction coefficient (μ), mass (m)

**Interactions**:
- Drag to adjust plane angle (0° to 60°)
- Slider for friction coefficient (0 to 1)
- Slider for mass (0.1kg to 10kg)
- Force vector visualization
- Play/Pause/Reset controls

**Localization**:
- Angle (°), Coefficient de frottement, Masse (kg), Accélération (m/s²)

---

## 3. Circuit Électrique (Electric Circuit)

**Subject**: Électricité — Loi d'Ohm

**Physics**:
- Ohm's law: `V = I × R`
- Series: `R_total = R₁ + R₂ + ...`
- Parallel: `1/R_total = 1/R₁ + 1/R₂ + ...`

**Interactions**:
- Drag and drop circuit components (battery, resistors, lamp, switch)
- Toggle between series and parallel configurations
- Adjust voltage and resistance values
- Real-time current and voltage readings

**Localization**:
- Tension (V), Courant (A), Résistance (Ω), Interrupteur, Pile

---

## 4. Réflexion de la Lumière (Light Reflection)

**Subject**: Optique — Réflexion et réfraction

**Physics**:
- Law of reflection: angle of incidence = angle of reflection
- Snell's law: `n₁ sin θ₁ = n₂ sin θ₂`
- Total internal reflection when `sin θ > n₂/n₁`

**Interactions**:
- Drag light ray to adjust incidence angle
- Toggle between flat mirror, concave mirror, convex mirror
- Toggle refraction mode with adjustable refractive indices
- Normal line and angle annotations displayed

**Localization**:
- Angle d'incidence (°), Angle de réflexion (°), Miroir plan, Miroir concave, Miroir convexe, Indice de réfraction

---

## 5. Levier Mécanique (Mechanical Lever)

**Subject**: Mécanique — Équilibre et moments

**Physics**:
- Lever principle: `F₁ × d₁ = F₂ × d₂`
- Mechanical advantage: `MA = d₁ / d₂`
- Three classes of levers

**Interactions**:
- Drag fulcrum position along the beam
- Adjust force and load values with sliders
- Visual indication of balance/imbalance
- Switch between lever classes (1st, 2nd, 3rd)

**Localization**:
- Force d'effort (N), Force de charge (N), Bras d'effort (m), Bras de charge (m), Point d'appui, Avantage mécanique

---

## Implementation Notes

- All simulations use **Konva.js** (via react-konva) for 2D canvas rendering
- **Matter.js** provides physics calculations where real-time simulation is needed (pendulum, inclined plane, lever)
- Target frame rate: 30 FPS on low-end devices
- Canvas size adapts to screen width (mobile-first)
- All numeric values displayed with appropriate SI units in French
