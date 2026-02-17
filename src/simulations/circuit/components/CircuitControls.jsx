import React from 'react';
import { Play, Pause, RotateCcw, Battery, Zap, GitBranch } from 'lucide-react';

const CircuitControls = ({
  voltage, onVoltageChange,
  resistance, onResistanceChange,
  current,
  circuitType, onCircuitTypeChange,
  isRunning, onToggleRunning,
  onReset
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl p-6 border border-slate-100 dark:border-slate-800 space-y-6">
      <button
        onClick={onToggleRunning}
        className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
          isRunning 
          ? 'bg-amber-100 text-amber-600 border-2 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' 
          : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {isRunning ? <><Pause size={24} /> PAUSE</> : <><Play size={24} /> DÉMARRER</>}
      </button>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <Battery size={16} /> Tension (V)
          </label>
          <input
            type="range"
            min="1"
            max="24"
            value={voltage}
            onChange={(e) => onVoltageChange(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="text-right text-lg font-bold text-green-600">{voltage} V</div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <Zap size={16} /> Résistance (Ω)
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={resistance}
            onChange={(e) => onResistanceChange(Number(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="text-right text-lg font-bold text-amber-600">{resistance} Ω</div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <GitBranch size={16} /> Type de circuit
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onCircuitTypeChange('series')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                circuitType === 'series'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Série
            </button>
            <button
              onClick={() => onCircuitTypeChange('parallel')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                circuitType === 'parallel'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Parallèle
            </button>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-purple-400 uppercase">Courant (I = V/R)</p>
          <p className="text-3xl font-black text-purple-700 dark:text-purple-300">{current.toFixed(2)} A</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-2 text-slate-400 font-bold flex items-center justify-center gap-2 hover:text-slate-600 transition-colors"
      >
        <RotateCcw size={18} /> RÉINITIALISER
      </button>
    </div>
  );
};

export default CircuitControls;