import React, { useState } from "react";

const MainMenuPage = ({ onStartGame, onResumeGame }) => {
  const [mistakesAllowed, setMistakesAllowed] = useState(3);
  const savedGame = localStorage.getItem('savedGame');

  const handleMistakesChange = (event) => {
    const value = event.target.value === "unlimited" ? Infinity : parseInt(event.target.value);
    setMistakesAllowed(value);
  };

  const handleStartGame = () => {
    onStartGame(mistakesAllowed);
  };

  return (
    <div className="text-center space-y-5">
      <h1 className="text-4xl font-bold">CatDoku</h1>

      <div className="flex justify-center items-center space-x-2">
        <label htmlFor="mistakes" className="text-lg">Mistakes Allowed:</label>
        <select
          id="mistakes"
          value={mistakesAllowed === Infinity ? "unlimited" : mistakesAllowed}
          onChange={handleMistakesChange}
          className="border border-gray-300 rounded-md"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg"
        onClick={handleStartGame}
      >
        Start Game
      </button>

      {savedGame && (
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg text-lg"
          onClick={onResumeGame}
        >
          Resume Last Game
        </button>
      )}
    </div>
  );
};

export default MainMenuPage;
