import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Line, Circle, Group, Text } from 'react-konva';

const InclinedPlaneCanvas = ({ 
  blockPosition, 
  angle, 
  planeData, 
  canSlide, // ← Ajoute cette prop
  isFullscreen 
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: isFullscreen ? window.innerHeight - 120 : 500
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen]);

  const { 
    startX = 150, 
    startY = 150, 
    planeLength = 450,
    blockSize = 40
  } = planeData || {}; 
  
  const angleRad = (angle * Math.PI) / 180;
  const endX = startX + planeLength * Math.cos(angleRad);
  const endY = startY + planeLength * Math.sin(angleRad);
  
  // Centrage dynamique
  const visualCenterX = dimensions.width / 2;
  const physicsCenterX = startX + (planeLength/2) * Math.cos(angleRad);
  const offsetX = visualCenterX - physicsCenterX;

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 dark:bg-slate-900/40 rounded-xl">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          <Group x={offsetX} y={50}>
            {/* Grille de fond légère */}
            {[...Array(5)].map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * 80, dimensions.width, i * 80]}
                stroke="#e2e8f0"
                strokeWidth={1}
                opacity={0.2}
              />
            ))}
            
            {/* Ligne verticale de référence */}
            <Line
              points={[startX, 0, startX, dimensions.height]}
              stroke="#cbd5e1"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.3}
            />
            
            {/* LE PLAN INCLINÉ (la ligne) */}
            <Line
              points={[startX, startY, endX, endY]}
              stroke="#475569"
              strokeWidth={6}
              lineCap="round"
              className="dark:stroke-slate-400"
            />
            
            {/* Effet de matière sur le plan */}
            <Line
              points={[startX, startY, endX, endY]}
              stroke="#94a3b8"
              strokeWidth={14}
              opacity={0.2}
              lineCap="round"
            />
            
            {/* Supports du plan */}
            <Line
              points={[startX - 10, startY + 10, startX + 10, startY - 10]}
              stroke="#64748b"
              strokeWidth={2}
              opacity={0.5}
            />
            <Line
              points={[endX - 10, endY - 10, endX + 10, endY + 10]}
              stroke="#64748b"
              strokeWidth={2}
              opacity={0.5}
            />
            
            {/* MARQUEUR DE DÉPART (en haut) */}
            <Circle
              x={startX}
              y={startY}
              radius={10}
              fill="#22c55e"
              opacity={0.9}
              shadowBlur={10}
              shadowColor="#22c55e"
            />
            <Text
              x={startX - 25}
              y={startY - 30}
              text="DÉPART"
              fontSize={14}
              fontStyle="bold"
              fill="#22c55e"
            />
            
            {/* Indicateur de pente - version corrigée */}
            {!canSlide && (
              <Text
                x={startX + 50}
                y={startY - 80}
                text="⛔ Le bloc ne glisse pas (départ plus bas)"
                fontSize={14}
                fontStyle="bold"
                fill="#ef4444"
                opacity={0.9}
              />
            )}
            
            {/* MARQUEUR D'ARRIVÉE (en bas) */}
            <Circle
              x={endX}
              y={endY}
              radius={10}
              fill="#ef4444"
              opacity={0.9}
              shadowBlur={10}
              shadowColor="#ef4444"
            />
            <Text
              x={endX - 30}
              y={endY + 20}
              text="ARRIVÉE"
              fontSize={14}
              fontStyle="bold"
              fill="#ef4444"
            />
            
            {/* LE BLOC */}
            <Rect
              x={blockPosition.x}
              y={blockPosition.y}
              width={blockSize}
              height={blockSize}
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth={3}
              cornerRadius={6}
              shadowBlur={15}
              shadowColor="rgba(0,0,0,0.3)"
            />
            
            {/* Indication de l'angle */}
            <Text
              x={startX + 50}
              y={startY - 40}
              text={`Angle: ${angle}°`}
              fontSize={16}
              fontStyle="bold"
              fill="#3b82f6"
            />
            
            {/* Flèche de direction (visible seulement si le bloc peut glisser) */}
            {canSlide && (
              <>
                <Line
                  points={[endX - 40, endY - 20, endX - 20, endY - 10, endX - 40, endY]}
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="#ef4444"
                  closed
                  opacity={0.7}
                />
                <Text
                  x={endX - 80}
                  y={endY - 40}
                  text="Sens de glissement"
                  fontSize={12}
                  fill="#ef4444"
                  opacity={0.7}
                />
              </>
            )}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default InclinedPlaneCanvas;