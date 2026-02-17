import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Line, Circle, Group, Text } from 'react-konva';

const InclinedPlaneCanvas = ({ blockPosition, angle, planeData, isFullscreen }) => {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 500 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.offsetWidth,
          h: isFullscreen ? window.innerHeight - 120 : 500
        });
      }
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, [isFullscreen]);

  const { startX, startY, planeLength, blockSize } = planeData || { 
    startX: 150, startY: 150, planeLength: 600, blockSize: 40 
  };
  
  const rad = (angle * Math.PI) / 180;
  const endX = startX + planeLength * Math.cos(rad);
  const endY = startY + planeLength * Math.sin(rad);

  // Centrage intelligent
  const minX = Math.min(startX, endX) - 100;
  const maxX = Math.max(startX, endX) + 100;
  const minY = Math.min(startY, endY) - 100;
  const maxY = Math.max(startY, endY) + 100;
  
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  const scale = Math.min(
    dims.w / (maxX - minX + 200),
    dims.h / (maxY - minY + 200)
  ) * 0.9;

  const offsetX = dims.w / 2 - centerX * scale;
  const offsetY = dims.h / 2 - centerY * scale;

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 dark:bg-slate-900/20 rounded-3xl overflow-hidden">
      <Stage width={dims.w} height={dims.h}>
        <Layer>
          <Group 
            x={offsetX} 
            y={offsetY}
            scaleX={scale}
            scaleY={scale}
          >
            {/* Pied du plan */}
            <Line
              points={[startX, startY, startX, startY + 300]}
              stroke="#cbd5e1"
              strokeWidth={2}
              dash={[10, 5]}
            />

            {/* Le Plan Incliné */}
            <Line
              points={[startX, startY, endX, endY]}
              stroke="#475569"
              strokeWidth={8}
              lineCap="round"
              shadowBlur={5}
              shadowColor="rgba(0,0,0,0.1)"
            />

            {/* Le Bloc (Masse) - avec correction de position */}
            <Rect
              x={blockPosition.x - blockSize/2}
              y={blockPosition.y - blockSize/2}
              width={blockSize}
              height={blockSize}
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth={3}
              cornerRadius={4}
              shadowBlur={15}
              shadowColor="rgba(0,0,0,0.3)"
            />

            {/* Marqueur Départ */}
            <Circle x={startX} y={startY} radius={8} fill="#22c55e" />
            <Text x={startX + 10} y={startY - 20} text="DÉPART" fontSize={12} fill="#22c55e" />

            {/* Marqueur Arrivée */}
            <Circle x={endX} y={endY} radius={8} fill="#ef4444" />
            <Text x={endX + 10} y={endY - 20} text="ARRIVÉE" fontSize={12} fill="#ef4444" />

            {/* Indicateur angle */}
            <Text
              x={startX + 50}
              y={startY - 40}
              text={`${angle}°`}
              fontSize={18}
              fill="#3b82f6"
              fontStyle="bold"
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default InclinedPlaneCanvas;