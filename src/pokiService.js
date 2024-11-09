// src/pokiService.js

const pokiService = {
    // Initialize Poki SDK
    init() {
      return new Promise((resolve, reject) => {
        if (window.PokiSDK) {
          window.PokiSDK.init()
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          reject("Poki SDK not loaded.");
        }
      });
    },
  
    // Show rewarded ad and handle rewards
    showRewardedAd() {
      return new Promise((resolve, reject) => {
        if (window.PokiSDK) {
          window.PokiSDK.rewardedBreak()
            .then(() => resolve(true))  // Ad successfully watched
            .catch(() => resolve(false)); // Ad was not watched
        } else {
          reject("Poki SDK not available.");
        }
      });
    },
  
    // Optional: Pause and resume the game for Poki
    gameLoadingStart() {
      if (window.PokiSDK) {
        window.PokiSDK.gameLoadingStart();
      }
    },
    gameLoadingFinished() {
      if (window.PokiSDK) {
        window.PokiSDK.gameLoadingFinished();
      }
    }
  };
  
  export default pokiService;
  