import React, { useState, useEffect } from 'react';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [mistakesAllowed, setMistakesAllowed] = useState(3);

  useEffect(() => {
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
      setIsResuming(true);
    }
  }, []);

  const handleStartGame = (selectedMistakesAllowed) => {
    setMistakesAllowed(selectedMistakesAllowed);
    setIsGameStarted(true);
    setIsResuming(false);
  };

  const handleResumeGame = () => {
    setIsGameStarted(true);
    setIsResuming(true);
  };

  const handleReturnToMenu = () => {
    setIsGameStarted(false); // Go back to the main menu
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isGameStarted ? (
        <div className="flex flex-col justify-center items-center">
          <Game isResuming={isResuming} mistakesAllowed={mistakesAllowed} onReturnToMenu={handleReturnToMenu} />
          <button className='bg-orange-900 text-white rounded-md w-fit p-2 mt-2' onClick={handleReturnToMenu}>Return to main menu</button>
        </div>
      ) : (
        <MainMenuPage onStartGame={handleStartGame} onResumeGame={handleResumeGame} />
      )}
    </div>
  );
}

export default App;
