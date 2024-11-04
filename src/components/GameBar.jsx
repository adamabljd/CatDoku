import React from "react";
import pauseIcon from "../assets/icons/pause.svg"
import playIcon from "../assets/icons/play.svg"
import restartIcon from "../assets/icons/restart.svg"
import deadCatIcon from "../assets/cats/deadcat.png"
import SettingsDropdown from "../components/SettingsDropdown";

const GameBar = ({ difficulty, mistakes, timer, isPaused, onPauseToggle, onRestart, mistakesAllowed, soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled }) => {

    return (
        <div className="flex flex-row justify-between items-center px-1">
            <p>{difficulty}</p>
            {mistakesAllowed < 10 && <div className="flex flex-row items-center"><img src={deadCatIcon} alt="deadCat" className="w-8 h-8 aspect-square me-1" /> {mistakes}/{mistakesAllowed}</div>}
            <div>{timer}</div>
            <button onClick={onPauseToggle}>
                {isPaused ? <img className="h-8 w-8" src={playIcon} alt="play" /> : <img className="h-7 w-7" src={pauseIcon} alt="pause" />}
            </button>
            <button onClick={onRestart}>
                <img src={restartIcon} alt="restart" className="h-7 w-7" />
            </button>
            <div>
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

export default GameBar;
