import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import houseLogo from '../assets/icons/house.svg';
import purrSound from '../assets/sounds/cat_purr.mp3';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import downloadLogo from '../assets/icons/download.svg'
import LoadingScreen from '../pages/LoadingScreen';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import shareLogo from '../assets/icons/share.svg'

const GameWon = ({ bestTime, time, mistakes, maxMistakes, difficulty, totalWins, soundEnabled, imageURL }) => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);
    const [loadingAd, setLoadingAd] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const audio = new Audio(purrSound);

    audio.volume = 0.6

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
                    await AdMob.prepareInterstitial({ adId: 'ca-app-pub-3940256099942544/1033173712' });
                    await AdMob.showInterstitial();
                    adShown = true;
                    break;
                case 'ios':
                    await AdMob.prepareInterstitial({ adId: 'ca-app-pub-3940256099942544/4411468910' });
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
                    <div className="text-center p-6 mx-2 bg-white rounded-lg shadow-lg max-w-full landscape:flex landscape:flex-row landscape:items-center">
                        <div>
                            {imageURL && (
                                <div className="flex items-center justify-center mb-3">
                                    <img src={imageURL} alt="Completed Grid" className='h-52' />
                                </div>
                            )}
                            <h2 className="text-4xl text-green-600 mb-4">Congratulations!</h2>
                            <p className="text-xl text-gray-700 mb-6">You've won the game!</p>
                        </div>
                        <div>


                            <div className='flex justify-between mb-1'><p>Your Time : {time}</p> <p>Best Time : {bestTime}</p></div>
                            {maxMistakes < 6 && <p className='mb-1'>Mistakes : {mistakes} / {maxMistakes}</p>}
                            <p>Total wins in <span className='text-blue-700'>{difficulty}</span> with <span className='text-blue-700'>{maxMistakes < 6 ? maxMistakes : "Unlimited"}</span> mistakes : {totalWins}</p>
                            <div className="flex items-center justify-center mt-4 mb-5 space-x-4">
                                <button
                                    className="bg-stone-400 shadow-md text-white rounded-md w-fit p-2"
                                    onClick={handleReturnToMenu}
                                >
                                    <img src={houseLogo} alt="house" className="h-7 w-7" />
                                </button>
                                <button
                                    className="bg-green-500 shadow-md text-white rounded-md w-fit p-2"
                                    onClick={downloadGameTemplate}
                                >
                                    <img src={shareLogo} alt="share" className="h-7 w-7" />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameWon;
