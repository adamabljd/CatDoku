import React, { useState, useEffect } from 'react';
import { Storage } from '@capacitor/storage';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/house.svg';


const difficulties = ["Easy", "Medium", "Hard"];
const mistakesOptions = [1, 2, 3, 4, 5, Infinity];

const BestTimesPage = () => {
  const [bestTimes, setBestTimes] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const loadBestTimes = async () => {
      const times = {};

      // Loop through each difficulty and maxMistakes option
      for (let difficulty of difficulties) {
        times[difficulty] = {};
        for (let mistakes of mistakesOptions) {
          const key = `bestTime_${difficulty}_${mistakes}`;
          const result = await Storage.get({ key });
          const time = result.value ? JSON.parse(result.value) : null;
          times[difficulty][mistakes] = time;
        }
      }
      setBestTimes(times);
    };

    loadBestTimes();
  }, []);

  const formatTime = (time) => {
    if (!time) return "-";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Best Times Leaderboard</h2>
      <table className="border-collapse border border-gray-500">
        <thead>
          <tr>
            <th className="border border-gray-500 p-2">Difficulty</th>
            {mistakesOptions.map((mistakes) => (
              <th key={mistakes} className="border border-gray-500 p-2 w-5">
                {mistakes === Infinity ? "Unlimited" : mistakes} Mistakes
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {difficulties.map((difficulty) => (
            <tr key={difficulty}>
              <td className="border border-gray-500 p-2 font-semibold">{difficulty}</td>
              {mistakesOptions.map((mistakes) => (
                <td key={mistakes} className="border border-gray-500 p-2">
                  {formatTime(bestTimes[difficulty]?.[mistakes])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <button
        className="bg-stone-400 shadow-md text-white rounded-md w-fit p-2 mt-4"
        onClick={handleBackToMenu}
      >
        <img src={houseLogo} alt="house" className="h-7 w-7" />
      </button>
    </div>
  );
};

export default BestTimesPage;
