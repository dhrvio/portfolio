"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const palette = {
  ink: "#171923",
  screen: "#a7c957",
  screenDark: "#2f4f2f",
  highlight: "#ffd166",
  accent: "#ff6b6b",
  linkHover: "#8bd450",
};

export function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("ready"); // ready/playing/paused/gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef(null);
  const directionRef = useRef("right");
  const nextDirectionRef = useRef("right");
  const lastUpdateTimeRef = useRef(0);
  const gridSize = 20;
  const cellSizeRef = useRef(20);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Game elements
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 5, y: 5 });
  const speedRef = useRef(150);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = { x: 5, y: 5 };
    directionRef.current = "right";
    nextDirectionRef.current = "right";
    speedRef.current = 150;
    drawGame();
  }, []);

  // Get random position for food that's not on the snake
  const getRandomFoodPosition = useCallback(() => {
    let newFoodPos;
    const snake = snakeRef.current;
    do {
      newFoodPos = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (snake.some(segment => segment.x === newFoodPos.x && segment.y === newFoodPos.y));
    return newFoodPos;
  }, []);

  // Draw the game state
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cellSizeRef.current = canvas.width / gridSize;

    // Clear canvas
    ctx.fillStyle = palette.screen;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(47, 79, 47, 0.2)";
    for (let i = 0; i <= gridSize; i++) {
      const line = i * cellSizeRef.current;
      ctx.fillRect(line, 0, 1, canvas.height);
      ctx.fillRect(0, line, canvas.width, 1);
    }

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? palette.ink : palette.screenDark;
      ctx.fillRect(
        segment.x * cellSizeRef.current,
        segment.y * cellSizeRef.current,
        cellSizeRef.current - 2,
        cellSizeRef.current - 2
      );
      if (isHead) {
        ctx.fillStyle = palette.highlight;
        ctx.fillRect(
          segment.x * cellSizeRef.current + 4,
          segment.y * cellSizeRef.current + 4,
          4,
          4
        );
      }
    });

    // Draw food
    const food = foodRef.current;
    ctx.fillStyle = palette.accent;
    ctx.fillRect(
      food.x * cellSizeRef.current + 4,
      food.y * cellSizeRef.current + 4,
      cellSizeRef.current - 8,
      cellSizeRef.current - 8
    );

    // Draw score
    ctx.fillStyle = palette.ink;
    ctx.font = "16px monospace";
    ctx.textAlign = "left";

    if (gameState === "ready") {
      ctx.fillStyle = palette.ink;
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Press arrow key", canvas.width / 2, canvas.height / 2);
    }
  }, [score, highScore, gameState]);

  // Update game state
  const updateGame = useCallback(() => {
    const snake = snakeRef.current;
    const food = foodRef.current;

    // Update direction
    directionRef.current = nextDirectionRef.current;

    // Create new head
    const head = { ...snake[0] };
    switch (directionRef.current) {
      case "up": head.y -= 1; break;
      case "down": head.y += 1; break;
      case "left": head.x -= 1; break;
      case "right": head.x += 1; break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      setGameState("gameover");
      return;
    }

    // Check self collision
    if (snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)) {
      setGameState("gameover");
      return;
    }

    // Add new head
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      // Update score
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        return newScore;
      });

      // Generate new food
      foodRef.current = getRandomFoodPosition();

      // Increase speed (with minimum speed of 50ms)
      speedRef.current = Math.max(50, speedRef.current - 5);
    } else {
      // Remove tail if no food was eaten
      snake.pop();
    }
  }, [highScore, getRandomFoodPosition]);

  // Main game loop
  const gameLoop = useCallback((timestamp) => {
    if (gameState !== "playing") {
      drawGame();
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastUpdateTimeRef.current;
    if (elapsed > speedRef.current) {
      updateGame();
      drawGame();
      lastUpdateTimeRef.current = timestamp;
    }
  }, [gameState, updateGame, drawGame]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
      e.preventDefault();
    }

    if (gameState === "ready" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      setGameState("playing");
      return;
    }

    if (e.key === " ") {
      setGameState(prev => prev === "playing" ? "paused" : "playing");
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        if (directionRef.current !== "down") nextDirectionRef.current = "up";
        break;
      case "ArrowDown":
        if (directionRef.current !== "up") nextDirectionRef.current = "down";
        break;
      case "ArrowLeft":
        if (directionRef.current !== "right") nextDirectionRef.current = "left";
        break;
      case "ArrowRight":
        if (directionRef.current !== "left") nextDirectionRef.current = "right";
        break;
    }
  }, [gameState]);

  // Handle touch input
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (gameState === "ready") {
      setGameState("playing");
      return;
    }

    if (Math.max(absDx, absDy) < 30) return; // Minimum swipe distance

    if (absDx > absDy) {
      // Horizontal swipe
      if (dx > 0 && directionRef.current !== "left") {
        nextDirectionRef.current = "right";
      } else if (dx < 0 && directionRef.current !== "right") {
        nextDirectionRef.current = "left";
      }
    } else {
      // Vertical swipe
      if (dy > 0 && directionRef.current !== "up") {
        nextDirectionRef.current = "down";
      } else if (dy < 0 && directionRef.current !== "down") {
        nextDirectionRef.current = "up";
      }
    }
  }, [gameState]);

  // Set up event listeners and game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Initialize food position
    foodRef.current = getRandomFoodPosition();
    drawGame();

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [handleKeyDown, handleTouchStart, handleTouchEnd, drawGame, gameLoop, getRandomFoodPosition]);

  // Handle game state changes
  useEffect(() => {
    if (gameState === "playing") {
      lastUpdateTimeRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState === "ready") {
      resetGame();
    }
  }, [gameState, gameLoop, resetGame]);

  const restartGame = () => {
    setScore(0);
    resetGame();
    setGameState("playing");
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="flex w-full justify-between font-pixel text-xs uppercase">
        <p>{`Score: ${score}`}</p>
        <p>{`Best: ${highScore}`}</p>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={400}
        className="gba-canvas"
      />

      {gameState === "paused" && (
        <div className="pixel-screen absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 text-center">
          <p className="mb-4 font-pixel text-2xl font-black">Paused</p>
          <button
            onClick={() => setGameState("playing")}
            className="pixel-button px-4 py-2"
          >
            Resume
          </button>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="pixel-screen absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 text-center">
          <p className="mb-2 font-pixel text-2xl font-black">Game Over</p>
          <p className="mb-4 text-xl font-bold">Score: {score}</p>
          <button
            onClick={restartGame}
            className="pixel-button h-full w-full px-4 py-2"
          >
            Play Again
          </button>
        </div>
      )}

      {gameState === 'ready' && (
        <div className="flex gap-4">
          <button
            onClick={() => setGameState("playing")}
            className="pixel-button px-4 py-2"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
