import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';
import BestTimesPage from './pages/BestTimesPage';
import HowToPlayPage from './pages/HowToPlayPage';
import { AdMob } from '@capacitor-community/admob';
import pokiService from './pokiService';

function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios') {
      // Initialize AdMob
      const initializeAdMob = async () => {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          // testingDevices: [],
          // initializeForTesting: true
        });
      };

      initializeAdMob();
    }
  }, []);

  useEffect(() => {
    if (process.env.REACT_APP_ACTIVE_SYSTEM === 'poki') {

      pokiService.init()
        .then(() => console.log("Poki SDK initialized"))
        .catch((error) => console.error("Failed to initialize Poki SDK:", error));
      // Prevent page jumps from specific keys and mouse wheel
      const preventPageJumps = (ev) => {
        if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
          ev.preventDefault();
        }
      };

      const preventWheelScroll = (ev) => ev.preventDefault();

      // Add event listeners
      window.addEventListener('keydown', preventPageJumps);
      window.addEventListener('wheel', preventWheelScroll, { passive: false });

      // Cleanup event listeners on unmount
      return () => {
        window.removeEventListener('keydown', preventPageJumps);
        window.removeEventListener('wheel', preventWheelScroll);
      };
    }
  }, []);

  return (
    <Router basename="/">
      <div className="min-h-screen bg-beige px-3">
        <Routes>
          <Route path="/" element={<MainMenuPage
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            vibrationEnabled={vibrationEnabled}
            setVibrationEnabled={setVibrationEnabled} />} />
          <Route path="/game" element={<div className="min-h-screen flex flex-col justify-center items-center">
            <Game
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              vibrationEnabled={vibrationEnabled}
              setVibrationEnabled={setVibrationEnabled}
            />
          </div>} />
          <Route path="/best-times" element={<BestTimesPage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
