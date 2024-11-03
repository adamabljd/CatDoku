import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import houseLogo from '../assets/icons/house.svg';

const GameWon = ({ bestTime, time, mistakes, maxMistakes, difficulty, totalWins }) => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);  // Track confetti state

    // Stop confetti after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);  // Cleanup on unmount
    }, []);

    const handleReturnToMenu = () => {
        navigate("/");
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-60 bg-black z-50">
            {showConfetti && (
                <Confetti width={width} height={height} recycle={true} numberOfPieces={500} />
            )}
            <div className="text-center p-6 mx-2 bg-white rounded-lg shadow-lg max-w-full">
                <h2 className="text-4xl font-bold text-green-600 mb-4">Congratulations!</h2>
                <p className="text-xl text-gray-700 mb-6">You've won the game!</p>
                <div className='flex justify-between mb-1'><p>Your Time : {time}</p> <p>Best Time : {bestTime}</p></div>
                {maxMistakes < 6 && <p className='mb-1'>Mistakes : {mistakes} / {maxMistakes}</p>}
                <p>Total wins in <span className='text-blue-700 font-bold'>{difficulty}</span> with <span className='text-blue-700 font-bold'>{maxMistakes < 6 ? maxMistakes : "Unlimited"}</span> mistakes : {totalWins}</p>
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

export default GameWon;
