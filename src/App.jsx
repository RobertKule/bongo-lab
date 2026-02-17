import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Footer from './components/Layout/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import SimulationDetail from './pages/SimulationDetail';
import { isOnline, onConnectivityChange } from './utils/offline';
import translations from './utils/translations';
import './styles/index.css';

/**
 * Root application component with splash screen, routing, and offline banner.
 */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState(isOnline());
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    return onConnectivityChange(setOnline);
  }, []);

  const handleSplashFinished = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen min-h-[100dvh]">
        <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
        <Navigation open={menuOpen} onClose={() => setMenuOpen(false)} />

        {!online && (
          <div
            className="text-center text-xs py-1.5 px-4 font-medium"
            style={{ background: '#F2D974', color: '#5D3A1A' }}
          >
            {translations.status.offline}
          </div>
        )}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation/:id" element={<SimulationDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
