import React from "react";

const MainMenuPage = ({ onStartGame, onResumeGame }) => {
  const savedGame = localStorage.getItem('savedGame');

  return (
    <div className="text-center space-y-5">
      <h1 className="text-4xl font-bold">CatDoku</h1>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg"
        onClick={onStartGame}
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
