import React, { useEffect } from "react";
import cat1 from "../assets/cats/Catdoku 1.png"
import cat2 from "../assets/cats/Catdoku 2.png"
import cat3 from "../assets/cats/Catdoku 3.png"
import cat4 from "../assets/cats/Catdoku 4.png"
import cat5 from "../assets/cats/Catdoku 5.png"
import cat6 from "../assets/cats/Catdoku 6.png"
import cat7 from "../assets/cats/Catdoku 7.png"
import cat8 from "../assets/cats/Catdoku 8.png"
import cat9 from "../assets/cats/Catdoku 9.png"
import backspace from "../assets/icons/backspace.svg"
import penLogo from "../assets/icons/pen.svg"
import hintLogo from "../assets/icons/lightbulb.svg"
import videoLogo from "../assets/icons/video.svg"
import { AdMob, RewardAdPluginEvents } from "@capacitor-community/admob";
import pokiService from "../pokiService";

const CatsRow = ({ onNumberClick, isSelected, onEraseClick, isNotesMode, toggleNotesMode, isPaused, revealNumber, freeHintUsed, setFreeHintUsed, setLoadingAd, setIsAd }) => {
  const cats = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9];

  const handleCatClick = (event, index) => {
    event.stopPropagation();
    onNumberClick(index + 1);
  };

  const handleHintClick = async () => {
    if (!freeHintUsed) {
      setFreeHintUsed(true);
      revealNumber();
    } else {
      try {
        console.log(process.env.REACT_APP_ACTIVE_SYSTEM)
        setIsAd(true)
        setLoadingAd(true);
        switch (process.env.REACT_APP_ACTIVE_SYSTEM) {
          case 'android':
            await AdMob.prepareRewardVideoAd({
              adId: 'ca-app-pub-3940256099942544/5224354917',
            });
            await AdMob.showRewardVideoAd();
            break;

          case 'ios':
            await AdMob.prepareRewardVideoAd({
              adId: '',
            });
            await AdMob.showRewardVideoAd();
            break;

          case 'poki':
            await pokiService.showRewardedAd();
            break;

          case 'itch.io':
            setLoadingAd(false);
            setIsAd(false);
            // revealNumber()
            break;

          default:
            console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
            setLoadingAd(false);
            setIsAd(false);
            break;
        };

      } catch (error) {
        console.log("Failed to show rewarded ad:", error);
        setLoadingAd(false);
        setIsAd(false)
      }
      finally {
        setLoadingAd(false);
      }
    }
  };

  useEffect(() => {
    if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios') {

      let adDismissListener, adRewardListener;

      const addAdListeners = async () => {
        adDismissListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          setIsAd(false);
        });

        adRewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
          revealNumber();
        });
      };

      addAdListeners();

      return () => {
        if (adDismissListener) {
          adDismissListener.remove();
        }
        if (adRewardListener) {
          adRewardListener.remove();
        }
      };
    }
  }, [setIsAd, revealNumber]);

  return (
    <div className="flex flex-col space-y-2">
      <div className={`flex flex-row justify-between px-2 sm:px-0`}>
        {cats.map((cat, index) => (
          <div
            key={index}
            onClick={(event) => handleCatClick(event, index)}
            className={`number font-bold cat`}
            disabled={!isSelected}
          >
            <img src={cat} alt={`Cat ${index + 1}`} className="w-full h-full max-w-11 max-h-11 lg:max-w-12 lg:max-h-12 xl:max-w-14 xl:max-h-14 aspect-square" />
          </div>
        ))}

      </div>

      <div className="flex justify-center items-center space-x-5">
        <button
          className={`p-1 rounded shadow ${isNotesMode ? 'bg-green-500 text-white' : 'bg-slate-300 text-black'}`}
          onClick={toggleNotesMode}
          disabled={isPaused}
        >
          {isNotesMode ? <img src={penLogo} alt={"pen"} className="h-10 w-10" /> : <img src={penLogo} alt={"pen"} className="h-7 w-7" />}
        </button>

        <button
          className={`bg-red-300 p-1 shadow-md text-xs rounded`}
          onClick={onEraseClick}
          disabled={!isSelected || isPaused}
        >
          <img src={backspace} alt="backspace" className="h-7 w-7" />
        </button>

        <div className="relative">
          <button
            className="bg-yellow-400 text-white p-1 shadow-md rounded relative"
            onClick={handleHintClick}
            disabled={isPaused}
          >
            <img src={hintLogo} alt="hint" className="h-7 w-7" />
          </button>
          <div className="absolute top-[-0.4rem] right-[-0.4rem] h-4 w-4 z-10"
          >
            {!freeHintUsed ?
              "1" :
              <img
                src={freeHintUsed ? videoLogo : "1"}
                alt="video hint"
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatsRow;
