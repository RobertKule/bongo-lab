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
  const [canSlide, setCanSlide] = useState(true); // Indique si le bloc peut glisser

  // Paramètres fixes
  const planeLength = 450;
  const startX = 150;
  const startY = 150;
  const blockSize = 40;

  // Normaliser l'angle entre 0 et 360°
  const getNormalizedAngle = useCallback((angleDeg) => {
    let normalized = angleDeg % 360;
    if (normalized < 0) normalized += 360;
    return (normalized * Math.PI) / 180;
  }, []);

  // Vérifier si le départ est plus haut que l'arrivée
  const checkIfCanSlide = useCallback((angleDeg) => {
    const angleRad = getNormalizedAngle(angleDeg);
    const endY = startY + planeLength * Math.sin(angleRad);
    
    // Le bloc peut glisser SI la fin est PLUS BASSE que le départ
    // Donc si endY > startY (car Y augmente vers le bas)
    return endY > startY;
  }, [getNormalizedAngle]);

  // Calculer la position du bloc SUR le plan
  const getBlockPositionOnPlane = useCallback((angleDeg, distanceFromTop = 0) => {
    const angleRad = getNormalizedAngle(angleDeg);
    
    // Position sur la ligne du plan
    const lineX = startX + distanceFromTop * Math.cos(angleRad);
    const lineY = startY + distanceFromTop * Math.sin(angleRad);
    
    // Décalage perpendiculaire pour que le bloc repose SUR la ligne
    return {
      x: lineX - (blockSize / 2) * Math.sin(angleRad),
      y: lineY - (blockSize / 2) * Math.cos(angleRad)
    };
  }, [getNormalizedAngle]);

  // Initialisation de Matter.js
  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0.8;

    const angleRad = getNormalizedAngle(angle);
    const initialPos = getBlockPositionOnPlane(angle, 0);
    const canSlideNow = checkIfCanSlide(angle);
    setCanSlide(canSlideNow);

    // Plan incliné
    const plane = Matter.Bodies.rectangle(
      startX + (planeLength/2) * Math.cos(angleRad),
      startY + (planeLength/2) * Math.sin(angleRad),
      planeLength, 4, 
      { 
        isStatic: true, 
        angle: angleRad, 
        friction: friction,
        restitution: 0.1,
        label: 'plane'
      }
    );

    // Bloc - avec friction statique élevée si ne peut pas glisser
    const block = Matter.Bodies.rectangle(
      initialPos.x + blockSize/2, 
      initialPos.y + blockSize/2, 
      blockSize, blockSize, 
      {
        friction: canSlideNow ? friction : 1.0, // Friction max si pas de pente
        frictionStatic: canSlideNow ? friction : 1.0,
        mass: mass,
        restitution: 0.1,
        label: 'block',
        inertia: Infinity // Empêche la rotation
      }
    );

    Matter.World.add(engine.world, [plane, block]);
    planeRef.current = plane;
    blockRef.current = block;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  // Mise à jour de l'angle
  useEffect(() => {
    if (!isRunning && blockRef.current && planeRef.current) {
      const angleRad = getNormalizedAngle(angle);
      const initialPos = getBlockPositionOnPlane(angle, 0);
      const canSlideNow = checkIfCanSlide(angle);
      setCanSlide(canSlideNow);

      // Mettre à jour le plan
      Matter.Body.setAngle(planeRef.current, angleRad);
      Matter.Body.setPosition(planeRef.current, {
        x: startX + (planeLength/2) * Math.cos(angleRad),
        y: startY + (planeLength/2) * Math.sin(angleRad)
      });

      // Mettre à jour le bloc avec la friction appropriée
      blockRef.current.friction = canSlideNow ? friction : 1.0;
      blockRef.current.frictionStatic = canSlideNow ? friction : 1.0;
      
      Matter.Body.setAngle(blockRef.current, 0);
      Matter.Body.setPosition(blockRef.current, {
        x: initialPos.x + blockSize/2,
        y: initialPos.y + blockSize/2
      });
      Matter.Body.setVelocity(blockRef.current, { x: 0, y: 0 });
    }
  }, [angle, isRunning, friction, getNormalizedAngle, getBlockPositionOnPlane, checkIfCanSlide]);

  // Mise à jour de la friction
  useEffect(() => {
    if (blockRef.current && planeRef.current) {
      const appropriateFriction = canSlide ? friction : 1.0;
      blockRef.current.friction = appropriateFriction;
      blockRef.current.frictionStatic = appropriateFriction;
      planeRef.current.friction = friction;
    }
  }, [friction, canSlide]);

  // Mise à jour de la masse
  useEffect(() => {
    if (blockRef.current) {
      Matter.Body.setMass(blockRef.current, mass);
    }
  }, [mass]);

  // Gestion de la pause/reprise
  useEffect(() => {
    if (runnerRef.current && engineRef.current) {
      if (isRunning && canSlide) {
        Matter.Runner.run(runnerRef.current, engineRef.current);
      } else {
        Matter.Runner.stop(runnerRef.current);
      }
    }
  }, [isRunning, canSlide]);

  // Récupérer la position du bloc
  const getBlockPosition = useCallback(() => {
    if (!blockRef.current) return { x: startX, y: startY, angle: 0 };
    
    const pos = blockRef.current.position;
    const angleRad = getNormalizedAngle(angle);
    const canSlideNow = checkIfCanSlide(angle);
    
    // Calculer la distance parcourue
    const dx = pos.x - blockSize/2 - startX;
    const dy = pos.y - blockSize/2 - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Réinitialiser si arrivé en bas ET qu'on peut glisser
    if (canSlideNow && distance > planeLength - blockSize) {
      const initialPos = getBlockPositionOnPlane(angle, 0);
      Matter.Body.setPosition(blockRef.current, {
        x: initialPos.x + blockSize/2,
        y: initialPos.y + blockSize/2
      });
      Matter.Body.setVelocity(blockRef.current, { x: 0, y: 0 });
      return { 
        x: initialPos.x, 
        y: initialPos.y, 
        angle: 0 
      };
    }
    
    return { 
      x: pos.x - blockSize/2, 
      y: pos.y - blockSize/2, 
      angle: blockRef.current.angle 
    };
  }, [angle, getNormalizedAngle, getBlockPositionOnPlane, checkIfCanSlide]);

  // Réinitialisation manuelle
  const resetPosition = useCallback(() => {
    if (blockRef.current && planeRef.current) {
      const angleRad = getNormalizedAngle(angle);
      const initialPos = getBlockPositionOnPlane(angle, 0);
      const canSlideNow = checkIfCanSlide(angle);
      
      blockRef.current.friction = canSlideNow ? friction : 1.0;
      blockRef.current.frictionStatic = canSlideNow ? friction : 1.0;
      
      Matter.Body.setPosition(blockRef.current, {
        x: initialPos.x + blockSize/2,
        y: initialPos.y + blockSize/2
      });
      Matter.Body.setVelocity(blockRef.current, { x: 0, y: 0 });
      setIsRunning(false);
    }
  }, [angle, friction, getNormalizedAngle, getBlockPositionOnPlane, checkIfCanSlide]);

return {
  angle, setAngle,
  friction, setFriction,
  mass, setMass,
  isRunning, setIsRunning,
  canSlide, // ← Important !
  getBlockPosition,
  resetPosition,
  planeData: { startX, startY, planeLength, blockSize }
};
};

export default useInclinedPlane;