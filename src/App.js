import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';
import BestTimesPage from './pages/BestTimesPage';
import { Storage } from '@capacitor/storage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-beige px-3">
        <Routes>
          <Route path="/" element={<MainMenuWrapper />} />
          <Route path="/game" element={<GameWrapper />} />
          <Route path="/best-times" element={<BestTimesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrappers to manage additional logic and state for each page
const MainMenuWrapper = () => {
  const navigate = useNavigate();
  const [isResuming, setIsResuming] = useState(false);

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedGame = await Storage.get({ key: 'grid' });
      if (savedGame.value) {
        setIsResuming(true);
      }
    };
    checkSavedGame();
  }, []);

  const handleStartGame = (mistakesAllowed, difficulty) => {
    navigate(`/game?mistakesAllowed=${mistakesAllowed}&difficulty=${difficulty}&isResuming=false`);
  };

  const handleResumeGame = () => {
    navigate(`/game?isResuming=true`);
  };

  return (
    <MainMenuPage onStartGame={handleStartGame} onResumeGame={handleResumeGame} />
  );
};

const GameWrapper = () => {
  
  const [searchParams] = useSearchParams();

  // Get values directly from URL params
  const mistakesAllowedParam = searchParams.get("mistakesAllowed");
  const mistakesAllowed = mistakesAllowedParam === "Infinity" || mistakesAllowedParam === "Unlimited"
    ? Infinity
    : parseInt(mistakesAllowedParam) || 3;
  const difficulty = searchParams.get("difficulty") || "Medium";
  const isResuming = searchParams.get("isResuming") === "true";

  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Game
        isResuming={isResuming}
        mistakesAllowed={mistakesAllowed}
        initialDifficulty={difficulty}
      />
    </div>
  );
};

export default App;
