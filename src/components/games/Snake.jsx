"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("ready"); // ready/playing/paused/gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const gameSpeedRef = useRef(100);
  const lastUpdateTimeRef = useRef(0);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear any pending game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    // Reset game state
    velocityRef.current = { x: 0, y: 0 };
    gameSpeedRef.current = 100;
    lastUpdateTimeRef.current = 0;

    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ready message
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press any arrow key to start", canvas.width / 2, canvas.height / 2);
  }, []);

  const drawGame = useCallback((snake, food) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = canvas.width / 20;

    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach((part, index) => {
      // Head is slightly different color
      const color = index === 0 ? "#4CAF50" : "#8BC34A";
      ctx.fillStyle = color;
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
      
      // Add some styling to make it look nicer
      ctx.strokeStyle = "#45a049";
      ctx.lineWidth = 1;
      ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    });

    // Draw food
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2,
      gridSize / 2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`High Score: ${highScore}`, 10, 50);
  }, [score, highScore]);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = canvas.width / 20;
    const tileCount = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };

    // Make sure food doesn't spawn on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    }

    let lastUpdateTime = 0;
    let accumulatedTime = 0;

    const gameLoop = (currentTime) => {
      if (gameState !== "playing") {
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);

      if (!lastUpdateTime) {
        lastUpdateTime = currentTime;
        return;
      }

      const deltaTime = currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;
      accumulatedTime += deltaTime;

      // Fixed time step game update
      while (accumulatedTime >= gameSpeedRef.current) {
        updateGame();
        accumulatedTime -= gameSpeedRef.current;
      }

      drawGame(snake, food);
    };

    const updateGame = () => {
      // Move snake
      const velocity = velocityRef.current;
      const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
      snake.unshift(head);

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        
        // Generate new food
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
        
        // Make sure food doesn't spawn on snake
        while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
          food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
          };
        }

        // Increase speed slightly (with a minimum speed)
        gameSpeedRef.current = Math.max(50, gameSpeedRef.current - 2);
      } else {
        snake.pop();
      }

      // Check collision with walls
      if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount
      ) {
        setGameState("gameover");
        return;
      }

      // Check collision with self
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          setGameState("gameover");
          return;
        }
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, highScore, drawGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Keyboard controls
    const keyDownHandler = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState === "ready" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        setGameState("playing");
        return;
      }

      if (gameState === "playing" || gameState === "paused") {
        if (e.key === " ") {
          setGameState(prev => prev === "playing" ? "paused" : "playing");
          return;
        }

        const velocity = velocityRef.current;
        switch (e.key) {
          case "ArrowUp":
            if (velocity.y === 0) velocityRef.current = { x: 0, y: -1 };
            break;
          case "ArrowDown":
            if (velocity.y === 0) velocityRef.current = { x: 0, y: 1 };
            break;
          case "ArrowLeft":
            if (velocity.x === 0) velocityRef.current = { x: -1, y: 0 };
            break;
          case "ArrowRight":
            if (velocity.x === 0) velocityRef.current = { x: 1, y: 0 };
            break;
        }
      }
    };

    window.addEventListener("keydown", keyDownHandler);

    // Touch controls for mobile
    const handleTouchStart = (e) => {
      if (gameState === "ready") {
        setGameState("playing");
        return;
      }

      if (!e.touches.length) return;
      const touch = e.touches[0];
      const canvasRect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - canvasRect.left;
      const touchY = touch.clientY - canvasRect.top;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const velocity = velocityRef.current;
      const dx = touchX - centerX;
      const dy = touchY - centerY;

      // Determine primary direction of swipe
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && velocity.x === 0) {
          velocityRef.current = { x: 1, y: 0 }; // Right
        } else if (dx < 0 && velocity.x === 0) {
          velocityRef.current = { x: -1, y: 0 }; // Left
        }
      } else {
        // Vertical swipe
        if (dy > 0 && velocity.y === 0) {
          velocityRef.current = { x: 0, y: 1 }; // Down
        } else if (dy < 0 && velocity.y === 0) {
          velocityRef.current = { x: 0, y: -1 }; // Up
        }
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });

    // Initial setup
    resetGame();

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      canvas.removeEventListener("touchstart", handleTouchStart);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, resetGame]);

  useEffect(() => {
    if (gameState === "playing") {
      startGame();
    } else if (gameState === "gameover") {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    } else if (gameState === "ready") {
      resetGame();
    }
  }, [gameState, startGame, resetGame]);

  const restartGame = () => {
    setScore(0);
    setGameState("playing");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-white">Snake Game</h1>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-2 border-white rounded-lg bg-black"
      />
      
      {gameState === "paused" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-6 rounded-lg text-center">
          <p className="text-white text-2xl mb-4">Game Paused</p>
          <button
            onClick={() => setGameState("playing")}
            className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
          >
            Resume
          </button>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-6 rounded-lg text-center">
          <p className="text-white text-2xl mb-2">Game Over!</p>
          <p className="text-white text-xl mb-4">Score: {score}</p>
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 mr-2"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setGameState("playing")}
          className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
          disabled={gameState === "playing"}
        >
          {gameState === "paused" ? "Resume" : "Start"}
        </button>
        <button
          onClick={() => setGameState("paused")}
          className="px-4 py-2 bg-yellow-600 rounded-lg text-white hover:bg-yellow-700"
          disabled={gameState !== "playing"}
        >
          Pause
        </button>
      </div>
    </div>
  );
}