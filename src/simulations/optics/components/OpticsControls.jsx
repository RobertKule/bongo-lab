import React from 'react';
import { Play, Pause, RotateCcw, Eye, Waves, GitBranch } from 'lucide-react';

const OpticsControls = ({
  incidentAngle, onIncidentAngleChange,
  n1, onN1Change,
  n2, onN2Change,
  surfaceType, onSurfaceTypeChange,
  rayType, onRayTypeChange,
  wavelength, onWavelengthChange,
  reflectedAngle,
  refractedAngle,
  criticalAngle,
  totalInternalReflection,
  predefinedMaterials,
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
        {/* Angle d'incidence */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <Eye size={16} /> Angle d'incidence
          </label>
          <input
            type="range"
            min="0"
            max="90"
            value={incidentAngle}
            onChange={(e) => onIncidentAngleChange(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-sm">
            <span className="text-blue-600 font-bold">{incidentAngle}°</span>
            {criticalAngle && (
              <span className="text-amber-600">Angle critique: {criticalAngle.toFixed(1)}°</span>
            )}
          </div>
        </div>

        {/* Indices de réfraction */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500">Milieu 1 (n₁)</label>
            <select
              value={n1}
              onChange={(e) => onN1Change(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg mt-1"
            >
              <option value={1.0}>Air (1.0)</option>
              <option value={1.33}>Eau (1.33)</option>
              <option value={1.5}>Verre (1.5)</option>
              <option value={2.42}>Diamant (2.42)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">Milieu 2 (n₂)</label>
            <select
              value={n2}
              onChange={(e) => onN2Change(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg mt-1"
            >
              <option value={1.0}>Air (1.0)</option>
              <option value={1.33}>Eau (1.33)</option>
              <option value={1.5}>Verre (1.5)</option>
              <option value={2.42}>Diamant (2.42)</option>
            </select>
          </div>
        </div>

        {/* Type de surface */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <GitBranch size={16} /> Type de surface
          </label>
          <div className="flex gap-2">
            {['plan', 'concave', 'convexe'].map(type => (
              <button
                key={type}
                onClick={() => onSurfaceTypeChange(type)}
                className={`flex-1 py-2 rounded-lg font-bold capitalize transition-all ${
                  surfaceType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Type de rayon */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <Waves size={16} /> Affichage
          </label>
          <div className="flex gap-2">
            {[
              { value: 'reflection', label: 'Réflexion' },
              { value: 'refraction', label: 'Réfraction' },
              { value: 'both', label: 'Les deux' }
            ].map(type => (
              <button
                key={type.value}
                onClick={() => onRayTypeChange(type.value)}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                  rayType === type.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Longueur d'onde (couleur) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-red-500" /> Couleur
          </label>
          <input
            type="range"
            min="380"
            max="700"
            value={wavelength}
            onChange={(e) => onWavelengthChange(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <div className="text-right text-sm font-bold text-purple-600">{wavelength} nm</div>
        </div>

        {/* Résultats */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Angle réfléchi:</span>
            <span className="font-bold text-green-600">{reflectedAngle}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Angle réfracté:</span>
            <span className="font-bold text-blue-600">
              {totalInternalReflection ? '⚠️ Réflexion totale' : (refractedAngle?.toFixed(1) + '°' || 'N/A')}
            </span>
          </div>
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

export default OpticsControls;