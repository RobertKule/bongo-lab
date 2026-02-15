import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import translations from '../utils/translations';

/**
 * Optics (Light Reflection) simulation placeholder.
 * TODO: Implement with Konva.js canvas for ray tracing.
 */
const Optics = () => {
  const navigate = useNavigate();
  const t = translations.simulations.optics;

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
        {/* TODO: Implement optics simulation with Konva.js */}
        {/* Physics: Snell's law n₁ sin θ₁ = n₂ sin θ₂ — see utils/physics.js */}
        <p className="text-gray-500">{translations.status.developing}</p>
      </div>
      <div className="control-panel">
        {/* TODO: Add controls for incidence angle, mirror type, refractive index */}
        <p className="text-gray-500">{translations.status.controlsPlaceholder}</p>
      </div>
    </div>
  );
};

export default Optics;
