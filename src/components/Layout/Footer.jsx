// src/components/Layout/Footer.jsx
import React from 'react';
import { Heart, Github } from 'lucide-react';

/** Warm-toned footer with DRC credits - optimisé et responsive */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Copyright avec coeur */}
        <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <span>Bongo-Lab © {currentYear}</span>
          <span className="hidden sm:inline">—</span>
          <span className="flex items-center gap-1">
            Fait avec <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> 
            pour l'éducation en RDC
          </span>
        </p>

        {/* Liens utiles */}
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/RobertKule/bongo-lab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github size={14} />
            <span className="hidden xs:inline">GitHub</span>
          </a>
          
          <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            ↑ Haut de page
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;