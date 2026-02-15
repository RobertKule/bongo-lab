import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import translations from '../utils/translations';

/**
 * Inclined Plane simulation placeholder.
 * TODO: Implement with Konva.js canvas and Matter.js physics.
 */
const InclinedPlane = () => {
  const navigate = useNavigate();
  const t = translations.simulations.inclinedPlane;

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
        {/* TODO: Implement inclined plane simulation with Konva.js */}
        {/* Physics: a = g(sin θ - μ cos θ) — see utils/physics.js */}
        <p className="text-gray-500">{translations.status.developing}</p>
      </div>
      <div className="control-panel">
        {/* TODO: Add sliders for angle (θ), friction (μ), mass (m) */}
        <p className="text-gray-500">{translations.status.controlsPlaceholder}</p>
      </div>
    </div>
  );
};

export default InclinedPlane;
