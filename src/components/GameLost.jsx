import React from 'react';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/icons/house.svg';
import videoLogo from '../assets/icons/video.svg';
import { AdMob } from '@capacitor-community/admob';

const GameLost = ({ mistakes, setMistakes, setGameOver, setLoadingAd }) => {
    const navigate = useNavigate();

    const handleReturnToMenu = () => {
        navigate("/");
    };

    const handleExtraMistakeClick = async () => {
          try {
            setLoadingAd(true);
            let result = null
            switch (process.env.REACT_APP_ACTIVE_SYSTEM) {
              case 'android':
                await AdMob.prepareRewardVideoAd({
                  adId: 'ca-app-pub-3940256099942544/5224354917',
                });
                result = await AdMob.showRewardVideoAd();
                setLoadingAd(false);
                break;
    
              case 'ios':
                await AdMob.prepareRewardVideoAd({
                  adId: '',
                });
                result = await AdMob.showRewardVideoAd();
                setLoadingAd(false);
                break;
    
              case 'poki':
                console.log("Poki ads will be implemented here.");
                break;
    
              default:
                console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
                break;
            };
    
            if (result) {
                setMistakes((prevMistakes) => prevMistakes - 1);
                setGameOver(false)
            }
          } catch (error) {
            console.log("Failed to show rewarded ad:", error);
            setLoadingAd(false);
          }
        
      };
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-60 bg-black z-50">
            <div className="text-center p-6 mx-2 bg-white rounded-lg shadow-lg max-w-full">
                <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h2>
                <p className="text-xl text-gray-700 mb-6">You've made <span className='font-bold text-red-600'>{mistakes}</span> mistakes!</p>
                <div className="flex items-center justify-center mt-4 mb-5">
                    <button
                        className="bg-blue-500 shadow-md text-white text-lg rounded-md w-fit p-4 flex items-center justify-center font-bold"
                        onClick={handleExtraMistakeClick}
                    >
                        Extra Mistake? <img src={videoLogo} alt="adlogo" className="ms-3 h-6 w-6 shadow-sm" />
                    </button>
                </div>
                <div className="flex items-center justify-center mt-4 mb-5">
                    <button
                        className="bg-stone-400 shadow-md text-white rounded-md w-fit p-2"
                        onClick={handleReturnToMenu}
                    >
                        <img src={houseLogo} alt="house" className="h-7 w-7" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameLost;
