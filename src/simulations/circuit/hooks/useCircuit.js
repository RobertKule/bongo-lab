import { useState, useCallback, useEffect } from 'react';

const useCircuit = () => {
  const [components, setComponents] = useState([
    { id: 1, type: 'battery', x: 200, y: 200, value: 9 },
    { id: 2, type: 'resistor', x: 400, y: 200, value: 100 },
    { id: 3, type: 'bulb', x: 300, y: 300, value: 0, blown: false }
  ]);
  
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(100);
  const [current, setCurrent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [circuitType, setCircuitType] = useState('series');
  const [shortCircuit, setShortCircuit] = useState(false);

  const addComponent = useCallback((type, x, y) => {
    const newComponent = {
      id: Date.now(),
      type,
      x,
      y,
      value: type === 'battery' ? 9 : type === 'resistor' ? 100 : 0,
      blown: false
    };
    setComponents(prev => [...prev, newComponent]);
  }, []);

  const removeComponent = useCallback((id) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  }, []);

  const updateComponent = useCallback((id, updates) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  }, []);

  const calculateCurrent = useCallback(() => {
    if (!isRunning) return;
    
    // Calculer la résistance totale
    let totalR;
    if (circuitType === 'series') {
      totalR = components
        .filter(c => c.type === 'resistor' && !c.blown)
        .reduce((sum, r) => sum + r.value, resistance);
    } else {
      const resistors = components.filter(c => c.type === 'resistor' && !c.blown);
      if (resistors.length === 0) {
        totalR = resistance;
      } else {
        totalR = 1 / resistors.reduce((sum, r) => sum + 1/r.value, 0);
      }
    }
    
    const newCurrent = voltage / totalR;
    setCurrent(newCurrent);
    
    // Vérifier le court-circuit
    setShortCircuit(newCurrent > 2.0);
    
    // Vérifier si les ampoules grillent
    if (newCurrent > 0.5) {
      setComponents(prev => prev.map(comp => 
        comp.type === 'bulb' && !comp.blown 
          ? { ...comp, blown: true, value: '💥' } 
          : comp
      ));
    }
  }, [voltage, resistance, components, circuitType, isRunning]);

  // Reset des ampoules grillées
  const resetCircuit = useCallback(() => {
    setComponents(prev => prev.map(comp => 
      comp.type === 'bulb' ? { ...comp, blown: false, value: 0 } : comp
    ));
    setShortCircuit(false);
    setVoltage(9);
    setResistance(100);
    setCircuitType('series');
    setIsRunning(false);
  }, []);

  // Recalculer quand des paramètres changent
  useEffect(() => {
    if (isRunning) {
      calculateCurrent();
    }
  }, [voltage, resistance, circuitType, components, isRunning, calculateCurrent]);

  return {
    components,
    setComponents,  
    addComponent,
    removeComponent,
    updateComponent,
    voltage, setVoltage,
    resistance, setResistance,
    current,
    isRunning, setIsRunning,
    circuitType, setCircuitType,
    calculateCurrent,
    shortCircuit,
    resetCircuit
  };
};

export default useCircuit;