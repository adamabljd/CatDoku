import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';
import BestTimesPage from './pages/BestTimesPage';
import HowToPlayPage from './pages/HowToPlayPage';

function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <Router>
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
