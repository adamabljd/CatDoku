import React from "react";
import SubGrid from "./SubGrid";

const Grid = ({ grid, initialGrid, selectedCell, onCellClick, mistakenCells, correctCells, isPaused }) => {
  // Divide the grid into 3x3 subgrids
  const subGrids = [];

  for (let subGridRow = 0; subGridRow < 3; subGridRow++) {
    for (let subGridCol = 0; subGridCol < 3; subGridCol++) {
      const subGrid = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const actualRow = subGridRow * 3 + row;
          const actualCol = subGridCol * 3 + col;

          // Add the actual row and column along with the number
          subGrid.push({
            number: grid[actualRow][actualCol],
            isLocked: initialGrid[actualRow][actualCol],
            row: actualRow,
            col: actualCol,
          });
        }
      }
      subGrids.push(subGrid);
    }
  }

  return (
    <div className="grid grid-cols-3 border-2 rounded border-slate-900 bg-white">
      {subGrids.map((subGrid, index) => (
        <div key={index} className="border border-slate-900 w-full h-fit">
          <SubGrid
            subGrid={subGrid}
            onCellClick={onCellClick}
            selectedCell={selectedCell}
            mistakenCells={mistakenCells}
            correctCells={correctCells}
            isPaused={isPaused}
          />
        </div>
      ))}
    </div>
  );
};

export default Grid;
