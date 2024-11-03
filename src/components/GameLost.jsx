import React from 'react';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/icons/house.svg';
import videoLogo from '../assets/icons/video.svg';

const GameLost = ({ mistakes }) => {
    const navigate = useNavigate();

    const handleReturnToMenu = () => {
        navigate("/");
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-60 bg-black z-50">
            <div className="text-center p-6 mx-2 bg-white rounded-lg shadow-lg max-w-full">
                <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h2>
                <p className="text-xl text-gray-700 mb-6">You've made <span className='font-bold text-red-600'>{mistakes}</span> mistakes!</p>
                <div className="flex items-center justify-center mt-4 mb-5">
                    <button
                        className="bg-blue-500 shadow-md text-white text-lg rounded-md w-fit p-4 flex items-center justify-center font-bold"
                        onClick={() => {}}
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
