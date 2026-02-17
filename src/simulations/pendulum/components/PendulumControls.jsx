import React from 'react';
import { Play, Pause, RotateCcw, Ruler, Gauge, MoveHorizontal } from 'lucide-react';

const PendulumControls = ({ 
  length, onLengthChange, angle, onAngleChange, gravity, onGravityChange, 
  isRunning, onToggleRunning, onReset 
}) => {
  
  // Fonction pour gérer l'édition avec pause automatique
  const handleEdit = (setter, value) => {
    if (isRunning) {
      onToggleRunning(); // Met en pause automatiquement
    }
    setter(value);
  };

  const ControlSection = ({ icon: Icon, label, value, unit, disabled, children }) => (
    <div className={`space-y-3 p-4 rounded-xl transition-all dark:bg-slate-800 ${
      disabled ? 'bg-slate-50 opacity-60 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800'
    }`}>
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
      
      {/* Bouton Principal */}
      <div className="p-6 bg-slate-50 flex flex-col sm:flex-row justify-center gap-4 dark:bg-slate-800/50">
        <button
          onClick={onToggleRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-md ${
            isRunning 
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-amber-900/30' 
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/30'
          }`}
        >
          {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Démarrer</>}
        </button>
        <button
          onClick={onReset}
          className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Sliders avec édition automatique */}
      <ControlSection 
        icon={Ruler} 
        label="Longueur" 
        value={length} 
        unit="cm" 
        disabled={isRunning}
      >
        <input
          type="range" 
          min="50" 
          max="350" 
          value={length}
          onChange={(e) => handleEdit(onLengthChange, Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer dark:accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>50</span>
          <span>200</span>
          <span>350</span>
        </div>
      </ControlSection>

      <ControlSection 
        icon={MoveHorizontal} 
        label="Angle initial" 
        value={Math.abs(angle)} 
        unit="°" 
        disabled={isRunning}
      >
        <input
          type="range" 
          min="-85" 
          max="85" 
          value={angle}
          onChange={(e) => handleEdit(onAngleChange, Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer dark:accent-amber-400"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Gauche</span>
          <span>Milieu</span>
          <span>Droite</span>
        </div>
      </ControlSection>

      <ControlSection 
        icon={Gauge} 
        label="Gravité" 
        value={gravity.toFixed(2)} 
        unit="g"
      >
        <input
          type="range" 
          min="0.1" 
          max="2" 
          step="0.01" 
          value={gravity}
          onChange={(e) => onGravityChange(Number(e.target.value))}
          className="w-full accent-purple-600 cursor-pointer dark:accent-purple-500"
        />
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            {l: '🌑 Lune', v: 0.16, short: '🌑'},
            {l: '🌍 Terre', v: 1, short: '🌍'},
            {l: '🪐 Jupiter', v: 1.5, short: '🪐'}
          ].map(opt => (
            <button
              key={opt.l}
              onClick={() => onGravityChange(opt.v)}
              className="flex-1 text-xs font-medium py-2 bg-slate-100 rounded hover:bg-slate-200 transition-all dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
              title={opt.l}
            >
              <span className="hidden sm:inline">{opt.l}</span>
              <span className="sm:hidden">{opt.short}</span>
            </button>
          ))}
        </div>
      </ControlSection>
    </div>
  );
};

export default PendulumControls;