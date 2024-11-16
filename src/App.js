import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';
import BestTimesPage from './pages/BestTimesPage';
import HowToPlayPage from './pages/HowToPlayPage';
import { AdMob } from '@capacitor-community/admob';

function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios') {
      const initializeAdMob = async () => {
        try {
          await AdMob.initialize({
            requestTrackingAuthorization: true,
            // testingDevices: [],
            // initializeForTesting: true
          });
        } catch (error) {
          console.error('AdMob initialization failed:', error);
        }
      };

      initializeAdMob();
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
