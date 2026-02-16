// src/components/SplashScreen.jsx
import React from 'react'; // ← Vérifie que React est bien importé

const SplashScreen = ({ onFinished }) => {
  // Si on arrive ici, React est chargé
  console.log('✅ SplashScreen chargé avec React:', React.version);
  
  const [fadeOut, setFadeOut] = React.useState(false); // ← Utilise React.useState explicitement

  React.useEffect(() => {
    console.log('🟢 SplashScreen useEffect');
    const timer = setTimeout(() => setFadeOut(true), 2400);
    const remove = setTimeout(() => {
      if (onFinished) onFinished();
    }, 2900);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-emerald-50 z-50 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0v60M0 30h60" stroke="%23000" stroke-width="0.5"/%3E%3C/svg%3E")' }} />

      <img
        src="/Bongo-logo.png"
        alt="Bongo-Lab"
        className="w-28 h-28 sm:w-36 sm:h-36 object-contain animate-pulse"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%231B4F72"/%3E%3Ctext x="50" y="70" font-size="50" text-anchor="middle" fill="white"%3E⚡%3C/text%3E%3C/svg%3E';
        }}
      />

      <h1 className="text-3xl sm:text-4xl font-bold tracking-wide mb-2" style={{ color: '#1B4F72' }}>
        Bongo-Lab
      </h1>

      <p className="text-sm sm:text-base font-medium mt-2" style={{ color: '#C2703E' }}>
        Apprendre le STEM autrement
      </p>
      <p className="text-xs sm:text-sm mt-1" style={{ color: '#7A8B3C' }}>
        Learning STEM differently
      </p>

      <div className="w-48 h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full" 
             style={{ width: '100%', animation: 'progress 2.4s ease-in-out forwards' }} />
      </div>

      <p className="text-xs mt-4" style={{ color: '#8B7355' }}>
        Chargement...
      </p>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;