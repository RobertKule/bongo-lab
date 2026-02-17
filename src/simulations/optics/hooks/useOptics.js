import { useState, useCallback, useEffect } from 'react';

const useOptics = () => {
  // États
  const [incidentAngle, setIncidentAngle] = useState(30); // degrés
  const [n1, setN1] = useState(1.0); // indice milieu 1 (air)
  const [n2, setN2] = useState(1.5); // indice milieu 2 (verre)
  const [surfaceType, setSurfaceType] = useState('plan'); // plan, concave, convexe
  const [rayType, setRayType] = useState('refraction'); // reflection, refraction, both
  const [wavelength, setWavelength] = useState(550); // nm (vert)
  const [isRunning, setIsRunning] = useState(false);
  
  // Résultats calculés
  const [reflectedAngle, setReflectedAngle] = useState(30);
  const [refractedAngle, setRefractedAngle] = useState(null);
  const [criticalAngle, setCriticalAngle] = useState(null);
  const [totalInternalReflection, setTotalInternalReflection] = useState(false);

  // Loi de Snell-Descartes: n1 sin θ1 = n2 sin θ2
  const calculateAngles = useCallback(() => {
    const rad = (incidentAngle * Math.PI) / 180;
    const sinTheta1 = Math.sin(rad);
    
    // Angle réfléchi (loi de la réflexion)
    setReflectedAngle(incidentAngle);
    
    // Calcul de l'angle réfracté (Snell-Descartes)
    const sinTheta2 = (n1 * sinTheta1) / n2;
    
    // Vérifier la réflexion totale
    if (Math.abs(sinTheta2) > 1) {
      setTotalInternalReflection(true);
      setRefractedAngle(null);
    } else {
      setTotalInternalReflection(false);
      const theta2 = Math.asin(sinTheta2) * 180 / Math.PI;
      setRefractedAngle(theta2);
    }
    
    // Calcul de l'angle critique (pour n1 > n2)
    if (n1 > n2) {
      const critical = Math.asin(n2 / n1) * 180 / Math.PI;
      setCriticalAngle(critical);
    } else {
      setCriticalAngle(null);
    }
  }, [incidentAngle, n1, n2]);

  // Recalculer quand les paramètres changent
  useEffect(() => {
    calculateAngles();
  }, [calculateAngles]);

  // Couleurs selon la longueur d'onde
  const getRayColor = useCallback((type) => {
    if (type === 'incident') return '#ef4444'; // Rouge
    if (type === 'reflected') return '#22c55e'; // Vert
    if (type === 'refracted') {
      // Variation de couleur selon la longueur d'onde
      if (wavelength < 450) return '#8b5cf6'; // Violet
      if (wavelength < 500) return '#3b82f6'; // Bleu
      if (wavelength < 570) return '#22c55e'; // Vert
      if (wavelength < 590) return '#eab308'; // Jaune
      if (wavelength < 620) return '#f97316'; // Orange
      return '#ef4444'; // Rouge
    }
    return '#ffffff';
  }, [wavelength]);

  return {
    // États
    incidentAngle, setIncidentAngle,
    n1, setN1,
    n2, setN2,
    surfaceType, setSurfaceType,
    rayType, setRayType,
    wavelength, setWavelength,
    isRunning, setIsRunning,
    
    // Résultats
    reflectedAngle,
    refractedAngle,
    criticalAngle,
    totalInternalReflection,
    
    // Utilitaires
    getRayColor,
    
    // Indices prédéfinis
    predefinedMaterials: {
      air: 1.0,
      eau: 1.33,
      verre: 1.5,
      diamant: 2.42,
      plexiglas: 1.49
    }
  };
};

export default useOptics;