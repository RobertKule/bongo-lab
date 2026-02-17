import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';

const CircuitCanvas = ({ components, updateComponent, isRunning, isFullscreen, current, voltage }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [gridSize] = useState(40);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animation du courant
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 20);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: isFullscreen ? window.innerHeight - 120 : 500
        });
      }
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, [isFullscreen]);

  const snapToGrid = (pos) => Math.round(pos / gridSize) * gridSize;

  const handleDragMove = (e, id) => {
    if (isRunning) return;
    const node = e.target;
    updateComponent(id, { x: snapToGrid(node.x()), y: snapToGrid(node.y()) });
  };

  const handleDragEnd = (e, id) => {
    updateComponent(id, { 
      x: snapToGrid(e.target.x()), 
      y: snapToGrid(e.target.y()) 
    });
  };

  // Calculer si l'ampoule grille (courant > 0.5A)
  const getBulbIntensity = () => {
    if (!isRunning) return 0;
    if (current > 0.5) return 2; // Surchauffe
    if (current > 0.2) return 1; // Allumée
    return 0; // Éteinte
  };

  const drawComponent = (comp) => {
    const commonProps = {
      key: comp.id,
      x: comp.x,
      y: comp.y,
      draggable: !isRunning,
      onDragMove: (e) => handleDragMove(e, comp.id),
      onDragEnd: (e) => handleDragEnd(e, comp.id)
    };

    const bulbIntensity = getBulbIntensity();

    switch(comp.type) {
      case 'battery':
        return (
          <Group {...commonProps}>
            <Rect width={40} height={60} fill="#6B9E3C" stroke="#2D4A1A" strokeWidth={2} cornerRadius={5} shadowBlur={5} shadowColor="rgba(0,0,0,0.2)" />
            {/* Borne positive (rouge) */}
            <Circle x={30} y={10} radius={5} fill="#ef4444" stroke="#991b1b" strokeWidth={1} />
            <Line points={[30, 10, 40, 10]} stroke="#ef4444" strokeWidth={2} />
            {/* Borne négative (noire) */}
            <Circle x={10} y={50} radius={5} fill="#1e293b" stroke="#0f172a" strokeWidth={1} />
            <Line points={[10, 50, 0, 50]} stroke="#1e293b" strokeWidth={2} />
            <Text text="+" x={32} y={2} fill="white" fontSize={10} fontStyle="bold" />
            <Text text="-" x={8} y={42} fill="white" fontSize={10} fontStyle="bold" />
            <Text text={`${comp.value}V`} x={10} y={-15} fontSize={10} fill="#6B9E3C" fontStyle="bold" />
          </Group>
        );
      
      case 'resistor':
        return (
          <Group {...commonProps}>
            <Rect width={50} height={20} fill="#D4792C" stroke="#5D3A1A" strokeWidth={2} cornerRadius={3} shadowBlur={5} shadowColor="rgba(0,0,0,0.2)" />
            <Line points={[0, 10, 10, 10, 20, 0, 30, 20, 40, 10, 50, 10]} stroke="#5D3A1A" strokeWidth={2} />
            <Text text={`${comp.value}Ω`} x={10} y={-15} fontSize={10} fill="#D4792C" fontStyle="bold" />
          </Group>
        );
      
      case 'bulb':
        return (
          <Group {...commonProps}>
            {/* Ampoule */}
            <Circle radius={20} fill="#F2D974" stroke="#D4792C" strokeWidth={2} shadowBlur={5} shadowColor="rgba(0,0,0,0.2)" />
            
            {/* Filament */}
            <Line points={[-8, -8, 8, 8]} stroke="#5D3A1A" strokeWidth={2} />
            <Line points={[-8, 8, 8, -8]} stroke="#5D3A1A" strokeWidth={2} />
            
            {/* Intensité lumineuse */}
            {bulbIntensity === 1 && (
              <>
                <Circle radius={22} stroke="#FBBF24" strokeWidth={2} opacity={0.5} dash={[5, 5]} />
                <Circle radius={12} fill="#FBBF24" opacity={0.3} />
              </>
            )}
            
            {/* Surchauffe / grillée */}
            {bulbIntensity === 2 && (
              <>
                <Circle radius={22} stroke="#ef4444" strokeWidth={3} opacity={0.8} dash={[5, 5]} />
                <Text text="💥" x={-10} y={-10} fontSize={20} />
              </>
            )}
            
            {/* Culot */}
            <Rect x={-8} y={15} width={16} height={8} fill="#64748b" stroke="#475569" strokeWidth={1} cornerRadius={2} />
          </Group>
        );
      
      default:
        return null;
    }
  };

  // Dessiner les connexions avec deux fils (rouge = positif, noir = négatif)
  const drawWires = () => {
    const wires = [];
    
    for (let i = 0; i < components.length - 1; i++) {
      const from = components[i];
      const to = components[i + 1];
      
      // Points de connexion
      const fromPos = getConnectionPoint(from, 'out');
      const toPos = getConnectionPoint(to, 'in');
      
      if (!fromPos || !toPos) continue;
      
      // Fil positif (rouge)
      wires.push(
        <Line
          key={`wire-pos-${i}`}
          points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
          stroke="#ef4444"
          strokeWidth={3}
          lineCap="round"
          dash={isRunning ? [] : [5, 5]}
          opacity={0.8}
        />
      );
      
      // Fil négatif (noir) - légèrement décalé
      wires.push(
        <Line
          key={`wire-neg-${i}`}
          points={[fromPos.x + 5, fromPos.y + 5, toPos.x + 5, toPos.y + 5]}
          stroke="#1e293b"
          strokeWidth={3}
          lineCap="round"
          dash={isRunning ? [] : [5, 5]}
          opacity={0.8}
        />
      );
      
      // Animation du courant (électrons qui bougent)
      if (isRunning && current > 0.05) {
        const t = animationPhase / 20;
        const electronX = fromPos.x + (toPos.x - fromPos.x) * t;
        const electronY = fromPos.y + (toPos.y - fromPos.y) * t;
        
        wires.push(
          <Circle
            key={`electron-${i}`}
            x={electronX}
            y={electronY}
            radius={3}
            fill="#FBBF24"
            shadowBlur={10}
            shadowColor="#FBBF24"
          />
        );
        
        // Deuxième électron décalé
        const t2 = (animationPhase + 5) / 20;
        const electronX2 = fromPos.x + (toPos.x - fromPos.x) * (t2 > 1 ? t2 - 1 : t2);
        const electronY2 = fromPos.y + (toPos.y - fromPos.y) * (t2 > 1 ? t2 - 1 : t2);
        
        wires.push(
          <Circle
            key={`electron2-${i}`}
            x={electronX2}
            y={electronY2}
            radius={2}
            fill="#FBBF24"
            opacity={0.7}
          />
        );
      }
    }
    
    return wires;
  };

  // Obtenir les points de connexion des composants
  const getConnectionPoint = (comp, type) => {
    switch(comp.type) {
      case 'battery':
        return type === 'out' 
          ? { x: comp.x + 35, y: comp.y + 10 }  // Borne positive
          : { x: comp.x + 5, y: comp.y + 50 };  // Borne négative
      case 'resistor':
        return { x: comp.x + 45, y: comp.y + 10 };
      case 'bulb':
        return { x: comp.x, y: comp.y + 25 };
      default:
        return null;
    }
  };

  // Vérifier si le circuit est en court-circuit
  const isShortCircuit = () => {
    return current > 2.0; // Plus de 2A = court-circuit
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 dark:bg-slate-900/20 rounded-3xl overflow-hidden">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Grille */}
          {[...Array(Math.ceil(dimensions.width / gridSize))].map((_, i) => (
            [...Array(Math.ceil(dimensions.height / gridSize))].map((_, j) => (
              <Line
                key={`grid-${i}-${j}`}
                points={[i * gridSize, j * gridSize, i * gridSize + gridSize, j * gridSize]}
                stroke="#cbd5e1"
                strokeWidth={0.5}
                opacity={0.2}
              />
            ))
          ))}
          
          {/* Points de grille */}
          {[...Array(Math.ceil(dimensions.width / gridSize))].map((_, i) => (
            [...Array(Math.ceil(dimensions.height / gridSize))].map((_, j) => (
              <Circle
                key={`dot-${i}-${j}`}
                x={i * gridSize}
                y={j * gridSize}
                radius={1}
                fill="#94a3b8"
                opacity={0.3}
              />
            ))
          ))}

          {/* WARNING en cas de court-circuit */}
          {isShortCircuit() && (
            <Text
              x={dimensions.width / 2 - 100}
              y={50}
              text="⚠️ COURT-CIRCUIT ⚠️"
              fontSize={24}
              fill="#ef4444"
              fontStyle="bold"
              shadowBlur={10}
              shadowColor="#ef4444"
            />
          )}

          {/* Fils */}
          {drawWires()}

          {/* Composants */}
          {components.map(comp => drawComponent(comp))}

          {!isRunning && (
            <Text
              x={10}
              y={dimensions.height - 30}
              text="Déplace les composants sur la grille"
              fontSize={12}
              fill="#64748b"
              opacity={0.6}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CircuitCanvas;