import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import logo from "../assets/Catdoku-logo_rounded.png"
import hat from '../assets/icons/academicHat.svg';
import chartBar from "../assets/icons/chart_bar.svg"
import { Storage } from '@capacitor/storage';
import { useNavigate } from "react-router-dom";
import SettingsDropdown from "../components/SettingsDropdown";

const MainMenuPage = ({ soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled }) => {
  const navigate = useNavigate();
  const [mistakesAllowed, setMistakesAllowed] = useState(3);
  const [difficulty, setDifficulty] = useState("Medium");
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isMistakesOpen, setIsMistakesOpen] = useState(false);

  const handleStartGame = () => {
    navigate(`/game?mistakesAllowed=${mistakesAllowed}&difficulty=${difficulty}&isResuming=false`);
  };

  const handleResumeGame = () => {
    navigate(`/game?isResuming=true`);
  };

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedGame = await Storage.get({ key: 'grid' });
      setHasSavedGame(savedGame.value !== null);
    };
    checkSavedGame();
  }, []);

  const handleMistakesSelect = (value) => {
    setMistakesAllowed(value);
    setIsMistakesOpen(false);
  };

  const handleDifficultySelect = (value) => {
    setDifficulty(value);
    setIsDifficultyOpen(false);
  };

  const handleViewBestTimes = () => {
    navigate("/best-times");
  };

  const handleHowToPlay = () => {
    navigate("/how-to-play");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center mt-20 mb-10 landscape:mt-10">
        <img src={logo} alt="logo" className="w-56 aspect-square shadow rounded-[1.25rem]" />
        <h1 className="text-4xl font-bold text-center mt-3">MiawDoku!</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center space-y-4 mb-10">
        <div className="flex items-center space-x-2">
          <label className="text-md font-semibold">Mistakes :</label>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsMistakesOpen(!isMistakesOpen)}
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {mistakesAllowed === Infinity ? "Unlimited" : mistakesAllowed}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </button>

            {isMistakesOpen && (
              <div className="absolute z-10 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <p
                      key={num}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      onClick={() => handleMistakesSelect(num)}
                    >
                      {num}
                    </p>
                  ))}
                  <p
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    onClick={() => handleMistakesSelect(Infinity)}
                  >
                    &#8734;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-md font-semibold">Difficulty :</label>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </button>

            {isDifficultyOpen && (
              <div className="absolute z-10 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <p
                      key={level}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      onClick={() => handleDifficultySelect(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="bg-red-800 text-white px-4 py-2 rounded-lg text-lg font-semibold"
          onClick={handleStartGame}
        >
          Start New Game
        </button>

        {hasSavedGame && (
          <button
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-lg font-semibold"
            onClick={handleResumeGame}
          >
            Resume Last Game
          </button>
        )}

        <div className="space-x-4">
          <button
            onClick={handleViewBestTimes}
            className="bg-emerald-500 rounded-md shadow-md w-fit p-2"
          >
            <img src={chartBar} alt="chartbar" className="w-7 h-7" />
          </button>

          <button
            onClick={handleHowToPlay}
            className="bg-yellow-500 rounded-md shadow-md w-fit p-2"
          >
            <img src={hat} alt="chartbar" className="w-7 h-7" />
          </button>
        </div>

        <SettingsDropdown
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            vibrationEnabled={vibrationEnabled}
            setVibrationEnabled={setVibrationEnabled}
          />
      </div>
    </div>
  );
};

export default MainMenuPage;
