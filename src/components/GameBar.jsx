import React, { useState } from "react";
import pauseIcon from "../assets/pause.svg"
import playIcon from "../assets/play.svg"
import restartIcon from "../assets/restart.svg"
import deadCatIcon from "../assets/cats/deadcat.png"

const GameBar = ({ difficulty, onDifficultyChange, mistakes, timer, isPaused, onPauseToggle, onRestart, mistakesAllowed }) => {
    const handleDifficultyChange = (event) => {
        const selectedDifficulty = event.target.value;
        onDifficultyChange(selectedDifficulty);
    };

    return (
        <div className="flex flex-row justify-between items-center px-1">
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
            {mistakesAllowed < 10 && <div className="flex flex-row items-center"><img src={deadCatIcon} alt="deadCat" className="w-10 h-10 aspect-square me-1" /> {mistakes}/{mistakesAllowed}</div>}
            <div>{timer}</div>
            <button onClick={onPauseToggle}>
                {isPaused ? <img className="h-8 w-8" src={playIcon} alt="play" /> : <img className="h-7 w-7" src={pauseIcon} alt="pause" />}
            </button>
            <button onClick={onRestart}>
                <img src={restartIcon} alt="restart" className="h-7 w-7"/>
            </button>
        </div>
    );
};

export default GameBar;
