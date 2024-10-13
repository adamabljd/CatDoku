import React, { useState } from "react";

const GameBar = ({ onDifficultyChange, mistakes, score, timer, isPaused, onPauseToggle, onRestart }) => {
    const [difficulty, setDifficulty] = useState("medium");

    const handleDifficultyChange = (event) => {
        const selectedDifficulty = event.target.value;
        setDifficulty(selectedDifficulty);
        onDifficultyChange(selectedDifficulty);
    };

    return (
        <div className="flex flex-row justify-between items-center text-xs">
            <div className="flex flex-col items-start">
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    className="border border-gray-300 rounded-md"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            <div>Mistakes {mistakes}/3</div>
            <div>Score : {score}</div>
            <div>{timer}</div>
            <button className="bg-gray-300 rounded-md p-1 text-xs" onClick={onPauseToggle}>
                {isPaused ? "Resume" : "Pause"}
            </button>
            <button onClick={onRestart} className="border border-gray-300 p-1">
                Restart
            </button>
        </div>
    );
};

export default GameBar;
