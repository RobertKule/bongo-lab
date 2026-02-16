// src/simulations/pendulum/hooks/usePendulum.js
import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const usePendulum = (initialLength = 200, initialAngle = 45, initialGravity = 1) => {
  const engineRef = useRef(null);
  const pendulumRef = useRef(null);
  const constraintRef = useRef(null);
  const runnerRef = useRef(null);
  
  const [length, setLength] = useState(initialLength);
  const [gravity, setGravity] = useState(initialGravity);
  const [isRunning, setIsRunning] = useState(true);
  const [angle, setAngle] = useState(initialAngle);
  const [targetAngle, setTargetAngle] = useState(initialAngle);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 500 });

  // Initialisation de Matter.js
  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    
    const world = engine.world;
    world.gravity.y = gravity;

    // Point d'ancrage positionné dynamiquement selon le canvas
    const anchorX = canvasDimensions.width / 2;
    const anchorY = Math.min(80, canvasDimensions.height * 0.15);
    
    const anchor = Matter.Bodies.circle(anchorX, anchorY, 5, {
      isStatic: true,
      restitution: 0,
      label: 'anchor'
    });

    // Masse du pendule
    const bob = Matter.Bodies.circle(anchorX, anchorY + length, 20, {
      restitution: 0.1,
      friction: 0.001,
      density: 0.1,
      label: 'bob'
    });

    // Corde (contrainte)
    const constraint = Matter.Constraint.create({
      pointA: { x: anchor.position.x, y: anchor.position.y },
      bodyB: bob,
      length: length,
      stiffness: 0.99,
      damping: 0.002
    });

    Matter.World.add(world, [anchor, bob, constraint]);
    
    pendulumRef.current = bob;
    constraintRef.current = constraint;

    // Position initiale
    const angleRad = (initialAngle * Math.PI) / 180;
    const x = anchor.position.x + length * Math.sin(angleRad);
    const y = anchor.position.y + length * Math.cos(angleRad);
    Matter.Body.setPosition(bob, { x, y });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    return () => {
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [canvasDimensions]); // ← Recalcul quand le canvas change

  // Mise à jour longueur
  useEffect(() => {
    if (constraintRef.current) constraintRef.current.length = length;
  }, [length]);

  // Mise à jour gravité
  useEffect(() => {
    if (engineRef.current) engineRef.current.world.gravity.y = gravity;
  }, [gravity]);

  // Pause/Reprise
  useEffect(() => {
    if (runnerRef.current && engineRef.current) {
      if (isRunning) {
        Matter.Runner.run(runnerRef.current, engineRef.current);
      } else {
        Matter.Runner.stop(runnerRef.current);
      }
    }
  }, [isRunning]);

  // Calcul précis de l'angle
  const updateAngleFromPosition = useCallback(() => {
    if (!pendulumRef.current || !constraintRef.current) return;
    
    const anchor = constraintRef.current.pointA;
    const bobPos = pendulumRef.current.position;
    
    const dx = bobPos.x - anchor.x;
    const dy = bobPos.y - anchor.y;
    let angleRad = Math.atan2(dx, dy);
    let angleDeg = (angleRad * 180) / Math.PI;
    
    if (angleDeg > 180) angleDeg -= 360;
    if (angleDeg < -180) angleDeg += 360;
    
    setAngle(Math.round(angleDeg * 10) / 10);
  }, []);

  // Changer l'angle
  const setNewAngle = useCallback((newAngleDegrees) => {
    if (!pendulumRef.current || !constraintRef.current) return;
    
    const anchor = constraintRef.current.pointA;
    const angleRad = (newAngleDegrees * Math.PI) / 180;
    
    const x = anchor.x + length * Math.sin(angleRad);
    const y = anchor.y + length * Math.cos(angleRad);
    
    Matter.Body.setPosition(pendulumRef.current, { x, y });
    Matter.Body.setVelocity(pendulumRef.current, { x: 0, y: 0 });
    
    setTargetAngle(newAngleDegrees);
    setAngle(newAngleDegrees);
  }, [length]);

  // Récupérer la position
  const getBobPosition = useCallback(() => {
    if (!pendulumRef.current) {
      // Position par défaut centrée
      return { 
        x: canvasDimensions.width / 2, 
        y: canvasDimensions.height * 0.15 + length 
      };
    }
    updateAngleFromPosition();
    return pendulumRef.current.position;
  }, [length, updateAngleFromPosition, canvasDimensions]);

  // Fonction pour mettre à jour les dimensions du canvas
  const updateCanvasDimensions = useCallback((width, height) => {
    setCanvasDimensions({ width, height });
    
    // Si le pendule existe, on le repositionne
    if (pendulumRef.current && constraintRef.current) {
      const anchor = constraintRef.current.pointA;
      const newAnchorX = width / 2;
      const newAnchorY = Math.min(80, height * 0.15);
      
      // Déplacer l'ancrage
      Matter.Body.setPosition(anchor, { x: newAnchorX, y: newAnchorY });
      
      // Recalculer la position de la boule
      const angleRad = (angle * Math.PI) / 180;
      const x = newAnchorX + length * Math.sin(angleRad);
      const y = newAnchorY + length * Math.cos(angleRad);
      Matter.Body.setPosition(pendulumRef.current, { x, y });
    }
  }, [length, angle]);

  return {
    length, setLength,
    gravity, setGravity,
    isRunning, setIsRunning,
    angle, targetAngle, setNewAngle,
    getBobPosition,
    updateCanvasDimensions // ← Nouvelle fonction
  };
};

export default usePendulum;