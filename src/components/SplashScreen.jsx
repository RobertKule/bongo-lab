import React, { useState, useEffect } from 'react';

/**
 * Splash/loading screen displayed on app startup.
 * Shows the Bongo-Lab logo, a progress bar, and bilingual taglines
 * over a subtle circuit pattern background.
 */
const SplashScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2400);
    const remove = setTimeout(() => onFinished(), 2900);
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, [onFinished]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Circuit pattern background */}
      <div className="splash-circuit-bg" />

      {/* Logo */}
      <div className="splash-logo relative z-10 mb-6">
        <img
          src="/Bongo-logo.png"
          alt="Bongo-Lab"
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
        />
      </div>

      {/* App name */}
      <h1 className="relative z-10 text-3xl sm:text-4xl font-bold tracking-wide mb-2"
          style={{ color: '#1B4F72' }}>
        Bongo-Lab
      </h1>

      {/* Taglines */}
      <p className="relative z-10 text-sm sm:text-base font-medium mt-2"
         style={{ color: '#C2703E' }}>
        Apprendre le STEM autrement
      </p>
      <p className="relative z-10 text-xs sm:text-sm mt-1"
         style={{ color: '#7A8B3C' }}>
        Learning STEM differently
      </p>

      {/* Progress bar */}
      <div className="splash-progress relative z-10">
        <div className="splash-progress-bar" />
      </div>

      {/* Loading text */}
      <p className="relative z-10 text-xs mt-4"
         style={{ color: '#8B7355' }}>
        Chargement...
      </p>
    </div>
  );
};

export default SplashScreen;
