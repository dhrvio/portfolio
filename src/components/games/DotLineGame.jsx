"use client";
import { useEffect, useRef, useState } from "react";

export default function DotLineGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [uiState, setUiState] = useState({
    gameState: "menu",
    score: 0,
    lives: 3,
    difficulty: "medium"
  });

  // Game elements refs
  const gameRef = useRef({
    mouseX: 150,
    ballY: 100,
    ballX: 150,
    dy: 2,
    dx: 2,
    paddleWidth: 80
  });

  // Touch position ref
  const touchPosRef = useRef({ x: 0 });

  // Update paddle width when difficulty changes
  useEffect(() => {
    gameRef.current.paddleWidth = 
      uiState.difficulty === "easy" ? 120 :
      uiState.difficulty === "medium" ? 80 : 60;
  }, [uiState.difficulty]);

  // Draw UI elements whenever score or lives change
  useEffect(() => {
    if (uiState.gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear just the UI area to avoid flickering
    ctx.clearRect(0, 0, width, 30);
    ctx.clearRect(width - 100, 0, 100, 30);

    // Draw updated UI
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${uiState.score}`, 10, 20);
    ctx.fillText(`Lives: ${uiState.lives}`, width - 80, 20);
  }, [uiState.score, uiState.lives, uiState.gameState]);

  const startGame = () => {
    setUiState({
      gameState: "playing",
      score: 0,
      lives: 3,
      difficulty: uiState.difficulty
    });
    
    gameRef.current = {
      mouseX: 150,
      ballY: 100,
      ballX: 150,
      dy: 2,
      dx: 2,
      paddleWidth: uiState.difficulty === "easy" ? 120 : 
                 uiState.difficulty === "medium" ? 80 : 60
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();
  };

  const animate = () => {
    if (uiState.gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width = 300;
    const height = canvas.height = 400;
    const game = gameRef.current;

    // Clear only the game area (not the UI area)
    ctx.clearRect(0, 30, width, height - 30);

    // Draw ball
    ctx.beginPath();
    ctx.arc(game.ballX, game.ballY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // Draw paddle
    ctx.beginPath();
    ctx.moveTo(game.mouseX - game.paddleWidth/2, height - 20);
    ctx.lineTo(game.mouseX + game.paddleWidth/2, height - 20);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.closePath();

    // Update ball position
    game.ballY += game.dy;
    game.ballX += game.dx;

    // Ball hits paddle
    if (game.ballY >= height - 30 && 
        game.ballX > game.mouseX - game.paddleWidth/2 && 
        game.ballX < game.mouseX + game.paddleWidth/2) {
      game.dy = -game.dy - (uiState.difficulty === "easy" ? 0.2 : 
                           uiState.difficulty === "medium" ? 0.3 : 0.4);
      
      // Update score
      setUiState(prev => ({ ...prev, score: prev.score + 10 }));
      
      // Add randomness to X direction
      const hitPosition = (game.ballX - (game.mouseX - game.paddleWidth/2)) / game.paddleWidth;
      game.dx = (hitPosition - 0.5) * 4;
      if (Math.abs(game.dx) < 0.5) {
        game.dx = game.dx > 0 ? 2 : -2;
      }
    }

    // Ball hits top
    if (game.ballY <= 10) {
      game.dy = -game.dy;
    }

    // Ball misses paddle (lose life)
    if (game.ballY > height) {
      setUiState(prev => {
        const newLives = prev.lives - 1;
        if (newLives <= 0) {
          return { ...prev, gameState: "gameover", lives: 0 };
        }
        
        // Reset ball position
        game.ballY = 100;
        game.ballX = Math.random() * (width - 20) + 10;
        game.dy = Math.abs(game.dy);
        game.dx = Math.random() > 0.5 ? 2 : -2;
        
        return { ...prev, lives: newLives };
      });
    }

    // Ball hits side walls
    if (game.ballX <= 10 || game.ballX >= width - 10) {
      game.dx = -game.dx;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (uiState.gameState === "playing") {
      animate();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [uiState.gameState]);

  const handleMouseMove = (e) => {
    if (uiState.gameState === "playing") {
      gameRef.current.mouseX = e.nativeEvent.offsetX;
    }
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (uiState.gameState !== "playing") return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    touchPosRef.current.x = touch.clientX - rect.left;
    gameRef.current.mouseX = touch.clientX - rect.left;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (uiState.gameState !== "playing") return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    gameRef.current.mouseX = touch.clientX - rect.left;
  };

  // Set up touch event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [uiState.gameState]);

  return (
    <div className="flex flex-col items-center gap-4">
      {uiState.gameState === "menu" && (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold">Dot Bounce Game</h1>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="difficulty" 
                checked={uiState.difficulty === "easy"} 
                onChange={() => setUiState(prev => ({ ...prev, difficulty: "easy" }))} 
              />
              Easy
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="difficulty" 
                checked={uiState.difficulty === "medium"} 
                onChange={() => setUiState(prev => ({ ...prev, difficulty: "medium" }))} 
              />
              Medium
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="difficulty" 
                checked={uiState.difficulty === "hard"} 
                onChange={() => setUiState(prev => ({ ...prev, difficulty: "hard" }))} 
              />
              Hard
            </label>
          </div>
          <button 
            onClick={startGame}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Start Game
          </button>
        </div>
      )}

      {uiState.gameState === "gameover" && (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold">Game Over</h1>
          <p className="text-xl">Your score: {uiState.score}</p>
          <button 
            onClick={startGame}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Play Again
          </button>
        </div>
      )}
      
      {uiState.gameState === "playing" && <div className="flex justify-between w-full px-20">
        <p>Score: {uiState.score}</p>
        <p>Lives: {uiState.lives}</p>
      </div>}
      
      <canvas
        ref={canvasRef}
        className={`border border-white rounded-md ${uiState.gameState !== "playing" ? "hidden" : ""}`}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}