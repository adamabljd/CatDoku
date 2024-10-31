import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';
import BestTimesPage from './pages/BestTimesPage'; // Import leaderboard if created
import houseLogo from './assets/house.svg';
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
  const navigate = useNavigate();
  const [mistakesAllowed, setMistakesAllowed] = useState(3);
  const [difficulty, setDifficulty] = useState("medium");
  const [isResuming, setIsResuming] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMistakesAllowed(parseInt(params.get("mistakesAllowed")) || 3);
    setDifficulty(params.get("difficulty") || "medium");
    setIsResuming(params.get("isResuming") === "true");
  }, []);

  const handleReturnToMenu = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Game
        isResuming={isResuming}
        mistakesAllowed={mistakesAllowed}
        initialDifficulty={difficulty}
        onReturnToMenu={handleReturnToMenu}
      />
      <button
        className="bg-stone-400 shadow-md text-white rounded-md w-fit p-2 mt-4"
        onClick={handleReturnToMenu}
      >
        <img src={houseLogo} alt="house" className="h-7 w-7" />
      </button>
    </div>
  );
};

export default App;
