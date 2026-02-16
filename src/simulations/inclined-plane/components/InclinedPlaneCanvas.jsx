// src/simulations/inclined-plane/components/InclinedPlaneCanvas.jsx
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Line, Circle, Text } from 'react-konva';

const InclinedPlaneCanvas = forwardRef(({ blockPosition, angle, isFullscreen }, ref) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const responsiveHeight = Math.min(
          600, 
          Math.max(350, Math.min(containerWidth * 0.7, window.innerHeight * 0.6))
        );
        
        setDimensions({
          width: containerWidth,
          height: isFullscreen ? window.innerHeight - 100 : responsiveHeight
        });
      }
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen]);

  useImperativeHandle(ref, () => ({
    getDimensions: () => dimensions
  }));

  // Calculer les points du plan incliné
  const angleRad = (angle * Math.PI) / 180;
  const planeLength = Math.min(400, dimensions.width * 0.6);
  const startX = dimensions.width * 0.2;
  const startY = dimensions.height * 0.7;
  const endX = startX + planeLength * Math.cos(angleRad);
  const endY = startY - planeLength * Math.sin(angleRad);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Grille de fond */}
          {[...Array(8)].map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[0, i * 60, dimensions.width, i * 60]}
              stroke="#e2e8f0"
              strokeWidth={1}
              opacity={0.2}
              className="dark:stroke-slate-600"
            />
          ))}
          
          {/* Ligne de pente */}
          <Line
            points={[startX, startY, endX, endY]}
            stroke="#475569"
            strokeWidth={4}
            lineCap="round"
            className="dark:stroke-slate-400"
          />
          
          {/* Surface du plan (rectangle) */}
          <Rect
            x={startX - 5}
            y={startY - 10}
            width={planeLength + 10}
            height={15}
            fill="#94a3b8"
            opacity={0.3}
            rotation={angle}
            cornerRadius={5}
          />
          
          {/* Bloc */}
          <Rect
            x={blockPosition.x - 20}
            y={blockPosition.y - 20}
            width={40}
            height={40}
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth={2}
            cornerRadius={8}
            shadowBlur={10}
            shadowColor="#00000040"
            rotation={angle}
          />
          
          {/* Point de départ (repère) */}
          <Circle
            x={startX}
            y={startY}
            radius={6}
            fill="#3b82f6"
            opacity={0.5}
          />
          
          {/* Flèche de direction */}
          <Line
            points={[endX, endY, endX - 20, endY - 10, endX - 20, endY + 10]}
            fill="#ef4444"
            closed
            opacity={0.5}
          />
          
          {/* Angle */}
          <Text
            x={startX + 30}
            y={startY - 40}
            text={`${angle}°`}
            fontSize={16}
            fill="#64748b"
            className="dark:fill-slate-400"
          />
        </Layer>
      </Stage>
    </div>
  );
});

InclinedPlaneCanvas.displayName = 'InclinedPlaneCanvas';

export default InclinedPlaneCanvas;