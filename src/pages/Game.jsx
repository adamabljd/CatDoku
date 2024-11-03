import React, { useState, useEffect } from "react";
import Grid from "../components/Grid";
import CatsRow from "../components/CatsRow";
import houseLogo from '../assets/house.svg';
import GameBar from "../components/GameBar";
import { Storage } from '@capacitor/storage';
import { useNavigate } from "react-router-dom";
import GameWon from "../components/GameWon";
import GameLost from "../components/GameLost";

const Game = ({ isResuming, mistakesAllowed, initialDifficulty }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [grid, setGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [initialGrid, setInitialGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(false)));
  const [solutionGrid, setSolutionGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mistakenCells, setMistakenCells] = useState([]);
  const [correctCells, setCorrectCells] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [maxMistakes, setMaxMistakes] = useState(mistakesAllowed)
  const [notesGrid, setNotesGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
  const [highlightedNumber, setHighlightedNumber] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [totalWins, setTotalWins] = useState(0);
  const [freeHintUsed, setFreeHintUsed] = useState(false);

  const loadStats = async () => {
    const bestTimeKey = `bestTime_${difficulty}_${maxMistakes}`;
    const totalWinsKey = `winCount_${difficulty}_${maxMistakes}`;

    const bestTimeData = await Storage.get({ key: bestTimeKey });
    const totalWinsData = await Storage.get({ key: totalWinsKey });

    setBestTime(bestTimeData.value ? JSON.parse(bestTimeData.value) : null);
    setTotalWins(totalWinsData.value ? JSON.parse(totalWinsData.value) : 0);
  };

  const loadSavedState = async (key, defaultValue) => {
    const savedState = isResuming ? await Storage.get({ key }) : null;
    try {
      return savedState !== null ? JSON.parse(savedState.value) : defaultValue;
    } catch (error) {
      return savedState !== null ? savedState.value : defaultValue;
    }
  };

  useEffect(() => {
    const loadGame = async () => {
      if (isResuming) {
        const [
          loadedDifficulty,
          loadedMaxMistakes,
          loadedGrid,
          loadedInitialGrid,
          loadedSolutionGrid,
          loadedGameWon,
          loadedMistakes,
          loadedGameOver,
          loadedTimer,
          loadedMistakenCells,
          loadedCorrectCells,
          loadedNotesGrid,
          loadedFreeHintUsed
        ] = await Promise.all([
          loadSavedState("difficulty", initialDifficulty),
          loadSavedState("maxMistakes", maxMistakes),
          loadSavedState("grid", Array(9).fill(null).map(() => Array(9).fill(null))),
          loadSavedState("initialGrid", Array(9).fill(null).map(() => Array(9).fill(false))),
          loadSavedState("solutionGrid", Array(9).fill(null).map(() => Array(9).fill(null))),
          loadSavedState("gameWon", false),
          loadSavedState("mistakes", 0),
          loadSavedState("gameOver", false),
          loadSavedState("timer", 0),
          loadSavedState("mistakenCells", []),
          loadSavedState("correctCells", []),
          loadSavedState("notesGrid", Array(9).fill(null).map(() => Array(9).fill(null).map(() => []))),
          loadSavedState("freeHintUsed", false)
        ]);

        // Set all states at once after loading
        setDifficulty(loadedDifficulty);
        setMaxMistakes(loadedMaxMistakes);
        setGrid(loadedGrid);
        setInitialGrid(loadedInitialGrid);
        setSolutionGrid(loadedSolutionGrid);
        setGameWon(loadedGameWon);
        setMistakes(loadedMistakes);
        setGameOver(loadedGameOver);
        setTimer(loadedTimer);
        setMistakenCells(loadedMistakenCells);
        setCorrectCells(loadedCorrectCells);
        setIsRunning(true);
        setIsPaused(false);
        setNotesGrid(loadedNotesGrid)
        setFreeHintUsed(loadedFreeHintUsed);
      } else {
        initGame();
      }

      setIsLoaded(true);
    };
    loadGame();
    loadStats();
  }, [isResuming]);

  // Save game state in individual keys
  useEffect(() => {
    if (isLoaded) {
      const saveGameState = async () => {
        await Storage.set({ key: 'grid', value: JSON.stringify(grid) });
        await Storage.set({ key: 'initialGrid', value: JSON.stringify(initialGrid) });
        await Storage.set({ key: 'solutionGrid', value: JSON.stringify(solutionGrid) });
        await Storage.set({ key: 'difficulty', value: difficulty });
        await Storage.set({ key: 'maxMistakes', value: JSON.stringify(maxMistakes) });
        await Storage.set({ key: 'gameWon', value: JSON.stringify(gameWon) });
        await Storage.set({ key: 'mistakes', value: JSON.stringify(mistakes) });
        await Storage.set({ key: 'gameOver', value: JSON.stringify(gameOver) });
        await Storage.set({ key: 'timer', value: JSON.stringify(timer) });
        await Storage.set({ key: 'mistakenCells', value: JSON.stringify(mistakenCells) });
        await Storage.set({ key: 'correctCells', value: JSON.stringify(correctCells) });
        await Storage.set({ key: 'notesGrid', value: JSON.stringify(notesGrid) });
        await Storage.set({ key: 'freeHintUsed', value: JSON.stringify(freeHintUsed) });
      };
      saveGameState();
    }
  }, [grid, initialGrid, notesGrid, solutionGrid, selectedCell, selectedNumber, isSelected, difficulty, maxMistakes, gameWon, mistakes, gameOver, timer, mistakenCells, correctCells, isLoaded, freeHintUsed]);

  const initGame = () => {
    setSelectedCell(null);
    setSelectedNumber(null);
    setIsSelected(false);
    setGameWon(false);
    setMistakes(0);
    setGameOver(false);
    setMistakenCells([]);
    setCorrectCells([]);
    setTimer(0);
    setIsRunning(true);
    setIsPaused(false);
    setNotesGrid(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])))
    setIsNotesMode(false)
    setHighlightedNumber(null)
    setFreeHintUsed(false)
    fillGridWithRandomNumbers(difficulty)
  };

  // Function to start the timer
  useEffect(() => {
    let interval;
    if (isRunning && !gameOver && !gameWon && !isPaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameOver, gameWon, isPaused]);

  // Function to format the timer into mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Function to toggle the selected cell
  const handleCellClick = (row, col) => {
    if (initialGrid[row][col] || correctCells.some(cell => cell.row === row && cell.col === col)) {
      return;
    }

    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setSelectedCell(null); // Deselect
      setIsSelected(false);
    } else {
      setSelectedCell({ row, col });
      setIsSelected(true);
    }
  };

  // Function to handle the number click from CatsRow
  const handleNumberClick = (number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const newGrid = [...grid];
      const newNotesGrid = [...notesGrid];

      if (isNotesMode) {
        // Store the number as a note (a visual draft)
        const notes = newNotesGrid[row][col];
        if (notes.includes(number)) {
          newNotesGrid[row][col] = notes.filter((n) => n !== number);
        } else {
          newNotesGrid[row][col] = [...notes, number];
        }
        setMistakenCells((prev) =>
          prev.filter(
            (cell) =>
              !(cell.row === selectedCell.row && cell.col === selectedCell.col)
          )
        );
      } else {
        // Normal mode: handle mistakes and correct answers
        newNotesGrid[row][col] = [];
        newGrid[selectedCell.row][selectedCell.col] = number;
        checkUserSelection(selectedCell.row, selectedCell.col, number);
      }
      setNotesGrid(newNotesGrid);
      setGrid(newGrid);
      setSelectedCell(null);
      setIsSelected(false);
      if (!isNotesMode) {
        checkIfGameWon(newGrid);
      }
    } else {
      setHighlightedNumber(number)
    }
  };

  // Function to handle the erase button click
  const handleEraseClick = () => {
    if (selectedCell) {
      const newGrid = [...grid];
      newGrid[selectedCell.row][selectedCell.col] = null; // Clear the selected cell's value
      setGrid(newGrid);
      setSelectedCell(null); // Deselect after erasing
      setIsSelected(false);

      // Remove from both mistaken and correct cells
      setMistakenCells((prev) =>
        prev.filter(
          (cell) =>
            !(cell.row === selectedCell.row && cell.col === selectedCell.col)
        )
      );
      setCorrectCells((prev) =>
        prev.filter(
          (cell) =>
            !(cell.row === selectedCell.row && cell.col === selectedCell.col)
        )
      );
    }
  };

  const toggleNotesMode = () => {
    setIsNotesMode((prev) => !prev);
  };

  // Function to check if the entire grid is correctly filled
  const checkIfGameWon = async (grid) => {
    // Check if any cells contain a note (not fully completed)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (typeof grid[row][col] === "string" && grid[row][col].includes("(")) {
          return; // Exit: can't win with notes in the grid
        }
      }
    }

    // Helper to check if an array contains numbers 1-9 without duplicates
    const isValidSet = (arr) => {
      const set = new Set(arr);
      return set.size === 9 && !set.has(null);
    };

    // Check all rows
    for (let row = 0; row < 9; row++) {
      if (!isValidSet(grid[row])) {
        return false;
      }
    }

    // Check all columns
    for (let col = 0; col < 9; col++) {
      const column = grid.map((row) => row[col]);
      if (!isValidSet(column)) {
        return false;
      }
    }

    // Check all 3x3 subgrids
    for (let subGridRow = 0; subGridRow < 3; subGridRow++) {
      for (let subGridCol = 0; subGridCol < 3; subGridCol++) {
        const subGrid = [];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            subGrid.push(grid[subGridRow * 3 + row][subGridCol * 3 + col]);
          }
        }
        if (!isValidSet(subGrid)) {
          return false;
        }
      }
    }

    // If all checks pass, set game won to true
    setGameWon(true);
    await checkAndSetBestTime();
    await incrementWinCount();
    loadStats();
  };

  // Function to check and update best time for the current difficulty and max mistakes setting
  const checkAndSetBestTime = async () => {
    const key = `bestTime_${difficulty}_${maxMistakes}`;
    const bestTimeData = await Storage.get({ key });
    const bestTime = bestTimeData.value ? JSON.parse(bestTimeData.value) : Infinity;

    if (timer < bestTime) {
      await Storage.set({ key, value: JSON.stringify(timer) });
      setBestTime(timer)
    }
  };

  // Function to increment win count in storage
  const incrementWinCount = async () => {
    const key = `winCount_${difficulty}_${maxMistakes}`;
    const winData = await Storage.get({ key });
    const winCount = winData.value ? JSON.parse(winData.value) : 0;

    setTotalWins(winCount + 1)
    await Storage.set({ key, value: JSON.stringify(winCount + 1) });
  };


  //------------------------------ GAME'S CORE MECANICS ----------------------------------------------
  // Function to check if a number can be placed in a cell
  const isValidPlacement = (grid, row, col, number) => {
    // Check the row for the number
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === number) return false;
    }
    // Check the column for the number
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === number) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === number) {
          return false;
        }
      }
    }
    return true;
  };

  // Function to fill some cells with random numbers while ensuring uniqueness in rows, columns, and subgrids
  const fillGridWithRandomNumbers = (difficulty) => {
    const newGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));

    const newInitialGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(false));

    let maxFilledCells, minFilledCells, fillChance;
    switch (difficulty) {
      case "Easy":
        maxFilledCells = 8;
        minFilledCells = 4;
        fillChance = 0.8;
        break;
      case "Medium":
        maxFilledCells = 6;
        minFilledCells = 3;
        fillChance = 0.8;
        break;
      case "Hard":
        maxFilledCells = 5;
        minFilledCells = 2;
        fillChance = 0.5;
        break;
      default:
        maxFilledCells = 6;
        minFilledCells = 2;
        fillChance = 0.6;
        break;
    }

    const shuffle = (array) => {
      return array.sort(() => Math.random() - 0.5);
    };

    // Backtracking algorithm to fill the grid
    const fillGrid = (grid) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === null) {
            const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (let num of numbers) {
              if (isValidPlacement(grid, row, col, num)) {
                grid[row][col] = num;
                if (fillGrid(grid)) {
                  return true; // Continue filling
                }
                grid[row][col] = null; // Backtrack
              }
            }
            return false; // No valid number found, trigger backtracking
          }
        }
      }
      return true; // Grid fully filled
    };

    // Fill the grid using the backtracking algorithm
    fillGrid(newGrid);
    setSolutionGrid(JSON.parse(JSON.stringify(newGrid)));

    // Function to remove numbers to create the puzzle while enforcing subgrid limits
    const removeNumbers = () => {
      for (let subGridRow = 0; subGridRow < 3; subGridRow++) {
        for (let subGridCol = 0; subGridCol < 3; subGridCol++) {
          const cellsToKeep =
            Math.floor(Math.random() * (maxFilledCells - minFilledCells + 1)) +
            minFilledCells;
          const subGridCells = [];

          // Collect all cells in the subgrid
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              const actualRow = subGridRow * 3 + row;
              const actualCol = subGridCol * 3 + col;
              subGridCells.push({ row: actualRow, col: actualCol });
            }
          }

          // Shuffle the subgrid cells and remove the ones we don't want to keep
          const shuffledSubGridCells = shuffle(subGridCells);
          let filledCount = 0;
          for (let i = 0; i < 9; i++) {
            if (filledCount < cellsToKeep && Math.random() < fillChance) {
              filledCount++;
              // Leave the cell filled
            } else {
              // Remove the cell to stay within the limit for this subgrid
              const { row, col } = shuffledSubGridCells[i];
              newGrid[row][col] = null;
              newInitialGrid[row][col] = false; // Mark it as editable by the player
            }
          }
        }
      }
    };

    removeNumbers(); // Create the puzzle by removing numbers from the filled grid

    // After removing numbers, mark the remaining ones as locked
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newGrid[row][col] !== null) {
          newInitialGrid[row][col] = true; // These cells are pre-filled and should be locked
        }
      }
    }

    // Update the state with the new grid and initial grid (locked cells)
    setGrid(newGrid);
    setInitialGrid(newInitialGrid); // Tracks locked cells
  };

  const checkUserSelection = (row, col, selectedNumber) => {
    const correctNumber = solutionGrid[row][col];

    if (selectedNumber !== correctNumber) {
      setMistakes((prev) => prev + 1);
      setCorrectCells((prev) =>
        prev.filter((cell) => !(cell.row === row && cell.col === col))
      );
      setMistakenCells((prev) => [...prev, { row, col }]);
      if (mistakes + 1 >= maxMistakes) {
        setGameOver(true);
      }
    } else {
      setMistakenCells((prev) =>
        prev.filter((cell) => !(cell.row === row && cell.col === col))
      );
      setCorrectCells((prev) => [...prev, { row, col }]);
    }
  };

  const revealNumber = () => {
    const emptyCells = [];

    // Collect all empty cells
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    // Choose a random empty cell if there are any
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const { row, col } = randomCell;
      const correctNumber = solutionGrid[row][col]; // Get the correct number from solutionGrid

      const newGrid = [...grid];
      const newNotesGrid = [...notesGrid];
      newGrid[row][col] = correctNumber;
      newNotesGrid[row][col] = [];

      setGrid(newGrid);
      setNotesGrid(newNotesGrid);
      setCorrectCells([...correctCells, { row, col }]);
      checkIfGameWon(newGrid)
    }
  };

  // Global click listener to reset highlightedNumber
  useEffect(() => {
    const handleGlobalClick = (event) => {
      const isClickInsideCatsRow = event.target.closest('.cats-row');
      if (!isClickInsideCatsRow) {
        setHighlightedNumber(null); // Reset only if clicking outside CatsRow
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleReturnToMenu = () => {
    navigate("/");
  };


  if (!isLoaded) {
    return <div>Loading game data...</div>;
  }

  return (
    <div className="space-y-5 mt-5 landscape:mb-10">
      {/* Render based on explicit checks */}
      {isLoaded && gameOver && !gameWon ? (
        <GameLost mistakes={mistakes} />
      ) : isLoaded && gameWon && !gameOver ? (
        <GameWon bestTime={bestTime ? formatTime(bestTime) : "N/A"} time={formatTime(timer)} mistakes={mistakes} maxMistakes={maxMistakes} difficulty={difficulty} totalWins={totalWins} />

      ) : (
        (
          <>
            <GameBar
              difficulty={difficulty}
              mistakes={mistakes}
              timer={formatTime(timer)}
              isPaused={isPaused}
              onPauseToggle={togglePause}
              onRestart={initGame}
              mistakesAllowed={maxMistakes}
            />
            <div className="flex items-center justify-center">
              <Grid
                grid={grid}
                notesGrid={notesGrid}
                initialGrid={initialGrid}
                selectedCell={selectedCell}
                mistakenCells={mistakenCells}
                correctCells={correctCells}
                onCellClick={handleCellClick}
                isPaused={isPaused}
                highlightedNumber={highlightedNumber}
              />
            </div>
            <CatsRow
              onNumberClick={handleNumberClick}
              isSelected={isSelected}
              onEraseClick={handleEraseClick}
              isNotesMode={isNotesMode}
              toggleNotesMode={toggleNotesMode}
              revealNumber={revealNumber}
              freeHintUsed={freeHintUsed}
              setFreeHintUsed={setFreeHintUsed}
            />

            <div className="flex items-center justify-center mt-4 mb-5">
              <button
                className="bg-stone-400 shadow-md text-white rounded-md w-fit p-2"
                onClick={handleReturnToMenu}
              >
                <img src={houseLogo} alt="house" className="h-7 w-7" />
              </button>
            </div>
          </>
        )
      )}
    </div>
  );

};

export default Game;
