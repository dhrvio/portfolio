"use client";
import { useEffect, useState } from "react";

export function Game2048() {
  const [grid, setGrid] = useState(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newGrid = Array(16).fill(0);
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  const addRandomTile = (grid) => {
    const emptyCells = grid.reduce((acc, val, index) => {
      if (val === 0) acc.push(index);
      return acc;
    }, []);

    if (emptyCells.length > 0) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveTiles = (direction) => {
    if (gameOver) return;

    const newGrid = [...grid];
    let moved = false;
    let newScore = score;

    // Helper function to process a single row/column
    const processLine = (line) => {
      let changed = false;
      // Filter out zeros
      let filtered = line.filter(val => val !== 0);
      
      // Merge tiles
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered.splice(i + 1, 1);
          changed = true;
        }
      }
      
      // Pad with zeros
      while (filtered.length < 4) {
        filtered.push(0);
      }
      
      return { line: filtered, changed };
    };

    // Process grid based on direction
    for (let i = 0; i < 4; i++) {
      let line = [];
      
      if (direction === 'left') {
        line = newGrid.slice(i * 4, i * 4 + 4);
        const result = processLine(line);
        if (result.changed) {
          moved = true;
          for (let j = 0; j < 4; j++) {
            newGrid[i * 4 + j] = result.line[j];
          }
        }
      } else if (direction === 'right') {
        line = newGrid.slice(i * 4, i * 4 + 4).reverse();
        const result = processLine(line);
        if (result.changed) {
          moved = true;
          for (let j = 0; j < 4; j++) {
            newGrid[i * 4 + j] = result.line[3 - j];
          }
        }
      } else if (direction === 'up') {
        line = [newGrid[i], newGrid[i + 4], newGrid[i + 8], newGrid[i + 12]];
        const result = processLine(line);
        if (result.changed) {
          moved = true;
          for (let j = 0; j < 4; j++) {
            newGrid[i + j * 4] = result.line[j];
          }
        }
      } else if (direction === 'down') {
        line = [newGrid[i + 12], newGrid[i + 8], newGrid[i + 4], newGrid[i]].reverse();
        const result = processLine(line);
        if (result.changed) {
          moved = true;
          for (let j = 0; j < 4; j++) {
            newGrid[i + (3 - j) * 4] = result.line[j];
          }
        }
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      
      // Check for game over
      if (!hasValidMoves(newGrid)) {
        setGameOver(true);
      }
    }
  };

  const hasValidMoves = (grid) => {
    // Check for empty cells
    if (grid.some(cell => cell === 0)) return true;
    
    // Check for possible merges
    for (let i = 0; i < 16; i++) {
      const val = grid[i];
      // Check right
      if (i % 4 < 3 && grid[i + 1] === val) return true;
      // Check down
      if (i < 12 && grid[i + 4] === val) return true;
    }
    
    return false;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          moveTiles('left');
          break;
        case 'ArrowRight':
          moveTiles('right');
          break;
        case 'ArrowUp':
          moveTiles('up');
          break;
        case 'ArrowDown':
          moveTiles('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, gameOver]);

  const getTileColor = (value) => {
    const colors = {
      0: 'bg-gray-800',
      2: 'bg-yellow-200',
      4: 'bg-yellow-300',
      8: 'bg-orange-300',
      16: 'bg-orange-400',
      32: 'bg-red-400',
      64: 'bg-red-500',
      128: 'bg-yellow-500',
      256: 'bg-yellow-600',
      512: 'bg-yellow-700',
      1024: 'bg-yellow-800',
      2048: 'bg-yellow-900'
    };
    return colors[value] || 'bg-black';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-xs">
        <div className="text-xl font-bold">Score: {score}</div>
        <button 
          onClick={startGame}
          className="px-4 py-1 bg-blue-600 rounded"
        >
          New Game
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 bg-gray-900 p-2 rounded">
        {grid.map((value, index) => (
          <div 
            key={index}
            className={`w-16 h-16 flex items-center justify-center rounded font-bold text-xl 
              ${getTileColor(value)} 
              ${value > 0 ? 'text-gray-900' : 'text-transparent'}`}
          >
            {value > 0 ? value : ''}
          </div>
        ))}
      </div>
      
      {gameOver && (
        <div className="mt-4 p-4 bg-red-900 rounded-lg">
          <p className="text-white text-xl">Game Over!</p>
          <button 
            onClick={startGame}
            className="mt-2 px-4 py-1 bg-blue-600 rounded"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}