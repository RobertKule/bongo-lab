import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FlaskConical, Info, Settings } from 'lucide-react';
import translations from '../../utils/translations';

const navItems = [
  { to: '/', icon: Home, label: translations.nav.home },
  { to: '/', icon: FlaskConical, label: translations.nav.simulations },
  { to: '/', icon: Info, label: translations.nav.about },
  { to: '/', icon: Settings, label: translations.nav.settings },
];

/**
 * Slide-in navigation drawer with logo and African-themed styling.
 */
const Navigation = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <nav className="nav-drawer fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="px-6 py-5 border-b border-[#E8DFD0] flex items-center gap-3">
          <img
            src="/Bongo-logo.png"
            alt="Bongo-Lab"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1B4F72' }}>
              Bongo-Lab
            </h2>
            <p className="text-xs" style={{ color: '#8B7355' }}>Menu</p>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5D3A1A] hover:bg-[#FFF3E0] active:bg-[#FFE0B2] transition-colors font-medium text-sm"
            >
              <Icon size={20} style={{ color: '#C2703E' }} />
              {label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-4 border-t border-[#E8DFD0]">
          <p className="text-xs" style={{ color: '#A89478' }}>
            v1.0 &mdash; RDC
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
