// BestTimesPage.js
import React, { useState, useEffect } from 'react';
import { Storage } from '@capacitor/storage';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/icons/house.svg';
import LeaderboardTable from '../components/LeaderboardTable';

const difficulties = ["Easy", "Medium", "Hard"];
const mistakesOptions = [1, 2, 3, 4, 5, Infinity];

const BestTimesPage = () => {
  const [bestTimes, setBestTimes] = useState({});
  const [wins, setWins] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeaderboardData = async () => {
      const times = {};
      const winCounts = {};

      for (let difficulty of difficulties) {
        times[difficulty] = {};
        winCounts[difficulty] = {};
        for (let mistakes of mistakesOptions) {
          const timeKey = `bestTime_${difficulty}_${mistakes}`;
          const winKey = `winCount_${difficulty}_${mistakes}`;

          const timeResult = await Storage.get({ key: timeKey });
          const winResult = await Storage.get({ key: winKey });

          times[difficulty][mistakes] = timeResult.value ? JSON.parse(timeResult.value) : null;
          winCounts[difficulty][mistakes] = winResult.value ? JSON.parse(winResult.value) : null;
        }
      }

      setBestTimes(times);
      setWins(winCounts);
    };

    loadLeaderboardData();
  }, []);

  const formatTime = (time) => {
    if (!time) return "-";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h2 className="text-2xl font-bold mb-3 mt-10">Leaderboard</h2>

      <div className='flex-grow w-full overflow-y-auto px-2 max-h-[80vh] space-y-2 pb-3'>
        {/* Best Time Table */}
        <LeaderboardTable
          title="Best Time"
          data={bestTimes}
          difficulties={difficulties}
          mistakesOptions={mistakesOptions}
          formatTime={formatTime}
        />

        {/* Wins Table */}
        <LeaderboardTable
          title="Wins"
          data={wins}
          difficulties={difficulties}
          mistakesOptions={mistakesOptions}
        />
      </div>

      <div className="w-full flex justify-center mb-2 mt-4">
        <button
          className="bg-stone-400 shadow-md text-white rounded-md w-fit p-2"
          onClick={handleBackToMenu}
        >
          <img src={houseLogo} alt="house" className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
};

export default BestTimesPage;
