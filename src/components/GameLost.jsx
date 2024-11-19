/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/icons/house.svg';
import videoLogo from '../assets/icons/video.svg';
import { AdMob, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import LoadingScreen from '../pages/LoadingScreen';

const GameLost = ({ mistakes, setMistakes, setGameOver, setLoadingAd, setIsAd, isAd }) => {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const extraMistakeGiven = () => {
        setIsAd(false);
        setMistakes((prevMistakes) => prevMistakes - 1);
        setGameOver(false);
    }


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
                    await AdMob.prepareInterstitial({ adId: interTest });
                    await AdMob.showInterstitial();
                    adShown = true;
                    break;
                case "gameMonetize":
                    if (typeof sdk !== 'undefined' && sdk.showBanner !== 'undefined') {
                        sdk.showBanner()
                    }
                    break;
                default:
                    console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
                    break;
            }

            if (adShown) {
                const adDismissListener = await AdMob.addListener(
                    InterstitialAdPluginEvents.Dismissed,
                    () => {
                        setHomeLoadingScreen(true);
                        navigate("/");
                        adDismissListener.remove();
                    }
                );
            } else {
                setHomeLoadingScreen(true);
                navigate("/");
            }
        } catch (error) {
            console.log("Error showing interstitial ad:", error);
            setHomeLoadingScreen(true);
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
                        // adId: 'ca-app-pub-7381288019033542/2684504166',
                        adId: rewardedTest
                    });
                    await AdMob.showRewardVideoAd();
                    break;
                case "gameMonetize":
                    if (typeof sdk !== 'undefined' && sdk.showBanner !== 'undefined') {
                        sdk.showBanner()
                    }
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
        if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios') {
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
        if (process.env.REACT_APP_ACTIVE_SYSTEM === "gameMonetize") {
            window.extraMistakeGiven = extraMistakeGiven;
            return () => {
                window.extraMistakeGiven = null;
            };
        }
    }, [extraMistakeGiven])

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
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-60 bg-black z-40">
                    <div className="text-center p-6 mx-2 bg-white rounded-lg shadow-lg max-w-full">
                        <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h2>
                        <p className="text-xl text-gray-700 mb-6">You've made <span className='font-bold text-red-600'>{mistakes}</span> mistakes!</p>
                        <div className="flex items-center justify-center mt-4 mb-5">
                            <button
                                ref={extraMistakeButtonRef}
                                className="bg-blue-500 shadow-md text-white text-lg rounded-md w-fit p-4 flex items-center justify-center font-bold"
                                onClick={handleExtraMistakeClick}
                            >
                                Extra Mistake? <img src={videoLogo} alt="adlogo" className="ms-3 h-6 w-6 shadow-sm" />
                            </button>
                            {showTooltip && (
                                <div style={{ position: 'absolute', top: tooltipPosition.top, left: tooltipPosition.left }} className="bg-black text-white text-sm rounded-md p-2 shadow-lg z-50">
                                    {tooltipMessage}
                                </div>
                            )}
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
            )}
        </>
    );
};

export default GameLost;
