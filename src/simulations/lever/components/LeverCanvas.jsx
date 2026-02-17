import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Line, Circle, Rect, Text, Group } from 'react-konva';
import Weight from './Weight';

const LeverCanvas = ({
  massLeft,
  massRight,
  distanceLeft,
  distanceRight,
  leverType,
  rotation,
  equilibrium,
  isRunning,
  isFullscreen
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  
  // Paramètres du levier
  const pivotX = dimensions.width / 2;
  const pivotY = dimensions.height / 2 + 50;
  const leverLength = 400;
  const leverThickness = 15;
  const maxDistance = 3; // distance maximale en mètres

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

  // Conversion distance (m) → pixels
  const distanceToPixels = (dist) => {
    return (dist / maxDistance) * (leverLength / 2);
  };

  // Positions des masses avec rotation
  const leftDist = distanceToPixels(distanceLeft);
  const rightDist = distanceToPixels(distanceRight);
  
  const leftX = pivotX - leftDist * Math.cos(rotation * Math.PI / 180);
  const leftY = pivotY - leftDist * Math.sin(rotation * Math.PI / 180) - 20;
  const rightX = pivotX + rightDist * Math.cos(rotation * Math.PI / 180);
  const rightY = pivotY + rightDist * Math.sin(rotation * Math.PI / 180) - 20;

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 dark:bg-slate-900/20 rounded-3xl overflow-hidden">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Grille de fond */}
          {[...Array(10)].map((_, i) => (
            <Line
              key={i}
              points={[0, i * 60, dimensions.width, i * 60]}
              stroke="#e2e8f0"
              strokeWidth={1}
              opacity={0.2}
            />
          ))}

          {/* Support du pivot */}
          <Group>
            <Rect
              x={pivotX - 20}
              y={pivotY}
              width={40}
              height={60}
              fill="#94a3b8"
              stroke="#475569"
              strokeWidth={2}
              cornerRadius={5}
            />
            <Circle
              x={pivotX}
              y={pivotY}
              radius={12}
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth={2}
              shadowBlur={10}
              shadowColor="rgba(0,0,0,0.2)"
            />
          </Group>

          {/* Levier avec rotation */}
          <Group
            x={pivotX}
            y={pivotY}
            rotation={rotation}
          >
            {/* Barre du levier */}
            <Rect
              x={-leverLength/2}
              y={-leverThickness/2}
              width={leverLength}
              height={leverThickness}
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth={2}
              cornerRadius={5}
              shadowBlur={5}
              shadowColor="rgba(0,0,0,0.1)"
            />
            
            {/* Graduations */}
            {[-2, -1, 1, 2].map((val) => (
              <Line
                key={val}
                points={[val * 100, -15, val * 100, 15]}
                stroke="#64748b"
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
          </Group>

          {/* Marqueur de distance gauche */}
          <Line
            points={[pivotX, pivotY - 30, leftX + 20, leftY - 20]}
            stroke="#ef4444"
            strokeWidth={2}
            dash={[5, 5]}
            opacity={0.5}
          />
          <Text
            x={(pivotX + leftX) / 2 - 20}
            y={pivotY - 50}
            text={`${distanceLeft}m`}
            fontSize={12}
            fill="#ef4444"
            fontStyle="bold"
          />

          {/* Marqueur de distance droite */}
          <Line
            points={[pivotX, pivotY - 30, rightX - 20, rightY - 20]}
            stroke="#3b82f6"
            strokeWidth={2}
            dash={[5, 5]}
            opacity={0.5}
          />
          <Text
            x={(pivotX + rightX) / 2 - 10}
            y={pivotY - 50}
            text={`${distanceRight}m`}
            fontSize={12}
            fill="#3b82f6"
            fontStyle="bold"
          />

          {/* Masse gauche */}
          <Weight
            x={leftX}
            y={leftY}
            mass={massLeft}
            color="#ef4444"
            label="G"
            draggable={!isRunning}
            onDragEnd={(e) => {
              // Logique pour ajuster la distance
              const newX = e.target.x();
              const dist = Math.abs(newX - pivotX);
              const newDistance = (dist / (leverLength/2)) * maxDistance;
              if (newX < pivotX) {
                // distanceLeft = Math.min(maxDistance, newDistance);
              }
            }}
          />

          {/* Masse droite */}
          <Weight
            x={rightX}
            y={rightY}
            mass={massRight}
            color="#3b82f6"
            label="D"
            draggable={!isRunning}
            onDragEnd={(e) => {
              const newX = e.target.x();
              const dist = Math.abs(newX - pivotX);
              const newDistance = (dist / (leverLength/2)) * maxDistance;
              if (newX > pivotX) {
                // distanceRight = Math.min(maxDistance, newDistance);
              }
            }}
          />

          {/* Indicateur d'équilibre */}
          {equilibrium ? (
            <Text
              x={pivotX - 50}
              y={pivotY - 100}
              text="⚖️ ÉQUILIBRE ⚖️"
              fontSize={16}
              fill="#22c55e"
              fontStyle="bold"
            />
          ) : (
            <Text
              x={pivotX - 50}
              y={pivotY - 100}
              text={momentLeft > momentRight ? "⬅️ Penche à gauche" : "➡️ Penche à droite"}
              fontSize={16}
              fill="#ef4444"
              fontStyle="bold"
            />
          )}

          {/* Valeurs des moments */}
          <Text
            x={pivotX - 200}
            y={pivotY - 150}
            text={`M gauche: ${momentLeft.toFixed(1)} Nm`}
            fontSize={12}
            fill="#ef4444"
          />
          <Text
            x={pivotX + 50}
            y={pivotY - 150}
            text={`M droite: ${momentRight.toFixed(1)} Nm`}
            fontSize={12}
            fill="#3b82f6"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default LeverCanvas;