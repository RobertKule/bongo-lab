import React from 'react';
import { Play, Pause, RotateCcw, Gauge, Wind } from 'lucide-react';

const InclinedPlaneControls = ({ 
  angle, onAngleChange, 
  friction, onFrictionChange, 
  mass, onMassChange, 
  isRunning, onToggleRunning, 
  onReset,
  canSlide 
}) => {
  
  const handleEdit = (setter, val) => {
    if (isRunning) onToggleRunning();
    setter(val);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-8">
      <button
        onClick={onToggleRunning}
        className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
          isRunning 
          ? 'bg-amber-100 text-amber-600 border-2 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' 
          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 dark:bg-emerald-700'
        }`}
      >
        {isRunning ? <><Pause size={28} /> PAUSE</> : <><Play size={28} /> DÉMARRER</>}
      </button>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between font-bold text-slate-500 uppercase text-xs tracking-widest dark:text-slate-400">
            <span className="flex items-center gap-2"><Gauge size={16}/> Inclinaison</span>
            <span className="text-blue-600 dark:text-blue-400 text-lg">{angle}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={angle} 
            onChange={(e) => handleEdit(onAngleChange, Number(e.target.value))} 
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500" 
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>360°</span>
          </div>
          
        </div>

        <div className="space-y-4">
          <div className="flex justify-between font-bold text-slate-500 uppercase text-xs tracking-widest dark:text-slate-400">
            <span className="flex items-center gap-2"><Wind size={16}/> Friction</span>
            <span className="text-amber-600 dark:text-amber-400 text-lg">{friction.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.01" 
            max="0.9" 
            step="0.01" 
            value={friction} 
            onChange={(e) => handleEdit(onFrictionChange, Number(e.target.value))} 
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-400" 
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Glace</span>
            <span>Bois</span>
            <span>Caoutchouc</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between font-bold text-slate-500 uppercase text-xs tracking-widest dark:text-slate-400">
            <span className="flex items-center gap-2">⚖️ Masse</span>
            <span className="text-purple-600 dark:text-purple-400 text-lg">{mass.toFixed(1)} kg</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.1" 
            value={mass} 
            onChange={(e) => handleEdit(onMassChange, Number(e.target.value))} 
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-500" 
          />
        </div>
      </div>

      <button 
        onClick={onReset} 
        className="w-full py-2 text-slate-400 font-bold flex items-center justify-center gap-2 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
      >
        <RotateCcw size={18} /> RÉINITIALISER
      </button>
    </div>
  );
};

export default InclinedPlaneControls;