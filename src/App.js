import React, { useState, useEffect } from 'react';
import Game from './pages/Game';
import MainMenuPage from './pages/MainMenuPage';
import houseLogo from './assets/house.svg'
import { Storage } from '@capacitor/storage';

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [mistakesAllowed, setMistakesAllowed] = useState(3);
  const [difficulty, setDifficulty] = useState("medium");

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedGame = await Storage.get({ key: 'grid' });
      if (savedGame.value) {
        setIsResuming(true);
      }
    };
    checkSavedGame();
  }, []);
  

  const handleStartGame = (selectedMistakesAllowed, selectedDifficulty) => {
    setMistakesAllowed(selectedMistakesAllowed);
    setDifficulty(selectedDifficulty);
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
    <div className="min-h-screen bg-beige px-3">
      {isGameStarted ? (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <Game isResuming={isResuming} mistakesAllowed={mistakesAllowed} onReturnToMenu={handleReturnToMenu} initialDifficulty={difficulty} />
          <button className='bg-stone-400 shadow-md text-white rounded-md w-fit p-2 mt-4' onClick={handleReturnToMenu}><img src={houseLogo} alt='house' className='h-7 w-7' /></button>
        </div>
      ) : (
        <MainMenuPage onStartGame={handleStartGame} onResumeGame={handleResumeGame} />
      )}
    </div>
  );
}

export default App;
