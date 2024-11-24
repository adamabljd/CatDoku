import React, { useEffect, useState } from "react";
import cat1 from "../assets/cats/Catdoku 1.png"
import cat2 from "../assets/cats/Catdoku 2.png"
import cat3 from "../assets/cats/Catdoku 3.png"
import cat4 from "../assets/cats/Catdoku 4.png"
import cat5 from "../assets/cats/Catdoku 5.png"
import cat6 from "../assets/cats/Catdoku 6.png"
import cat7 from "../assets/cats/Catdoku 7.png"
import cat8 from "../assets/cats/Catdoku 8.png"
import cat9 from "../assets/cats/Catdoku 9.png"

const SubGrid = ({ subGrid, onCellClick, selectedCell, mistakenCells, correctCells, isPaused, notesGrid, highlightedNumber }) => {
  const catImages = [null, cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9];
  const [initialLoad, setInitialLoad] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeInBg, setFadeInBg] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeInBg(true), 1200);
    setTimeout(() => {
      setFadeIn(true);
      setInitialLoad(false);
    }, 1000);

  }, []);

  return (
    <div className="grid grid-cols-3">
      {subGrid.map((cell, index) => {
        const { number, isLocked, row, col } = cell;

        // Check if the current cell is in the selected row or column
        const isRowSelected = selectedCell && selectedCell.row === row;
        const isColSelected = selectedCell && selectedCell.col === col;
        const isBlockSelected =
          selectedCell &&
          Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
          Math.floor(selectedCell.col / 3) === Math.floor(col / 3);
        const isHighlighted = isRowSelected || isColSelected || isBlockSelected;

        const isSelectedCell = selectedCell && selectedCell.row === row && selectedCell.col === col;

        const isMistakenCell = mistakenCells.some((mistake) => mistake.row === row && mistake.col === col);
        const isCorrectCell = correctCells.some((cell) => cell.row === row && cell.col === col);

        const isHighlightedNumber = highlightedNumber !== null && number === highlightedNumber;

        return (
          <div
            key={index}
            className={`cell w-full h-full max-w-12 max-h-10  xl:max-w-16 xl:max-h-14 aspect-square border border-gray-300 flex items-center justify-center 
              ${isSelectedCell ? "bg-orange-300" : ""}
              ${isMistakenCell ? "bg-red-300" : ""}
              ${isCorrectCell ? "bg-green-300" : ""} 
              ${isHighlighted && !isMistakenCell && !isSelectedCell ? "bg-yellow-200" : ""}
              ${!isPaused && !isLocked && !isCorrectCell ? "hover:cursor-pointer" : ""} 
              ${isHighlightedNumber ? "bg-purple-300" : ""}
              ${isPaused ? "bg-white" : ""}
              ${initialLoad && fadeInBg && isLocked ? "bg-gray-200 transition-colors duration-700" : !initialLoad && !fadeIn ? "bg-white" : ""}
              ${fadeInBg && isLocked ? "bg-gray-200" : ""}
              `}
            onClick={() => !isLocked && onCellClick(row, col)}
          >

            {notesGrid[row][col].length ? (
              <div className="grid grid-cols-3 w-full h-full">
                {notesGrid[row][col].map((note, i) => (
                  <img key={i} src={catImages[note]} alt={`Cat note ${note}`} className={`w-fit h-fit aspect-square ${isPaused ? "invisible" : ""}`} />
                ))}
              </div>
            ) : (
              number !== null && number >= 1 && number <= 9 ? (
                <img src={catImages[number]} alt={`Cat ${number}`} className={`w-full h-full ${fadeIn && isLocked ? "opacity-100 transition-opacity duration-700" : !fadeIn ? "opacity-0" : ""} ${isPaused ? "invisible" : ""}`} />
              ) : ""
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubGrid;
