"use client";
import { useEffect, useState, useRef } from "react";

export function Game2048() {
  const [grid, setGrid] = useState(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

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

  // Touch controls
  useEffect(() => {
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
      touchEnd.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchEnd.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      const dx = touchEnd.current.x - touchStart.current.x;
      const dy = touchEnd.current.y - touchStart.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 10) { // threshold for minimal swipe
        if (absDx > absDy) {
          moveTiles(dx > 0 ? "right" : "left");
        } else {
          moveTiles(dy > 0 ? "down" : "up");
        }
      }
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener("touchstart", handleTouchStart, { passive: false });
      node.addEventListener("touchmove", handleTouchMove, { passive: false });
      node.addEventListener("touchend", handleTouchEnd, { passive: false });
    }
    return () => {
      if (node) {
        node.removeEventListener("touchstart", handleTouchStart);
        node.removeEventListener("touchmove", handleTouchMove);
        node.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [grid, gameOver]);

  const getTileColor = (value) => {
    const colors = {
      0: "bg-screen-dark/60",
      2: "bg-cartridge",
      4: "bg-screen",
      8: "bg-link-hover",
      16: "bg-highlight",
      32: "bg-accent",
      64: "bg-secondary text-text-primary",
      128: "bg-primary text-text-primary",
      256: "bg-highlight",
      512: "bg-link-hover",
      1024: "bg-accent",
      2048: "bg-screen",
    };
    return colors[value] || "bg-primary text-text-primary";
  };

  return (
    <div className="flex flex-col items-center" ref={containerRef}>
      <div className="mb-4 flex w-full max-w-xs items-center justify-between gap-4 font-pixel text-xs uppercase">
        <div>Score: {score}</div>
        <button onClick={startGame} className="pixel-button px-3 py-2">
          New Game
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 border-2 border-ink bg-screen-dark p-2 shadow-raised">
        {grid.map((value, index) => (
          <div
            key={index}
            className={`flex h-16 w-16 items-center justify-center border-2 border-ink font-pixel text-lg font-black 
              ${getTileColor(value)} 
              ${value > 0 ? "text-ink" : "text-transparent"}`}
          >
            {value > 0 ? value : ""}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="pixel-screen mt-4 p-4 text-center">
          <p className="font-pixel text-xl font-black">Game Over!</p>
          <button
            onClick={startGame}
            className="pixel-button mt-3 px-4 py-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
