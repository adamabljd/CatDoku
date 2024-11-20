/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/icons/house.svg';
import objective from "../assets/icons/objective.svg";
import controller from '../assets/icons/controller.svg'
import cell from "../assets/icons/cell.png"
import cat from '../assets/cats/Catdoku 1.png'
import backspace from "../assets/icons/backspace.svg"
import penLogo from "../assets/icons/pen.svg"
import hintLogo from "../assets/icons/lightbulb.svg"
import pauseIcon from "../assets/icons/pause.svg"
import deadCatIcon from "../assets/cats/deadcat.png"
import { AdMob, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

const bannerTest = 'ca-app-pub-3940256099942544/6300978111'
const interTest = 'ca-app-pub-3940256099942544/1033173712'
const rewardedTest = 'ca-app-pub-3940256099942544/5224354917'

const HowToPlayPage = () => {
    const navigate = useNavigate();
    const isGameMonetize = process.env.REACT_APP_ACTIVE_SYSTEM === "gameMonetize"

    const showAd = async () => {
        try {
            switch (process.env.REACT_APP_ACTIVE_SYSTEM) {
                case 'android':
                    await AdMob.showBanner({
                        // adId: 'ca-app-pub-7381288019033542/3327061050',
                        adId: bannerTest,
                        position: BannerAdPosition.BOTTOM_CENTER,
                        size: BannerAdSize.ADAPTIVE_BANNER,
                    });
                    break;

                case 'ios':
                    await AdMob.showBanner({
                        // adId: 'ca-app-pub-7381288019033542/6976872892',
                        adId: bannerTest,
                        position: BannerAdPosition.BOTTOM_CENTER,
                        size: BannerAdSize.ADAPTIVE_BANNER,
                    });
                    break;

                default:
                    console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
                    break;
            }
        } catch (error) {
            console.error('AdMob banner failed:', error);
        }
    };

    useEffect(() => {
        if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios') {
            AdMob.removeBanner().then(() => {
                showAd();
            }).catch((error) => console.error("Failed to remove AdMob banner:", error));

            return () => {
                AdMob.removeBanner();
            };
        }
    }, []);

    const handleHomeClickWeb = () => {
        if(isGameMonetize){
            if (typeof sdk !== 'undefined' && sdk.showBanner !== 'undefined') {
                try {
                  sdk.showBanner()
                } catch (error) {
                  console.error("Ad failed or was skipped:", error);
                };
              }
        }
        navigate('/')
        
    }

    return (
        <div className="py-6 text-gray-800 flex flex-col items-center space-y-5 pb-20 landscape:pb-32 font-coffee">
            {isGameMonetize ?
                (
                    <button
                        onClick={handleHomeClickWeb}
                        className="bg-stone-400 shadow-md rounded-md p-2 flex items-center"
                    >
                        <img src={houseLogo} alt="house" className="h-7 w-7" />
                    </button>
                ) : ""}
            <h1 className="text-3xl mb-1 text-center px-6">How to Play MiawDoku!</h1>

            <section className="space-y-4 max-w-lg">
                <p className='bg-stone-100 p-2 rounded-md shadow-md'>
                    Welcome to <span className="">MiawDoku</span>, a fun twist on the classic Sudoku game! In MiawDoku, you'll use adorable cat images instead of numbers to complete the puzzle.
                </p>

                <div className='bg-stone-100 p-2 pt-1 rounded-md shadow-md'>
                    <div className='mb-1 flex items-center justify-center space-x-2'>
                        <h2 className="text-2xl text-yellow-600 ">Objective
                        </h2>
                        <img src={objective} alt='objective' className='h-7 w-7 mt-1' />
                    </div>
                    <p>
                        Fill each 3x3 subgrid, row, and column with each unique cat only once. Every row, column, and subgrid should contain all nine different cats with no repeats!
                    </p>
                </div>

                <div className='bg-stone-100 p-2 pt-1 rounded-md shadow-md'>
                    <div className='mb-1 flex items-center justify-center space-x-2'>
                        <h2 className="text-2xl text-yellow-600 ">Game Controls
                        </h2>
                        <img src={controller} alt='controller' className='h-7 w-7 mt-2' />
                    </div>
                    <ul className="list-none space-y-2">
                        <li className="flex items-center">
                            <img src={cell} alt='cell' className='h-5 w-5 mr-3' />
                            <p><span className="">Tap a Cell:</span> Tap an empty cell to select it and place a cat image.</p>
                        </li>
                        <li className="flex items-center">
                            <img src={cat} alt='cat' className='h-6 w-6 aspect-square mr-2' />
                            <p><span className="">Select a Cat:</span> Choose a cat from the selection row at the bottom to place it in the selected cell.</p>
                        </li>
                        <li className="flex items-center">
                            <img src={backspace} alt='backspace' className='h-5 w-5 mr-3' />
                            <p><span className="">Erase:</span> Use the <span className="text-red-500">Erase</span> button to clear a selected cell.</p>
                        </li>
                        <li className="flex items-center">
                            <img src={penLogo} alt='pen' className='h-5 w-5 mr-3' />
                            <p><span className="">Notes Mode:</span> Toggle Notes Mode to place hints or mark possible cats in each cell.</p>
                        </li>
                        <li className="flex items-center">
                            <img src={hintLogo} alt='hint' className='h-5 w-5 mr-3' />
                            <p><span className="">Hint:</span> Use a hint to reveal the correct cat for a random cell. (You only get one free hint!)</p>
                        </li>
                        <li className="flex items-center">
                            <img src={pauseIcon} alt='pause' className='h-5 w-5 mr-3' />
                            <p><span className="">Pause:</span> Pause the game anytime to take a break.</p>
                        </li>
                        <li className="flex items-center">
                            <img src={deadCatIcon} alt='mistake limit' className='h-6 w-6 mr-2' />
                            <p><span className="">Limited Mistakes:</span> Be cautious! You have a limited number of mistakes before the game ends.</p>
                        </li>
                    </ul>
                </div>

                <div className='bg-stone-100 p-2 pt-1 rounded-md shadow-md'>
                    <h2 className="text-2xl  text-green-600 mb-1">Winning the Game</h2>
                    <p>
                        Complete the puzzle without any mistakes to win! If all cells are correctly filled with each unique cat, you’ll be a MiawDoku champion.
                    </p>
                </div>
            </section>

            <button
                onClick={() => navigate('/')}
                className="mt-6 bg-stone-400 shadow-md rounded-md p-2 flex items-center"
            >
                <img src={houseLogo} alt="house" className="h-7 w-7" />
            </button>
        </div>
    );
};

export default HowToPlayPage;
