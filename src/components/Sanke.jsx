"use client";
import { useEffect, useRef, useState } from "react";

export function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("playing");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = 20;
    let snake = [{x: 10, y: 10}];
    let velocity = {x: 0, y: 0};
    let food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    let gameSpeed = 100;

    // Game loop
    function gameLoop() {
      if (gameState !== "playing") return;

      // Move snake
      const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};
      snake.unshift(head);

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
        // Increase speed slightly
        gameSpeed = Math.max(50, gameSpeed - 2);
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

      // Draw everything
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      ctx.fillStyle = "lime";
      snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize-2, gridSize-2);
      });

      // Draw food
      ctx.fillStyle = "red";
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${score}`, 10, 20);

      setTimeout(gameLoop, gameSpeed);
    }

    // Keyboard controls
    function keyDownHandler(e) {
      switch(e.key) {
        case "ArrowUp":
          if (velocity.y === 0) velocity = {x: 0, y: -1};
          break;
        case "ArrowDown":
          if (velocity.y === 0) velocity = {x: 0, y: 1};
          break;
        case "ArrowLeft":
          if (velocity.x === 0) velocity = {x: -1, y: 0};
          break;
        case "ArrowRight":
          if (velocity.x === 0) velocity = {x: 1, y: 0};
          break;
      }
    }

    window.addEventListener("keydown", keyDownHandler);
    gameLoop();

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [gameState]);

  const restartGame = () => {
    setGameState("playing");
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="border border-white rounded-md"
      />
      {gameState === "gameover" && (
        <div className="mt-4 p-4 bg-red-900 rounded-lg">
          <p className="text-white">Game Over! Score: {score}</p>
          <button 
            onClick={restartGame}
            className="mt-2 px-4 py-1 bg-blue-600 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}