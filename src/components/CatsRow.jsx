import React from "react";

const CatsRow = ({ onNumberClick, isSelected, onEraseClick }) => {
  const cats = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={`flex flex-row justify-between px-2 sm:px-0 ${isSelected ? "text-2xl text-yellow-500" : "text-xl text-black"}`}>
      {cats.map((c, index) => (
        <div
          key={index}
          onClick={() => onNumberClick(c)}
          className={`number font-bold c`}
          disabled={!isSelected}
        >
          {c}
        </div>
      ))}
      <button
        className={`bg-red-200 p-1 text-xs rounded ${isSelected ? "hover:text-lg hover:shadow-md text-black" : ""}`}
        onClick={onEraseClick}
        disabled={!isSelected}
      >
        Erase
      </button>
    </div>
  );
};

export default CatsRow;
