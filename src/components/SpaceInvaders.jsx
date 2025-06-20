"use client";
import { useEffect, useRef, useState } from "react";

export function SpaceInvadersGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("playing");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Game elements
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 30,
      width: 50,
      height: 20,
      speed: 5,
      color: "#0095DD"
    };

    const bullets = [];
    const bulletSpeed = 7;
    const bulletWidth = 4;
    const bulletHeight = 10;

    const enemies = [];
    const enemyWidth = 40;
    const enemyHeight = 20;
    const enemyPadding = 20;
    const enemyOffsetTop = 30;
    const enemyOffsetLeft = 30;
    const enemyRowCount = 3;
    const enemyColCount = 8;

    // Create enemies
    for (let c = 0; c < enemyColCount; c++) {
      enemies[c] = [];
      for (let r = 0; r < enemyRowCount; r++) {
        enemies[c][r] = { 
          x: 0, 
          y: 0, 
          status: 1 
        };
      }
    }

    // Keyboard state
    const keys = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    };

    // Event listeners
    function keyDownHandler(e) {
      if (e.key in keys) {
        keys[e.key] = true;
        e.preventDefault();
      }
    }

    function keyUpHandler(e) {
      if (e.key in keys) {
        keys[e.key] = false;
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    // Game loop
    function draw() {
      if (gameState !== "playing") return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.fillStyle = player.color;
      ctx.fillRect(
        player.x - player.width / 2,
        player.y - player.height / 2,
        player.width,
        player.height
      );

      // Draw bullets
      ctx.fillStyle = "#FF0000";
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
        bullet.y -= bulletSpeed;

        // Check bullet-enemy collision
        for (let c = 0; c < enemyColCount; c++) {
          for (let r = 0; r < enemyRowCount; r++) {
            const enemy = enemies[c][r];
            if (enemy.status === 1) {
              if (
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemyWidth &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemyHeight
              ) {
                enemy.status = 0;
                bullets.splice(bullets.indexOf(bullet), 1);
                setScore(prev => prev + 10);
              }
            }
          }
        }
      });

      // Remove bullets that are off screen
      for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
        }
      }

      // Draw enemies
      for (let c = 0; c < enemyColCount; c++) {
        for (let r = 0; r < enemyRowCount; r++) {
          if (enemies[c][r].status === 1) {
            const enemyX = c * (enemyWidth + enemyPadding) + enemyOffsetLeft;
            const enemyY = r * (enemyHeight + enemyPadding) + enemyOffsetTop;
            enemies[c][r].x = enemyX;
            enemies[c][r].y = enemyY;
            ctx.fillStyle = "#0095DD";
            ctx.fillRect(enemyX, enemyY, enemyWidth, enemyHeight);
          }
        }
      }

      // Check if all enemies are dead
      if (enemies.flat().every(enemy => enemy.status === 0)) {
        setGameState("win");
        return;
      }

      // Player movement
      if (keys.ArrowLeft && player.x > player.width / 2) {
        player.x -= player.speed;
      }
      if (keys.ArrowRight && player.x < canvas.width - player.width / 2) {
        player.x += player.speed;
      }
      if (keys.Space) {
        bullets.push({
          x: player.x - bulletWidth / 2,
          y: player.y - player.height / 2 - bulletHeight
        });
        keys.Space = false;
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [gameState]);

  const restartGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <p>Score: {score} | Lives: {lives}</p>
      </div>
      <canvas 
        ref={canvasRef} 
        width={480} 
        height={320} 
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
      {gameState === "win" && (
        <div className="mt-4 p-4 bg-green-900 rounded-lg">
          <p className="text-white">You Win! Score: {score}</p>
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