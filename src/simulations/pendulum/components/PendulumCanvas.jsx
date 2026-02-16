// src/simulations/pendulum/components/PendulumCanvas.jsx
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';

const PendulumCanvas = forwardRef(({ bobPosition, isFullscreen, onDimensionsChange }, ref) => {
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
        
        const newDimensions = {
          width: containerWidth,
          height: isFullscreen ? window.innerHeight - 100 : responsiveHeight
        };
        
        setDimensions(newDimensions);
        
        // Informer le hook du changement de dimensions
        if (onDimensionsChange) {
          onDimensionsChange(newDimensions.width, newDimensions.height);
        }
      }
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen, onDimensionsChange]);

  // Exposer les dimensions au parent si nécessaire
  useImperativeHandle(ref, () => ({
    getDimensions: () => dimensions
  }));

  const anchorX = dimensions.width / 2;
  const anchorY = Math.max(40, Math.min(100, dimensions.height * 0.15));
  const ballRadius = Math.min(28, Math.max(16, dimensions.width * 0.04, dimensions.height * 0.05));

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Grille */}
          {dimensions.height > 250 && [...Array(6)].map((_, i) => {
            const y = anchorY + 50 + i * 50;
            return y < dimensions.height - 30 && (
              <Line 
                key={i} 
                points={[50, y, dimensions.width - 50, y]} 
                stroke="#e2e8f0" 
                strokeWidth={1} 
                opacity={0.3}
                className="dark:stroke-slate-600"
              />
            );
          })}

          {/* Ligne verticale */}
          <Line
            points={[anchorX, anchorY + 10, anchorX, dimensions.height - 30]}
            stroke="#cbd5e1"
            strokeWidth={1}
            dash={[5, 5]}
            opacity={0.3}
            className="dark:stroke-slate-600"
          />

          {/* Corde */}
          <Line
            points={[anchorX, anchorY, bobPosition.x, bobPosition.y]}
            stroke="#64748b"
            strokeWidth={3}
            lineCap="round"
            className="dark:stroke-slate-400"
          />
          
          {/* Point d'ancrage */}
          <Circle 
            x={anchorX} 
            y={anchorY} 
            radius={Math.max(6, dimensions.width * 0.012)} 
            fill="#1e293b" 
            className="dark:fill-slate-200"
            shadowBlur={5}
            shadowColor="#00000040"
          />
          
          {/* Masse */}
          <Circle
            x={bobPosition.x}
            y={bobPosition.y}
            radius={ballRadius}
            fillRadialGradientStartPoint={{ x: -ballRadius*0.3, y: -ballRadius*0.3 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndPoint={{ x: ballRadius*0.2, y: ballRadius*0.2 }}
            fillRadialGradientEndRadius={ballRadius * 1.5}
            fillRadialGradientColorStops={[
              0, '#fbbf24', 
              0.7, '#d97706', 
              1, '#b45309'
            ]}
            shadowBlur={ballRadius * 0.4}
            shadowColor="#00000040"
            className="dark:shadow-yellow-900/60"
          />
          
          {/* Point lumineux */}
          <Circle
            x={bobPosition.x - ballRadius*0.2}
            y={bobPosition.y - ballRadius*0.2}
            radius={ballRadius * 0.15}
            fill="white"
            opacity={0.3}
          />
        </Layer>
      </Stage>
    </div>
  );
});

PendulumCanvas.displayName = 'PendulumCanvas';

export default PendulumCanvas;