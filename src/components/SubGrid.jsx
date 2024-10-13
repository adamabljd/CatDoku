import React from "react";

const SubGrid = ({ subGrid, onCellClick, selectedCell, mistakenCells, correctCells, isPaused }) => {
  return (
    <div className="grid grid-cols-3">
      {subGrid.map((cell, index) => {
        const { number, isLocked, row, col } = cell;

        // Check if the current cell is in the selected row or column
        const isRowSelected = selectedCell && selectedCell.row === row;
        const isColSelected = selectedCell && selectedCell.col === col;
        const isHighlighted = isRowSelected || isColSelected;

        const isSelectedCell = selectedCell && selectedCell.row === row && selectedCell.col === col;

        const isMistakenCell = mistakenCells.some((mistake) => mistake.row === row && mistake.col === col);
        const isCorrectCell = correctCells.some((cell) => cell.row === row && cell.col === col);

        return (
          <div
            key={index}
            className={`cell w-8 h-8 md:w-16 md:h-16 border border-gray-300 flex items-center justify-center text-xs 
              ${isSelectedCell ? "bg-blue-300" : ""}
              ${isMistakenCell ? "bg-red-300" : ""}
              ${isCorrectCell ? "bg-green-300" : ""} 
              ${isHighlighted ? "bg-yellow-200" : ""}
              ${isLocked ? "bg-gray-200" : ""}
              ${!isPaused && !isLocked ? "hover:cursor-pointer" : ""} 
              ${isPaused ? "bg-white" : ""}`}
            onClick={() => !isLocked && onCellClick(row, col)}
          >
            {isPaused ? "" : number !== null ? number : ""}
          </div>
        );
      })}
    </div>
  );
};

export default SubGrid;
