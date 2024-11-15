// BestTimesPage.js
import React, { useState, useEffect } from 'react';
import { Storage } from '@capacitor/storage';
import { useNavigate } from 'react-router-dom';
import houseLogo from '../assets/icons/house.svg';
import LeaderboardTable from '../components/LeaderboardTable';
import { AdMob, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

const difficulties = ["Easy", "Medium", "Hard", "Expert", "Master"];
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

  const showAd = async () => {
    switch (process.env.REACT_APP_ACTIVE_SYSTEM) {
      case 'android':
        await AdMob.showBanner({
          adId: 'ca-app-pub-7381288019033542/6012934144',
          position: BannerAdPosition.BOTTOM_CENTER,
          size: BannerAdSize.ADAPTIVE_BANNER,
        });
        break;

      case 'ios':
        await AdMob.showBanner({
          adId: '',
          position: BannerAdPosition.BOTTOM_CENTER,
          size: BannerAdSize.ADAPTIVE_BANNER,
        });
        break;

      case 'poki':
        console.log("Poki ads will be implemented here.");
        // Implement Poki ad logic here when ready
        break;

      default:
        console.warn("No ad provider matched. Check REACT_APP_ACTIVE_SYSTEM value.");
        break;
    }
  };

  useEffect(() => {
    if (process.env.REACT_APP_ACTIVE_SYSTEM === 'android' || process.env.REACT_APP_ACTIVE_SYSTEM === 'ios') {
      AdMob.removeBanner().then(() => {
        showAd();
      });

      return () => {
        AdMob.removeBanner();
      };
    }
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
    <div className="flex flex-col items-center min-h-screen pb-20 landscape:pb-32 font-coffee">
      <h2 className="text-2xl mb-3 mt-10">Leaderboard</h2>

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
