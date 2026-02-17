import React from 'react';
import { User, Plus } from 'lucide-react';
import SimulationCard from '../components/SimulationCard';
import translations from '../utils/translations';

/**
 * Custom SVG icons for each simulation, matching the African color descriptions.
 */
const PendulumIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
    {/* Two pendulum bobs on strings */}
    <line x1="32" y1="8" x2="20" y2="40" stroke="#5D3A1A" strokeWidth="2.5" />
    <line x1="32" y1="8" x2="44" y2="40" stroke="#5D3A1A" strokeWidth="2.5" />
    <circle cx="20" cy="42" r="7" fill="#D4792C" stroke="#5D3A1A" strokeWidth="1.5" />
    <circle cx="44" cy="42" r="7" fill="#E8C547" stroke="#5D3A1A" strokeWidth="1.5" />
    <circle cx="32" cy="8" r="3" fill="#5D3A1A" />
    {/* Motion arc */}
    <path d="M14 48 Q32 56 50 48" stroke="#D4792C" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.5" />
  </svg>
);

const InclinedPlaneIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
    {/* Inclined plane triangle */}
    <polygon points="8,52 56,52 56,20" fill="#F2D974" stroke="#5D3A1A" strokeWidth="2" />
    {/* Block on slope */}
    <rect x="34" y="28" width="12" height="10" rx="2" fill="#D4792C" stroke="#5D3A1A" strokeWidth="1.5"
          transform="rotate(-30 40 33)" />
    {/* Arrow showing direction */}
    <line x1="42" y1="38" x2="50" y2="46" stroke="#C2703E" strokeWidth="2.5" />
    <polygon points="50,46 46,43 48,48" fill="#C2703E" />
  </svg>
);

const CircuitIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
    {/* Battery */}
    <rect x="6" y="24" width="12" height="20" rx="2" fill="#6B9E3C" stroke="#2D4A1A" strokeWidth="1.5" />
    <line x1="9" y1="28" x2="15" y2="28" stroke="white" strokeWidth="2" />
    <line x1="12" y1="25" x2="12" y2="31" stroke="white" strokeWidth="2" />
    {/* Wires */}
    <path d="M18 30 H30 V16 H50 V30" stroke="#1B4F72" strokeWidth="2" />
    <path d="M18 38 H30 V52 H50 V38" stroke="#1B4F72" strokeWidth="2" />
    {/* Bulb */}
    <circle cx="50" cy="34" r="8" fill="#F2D974" stroke="#D4792C" strokeWidth="1.5" />
    <path d="M46 34 L50 30 L54 34" stroke="#D4792C" strokeWidth="1.5" />
    {/* Glow */}
    <circle cx="50" cy="34" r="11" fill="none" stroke="#E8C547" strokeWidth="0.8" opacity="0.4" />
  </svg>
);

const RefractionIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
    {/* Prism */}
    <polygon points="32,10 12,54 52,54" fill="#1A3A5C" stroke="#0F2540" strokeWidth="1.5" />
    {/* Incoming light */}
    <line x1="2" y1="28" x2="24" y2="36" stroke="#E8C547" strokeWidth="2.5" />
    {/* Dispersed spectrum */}
    <line x1="40" y1="32" x2="60" y2="24" stroke="#CE1126" strokeWidth="2" />
    <line x1="40" y1="35" x2="62" y2="32" stroke="#D4792C" strokeWidth="2" />
    <line x1="40" y1="38" x2="62" y2="38" stroke="#E8C547" strokeWidth="2" />
    <line x1="40" y1="41" x2="62" y2="44" stroke="#6B9E3C" strokeWidth="2" />
    <line x1="40" y1="44" x2="60" y2="52" stroke="#1B4F72" strokeWidth="2" />
  </svg>
);

const LeverIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
    {/* Beam */}
    <rect x="6" y="28" width="52" height="5" rx="2" fill="#C9A84C" stroke="#5D3A1A" strokeWidth="1.5" />
    {/* Fulcrum triangle */}
    <polygon points="32,33 26,48 38,48" fill="#D4792C" stroke="#5D3A1A" strokeWidth="1.5" />
    {/* Left weight */}
    <rect x="10" y="18" width="10" height="10" rx="2" fill="#8B5E3C" stroke="#5D3A1A" strokeWidth="1.5" />
    {/* Right weight */}
    <circle cx="50" cy="22" r="6" fill="#E8C547" stroke="#5D3A1A" strokeWidth="1.5" />
    {/* Balance arrows */}
    <path d="M10 14 L15 10" stroke="#5D3A1A" strokeWidth="1" />
    <path d="M50 12 L50 16" stroke="#5D3A1A" strokeWidth="1" />
  </svg>
);

/** Simulation definitions with African warm palette. */
const simulations = [
  {
    id: 'pendulum',
    icon: <PendulumIcon />,
    title: translations.simulations.pendulum.title,
    description: translations.simulations.pendulum.description,
    color: '#D4792C',
    bgGradient: 'linear-gradient(135deg, #FDEBD0 0%, #F5CBA7 100%)',
  },
  {
    id: 'inclined-plane',
    icon: <InclinedPlaneIcon />,
    title: translations.simulations.inclinedPlane.title,
    description: translations.simulations.inclinedPlane.description,
    color: '#C2703E',
    bgGradient: 'linear-gradient(135deg, #FEF9E7 0%, #F9E79F 100%)',
  },
  {
    id: 'circuit',
    icon: <CircuitIcon />,
    title: translations.simulations.circuit.title,
    description: translations.simulations.circuit.description,
    color: '#6B9E3C',
    bgGradient: 'linear-gradient(135deg, #EAFAF1 0%, #A9DFBF 100%)',
  },
  {
    id: 'optics',
    icon: <RefractionIcon />,
    title: translations.simulations.optics.title,
    description: translations.simulations.optics.description,
    color: '#1A3A5C',
    bgGradient: 'linear-gradient(135deg, #D6EAF8 0%, #85C1E9 100%)',
  },
  {
    id: 'lever',
    icon: <LeverIcon />,
    title: translations.simulations.lever.title,
    description: translations.simulations.lever.description,
    color: '#8B5E3C',
    bgGradient: 'linear-gradient(135deg, #FDEBD0 0%, #E8C547 100%)',
  },
];

/**
 * Home page — warm African-themed simulation launcher.
 * Mobile-first 2-column grid, designed for low-end Android phones.
 */
const Home = () => {
  return (
    <div className="min-h-[calc(100dvh-52px)] pb-24 app-shell"
         style={{ background: 'linear-gradient(160deg, #FDF2E4 0%, #F0E8D8 40%, #E8EFD5 100%)' }}>
      {/* Greeting banner */}
      <div className="px-4 pt-5 pb-4"
           style={{ background: 'linear-gradient(135deg, #C2703E 0%, #A85A2A 60%, #7A8B3C 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white">
            <User size={22} />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{translations.greeting}</p>
            <p className="text-xs text-white/80">{translations.app.tagline}</p>
          </div>
        </div>
      </div>

      {/* Simulation cards grid */}
      <div className="px-3 py-4 sm:px-4 sm:py-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 px-1"
            style={{ color: '#8B7355' }}>
          {translations.nav.simulations}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {simulations.map((sim) => (
            <SimulationCard key={sim.id} {...sim} />
          ))}
        </div>
      </div>

      {/* Floating action button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-30 text-white"
        style={{ background: 'linear-gradient(135deg, #C2703E, #D4792C)' }}
        aria-label="Ajouter une simulation"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Home;
