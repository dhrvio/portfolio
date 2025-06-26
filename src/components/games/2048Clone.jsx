"use client";
import { useEffect, useState, useRef } from "react";

export function Game2048() {
  const [grid, setGrid] = useState(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0 });

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
      const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveTiles = (direction) => {
    if (gameOver) return;

    const newGrid = [...grid];
    let moved = false;
    let newScore = score;

    const processLine = (line) => {
      let changed = false;
      let filtered = line.filter((val) => val !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered[i + 1] = 0;
          changed = true;
        }
      }

      filtered = filtered.filter((val) => val !== 0);
      while (filtered.length < 4) filtered.push(0);

      return { line: filtered, changed };
    };

    for (let i = 0; i < 4; i++) {
      let line = [];

      if (direction === "left") {
        line = newGrid.slice(i * 4, i * 4 + 4);
        const result = processLine(line);
        moved = moved || result.changed || JSON.stringify(line) !== JSON.stringify(result.line);
        for (let j = 0; j < 4; j++) {
          newGrid[i * 4 + j] = result.line[j];
        }
      } else if (direction === "right") {
        line = newGrid.slice(i * 4, i * 4 + 4).reverse();
        const result = processLine(line);
        moved = moved || result.changed || JSON.stringify(line) !== JSON.stringify(result.line);
        for (let j = 0; j < 4; j++) {
          newGrid[i * 4 + j] = result.line[3 - j];
        }
      } else if (direction === "up") {
        line = [newGrid[i], newGrid[i + 4], newGrid[i + 8], newGrid[i + 12]];
        const result = processLine(line);
        moved = moved || result.changed || JSON.stringify(line) !== JSON.stringify(result.line);
        for (let j = 0; j < 4; j++) {
          newGrid[i + j * 4] = result.line[j];
        }
      } else if (direction === "down") {
        line = [
          newGrid[i + 12],
          newGrid[i + 8],
          newGrid[i + 4],
          newGrid[i],
        ].reverse();
        const result = processLine(line);
        moved = moved || result.changed || JSON.stringify(line) !== JSON.stringify(result.line);
        for (let j = 0; j < 4; j++) {
          newGrid[i + (3 - j) * 4] = result.line[j];
        }
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);

      if (!hasValidMoves(newGrid)) {
        setGameOver(true);
      }
    }
  };

  const hasValidMoves = (grid) => {
    if (grid.some((cell) => cell === 0)) return true;
    for (let i = 0; i < 16; i++) {
      const val = grid[i];
      if (i % 4 < 3 && grid[i + 1] === val) return true;
      if (i < 12 && grid[i + 4] === val) return true;
    }
    return false;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      switch (e.key) {
        case "ArrowLeft":
          moveTiles("left");
          break;
        case "ArrowRight":
          moveTiles("right");
          break;
        case "ArrowUp":
          moveTiles("up");
          break;
        case "ArrowDown":
          moveTiles("down");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, gameOver]);

  // Mouse/touch swipe controls
  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
          moveTiles(dx > 0 ? "right" : "left");
        } else {
          moveTiles(dy > 0 ? "down" : "up");
        }
      }
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener("touchstart", handleTouchStart);
      node.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (node) {
        node.removeEventListener("touchstart", handleTouchStart);
        node.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [grid, gameOver]);

  const getTileColor = (value) => {
    const colors = {
      0: "bg-gray-800",
      2: "bg-yellow-200",
      4: "bg-yellow-300",
      8: "bg-orange-300",
      16: "bg-orange-400",
      32: "bg-red-400",
      64: "bg-red-500",
      128: "bg-yellow-500",
      256: "bg-yellow-600",
      512: "bg-yellow-700",
      1024: "bg-yellow-800",
      2048: "bg-yellow-900",
    };
    return colors[value] || "bg-black";
  };

  return (
    <div className="flex flex-col items-center" ref={containerRef}>
      <div className="mb-4 flex justify-between w-full max-w-xs">
        <div className="text-xl font-bold">Score: {score}</div>
        <button onClick={startGame} className="px-4 py-1 bg-blue-600 rounded">
          New Game
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-gray-900 p-2 rounded">
        {grid.map((value, index) => (
          <div
            key={index}
            className={`w-16 h-16 flex items-center justify-center rounded font-bold text-xl 
              ${getTileColor(value)} 
              ${value > 0 ? "text-gray-900" : "text-transparent"}`}
          >
            {value > 0 ? value : ""}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 p-4 bg-red-900 rounded-lg text-center">
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
