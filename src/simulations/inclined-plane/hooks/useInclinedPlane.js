// src/simulations/inclined-plane/hooks/useInclinedPlane.js
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
  const [isRunning, setIsRunning] = useState(true);
  const [position, setPosition] = useState({ x: 200, y: 200 });
  const [velocity, setVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(0);

  // Initialisation de Matter.js
  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    
    const world = engine.world;
    world.gravity.y = 0.5; // Gravité standard

    // Créer le plan incliné (statique)
    const angleRad = (angle * Math.PI) / 180;
    const planeLength = 400;
    const planeX = 200 + planeLength * Math.cos(angleRad) / 2;
    const planeY = 300 - planeLength * Math.sin(angleRad) / 2;
    
    const plane = Matter.Bodies.rectangle(planeX, planeY, planeLength, 10, {
      isStatic: true,
      angle: angleRad,
      restitution: 0.1,
      friction: friction,
      label: 'plane',
      render: {
        fillStyle: '#94a3b8',
        strokeStyle: '#475569',
        lineWidth: 2
      }
    });

    // Créer le bloc (mobile)
    const block = Matter.Bodies.rectangle(150, 250, 40, 40, {
      restitution: 0.1,
      friction: friction,
      density: 0.001 * mass,
      mass: mass,
      label: 'block',
      render: {
        fillStyle: '#f59e0b',
        strokeStyle: '#d97706',
        lineWidth: 2
      }
    });

    Matter.World.add(world, [plane, block]);
    
    planeRef.current = plane;
    blockRef.current = block;

    // Position initiale du bloc en haut du plan
    const startX = 150;
    const startY = 250;
    Matter.Body.setPosition(block, { x: startX, y: startY });
    Matter.Body.setVelocity(block, { x: 0, y: 0 });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    return () => {
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  // Mise à jour de l'angle
  useEffect(() => {
    if (planeRef.current) {
      const angleRad = (angle * Math.PI) / 180;
      Matter.Body.setAngle(planeRef.current, angleRad);
      
      // Recalculer la position du plan
      const planeLength = 400;
      const planeX = 200 + planeLength * Math.cos(angleRad) / 2;
      const planeY = 300 - planeLength * Math.sin(angleRad) / 2;
      Matter.Body.setPosition(planeRef.current, { x: planeX, y: planeY });
    }
  }, [angle]);

  // Mise à jour de la friction
  useEffect(() => {
    if (planeRef.current && blockRef.current) {
      planeRef.current.friction = friction;
      blockRef.current.friction = friction;
    }
  }, [friction]);

  // Mise à jour de la masse
  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.mass = mass;
      blockRef.current.inverseMass = 1 / mass;
    }
  }, [mass]);

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

  // Récupérer la position et calculer la vitesse
  const getBlockPosition = useCallback(() => {
    if (!blockRef.current) return { x: 150, y: 250 };
    
    const pos = blockRef.current.position;
    const vel = blockRef.current.velocity;
    
    // Calculer la vitesse le long du plan
    const angleRad = (angle * Math.PI) / 180;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
    const direction = Math.sign(vel.x * Math.cos(angleRad) + vel.y * Math.sin(angleRad));
    
    setVelocity(speed * direction);
    
    // Calculer l'accélération théorique: a = g(sin θ - μ cos θ)
    const g = 0.5;
    const theoreticalAccel = g * (Math.sin(angleRad) - friction * Math.cos(angleRad));
    setAcceleration(theoreticalAccel);
    
    return pos;
  }, [angle, friction]);

  // Réinitialiser la position
  const resetPosition = useCallback(() => {
    if (blockRef.current) {
      Matter.Body.setPosition(blockRef.current, { x: 150, y: 250 });
      Matter.Body.setVelocity(blockRef.current, { x: 0, y: 0 });
    }
  }, []);

  return {
    angle, setAngle,
    friction, setFriction,
    mass, setMass,
    isRunning, setIsRunning,
    position,
    velocity,
    acceleration,
    getBlockPosition,
    resetPosition,
  };
};

export default useInclinedPlane;