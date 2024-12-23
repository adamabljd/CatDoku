/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import logo from "../assets/Catdoku-logo_rounded.png"
import { Storage } from '@capacitor/storage';
import { useNavigate } from "react-router-dom";
import SettingsDropdown from "../components/SettingsDropdown";
import { AdMob, BannerAdPosition } from '@capacitor-community/admob';
import playBtn from "../assets/UI/PlayBtn.png";
import resumeBtn from "../assets/UI/ResumeBtn.png";
import lbIcon from "../assets/UI/LeaderBoardIcon.png";
import htpIcon from "../assets/UI/howToPlay.png";
import mistakesIcon from '../assets/UI/mistakesUI.png';
import heartFilled from '../assets/UI/heartFilled.png';
import heartEmpty from '../assets/UI/heartEmpty.png';



const MainMenuPage = ({ soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled }) => {
  const navigate = useNavigate();
  const [mistakesAllowed, setMistakesAllowed] = useState(3);
  const [difficulty, setDifficulty] = useState("Easy");
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isMistakesOpen, setIsMistakesOpen] = useState(false);
  const isInifity = useRef(false)

  const [isMediumUnlocked, setIsMediumUnlocked] = useState(false);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [isExpertUnlocked, setIsExpertUnlocked] = useState(false);
  const [isMasterUnlocked, setIsMasterUnlocked] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false); // Tooltip state
  const [tooltipMessage, setTooltipMessage] = useState(""); // Tooltip message
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  const bannerTest = 'ca-app-pub-3940256099942544/6300978111'
  const interTest = 'ca-app-pub-3940256099942544/1033173712'
  const rewardedTest = 'ca-app-pub-3940256099942544/5224354917'

  const showAd = async () => {
    try {
      switch (process.env.REACT_APP_ACTIVE_SYSTEM) {
        case 'android':
          await AdMob.showBanner({
            // adId: 'ca-app-pub-7381288019033542/2071389944',
            adId: bannerTest,
            position: BannerAdPosition.BOTTOM_CENTER,
            size: "SMART_BANNER",
          });
          break;

        case 'ios':
          await AdMob.showBanner({
            adId: 'ca-app-pub-7381288019033542/1161610875',
            // adId: bannerTest,
            position: BannerAdPosition.BOTTOM_CENTER,
            size: "SMART_BANNER",
          });
          break;

        case 'test':
          await AdMob.showBanner({
            adId: bannerTest,
            position: BannerAdPosition.BOTTOM_CENTER,
            size: "SMART_BANNER",
          });
          break;

        default:
          console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
          break;
      }
    } catch (error) {
      console.error('AdMob Banner failed:', error);
    }
  };

  useEffect(() => {
    if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios' || process.env.REACT_APP_ACTIVE_SYSTEM === 'test') {
      AdMob.removeBanner().then(() => {
        showAd();
      }).catch((error) => console.error("Failed to remove AdMob banner:", error));

      return () => {
        AdMob.removeBanner();
      };
    }
  }, []);


  const handleStartGame = () => {
    navigate(`/game?mistakesAllowed=${mistakesAllowed}&difficulty=${difficulty}&isResuming=false`);
  };

  const handleResumeGame = () => {
    navigate(`/game?isResuming=true`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTooltip(false); // Hide tooltip if clicked outside
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedGame = await Storage.get({ key: 'grid' });
      setHasSavedGame(savedGame.value !== null);
    };

    const loadWinCounts = async () => {
      const easyWinsData = await Storage.get({ key: 'winCount_Easy_3' });
      const mediumWinsData = await Storage.get({ key: 'winCount_Medium_3' });
      const hardWinsData = await Storage.get({ key: 'winCount_Hard_3' });
      const expertWinsData = await Storage.get({ key: 'winCount_Expert_3' });

      // Parse the values and handle null values by defaulting to 0
      const easyWins = parseInt(easyWinsData.value) || 0;
      const mediumWins = parseInt(mediumWinsData.value) || 0;
      const hardWins = parseInt(hardWinsData.value) || 0;
      const expertWins = parseInt(expertWinsData.value) || 0;

      if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios') {
        setIsMediumUnlocked(easyWins >= 5);
        setIsHardUnlocked(mediumWins >= 3);
        setIsExpertUnlocked(hardWins >= 2);
        setIsMasterUnlocked(expertWins >= 1);
      } else {
        setIsMediumUnlocked(true);
        setIsHardUnlocked(true);
        setIsExpertUnlocked(true);
        setIsMasterUnlocked(true);
      }
    };

    checkSavedGame();
    loadWinCounts();

  }, []);

  const handleMistakesSelect = (value) => {
    setMistakesAllowed(value);
    setIsMistakesOpen(false);
  };

  const handleDifficultySelect = (value, event) => {
    if (
      (value === "Medium" && !isMediumUnlocked) ||
      (value === "Hard" && !isHardUnlocked) ||
      (value === "Expert" && !isExpertUnlocked) ||
      (value === "Master" && !isMasterUnlocked)
    ) {
      let unlockMessage = "";
      switch (value) {
        case "Medium":
          unlockMessage = "Win 5 Easy games with 3 Mistakes Allowed to unlock Medium level.";
          break;
        case "Hard":
          unlockMessage = "Win 3 Medium games with 3 Mistakes Allowed to unlock Hard level.";
          break;
        case "Expert":
          unlockMessage = "Win 2 Hard games with 3 Mistakes Allowed to unlock Expert level.";
          break;
        case "Master":
          unlockMessage = "Win 1 Expert game with 3 Mistakes Allowed to unlock Master level.";
          break;
        default:
          unlockMessage = "Level locked. Complete prerequisites to unlock.";
      }
      setTooltipMessage(unlockMessage);
      setTooltipPosition({ top: event.clientY - 50, left: event.clientX - 30 });
      setShowTooltip(true);

      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      // Set a new timeout to hide the tooltip after 5 seconds
      tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 5000);
      return;
    }
    setDifficulty(value);
    setIsDifficultyOpen(false);
  };

  useEffect(() => {
    return () => clearTimeout(tooltipTimeoutRef.current);
  }, []);

  const handleViewBestTimes = () => {
    navigate("/best-times");
  };

  const handleHowToPlay = () => {
    navigate("/how-to-play");
  };


  return (
    <div className="flex flex-col pb-10 landscape:pb-20 font-coffee">
      <div className="flex flex-col items-center mt-20 mb-10 landscape:mt-10">
        <img src={logo} alt="logo" className="w-56 aspect-square shadow rounded-[1.25rem]" />
        <h1 className="text-4xl text-center mt-3">MiawDoku!</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center space-y-4 mb-10">
        <div className="flex items-center justify-center">
          <div
            className="relative flex justify-center h-10 cursor-pointer"
          >
            <img
              className="h-10"
              src={mistakesIcon}
              alt="mistakesIcon"
            />

            <span className="absolute text-white text-md top-[0.65rem] ms-8">
              Mistakes :
            </span>
          </div>

          <div className="flex space-x-2 items-center ms-2">
            {Array.from({ length: 5 }, (_, index) => (
              <img
                key={index}
                src={index < mistakesAllowed ? heartFilled : heartEmpty}
                alt="Heart"
                className="w-4 h-4 cursor-pointer"
                onClick={() => handleMistakesSelect(index + 1)}
              />
            ))}

            <div className="relative flex justify-center cursor-pointer" onClick={() => handleMistakesSelect(Infinity)}>
              <img
                src={mistakesAllowed === Infinity ? heartFilled : heartEmpty}
                alt="Heart"
                className="w-6 h-6"
              />
              <span className="absolute text-xl text-black -top-[0.095rem]">
                &#8734;
              </span>
            </div>
          </div>
        </div>



        <div className="flex items-center space-x-2">
          <label className="text-md">Difficulty :</label>
          <div ref={dropdownRef} className="relative inline-block text-left">
            <button
              onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </button>

            {isDifficultyOpen && (
              <div className="absolute z-10 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {["Easy", "Medium", "Hard", "Expert", "Master"].map((level) => (
                    <p
                      key={level}
                      className={`block px-4 py-2 text-sm cursor-pointer ${(level === "Medium" && !isMediumUnlocked) ||
                        (level === "Hard" && !isHardUnlocked) ||
                        (level === "Expert" && !isExpertUnlocked) ||
                        (level === "Master" && !isMasterUnlocked)
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      onClick={() => handleDifficultySelect(level, event)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="relative flex justify-center w-32 h-16 cursor-pointer"
          onClick={handleStartGame}
        >
          <img
            className="h-16"
            src={playBtn}
            alt="playbtn"
          />

          <span className="absolute text-white text-xl top-7">
            Play !
          </span>
        </div>



        {hasSavedGame && (
          <div
            className="relative flex justify-center w-32 h-16 cursor-pointer"
            onClick={handleResumeGame}
          >
            <img
              className="h-16"
              src={resumeBtn}
              alt="resumeBtn"
            />

            <span className="absolute text-white text-xl top-7">
              Resume !
            </span>
          </div>
        )}

        <div className="space-x-4">
          <button
            onClick={handleViewBestTimes}
            className="bg-emerald-500 rounded-md shadow-md w-fit p-2"
          >
            <img src={lbIcon} alt="chartbar" className="w-9 h-9" />
          </button>

          <button
            onClick={handleHowToPlay}
            className="bg-blue-300 rounded-md shadow-md w-fit p-2"
          >
            <img src={htpIcon} alt="chartbar" className="w-9 h-9" />
          </button>
        </div>

        <SettingsDropdown
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          vibrationEnabled={vibrationEnabled}
          setVibrationEnabled={setVibrationEnabled}
        />

        {showTooltip && (
          <div style={{ position: 'absolute', top: tooltipPosition.top, left: tooltipPosition.left }} className="bg-black text-white text-sm rounded-md p-2 shadow-lg z-50">
            {tooltipMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMenuPage;
