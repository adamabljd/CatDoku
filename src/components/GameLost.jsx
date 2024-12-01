import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/icons/house.svg';
import videoLogo from '../assets/icons/video.svg';
import { AdMob, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import LoadingScreen from '../pages/LoadingScreen';
import gameLostUI from '../assets/UI/gameLostUI.png';

const GameLost = ({ mistakes, setMistakes, setGameOver, setLoadingAd, setIsAd }) => {
    const navigate = useNavigate();
    const [homeLoadingScreen, setHomeLoadingScreen] = useState(false)

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState("");
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const tooltipTimeoutRef = useRef(null);
    const extraMistakeButtonRef = useRef(null);


    const bannerTest = 'ca-app-pub-3940256099942544/6300978111'
    const interTest = 'ca-app-pub-3940256099942544/1033173712'
    const rewardedTest = 'ca-app-pub-3940256099942544/5224354917'

    const handleReturnToMenu = async () => {
        try {
            setHomeLoadingScreen(true);
            let adShown = false;
            switch (process.env.REACT_APP_ACTIVE_SYSTEM) {
                case 'android':
                    await AdMob.prepareInterstitial({ adId: interTest });
                    await AdMob.showInterstitial();
                    adShown = true;
                    break;
                case 'ios':
                    await AdMob.prepareInterstitial({ adId: "ca-app-pub-7381288019033542/3257291179" });
                    await AdMob.showInterstitial();
                    adShown = true;
                    break;
                case 'test':
                    await AdMob.prepareInterstitial({ adId: interTest });
                    await AdMob.showInterstitial();
                    // adShown = true;
                    break;
                default:
                    console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
                    break;
            }

            if (adShown) {
                const adDismissListener = await AdMob.addListener(
                    InterstitialAdPluginEvents.Dismissed,
                    () => {
                        setHomeLoadingScreen(false);
                        navigate("/");
                        adDismissListener.remove();
                    }
                );
            } else {
                setHomeLoadingScreen(false);
                navigate("/");
            }
        } catch (error) {
            console.log("Error showing interstitial ad:", error);
            setHomeLoadingScreen(false);
            navigate("/");
        }
    };

    const handleExtraMistakeClick = async (event) => {
        try {
            setIsAd(true)
            setLoadingAd(true);
            switch (process.env.REACT_APP_ACTIVE_SYSTEM) {
                case 'android':
                    await AdMob.prepareRewardVideoAd({
                        // adId: 'ca-app-pub-7381288019033542/4907837661',
                        adId: rewardedTest
                    });
                    await AdMob.showRewardVideoAd();
                    break;

                case 'ios':
                    await AdMob.prepareRewardVideoAd({
                        adId: 'ca-app-pub-7381288019033542/2684504166',
                        // adId: rewardedTest
                    });
                    await AdMob.showRewardVideoAd();
                    break;

                case 'test':
                    await AdMob.prepareRewardVideoAd({
                        adId: rewardedTest
                    });
                    await AdMob.showRewardVideoAd();
                    break;

                default:
                    setTooltipMessage("Extra Mistake feature only available on iOS and Android");
                    setTooltipPosition({ top: event.clientY - 50, left: event.clientX - 30 });
                    setShowTooltip(true);

                    if (tooltipTimeoutRef.current) {
                        clearTimeout(tooltipTimeoutRef.current);
                    }

                    tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 5000);
                    setLoadingAd(false);
                    setIsAd(false);
                    break;
            };
        } catch (error) {
            console.log("Failed to show rewarded ad:", error);
            setLoadingAd(false);
            setIsAd(false);
        } finally {
            setLoadingAd(false);
        }
    };

    useEffect(() => {
        if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios' || process.env.REACT_APP_ACTIVE_SYSTEM === 'test') {
            let adDismissListener, adRewardListener;

            const addAdListeners = async () => {
                adDismissListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                    setIsAd(false);
                });

                adRewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
                    setMistakes((prevMistakes) => prevMistakes - 1);
                    setGameOver(false)
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
        return () => clearTimeout(tooltipTimeoutRef.current);
    }, [setIsAd, setMistakes, setGameOver]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (showTooltip && !extraMistakeButtonRef.current.contains(event.target)) {
                setShowTooltip(false);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => document.removeEventListener("click", handleDocumentClick);
    }, [showTooltip]);

    return (
        <>
            {homeLoadingScreen && <LoadingScreen />}
            {!homeLoadingScreen && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-60 bg-black z-40 font-coffee">
                    <div className='relative flex justify-center -mt-10 ms-2'>
                        <img src={gameLostUI} alt='game lost ui' className='w-72' />
                        <span className="absolute text-white text-3xl top-[4.2rem] -ms-2">
                            Game Over !
                        </span>
                        <span className="absolute text-white text-md top-[6.2rem] -ms-2">
                            You've made {mistakes} mistakes!
                        </span>

                        <button
                            ref={extraMistakeButtonRef}
                            className="absolute flex text-white text-sm top-[9.25rem]"
                            onClick={handleExtraMistakeClick}
                        >
                            Extra Mistake? Watch ad<img src={videoLogo} alt="adlogo" className="mx-2 h-4 w-4 shadow-sm" />
                        </button>
                        {showTooltip && (
                            <div style={{ position: 'absolute', top: tooltipPosition.top, left: tooltipPosition.left }} className="bg-black text-white text-sm rounded-md p-2 shadow-lg z-50">
                                {tooltipMessage}
                            </div>
                        )}

                        <button
                            className="absolute flex top-[12.2rem] -ms-[0.45rem] p-2"
                            onClick={handleReturnToMenu}
                        >
                            <img src={houseLogo} alt="house" className="h-7 w-7" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameLost;
