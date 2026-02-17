import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Line, Circle, Text, Group, Arrow } from 'react-konva';

const OpticsCanvas = ({
  incidentAngle,
  reflectedAngle,
  refractedAngle,
  surfaceType,
  rayType,
  n1,
  n2,
  totalInternalReflection,
  getRayColor,
  isRunning,
  isFullscreen
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  
  // Paramètres de la scène
  const centerX = dimensions.width / 2;
  const interfaceY = dimensions.height / 2; // Interface entre les deux milieux
  const rayLength = 150;
  const sourceX = centerX - 100;
  const sourceY = interfaceY - 50;

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

  // Calcul des points des rayons
  const calculateRayPoints = () => {
    const rad = (incidentAngle * Math.PI) / 180;
    
    // Point d'incidence sur l'interface
    const incidenceX = centerX;
    const incidenceY = interfaceY;
    
    // Point de départ du rayon incident (en haut à gauche)
    const startX = incidenceX - rayLength * Math.cos(rad);
    const startY = incidenceY - rayLength * Math.sin(rad);
    
    // Rayon réfléchi (angle symétrique)
    const reflectedEndX = incidenceX + rayLength * Math.cos(rad);
    const reflectedEndY = incidenceY - rayLength * Math.sin(rad);
    
    // Rayon réfracté (loi de Snell)
    let refractedEndX = incidenceX;
    let refractedEndY = incidenceY;
    
    if (!totalInternalReflection && refractedAngle !== null) {
      const refRad = (refractedAngle * Math.PI) / 180;
      refractedEndX = incidenceX + rayLength * Math.cos(refRad);
      refractedEndY = incidenceY + rayLength * Math.sin(refRad); // Vers le bas
    }

    return {
      incident: { startX, startY, endX: incidenceX, endY: incidenceY },
      reflected: { startX: incidenceX, startY: incidenceY, endX: reflectedEndX, endY: reflectedEndY },
      refracted: { startX: incidenceX, startY: incidenceY, endX: refractedEndX, endY: refractedEndY }
    };
  };

  const points = calculateRayPoints();

  // Dessiner l'interface selon le type de surface
  const drawInterface = () => {
    switch(surfaceType) {
      case 'plan':
        return (
          <Line
            points={[0, interfaceY, dimensions.width, interfaceY]}
            stroke="#64748b"
            strokeWidth={3}
            dash={[10, 5]}
          />
        );
      case 'concave':
        return (
          <Group>
            <Line
              points={[0, interfaceY - 20, centerX - 50, interfaceY - 30, centerX + 50, interfaceY - 30, dimensions.width, interfaceY - 20]}
              stroke="#64748b"
              strokeWidth={3}
              tension={0.5}
            />
            <Text x={centerX - 30} y={interfaceY - 60} text="⟁" fontSize={30} fill="#64748b" />
          </Group>
        );
      case 'convexe':
        return (
          <Group>
            <Line
              points={[0, interfaceY + 20, centerX - 50, interfaceY + 30, centerX + 50, interfaceY + 30, dimensions.width, interfaceY + 20]}
              stroke="#64748b"
              strokeWidth={3}
              tension={0.5}
            />
            <Text x={centerX - 30} y={interfaceY + 20} text="⤾" fontSize={30} fill="#64748b" />
          </Group>
        );
      default:
        return null;
    }
  };

  // Dessiner les normales
  const drawNormals = () => {
    return (
      <Line
        points={[centerX, interfaceY - 100, centerX, interfaceY + 100]}
        stroke="#94a3b8"
        strokeWidth={1}
        dash={[5, 5]}
        opacity={0.5}
      />
    );
  };

  // Dessiner les angles
  const drawAngles = () => {
    return (
      <Group>
        {/* Arc pour l'angle incident */}
        <Arc
          x={centerX}
          y={interfaceY}
          innerRadius={40}
          outerRadius={50}
          angle={incidentAngle}
          rotation={-90}
          fill="#ef4444"
          opacity={0.2}
        />
        <Text
          x={centerX - 30}
          y={interfaceY - 60}
          text={`θ₁ = ${incidentAngle}°`}
          fontSize={12}
          fill="#ef4444"
        />
        
        {/* Arc pour l'angle réfléchi */}
        <Arc
          x={centerX}
          y={interfaceY}
          innerRadius={60}
          outerRadius={70}
          angle={reflectedAngle}
          rotation={90}
          fill="#22c55e"
          opacity={0.2}
        />
        <Text
          x={centerX + 20}
          y={interfaceY - 60}
          text={`θ₂ = ${reflectedAngle}°`}
          fontSize={12}
          fill="#22c55e"
        />
        
        {/* Arc pour l'angle réfracté */}
        {!totalInternalReflection && refractedAngle && (
          <>
            <Arc
              x={centerX}
              y={interfaceY}
              innerRadius={80}
              outerRadius={90}
              angle={refractedAngle}
              rotation={90}
              fill="#3b82f6"
              opacity={0.2}
            />
            <Text
              x={centerX + 40}
              y={interfaceY + 30}
              text={`θ₃ = ${refractedAngle.toFixed(1)}°`}
              fontSize={12}
              fill="#3b82f6"
            />
          </>
        )}
      </Group>
    );
  };

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
          
          {/* Indication des milieux */}
          <Text
            x={20}
            y={interfaceY - 40}
            text={`n₁ = ${n1.toFixed(2)}`}
            fontSize={14}
            fill="#ef4444"
            fontStyle="bold"
          />
          <Text
            x={20}
            y={interfaceY + 20}
            text={`n₂ = ${n2.toFixed(2)}`}
            fontSize={14}
            fill="#3b82f6"
            fontStyle="bold"
          />
          
          {/* Ligne d'interface */}
          {drawInterface()}
          
          {/* Normale */}
          {drawNormals()}
          
          {/* Source lumineuse */}
          <Circle
            x={points.incident.startX}
            y={points.incident.startY}
            radius={8}
            fill="#fbbf24"
            shadowBlur={10}
            shadowColor="#fbbf24"
          />
          
          {/* Rayon incident */}
          <Arrow
            points={[
              points.incident.startX,
              points.incident.startY,
              points.incident.endX,
              points.incident.endY
            ]}
            stroke={getRayColor('incident')}
            strokeWidth={3}
            fill={getRayColor('incident')}
            pointerLength={10}
            pointerWidth={10}
            opacity={0.8}
          />
          
          {/* Rayon réfléchi */}
          {(rayType === 'reflection' || rayType === 'both') && (
            <Arrow
              points={[
                points.reflected.startX,
                points.reflected.startY,
                points.reflected.endX,
                points.reflected.endY
              ]}
              stroke={getRayColor('reflected')}
              strokeWidth={3}
              fill={getRayColor('reflected')}
              pointerLength={10}
              pointerWidth={10}
              opacity={0.8}
              dash={[5, 5]}
            />
          )}
          
          {/* Rayon réfracté */}
          {(rayType === 'refraction' || rayType === 'both') && !totalInternalReflection && refractedAngle && (
            <Arrow
              points={[
                points.refracted.startX,
                points.refracted.startY,
                points.refracted.endX,
                points.refracted.endY
              ]}
              stroke={getRayColor('refracted')}
              strokeWidth={3}
              fill={getRayColor('refracted')}
              pointerLength={10}
              pointerWidth={10}
              opacity={0.8}
            />
          )}
          
          {/* Message de réflexion totale */}
          {totalInternalReflection && (
            <Text
              x={centerX - 100}
              y={interfaceY + 50}
              text="⚠️ RÉFLEXION TOTALE ⚠️"
              fontSize={20}
              fill="#ef4444"
              fontStyle="bold"
              shadowBlur={10}
              shadowColor="#ef4444"
            />
          )}
          
          {/* Point d'incidence */}
          <Circle
            x={points.incident.endX}
            y={points.incident.endY}
            radius={5}
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth={2}
          />
        </Layer>
      </Stage>
    </div>
  );
};

// Composant Arc personnalisé pour dessiner les angles
const Arc = ({ x, y, innerRadius, outerRadius, angle, rotation, fill, opacity }) => {
  const points = [];
  const steps = 20;
  const startAngle = rotation * Math.PI / 180;
  const endAngle = startAngle + angle * Math.PI / 180;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = startAngle + t * (endAngle - startAngle);
    points.push(x + outerRadius * Math.cos(theta), y + outerRadius * Math.sin(theta));
  }
  
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const theta = startAngle + t * (endAngle - startAngle);
    points.push(x + innerRadius * Math.cos(theta), y + innerRadius * Math.sin(theta));
  }
  
  return (
    <Line
      points={points}
      fill={fill}
      opacity={opacity}
      closed
      listening={false}
    />
  );
};

export default OpticsCanvas;