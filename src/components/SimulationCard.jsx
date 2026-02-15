import React from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../utils/translations';

/**
 * Card displayed on the home page for each simulation.
 * Uses warm African-inspired gradients and custom SVG icons.
 * Designed touch-first for mobile.
 */
const SimulationCard = ({ id, icon, title, description, color, bgGradient }) => {
  const navigate = useNavigate();

  return (
    <div className="sim-card bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-[#E8DFD0] hover:shadow-lg transition-all active:scale-[0.97]">
      {/* Icon area with gradient background */}
      <div
        className="h-24 sm:h-28 flex items-center justify-center"
        style={{ background: bgGradient }}
      >
        {icon}
      </div>
      {/* Card body */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-sm mb-1" style={{ color: '#2C1810' }}>{title}</h3>
        <p className="text-[11px] leading-relaxed flex-1" style={{ color: '#8B7355' }}>
          {description}
        </p>
        <button
          onClick={() => navigate(`/simulation/${id}`)}
          className="mt-3 w-full py-2 rounded-xl text-white text-xs sm:text-sm font-semibold active:brightness-90 transition-all"
          style={{ backgroundColor: color }}
        >
          {translations.actions.start}
        </button>
      </div>
    </div>
  );
};

export default SimulationCard;
