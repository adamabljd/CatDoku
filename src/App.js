import React, { useState, useEffect } from 'react';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  useEffect(() => {
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
      setIsResuming(true);
    }
  }, []);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsResuming(false)
  };

  const handleResumeGame = () => {
    setIsGameStarted(true);
    setIsResuming(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isGameStarted ? (
        <Game isResuming={isResuming} />
      ) : (
        <MainMenuPage onStartGame={handleStartGame} onResumeGame={handleResumeGame} />
      )}
    </div>
  );
}

export default App;
