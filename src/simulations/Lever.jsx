import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import translations from '../utils/translations';

/**
 * Lever simulation placeholder.
 * TODO: Implement with Konva.js canvas and Matter.js physics.
 */
const Lever = () => {
  const navigate = useNavigate();
  const t = translations.simulations.lever;

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
        {/* TODO: Implement lever simulation with Konva.js */}
        {/* Physics: F₁ × d₁ = F₂ × d₂ — see utils/physics.js */}
        <p className="text-gray-500">{translations.status.developing}</p>
      </div>
      <div className="control-panel">
        {/* TODO: Add sliders for force, effort arm, load arm */}
        <p className="text-gray-500">{translations.status.controlsPlaceholder}</p>
      </div>
    </div>
  );
};

export default Lever;
