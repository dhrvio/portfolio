"use client";
import { useEffect, useRef, useState } from "react";

export function SpaceInvadersGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [uiState, setUiState] = useState({
    gameState: "menu",
    score: 0,
    lives: 3,
    difficulty: "medium",
    wave: 1
  });

  // Game elements refs
  const gameRef = useRef({
    playerX: 150,
    bullets: [],
    enemies: [],
    enemyBullets: [],
    enemyDirection: 1,
    enemySpeed: 0.2,
    lastShot: 0,
    lastEnemyShot: 0,
    gameWidth: 300,
    gameHeight: 400,
    wavePattern: 1,
    enemyTypes: ["👾", "👽", "🤖", "👹", "🦠"],
    enemyColors: ["#00FF00", "#FF00FF", "#FFFF00", "#FF0000", "#00FFFF"]
  });

  // Enemy patterns
  const enemyPatterns = [
    // Pattern 1: Classic grid (👾)
    (rows, cols) => {
      const enemies = [];
      const size = 20;
      const padding = 10;
      const offsetTop = 40;
      const offsetLeft = 20;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          enemies.push({
            x: c * (size + padding) + offsetLeft,
            y: r * (size + padding) + offsetTop,
            width: size,
            height: size,
            status: 1,
            type: 0 // 👾
          });
        }
      }
      return enemies;
    },
    // Pattern 2: Diamond formation (👽)
    (rows, cols) => {
      const enemies = [];
      const size = 20;
      const padding = 15;
      const offsetTop = 40;
      const offsetLeft = 50;
      
      const center = Math.floor(cols / 2);
      for (let r = 0; r < rows; r++) {
        const rowWidth = r < center ? r + 1 : rows - r;
        const startCol = center - Math.floor(rowWidth / 2);
        
        for (let c = 0; c < rowWidth; c++) {
          enemies.push({
            x: (startCol + c) * (size + padding) + offsetLeft,
            y: r * (size + padding) + offsetTop,
            width: size,
            height: size,
            status: 1,
            type: 1 // 👽
          });
        }
      }
      return enemies;
    },
    // Pattern 3: Zigzag (🤖)
    (rows, cols) => {
      const enemies = [];
      const size = 20;
      const padding = 15;
      const offsetTop = 40;
      const offsetLeft = 20;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r % 2 === 0 && c % 2 === 0) || (r % 2 === 1 && c % 2 === 1)) {
            enemies.push({
              x: c * (size + padding) + offsetLeft,
              y: r * (size + padding) + offsetTop,
              width: size,
              height: size,
              status: 1,
              type: 2 // 🤖
            });
          }
        }
      }
      return enemies;
    },
    // Pattern 4: Vertical lines (👹)
    (rows, cols) => {
      const enemies = [];
      const size = 20;
      const padding = 20;
      const offsetTop = 40;
      const offsetLeft = 30;
      
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (c % 2 === 0 || r % 3 === 0) {
            enemies.push({
              x: c * (size + padding) + offsetLeft,
              y: r * (size + padding) + offsetTop,
              width: size,
              height: size,
              status: 1,
              type: 3 // 👹
            });
          }
        }
      }
      return enemies;
    },
    // Pattern 5: Spiral (🦠)
    (rows, cols) => {
      const enemies = [];
      const size = 20;
      const padding = 15;
      const offsetTop = 40;
      const offsetLeft = 50;
      
      let r = 0, c = 0;
      let dr = 0, dc = 1;
      let visited = new Set();
      
      for (let i = 0; i < rows * cols; i++) {
        if (!visited.has(`${r},${c}`) && Math.random() > 0.3) {
          enemies.push({
            x: c * (size + padding) + offsetLeft,
            y: r * (size + padding) + offsetTop,
            width: size,
            height: size,
            status: 1,
            type: 4 // 🦠
          });
          visited.add(`${r},${c}`);
        }
        
        if (c + dc >= cols || c + dc < 0 || r + dr >= rows || r + dr < 0 || visited.has(`${r + dr},${c + dc}`)) {
          [dr, dc] = [dc, -dr]; // Change direction
        }
        
        r += dr;
        c += dc;
      }
      return enemies;
    }
  ];

  // Initialize enemies based on current wave pattern
  const initEnemies = () => {
    const rows = 4 + Math.floor(uiState.wave / 3);
    const cols = 6 + Math.floor(uiState.wave / 2);
    const patternIndex = (uiState.wave - 1) % 5;
    
    const newEnemies = enemyPatterns[patternIndex](rows, cols);
    gameRef.current.enemies = newEnemies.map(enemy => ({
      ...enemy,
      width: enemy.width || 20,
      height: enemy.height || 20,
      status: 1,
      type: enemy.type || 0
    }));
    
    gameRef.current.wavePattern = patternIndex + 1;
  };

  // Update difficulty
  useEffect(() => {
    const speed = 
      uiState.difficulty === "easy" ? 0.15 :
      uiState.difficulty === "medium" ? 0.2 :
      0.25;
    gameRef.current.enemySpeed = speed;
  }, [uiState.difficulty]);

  const startGame = () => {
    setUiState({
      gameState: "playing",
      score: 0,
      lives: 3,
      difficulty: uiState.difficulty,
      wave: 1
    });
    
    initEnemies();
    gameRef.current = {
      ...gameRef.current,
      playerX: 150,
      bullets: [],
      enemyBullets: [],
      enemyDirection: 1,
      lastShot: 0,
      lastEnemyShot: 0,
      enemySpeed: uiState.difficulty === "easy" ? 0.15 : 
                 uiState.difficulty === "medium" ? 0.2 : 0.25
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();
  };

  const drawPlayer = (ctx, playerX) => {
    ctx.fillRect(
      playerX - 12,
      gameRef.current.gameHeight - 25,
      24,
      10
    );
    ctx.font = "16px Arial";
    ctx.fillText("🚀", playerX - 8, gameRef.current.gameHeight - 15);
  };

  const drawBullets = (ctx) => {
    ctx.font = "12px Arial";
    gameRef.current.bullets.forEach(bullet => {
      ctx.fillText("🔺", bullet.x - 6, bullet.y);
    });
  };

  const drawEnemyBullets = (ctx) => {
    ctx.font = "12px Arial";
    gameRef.current.enemyBullets.forEach(bullet => {
      ctx.fillText("🔻", bullet.x - 6, bullet.y);
    });
  };

  const drawEnemies = (ctx) => {
    ctx.font = "16px Arial";
    gameRef.current.enemies.forEach(enemy => {
      if (enemy.status === 1) {
        ctx.fillStyle = gameRef.current.enemyColors[enemy.type];
        ctx.fillText(
          gameRef.current.enemyTypes[enemy.type],
          enemy.x,
          enemy.y + 15
        );
      }
    });
  };

  const fireEnemyBullet = () => {
    const now = Date.now();
    if (now - gameRef.current.lastEnemyShot < 2500) return;

    const activeEnemies = gameRef.current.enemies.filter(enemy => enemy.status === 1);
    if (activeEnemies.length === 0) return;

    const shooter = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
    gameRef.current.enemyBullets.push({
      x: shooter.x + shooter.width/2 - 6,
      y: shooter.y + shooter.height
    });
    gameRef.current.lastEnemyShot = now;
  };

  const calculateEnemySpeed = () => {
    const activeEnemies = gameRef.current.enemies.filter(e => e.status === 1).length;
    const totalEnemies = gameRef.current.enemies.length;
    const percentRemaining = activeEnemies / totalEnemies;
    
    const baseSpeed = gameRef.current.enemySpeed;
    const waveMultiplier = 1 + (uiState.wave - 1) * 0.1;
    const maxSpeed = baseSpeed * 2 * waveMultiplier;
    
    return baseSpeed * waveMultiplier + (maxSpeed - baseSpeed * waveMultiplier) * (1 - percentRemaining);
  };

  const nextWave = () => {
    if (uiState.wave >= 5) {
      setUiState(prev => ({
        ...prev,
        gameState: "victory",
        score: prev.score + 500 // Big bonus for completing all waves
      }));
      return;
    }

    setUiState(prev => ({
      ...prev,
      wave: prev.wave + 1,
      score: prev.score + 100
    }));
    initEnemies();
    gameRef.current.bullets = [];
    gameRef.current.enemyBullets = [];
  };

  const animate = () => {
    if (uiState.gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = gameRef.current.gameWidth;
    const height = gameRef.current.gameHeight;
    const game = gameRef.current;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    
    // Draw UI
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    
    // Draw game elements
    drawPlayer(ctx, game.playerX);
    drawBullets(ctx);
    drawEnemyBullets(ctx);
    drawEnemies(ctx);

    // Move bullets
    game.bullets = game.bullets.filter(bullet => {
      bullet.y -= 2;
      return bullet.y > 0;
    });

    game.enemyBullets = game.enemyBullets.filter(bullet => {
      bullet.y += 1.5;
      return bullet.y < height;
    });

    // Enemy bullet collision
    game.enemyBullets.forEach((bullet, index) => {
      if (bullet.y >= height - 25 && 
          bullet.x >= game.playerX - 12 && 
          bullet.x <= game.playerX + 12) {
        game.enemyBullets.splice(index, 1);
        setUiState(prev => {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            return { ...prev, gameState: "gameover", lives: 0 };
          }
          return { ...prev, lives: newLives };
        });
      }
    });

    // Move enemies
    const currentEnemySpeed = calculateEnemySpeed();
    let shouldChangeDirection = false;
    let enemyReachedBottom = false;
    
    game.enemies.forEach(enemy => {
      if (enemy.status === 1) {
        switch (game.wavePattern) {
          case 1: // Classic left-right
            enemy.x += currentEnemySpeed * game.enemyDirection;
            break;
          case 2: // Diamond - diagonal
            enemy.x += currentEnemySpeed * game.enemyDirection * 0.7;
            enemy.y += currentEnemySpeed * 0.7;
            break;
          case 3: // Zigzag
            enemy.x += currentEnemySpeed * game.enemyDirection;
            enemy.y += Math.sin(enemy.x * 0.05) * 0.5;
            break;
          case 4: // Vertical lines
            enemy.y += currentEnemySpeed * 0.8;
            enemy.x += Math.sin(enemy.y * 0.05) * 1.5;
            break;
          case 5: // Spiral
            const centerX = width / 2;
            const centerY = 100;
            const angle = Math.atan2(enemy.y - centerY, enemy.x - centerX);
            const newAngle = angle + 0.02;
            const radius = Math.sqrt(
              Math.pow(enemy.x - centerX, 2) + 
              Math.pow(enemy.y - centerY, 2)
            );
            enemy.x = centerX + radius * Math.cos(newAngle);
            enemy.y = centerY + radius * Math.sin(newAngle);
            break;
        }

        if (enemy.x <= 0 || enemy.x + enemy.width >= width) {
          shouldChangeDirection = true;
        }

        if (enemy.y + enemy.height >= height - 30) {
          enemyReachedBottom = true;
        }
      }
    });

    if (enemyReachedBottom) {
      setUiState(prev => ({ ...prev, gameState: "gameover" }));
      return;
    }

    if (shouldChangeDirection && [1, 2, 3].includes(game.wavePattern)) {
      game.enemyDirection *= -1;
      game.enemies.forEach(enemy => {
        if (enemy.status === 1) {
          enemy.y += 5;
          if (enemy.y + enemy.height >= height - 30) {
            setUiState(prev => ({ ...prev, gameState: "gameover" }));
            return;
          }
        }
      });
    }

    // Bullet-enemy collision
    game.bullets.forEach((bullet, bulletIndex) => {
      game.enemies.forEach((enemy, enemyIndex) => {
        if (enemy.status === 1 &&
            bullet.x > enemy.x - 10 &&
            bullet.x < enemy.x + enemy.width + 10 &&
            bullet.y > enemy.y - 10 &&
            bullet.y < enemy.y + enemy.height + 10) {
          enemy.status = 0;
          game.bullets.splice(bulletIndex, 1);
          setUiState(prev => ({ ...prev, score: prev.score + 10 }));
        }
      });
    });

    // Enemy shooting
    if (Math.random() < 0.003) {
      fireEnemyBullet();
    }

    // Check wave completion
    if (game.enemies.every(enemy => enemy.status === 0)) {
      nextWave();
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (uiState.gameState !== "playing") return;
      
      const now = Date.now();
      const game = gameRef.current;

      if (e.key === "ArrowLeft") {
        game.playerX = Math.max(15, game.playerX - 4);
      } else if (e.key === "ArrowRight") {
        game.playerX = Math.min(285, game.playerX + 4);
      } else if (e.key === " " && now - game.lastShot > 600) {
        game.bullets.push({
          x: game.playerX - 6,
          y: game.gameHeight - 35
        });
        game.lastShot = now;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [uiState.gameState]);

  // Mouse controls
  const handleMouseMove = (e) => {
    if (uiState.gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    gameRef.current.playerX = Math.max(15, Math.min(285, x));
  };

  const handleClick = () => {
    if (uiState.gameState !== "playing") return;
    
    const now = Date.now();
    const game = gameRef.current;
    
    if (now - game.lastShot > 600) {
      game.bullets.push({
        x: game.playerX - 6,
        y: game.gameHeight - 35
      });
      game.lastShot = now;
    }
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
  }, [uiState.gameState, uiState.wave]);

  return (
    <div className="flex flex-col items-center gap-4">
      {uiState.gameState === "menu" && (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold">Space Invaders 👾🚀</h1>
          <p className="text-center">Complete 5 waves to win!</p>
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
            Start Game 🚀
          </button>
        </div>
      )}

      {uiState.gameState === "gameover" && (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold">Game Over 💀</h1>
          <p className="text-xl">Score: {uiState.score}</p>
          <p className="text-xl">Waves: {uiState.wave}</p>
          <button 
            onClick={startGame}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Play Again 🔄
          </button>
        </div>
      )}

      {uiState.gameState === "victory" && (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold">Victory! 🎉</h1>
          <p className="text-xl">💯 Final Score: {uiState.score}</p>
          <p className="text-xl">You completed all 5 waves!</p>
          <button 
            onClick={startGame}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Play Again 🔄
          </button>
        </div>
      )}

      {uiState.gameState === "playing" && (
        <div className="flex justify-between w-full px-20">
          <p>Scrore: {uiState.score}</p>
          <p>❤️: {uiState.lives}</p>
          <p>Wave: {uiState.wave}/5</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`border border-white rounded-md ${uiState.gameState !== "playing" ? "hidden" : ""}`}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
}