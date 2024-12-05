import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import houseLogo from '../assets/icons/house.svg';
import purrSound from '../assets/sounds/cat_purr.mp3';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import LoadingScreen from '../pages/LoadingScreen';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import shareLogo from '../assets/icons/share.svg'
import gameWonFrame from '../assets/UI/gameWonFrame.png';
import greyBlock from '../assets/UI/greyBlock.png';
import yellowBlock from '../assets/UI/yellowBlock.png';
import roundedFrame from '../assets/UI/roundedFrame.png';

const GameWon = ({ bestTime, time, mistakes, maxMistakes, difficulty, totalWins, soundEnabled, imageURL }) => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);
    const [loadingAd, setLoadingAd] = useState(false);

    const isLandscape = width > height;


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const audio = new Audio(purrSound);

    audio.volume = 0.6

    const bannerTest = 'ca-app-pub-3940256099942544/6300978111'
    const interTest = 'ca-app-pub-3940256099942544/1033173712'
    const rewardedTest = 'ca-app-pub-3940256099942544/5224354917'

    // Stop confetti after 5 seconds
    useEffect(() => {
        if (soundEnabled) {
            // Start playing the sound
            audio.play().catch(error => console.log("Audio play error:", error));
        }

        // Stop confetti after 5 seconds
        const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

        return () => {
            // Cleanup: stop the sound and reset position when component unmounts
            clearTimeout(confettiTimer);
            audio.pause();
            audio.currentTime = 0;
        };
    }, [soundEnabled]);

    const handleReturnToMenu = async () => {
        audio.pause();
        audio.currentTime = 0;
        try {
            setLoadingAd(true);
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
                    adShown = true;
                    break;
                default:
                    console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
                    break;
            }
            if (adShown) {
                const adDismissListener = await AdMob.addListener(
                    InterstitialAdPluginEvents.Dismissed,
                    () => {
                        setLoadingAd(false);
                        navigate("/");
                        adDismissListener.remove();
                    }
                );
            } else {
                setLoadingAd(false)
                navigate("/");
            }
        } catch (error) {
            console.log("Error showing interstitial ad:", error);
            setLoadingAd(false)
            navigate("/");
        }
    };

    const downloadGameTemplate = async () => {
        const canvasWidth = 1600;
        const canvasHeight = 1000;
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        await document.fonts.ready;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.font = '48px "Coffee Butter"';

        // Background color
        ctx.fillStyle = '#eee1b7';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw the grid image if it exists
        if (imageURL) {
            const gameImage = new Image();
            gameImage.src = imageURL;
            await new Promise(resolve => {
                gameImage.onload = () => {
                    ctx.drawImage(gameImage, 100, 100, 800, 800);
                    resolve();
                };
            });
        }

        ctx.fillStyle = '#333';
        ctx.fillText(`Level: ${difficulty}`, 930, 200);
        ctx.fillText(`Time: ${time}`, 930, 300);
        ctx.fillText(`Mistakes Allowed: ${maxMistakes < 6 ? maxMistakes : "Unlimited"}`, 930, 400);
        ctx.fillText(`Play Miawdoku!`, 930, 500);
        ctx.fillText(`Available on iOS and Android!`, 930, 600);
        // Convert canvas to an image
        const templateImageURL = canvas.toDataURL('image/png');
        const base64Data = templateImageURL.split(',')[1];

        try {
            // Write the base64 image data to a local file
            const savedFile = await Filesystem.writeFile({
                path: `miawdoku_${difficulty}_level.png`,
                data: base64Data,
                directory: Directory.Cache,
            });


            if (Capacitor.isNativePlatform()) {
                // Use Camera plugin to add the saved file to the gallery
                await Share.share({
                    title: '🎉 Victory in MiawDoku! 🎉',
                    text: `I've just won a game of MiawDoku! on Level ${difficulty} with a maximum of ${maxMistakes} mistakes! My time: ${time}.`,
                    url: savedFile.uri,
                    dialogTitle: 'Save to Gallery',
                });
            } else {
                // Provide a download link for web
                const downloadLink = document.createElement('a');
                downloadLink.href = templateImageURL;
                downloadLink.download = `miawdoku_${difficulty}_level.png`;
                downloadLink.click();
            }
        } catch (error) {
            console.error('Failed to share image:', error);
            alert('Failed to share image.');
        }
    };

    return (
        <>
            {loadingAd && <LoadingScreen />}
            {!loadingAd && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-60 bg-black z-50 font-coffee">
                    {showConfetti && (
                        <Confetti width={width} height={height} recycle={true} numberOfPieces={500} />
                    )}
                    <div className='relative flex portrait:justify-center ms-2'>
                        <img src={gameWonFrame} alt='game won ui' className='w-[19rem] h-[30rem] landscape:w-[32rem] landscape:h-[20rem]' />
                        <div className='absolute text-center mt-9 -ms-1 landscape:ms-9'>
                            {imageURL && (
                                <div className="flex items-center justify-center mb-3">
                                    <img src={imageURL} alt="Completed Grid" className='h-52' />
                                </div>
                            )}
                            <p className="text-4xl mb-6">You Won!</p>
                        </div>

                        <div className='absolute top-[19.5rem] flex items-center space-x-5 -ms-1 landscape:top-[5rem] landscape:left-[16.5rem]'>
                            <div className='flex flex-col items-center'>
                                <div className='relative flex justify-center items-center'>
                                    <img src={roundedFrame} alt='your time frame' className='w-14' />
                                    <p className={`absolute ${time.length > 6 ? "text-[0.5rem]" : "text-xs"} mt-2`}>
                                        {time}
                                    </p>
                                </div>
                                <p className='text-xs mt-[0.15rem]'>Your time</p>
                            </div>

                            <div className='flex flex-col items-center'>
                                <div className='relative flex justify-center items-center'>
                                    <img src={roundedFrame} alt='best time frame' className='w-14' />
                                    <p className={`absolute ${bestTime.length > 6 ? "text-[0.5rem]" : "text-xs"} mt-2`}>
                                        {bestTime}
                                    </p>
                                </div>
                                <p className='text-xs mt-[0.15rem]'>Best time</p>
                            </div>

                            {maxMistakes < 6 && <div className='flex flex-col items-center'>
                                <div className='relative flex justify-center items-center'>
                                    <img src={roundedFrame} alt='mistakes frame' className='w-14' />
                                    <p className='absolute text-xs mt-2'>
                                        {mistakes} / {maxMistakes}
                                    </p>
                                </div>
                                <p className='text-xs mt-[0.15rem]'>Mistakes</p>
                            </div>}
                        </div>

                        <div className='absolute top-[25rem] flex flex-row space-x-4 -ms-1 landscape:top-[11rem] landscape:left-[19rem]'>
                            <div className='relative flex justify-center items-center'
                                onClick={handleReturnToMenu}>
                                <img src={greyBlock} alt='Home button' className='w-14 aspect-square' />
                                <img src={houseLogo} alt="house" className="absolute h-7 w-7" />
                            </div>

                            <div className='relative flex justify-center items-center'
                                onClick={downloadGameTemplate}>
                                <img src={yellowBlock} alt='your time frame' className='w-14 aspect-square' />
                                <img src={shareLogo} alt="house" className="absolute h-7 w-7 -mt-[0.15rem]" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameWon;
