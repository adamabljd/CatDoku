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
    if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios' || process.env.REACT_APP_ACTIVE_SYSTEM === 'test') {
      const initializeAdMob = async () => {
        try {
          await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: ['73FD3B2E-5E3A-4DE8-A69B-10E98045AFBA', 'A8C72CE7-4238-4F7E-AC3C-CE0507E53C09'],
            initializeForTesting: true
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
