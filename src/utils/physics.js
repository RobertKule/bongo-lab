/**
 * Physics helper functions for Bongo-Lab simulations.
 * @module physics
 */

/** Gravitational acceleration (m/s²) */
export const GRAVITY = 9.81;

/**
 * Calculate the period of a simple pendulum.
 * @param {number} length - Length of the pendulum in meters
 * @returns {number} Period in seconds
 */
export function pendulumPeriod(length) {
  return 2 * Math.PI * Math.sqrt(length / GRAVITY);
}

/**
 * Calculate the acceleration on an inclined plane.
 * @param {number} angle - Angle of inclination in degrees
 * @param {number} frictionCoeff - Coefficient of kinetic friction
 * @returns {number} Acceleration in m/s²
 */
export function inclinedPlaneAcceleration(angle, frictionCoeff = 0) {
  const rad = (angle * Math.PI) / 180;
  return GRAVITY * (Math.sin(rad) - frictionCoeff * Math.cos(rad));
}

/**
 * Calculate equivalent resistance for resistors in series.
 * @param {number[]} resistances - Array of resistance values in ohms
 * @returns {number} Total resistance in ohms
 */
export function seriesResistance(resistances) {
  return resistances.reduce((sum, r) => sum + r, 0);
}

/**
 * Calculate equivalent resistance for resistors in parallel.
 * @param {number[]} resistances - Array of resistance values in ohms
 * @returns {number} Total resistance in ohms
 */
export function parallelResistance(resistances) {
  const inverseSum = resistances.reduce((sum, r) => sum + 1 / r, 0);
  return 1 / inverseSum;
}

/**
 * Calculate the angle of reflection (equal to angle of incidence).
 * @param {number} incidenceAngle - Angle of incidence in degrees
 * @returns {number} Angle of reflection in degrees
 */
export function reflectionAngle(incidenceAngle) {
  return incidenceAngle;
}

/**
 * Calculate the refraction angle using Snell's law.
 * @param {number} incidenceAngle - Angle of incidence in degrees
 * @param {number} n1 - Refractive index of medium 1
 * @param {number} n2 - Refractive index of medium 2
 * @returns {number} Angle of refraction in degrees
 */
export function refractionAngle(incidenceAngle, n1, n2) {
  const rad = (incidenceAngle * Math.PI) / 180;
  const sinRefraction = (n1 * Math.sin(rad)) / n2;
  if (Math.abs(sinRefraction) > 1) return null; // Total internal reflection
  return (Math.asin(sinRefraction) * 180) / Math.PI;
}

/**
 * Calculate lever equilibrium: F1 * d1 = F2 * d2.
 * @param {number} force - Applied force in Newtons
 * @param {number} effortArm - Distance from fulcrum to effort in meters
 * @param {number} loadArm - Distance from fulcrum to load in meters
 * @returns {number} Load force in Newtons
 */
export function leverLoad(force, effortArm, loadArm) {
  return (force * effortArm) / loadArm;
}
