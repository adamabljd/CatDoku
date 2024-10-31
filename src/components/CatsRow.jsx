import React from "react";
import cat1 from "../assets/cats/Catdoku 1.png"
import cat2 from "../assets/cats/Catdoku 2.png"
import cat3 from "../assets/cats/Catdoku 3.png"
import cat4 from "../assets/cats/Catdoku 4.png"
import cat5 from "../assets/cats/Catdoku 5.png"
import cat6 from "../assets/cats/Catdoku 6.png"
import cat7 from "../assets/cats/Catdoku 7.png"
import cat8 from "../assets/cats/Catdoku 8.png"
import cat9 from "../assets/cats/Catdoku 9.png"
import backspace from "../assets/backspace.svg"
import penLogo from "../assets/pen.svg"

const CatsRow = ({ onNumberClick, isSelected, onEraseClick, isNotesMode, toggleNotesMode, isPaused }) => {
  const cats = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9];

  const handleCatClick = (event, index) => {
    event.stopPropagation(); // Stop event propagation
    onNumberClick(index + 1);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className={`flex flex-row justify-between px-2 sm:px-0`}>
        {cats.map((cat, index) => (
          <div
            key={index}
            onClick={(event) => handleCatClick(event, index)}
            className={`number font-bold cat`}
            disabled={!isSelected}
          >
            <img src={cat} alt={`Cat ${index + 1}`} className="w-full h-full max-w-11 max-h-11 lg:max-w-12 lg:max-h-12 xl:max-w-14 xl:max-h-14 aspect-square" />
          </div>
        ))}

      </div>

      <div className="flex justify-center items-center space-x-5">
        <button
          className={`p-1 rounded shadow ${isNotesMode ? 'bg-yellow-500 text-white' : 'bg-slate-300 text-black'}`}
          onClick={toggleNotesMode}
        >
          {isNotesMode ? <img src={penLogo} alt={"pen"} className="h-10 w-10" /> : <img src={penLogo} alt={"pen"} className="h-7 w-7" />}
        </button>

        <button
          className={`bg-red-300 p-1 shadow-md text-xs rounded`}
          onClick={onEraseClick}
          disabled={!isSelected}
        >
          <img src={backspace} alt="backspace" className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
};

export default CatsRow;
