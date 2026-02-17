import React from 'react';
import { Group, Line, Circle, Text, Path } from 'react-konva';

const Mirror = ({ 
  type = 'plan', 
  x, 
  y, 
  width = 200, 
  height = 10,
  orientation = 'vertical', // vertical, horizontal
  curvature = 50, // Rayon de courbure pour concave/convexe
  color = '#64748b',
  strokeColor = '#334155',
  showNormal = true,
  showLabel = true,
  label
}) => {
  
  // Dessiner un miroir plan
  const drawPlanMirror = () => {
    if (orientation === 'vertical') {
      return (
        <Group>
          {/* Ligne principale du miroir */}
          <Line
            points={[x, y - height/2, x, y + height/2]}
            stroke={color}
            strokeWidth={4}
            lineCap="round"
          />
          {/* Hachures pour indiquer la surface réfléchissante */}
          <Line
            points={[x - 5, y - height/2 + 10, x + 5, y - height/2 + 10]}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.5}
          />
          <Line
            points={[x - 5, y, x + 5, y]}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.5}
          />
          <Line
            points={[x - 5, y + height/2 - 10, x + 5, y + height/2 - 10]}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.5}
          />
        </Group>
      );
    } else {
      return (
        <Group>
          <Line
            points={[x - width/2, y, x + width/2, y]}
            stroke={color}
            strokeWidth={4}
            lineCap="round"
          />
          <Line
            points={[x - width/2 + 10, y - 5, x - width/2 + 10, y + 5]}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.5}
          />
          <Line
            points={[x, y - 5, x, y + 5]}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.5}
          />
          <Line
            points={[x + width/2 - 10, y - 5, x + width/2 - 10, y + 5]}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.5}
          />
        </Group>
      );
    }
  };

  // Dessiner un miroir concave
  const drawConcaveMirror = () => {
    const points = [];
    const steps = 20;
    
    if (orientation === 'vertical') {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const currentY = y - height/2 + t * height;
        const offset = curvature * Math.sin(t * Math.PI);
        points.push(x - offset, currentY);
      }
      
      return (
        <Group>
          <Line
            points={points.flat()}
            stroke={color}
            strokeWidth={4}
            tension={0.5}
            lineCap="round"
          />
          {/* Indication de la courbure */}
          <Text
            x={x - 40}
            y={y - 30}
            text="⟁"
            fontSize={24}
            fill={color}
            opacity={0.7}
          />
        </Group>
      );
    } else {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const currentX = x - width/2 + t * width;
        const offset = curvature * Math.sin(t * Math.PI);
        points.push(currentX, y - offset);
      }
      
      return (
        <Group>
          <Line
            points={points.flat()}
            stroke={color}
            strokeWidth={4}
            tension={0.5}
            lineCap="round"
          />
          <Text
            x={x + 20}
            y={y - 40}
            text="⤾"
            fontSize={24}
            fill={color}
            opacity={0.7}
          />
        </Group>
      );
    }
  };

  // Dessiner un miroir convexe
  const drawConvexMirror = () => {
    const points = [];
    const steps = 20;
    
    if (orientation === 'vertical') {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const currentY = y - height/2 + t * height;
        const offset = curvature * Math.sin(t * Math.PI);
        points.push(x + offset, currentY);
      }
      
      return (
        <Group>
          <Line
            points={points.flat()}
            stroke={color}
            strokeWidth={4}
            tension={0.5}
            lineCap="round"
          />
          <Text
            x={x + 20}
            y={y - 30}
            text="⤿"
            fontSize={24}
            fill={color}
            opacity={0.7}
          />
        </Group>
      );
    } else {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const currentX = x - width/2 + t * width;
        const offset = curvature * Math.sin(t * Math.PI);
        points.push(currentX, y + offset);
      }
      
      return (
        <Group>
          <Line
            points={points.flat()}
            stroke={color}
            strokeWidth={4}
            tension={0.5}
            lineCap="round"
          />
          <Text
            x={x + 20}
            y={y + 20}
            text="⤿"
            fontSize={24}
            fill={color}
            opacity={0.7}
          />
        </Group>
      );
    }
  };

  // Dessiner la normale (perpendiculaire)
  const drawNormal = () => {
    if (!showNormal) return null;
    
    if (orientation === 'vertical') {
      return (
        <Line
          points={[x, y - height/2 - 30, x, y + height/2 + 30]}
          stroke="#94a3b8"
          strokeWidth={1}
          dash={[5, 5]}
          opacity={0.5}
        />
      );
    } else {
      return (
        <Line
          points={[x - width/2 - 30, y, x + width/2 + 30, y]}
          stroke="#94a3b8"
          strokeWidth={1}
          dash={[5, 5]}
          opacity={0.5}
        />
      );
    }
  };

  // Dessiner le label
  const drawLabel = () => {
    if (!showLabel || !label) return null;
    
    if (orientation === 'vertical') {
      return (
        <Text
          x={x + 10}
          y={y - 10}
          text={label}
          fontSize={12}
          fill={color}
          fontStyle="bold"
        />
      );
    } else {
      return (
        <Text
          x={x - 30}
          y={y - 20}
          text={label}
          fontSize={12}
          fill={color}
          fontStyle="bold"
        />
      );
    }
  };

  // Sélection du type de miroir
  const renderMirror = () => {
    switch(type) {
      case 'concave':
        return drawConcaveMirror();
      case 'convexe':
        return drawConvexMirror();
      default:
        return drawPlanMirror();
    }
  };

  return (
    <Group>
      {drawNormal()}
      {renderMirror()}
      {drawLabel()}
    </Group>
  );
};

export default Mirror;