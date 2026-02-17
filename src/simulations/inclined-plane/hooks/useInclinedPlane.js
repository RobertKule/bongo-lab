import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const useInclinedPlane = (initialAngle = 30, initialFriction = 0.2, initialMass = 1) => {
  const engineRef = useRef(null);
  const blockRef = useRef(null);
  const planeRef = useRef(null);
  const runnerRef = useRef(null);
  
  const [angle, setAngle] = useState(initialAngle);
  const [friction, setFriction] = useState(initialFriction);
  const [mass, setMass] = useState(initialMass);
  const [isRunning, setIsRunning] = useState(false);
  const [canSlide, setCanSlide] = useState(true);

  const planeLength = 600;
  const startX = 150;
  const startY = 150;
  const blockSize = 40;
  const planeThickness = 10;

  // Calculer si le bloc peut glisser selon la physique
  const checkIfCanSlide = useCallback((angleDeg, frictionVal) => {
    const rad = (angleDeg * Math.PI) / 180;
    // Formule: tan(θ) > μ
    return Math.abs(Math.tan(rad)) > frictionVal;
  }, []);

  // Positionner le bloc sur la surface
  const getAlignedPosition = useCallback((angleDeg, distance = 0) => {
    const rad = (angleDeg * Math.PI) / 180;
    const xBase = startX + distance * Math.cos(rad);
    const yBase = startY + distance * Math.sin(rad);
    
    const offset = (blockSize / 2) + (planeThickness / 2);
    return {
      x: xBase - offset * Math.sin(rad),
      y: yBase + offset * Math.cos(rad)
    };
  }, []);

  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 1.5;

    const rad = (angle * Math.PI) / 180;
    const pos = getAlignedPosition(angle, 0);

    const plane = Matter.Bodies.rectangle(
      startX + (planeLength / 2) * Math.cos(rad),
      startY + (planeLength / 2) * Math.sin(rad),
      planeLength, planeThickness,
      { isStatic: true, angle: rad, friction: friction }
    );

    const block = Matter.Bodies.rectangle(pos.x, pos.y, blockSize, blockSize, {
      friction: friction,
      frictionStatic: friction,
      mass: mass,
      restitution: 0,
      inertia: Infinity
    });

    Matter.World.add(engine.world, [plane, block]);
    planeRef.current = plane;
    blockRef.current = block;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // Mettre à jour canSlide
    setCanSlide(checkIfCanSlide(angle, friction));

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  // Sync en temps réel
  useEffect(() => {
    if (!isRunning && blockRef.current && planeRef.current) {
      const rad = (angle * Math.PI) / 180;
      const pos = getAlignedPosition(angle, 0);

      Matter.Body.setAngle(planeRef.current, rad);
      Matter.Body.setPosition(planeRef.current, {
        x: startX + (planeLength / 2) * Math.cos(rad),
        y: startY + (planeLength / 2) * Math.sin(rad)
      });

      Matter.Body.setPosition(blockRef.current, pos);
      Matter.Body.setVelocity(blockRef.current, { x: 0, y: 0 });
      
      setCanSlide(checkIfCanSlide(angle, friction));
    }
  }, [angle, isRunning, friction, getAlignedPosition, checkIfCanSlide]);

  // Mise à jour friction
  useEffect(() => {
    if (blockRef.current && planeRef.current) {
      blockRef.current.friction = friction;
      blockRef.current.frictionStatic = friction;
      planeRef.current.friction = friction;
      setCanSlide(checkIfCanSlide(angle, friction));
    }
  }, [friction, angle, checkIfCanSlide]);

  // Gestion du Runner
  useEffect(() => {
    if (runnerRef.current && engineRef.current) {
      if (isRunning) {
        Matter.Runner.run(runnerRef.current, engineRef.current);
      } else {
        Matter.Runner.stop(runnerRef.current);
      }
    }
  }, [isRunning]);

  // Réinitialisation manuelle
  const resetPosition = useCallback(() => {
    if (blockRef.current && planeRef.current) {
      const pos = getAlignedPosition(angle, 0);
      Matter.Body.setPosition(blockRef.current, pos);
      Matter.Body.setVelocity(blockRef.current, { x: 0, y: 0 });
      setIsRunning(false);
    }
  }, [angle, getAlignedPosition]);

  return {
    angle, setAngle,
    friction, setFriction,
    mass, setMass,
    isRunning, setIsRunning,
    canSlide, // ← IMPORTANT: canSlide est retourné
    resetPosition,
    getBlockPosition: () => {
      if (!blockRef.current) return { x: startX, y: startY, angle: 0 };
      const pos = blockRef.current.position;
      
      // Auto-reset
      const rad = (angle * Math.PI) / 180;
      const dx = pos.x - startX;
      const dy = pos.y - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > planeLength) {
        const resetPos = getAlignedPosition(angle, 0);
        Matter.Body.setPosition(blockRef.current, resetPos);
        Matter.Body.setVelocity(blockRef.current, { x: 0, y: 0 });
        return { x: resetPos.x, y: resetPos.y, angle: 0 };
      }

      return { x: pos.x, y: pos.y, angle: 0 };
    },
    planeData: { startX, startY, planeLength, blockSize, planeThickness }
  };
};

export default useInclinedPlane;