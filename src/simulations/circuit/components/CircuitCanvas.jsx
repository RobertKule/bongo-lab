import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';

const CircuitCanvas = ({ components, setComponents, isRunning, isFullscreen }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [gridSize] = useState(40); // Taille de la grille

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

  // Fonction pour arrondir à la grille
  const snapToGrid = (pos) => {
    return Math.round(pos / gridSize) * gridSize;
  };

  const handleDragMove = (e, id) => {
    if (isRunning) return; // Pas de déplacement quand le circuit fonctionne
    
    const node = e.target;
    const x = node.x();
    const y = node.y();
    
    // Mise à jour en temps réel (snap to grid)
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, x: snapToGrid(x), y: snapToGrid(y) } : comp
    ));
  };

  const drawComponent = (comp) => {
    const commonProps = {
      key: comp.id,
      x: comp.x,
      y: comp.y,
      draggable: !isRunning,
      onDragMove: (e) => handleDragMove(e, comp.id),
      onDragEnd: (e) => {
        // Snap final
        const x = snapToGrid(e.target.x());
        const y = snapToGrid(e.target.y());
        setComponents(prev => prev.map(c => 
          c.id === comp.id ? { ...c, x, y } : c
        ));
      }
    };

    switch(comp.type) {
      case 'battery':
        return (
          <Group {...commonProps}>
            <Rect 
              width={40} 
              height={60} 
              fill="#6B9E3C" 
              stroke="#2D4A1A" 
              strokeWidth={2} 
              cornerRadius={5}
              shadowBlur={5}
              shadowColor="rgba(0,0,0,0.2)"
            />
            <Line points={[10, 20, 30, 20]} stroke="white" strokeWidth={3} />
            <Line points={[20, 15, 20, 25]} stroke="white" strokeWidth={3} />
            <Text text="+" x={5} y={10} fill="white" fontSize={12} fontStyle="bold" />
            <Text text="-" x={25} y={40} fill="white" fontSize={12} fontStyle="bold" />
            <Text text={`${comp.value}V`} x={10} y={-15} fontSize={10} fill="#6B9E3C" fontStyle="bold" />
          </Group>
        );
      
      case 'resistor':
        return (
          <Group {...commonProps}>
            <Rect 
              width={50} 
              height={20} 
              fill="#D4792C" 
              stroke="#5D3A1A" 
              strokeWidth={2} 
              cornerRadius={3}
              shadowBlur={5}
              shadowColor="rgba(0,0,0,0.2)"
            />
            <Line points={[0, 10, 10, 10, 20, 0, 30, 20, 40, 10, 50, 10]} stroke="#5D3A1A" strokeWidth={2} />
            <Text text={`${comp.value}Ω`} x={10} y={-15} fontSize={10} fill="#D4792C" fontStyle="bold" />
          </Group>
        );
      
      case 'bulb':
        return (
          <Group {...commonProps}>
            <Circle 
              radius={20} 
              fill="#F2D974" 
              stroke="#D4792C" 
              strokeWidth={2}
              shadowBlur={5}
              shadowColor="rgba(0,0,0,0.2)"
            />
            <Circle radius={15} fill="#E8C547" opacity={0.5} />
            <Line points={[-10, -10, 10, 10]} stroke="#D4792C" strokeWidth={2} />
            <Line points={[-10, 10, 10, -10]} stroke="#D4792C" strokeWidth={2} />
            {isRunning && (
              <>
                <Circle radius={22} stroke="#E8C547" strokeWidth={2} opacity={0.5} dash={[5, 5]} />
                <Circle radius={12} fill="#E8C547" opacity={0.8} />
              </>
            )}
          </Group>
        );
      
      default:
        return null;
    }
  };

  // Dessiner les connexions entre composants
  const drawConnections = () => {
    const lines = [];
    // Logique simple : connecter les composants dans l'ordre
    for (let i = 0; i < components.length - 1; i++) {
      const from = components[i];
      const to = components[i + 1];
      
      // Calculer les points de connexion (centre des composants)
      const fromX = from.x + (from.type === 'battery' ? 20 : from.type === 'resistor' ? 25 : 0);
      const fromY = from.y + (from.type === 'battery' ? 30 : from.type === 'resistor' ? 10 : 0);
      const toX = to.x + (to.type === 'battery' ? 20 : to.type === 'resistor' ? 25 : 0);
      const toY = to.y + (to.type === 'battery' ? 30 : to.type === 'resistor' ? 10 : 0);
      
      lines.push(
        <Line
          key={`conn-${i}`}
          points={[fromX, fromY, toX, toY]}
          stroke="#1B4F72"
          strokeWidth={3}
          lineCap="round"
          dash={isRunning ? [] : [5, 5]} // Pointillé quand en pause
        />
      );
    }
    return lines;
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 dark:bg-slate-900/20 rounded-3xl overflow-hidden">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* GRILLE EN CARREAUX */}
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

          {/* Connexions */}
          {drawConnections()}

          {/* Composants */}
          {components.map(comp => drawComponent(comp))}

          {/* Indicateur de grille */}
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