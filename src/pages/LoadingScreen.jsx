import React from "react";
import cat1 from "../assets/cats/Catdoku 1.png";
import cat2 from "../assets/cats/Catdoku 2.png";
import cat3 from "../assets/cats/Catdoku 3.png";
import cat4 from "../assets/cats/Catdoku 4.png";
import cat5 from "../assets/cats/Catdoku 5.png";
import cat6 from "../assets/cats/Catdoku 6.png";
import cat7 from "../assets/cats/Catdoku 7.png";
import cat8 from "../assets/cats/Catdoku 8.png";
import cat9 from "../assets/cats/Catdoku 9.png";

const LoadingScreen = () => {
  const catImages = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9];

  return (
    <div className="flex items-center justify-center bg-beige flex-col">
      <div className="relative w-40 h-40 animate-spin-slow">
        {catImages.map((cat, index) => (
          <img
            key={index}
            src={cat}
            alt={`Cat ${index + 1}`}
            className={`absolute w-10 h-10 object-contain rounded-full`}
            style={{
              top: `calc(50% - 20px)`,
              left: `calc(50% - 20px)`,
              transform: `rotate(${index * 40}deg) translate(80px) rotate(-${index * 40}deg)`,
            }}
          />
        ))}
      </div>
      <div className="mt-10">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
