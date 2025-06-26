"use client";
import { useEffect, useRef, useState } from "react";

export function BrickBreakerGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [uiState, setUiState] = useState({
    gameState: "menu",
    score: 0, // Now represents time in seconds
    lives: 3,
    difficulty: "medium"
  });

  // Game elements refs
  const gameRef = useRef({
    mouseX: 150,
    ballY: 300,
    ballX: 150,
    dy: -1.5,
    dx: 0.5,
    paddleWidth: 80,
    bricks: [],
    brickConfig: {
      rowCount: 5,
      colCount: 3,
      width: 60,
      height: 20,
      padding: 10,
      offsetTop: 30,
      offsetLeft: 60
    },
    lastTime: 0
  });

  // Timer for score
  useEffect(() => {
    let timer;
    if (uiState.gameState === "playing") {
      timer = setInterval(() => {
        setUiState(prev => ({ ...prev, score: prev.score + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [uiState.gameState]);

  // Initialize game based on difficulty
  useEffect(() => {
    gameRef.current.paddleWidth = 
      uiState.difficulty === "easy" ? 120 :
      uiState.difficulty === "medium" ? 80 : 60;
    
    // Initialize bricks
    const bricks = [];
    for (let c = 0; c < gameRef.current.brickConfig.colCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < gameRef.current.brickConfig.rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    gameRef.current.bricks = bricks;
  }, [uiState.difficulty]);

  // Draw UI elements when score/lives change
  useEffect(() => {
    if (uiState.gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    
    // Clear and redraw UI area
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, 30);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Time: ${uiState.score}s`, 10, 20);
    ctx.fillText(`Lives: ${uiState.lives}`, width - 80, 20);
  }, [uiState.score, uiState.lives, uiState.gameState]);

  const startGame = () => {
    setUiState({
      gameState: "playing",
      score: 0, // Reset timer
      lives: 3,
      difficulty: uiState.difficulty
    });
    
    // Reset game state
    gameRef.current = {
      ...gameRef.current,
      mouseX: 150,
      ballY: 300,
      ballX: 150,
      dy: -1.5,
      dx: 0.5,
      paddleWidth: uiState.difficulty === "easy" ? 120 : 
                 uiState.difficulty === "medium" ? 80 : 60,
      lastTime: Date.now()
    };
    
    // Reset bricks
    for (let c = 0; c < gameRef.current.brickConfig.colCount; c++) {
      for (let r = 0; r < gameRef.current.brickConfig.rowCount; r++) {
        gameRef.current.bricks[c][r].status = 1;
      }
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();
  };

  const drawGameElements = (ctx, canvas) => {
    const { ballX, ballY, bricks, brickConfig, paddleWidth, mouseX } = gameRef.current;
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    
    // Draw paddle
    ctx.beginPath();
    ctx.rect(mouseX - paddleWidth/2, canvas.height - 15, paddleWidth, 10);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    
    // Draw bricks
    for (let c = 0; c < brickConfig.colCount; c++) {
      for (let r = 0; r < brickConfig.rowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickConfig.width + brickConfig.padding) + brickConfig.offsetLeft;
          const brickY = r * (brickConfig.height + brickConfig.padding) + brickConfig.offsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickConfig.width, brickConfig.height);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
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

    // Clear game area (preserve UI area)
    ctx.clearRect(0, 30, width, height - 30);
    
    // Draw all game elements
    drawGameElements(ctx, canvas);

    // Update ball position
    game.ballY += game.dy;
    game.ballX += game.dx;

    // Brick collision
    let bricksLeft = 0;
    for (let c = 0; c < game.brickConfig.colCount; c++) {
      for (let r = 0; r < game.brickConfig.rowCount; r++) {
        const brick = game.bricks[c][r];
        if (brick.status === 1) {
          bricksLeft++;
          if (
            game.ballX > brick.x && game.ballX < brick.x + game.brickConfig.width &&
            game.ballY > brick.y && game.ballY < brick.y + game.brickConfig.height
          ) {
            game.dy = -game.dy;
            brick.status = 0;
            
            // Slightly increase speed after each hit
            game.dy *= 1.02;
            game.dx *= 1.02;
          }
        }
      }
    }

    // Wall collision
    if (game.ballX < 8 || game.ballX > width - 8) {
      game.dx = -game.dx;
    }
    if (game.ballY < 8) {
      game.dy = -game.dy;
    }
    // Paddle collision
    else if (game.ballY > height - 23 && 
             game.ballX > game.mouseX - game.paddleWidth/2 && 
             game.ballX < game.mouseX + game.paddleWidth/2) {
      game.dy = -Math.abs(game.dy);
      // Add angle based on where ball hits paddle
      const hitPos = (game.ballX - (game.mouseX - game.paddleWidth/2)) / game.paddleWidth;
      game.dx = (hitPos - 0.5) * 4;
    }
    // Bottom collision (lose life)
    else if (game.ballY > height) {
      setUiState(prev => {
        const newLives = prev.lives - 1;
        if (newLives <= 0) {
          return { ...prev, gameState: "gameover", lives: 0 };
        }
        
        // Reset ball
        game.ballY = 300;
        game.ballX = width / 2;
        game.dy = -1.5;
        game.dx = 0.5;
        
        return { ...prev, lives: newLives };
      });
    }

    // Win condition
    if (bricksLeft === 0) {
      setUiState(prev => ({ ...prev, gameState: "win" }));
      return;
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {uiState.gameState === "menu" && (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold">Brick Breaker</h1>
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

      {(uiState.gameState === "gameover" || uiState.gameState === "win") && (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold">
            {uiState.gameState === "win" ? "You Win!" : "Game Over"}
          </h1>
          <p className="text-xl">Time: {formatTime(uiState.score)}</p>
          <button 
            onClick={startGame}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Play Again
          </button>
        </div>
      )}

      {uiState.gameState === "playing" && (
        <div className="flex justify-between w-full px-20">
          <p>Time: {formatTime(uiState.score)}</p>
          <p>Lives: {uiState.lives}</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`border border-white rounded-md ${uiState.gameState !== "playing" ? "hidden" : ""}`}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}