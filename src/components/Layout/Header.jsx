import React from 'react';
import { Menu, X } from 'lucide-react';

/**
 * App header with Bongo-Lab logo and hamburger menu.
 * Uses the actual logo icon with app name in deep blue.
 */
const Header = ({ menuOpen, onToggleMenu }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8DFD0] px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src="/Bongo-logo.png"
          alt="Bongo-Lab logo"
          className="w-9 h-9 object-contain"
        />
        <h1
          className="text-lg font-bold tracking-wide"
          style={{ color: '#1B4F72' }}
        >
          Bongo-Lab
        </h1>
      </div>
      <button
        onClick={onToggleMenu}
        className="p-2 rounded-lg text-[--color-earth-brown] hover:bg-[--color-off-white] active:bg-[#E8DFD0] transition-colors"
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default Header;
