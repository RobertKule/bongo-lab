import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import translations from '../utils/translations';

/**
 * Pendulum simulation placeholder.
 * TODO: Implement with Konva.js canvas and Matter.js physics.
 */
const Pendulum = () => {
  const navigate = useNavigate();
  const t = translations.simulations.pendulum;

  return (
    <div className="simulation-container">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[--color-congo-blue] mb-4 font-medium"
      >
        <ArrowLeft size={20} />
        {translations.actions.back}
      </button>
      <h2 className="text-xl font-bold mb-4">{t.title}</h2>
      <div className="simulation-canvas">
        {/* TODO: Implement pendulum simulation with Konva.js */}
        {/* Physics: T = 2π√(L/g) — see utils/physics.js */}
        <p className="text-gray-500">{translations.status.developing}</p>
      </div>
      <div className="control-panel">
        {/* TODO: Add sliders for length (L), initial angle (θ₀), gravity (g) */}
        <p className="text-gray-500">{translations.status.controlsPlaceholder}</p>
      </div>
    </div>
  );
};

export default Pendulum;
