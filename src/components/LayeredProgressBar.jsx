import React from 'react';
import progressBarEmpty from '../assets/UI/progressBarEmpty.png'; // Empty bar
import progressBarFill from '../assets/UI/progressBarFill.png'; // Fill bar
import progressBarStroke from '../assets/UI/progressBarStroke.png'; // Stroke overlay
import pawImg from '../assets/UI/levelPAw.png'

const LayeredProgressBar = ({ progress = 0 }) => {
  return (
    <div className="relative w-64 h-10">
          {/* Progress Bar Frame */}
          <div className="relative w-full h-full">
            {/* Empty Bar */}
            <img
              src={progressBarEmpty}
              alt="Progress Bar Empty"
              className="absolute inset-0 w-full h-full"
            />

            {/* Fill Image Clipping */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - progress}% 0 0 )`, // Dynamically crop the fill image
              }}
            >
              <img
                src={progressBarFill}
                alt="Progress Bar Fill"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Paw Image */}
            <img
              src={pawImg}
              alt="Paw"
              className="absolute h-12 w-10 z-10" // Size of the paw image
              style={{
                left: `calc(${progress}% - 20px)`, // Adjust position based on progress and paw size
                top: '50%',
                transform: 'translateY(-55%)', // Center vertically
              }}
            />

            {/* Stroke */}
            <img
              src={progressBarStroke}
              alt="Progress Bar Stroke"
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          </div>
        </div>
  );
};

export default LayeredProgressBar;

