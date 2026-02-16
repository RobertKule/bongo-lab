// src/simulations/inclined-plane/components/InclinedPlaneControls.jsx
import React from 'react';
import { Play, Pause, RotateCcw, Gauge, Weight, Waves } from 'lucide-react';

const InclinedPlaneControls = ({ 
  angle, onAngleChange,
  friction, onFrictionChange,
  mass, onMassChange,
  isRunning, onToggleRunning,
  onReset
}) => {
  
  const handleEdit = (setter, value) => {
    if (isRunning) onToggleRunning();
    setter(value);
  };

  const ControlSection = ({ icon: Icon, label, value, unit, children }) => (
    <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-slate-800">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-700 font-semibold dark:text-slate-200">
          <Icon size={18} className="text-blue-500 dark:text-blue-400" />
          <label>{label}</label>
        </div>
        <span className="text-sm font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-300">
          {value} {unit}
        </span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700 dark:divide-slate-700">
      
      <div className="p-6 bg-slate-50 flex flex-col sm:flex-row justify-center gap-4 dark:bg-slate-800/50">
        <button
          onClick={onToggleRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-md ${
            isRunning 
              ? 'bg-amber-500 hover:bg-amber-600' 
              : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Démarrer</>}
        </button>
        <button
          onClick={onReset}
          className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <ControlSection 
        icon={Gauge} 
        label="Angle" 
        value={angle} 
        unit="°"
      >
        <input
          type="range" 
          min="0" 
          max="60" 
          value={angle}
          onChange={(e) => handleEdit(onAngleChange, Number(e.target.value))}
          disabled={isRunning}
          className="w-full accent-blue-600 cursor-pointer dark:accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>0°</span>
          <span>30°</span>
          <span>60°</span>
        </div>
      </ControlSection>

      <ControlSection 
        icon={Waves} 
        label="Friction" 
        value={friction.toFixed(2)} 
        unit="μ"
      >
        <input
          type="range" 
          min="0" 
          max="0.8" 
          step="0.01"
          value={friction}
          onChange={(e) => handleEdit(onFrictionChange, Number(e.target.value))}
          disabled={isRunning}
          className="w-full accent-amber-500 cursor-pointer dark:accent-amber-400"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Glace</span>
          <span>Bois</span>
          <span>Caoutchouc</span>
        </div>
      </ControlSection>

      <ControlSection 
        icon={Weight} 
        label="Masse" 
        value={mass.toFixed(1)} 
        unit="kg"
      >
        <input
          type="range" 
          min="0.5" 
          max="5" 
          step="0.1"
          value={mass}
          onChange={(e) => handleEdit(onMassChange, Number(e.target.value))}
          disabled={isRunning}
          className="w-full accent-purple-600 cursor-pointer dark:accent-purple-500"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Léger</span>
          <span>Moyen</span>
          <span>Lourd</span>
        </div>
      </ControlSection>
    </div>
  );
};

export default InclinedPlaneControls;