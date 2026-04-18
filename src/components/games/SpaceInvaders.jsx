"use client";

import { useEffect, useRef, useState } from "react";

const palette = {
  ink: "#171923",
  screen: "#a7c957",
  screenDark: "#2f4f2f",
  accent: "#ff6b6b",
  highlight: "#ffd166",
  primary: "#4f4a7f",
};

const difficultySpeed = {
  easy: 0.55,
  medium: 0.8,
  hard: 1.05,
};

function makeEnemies(wave) {
  const rows = Math.min(3 + wave, 5);
  const cols = 6;
  const enemies = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      enemies.push({
        x: 30 + col * 40,
        y: 52 + row * 30,
        alive: true,
      });
    }
  }
  return enemies;
}

export function SpaceInvadersGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const shipSheetRef = useRef(null);
  const gameRef = useRef(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [uiState, setUiState] = useState({
    gameState: "menu",
    score: 0,
    lives: 3,
    wave: 1,
  });

  useEffect(() => {
    const image = new Image();
    image.src = "/images/gba/ships.png";
    shipSheetRef.current = image;
  }, []);

  const stopAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  };

  const syncUi = (gameState, game) => {
    setUiState({
      gameState,
      score: game.score,
      lives: game.lives,
      wave: game.wave,
    });
  };

  const drawSprite = (ctx, sx, sy, dx, dy, scale = 1.8) => {
    const image = shipSheetRef.current;
    if (image?.complete) {
      ctx.drawImage(image, sx, sy, 18, 18, dx, dy, 18 * scale, 18 * scale);
      return;
    }
    ctx.fillStyle = palette.ink;
    ctx.fillRect(dx, dy, 28, 18);
  };

  const draw = (ctx, game) => {
    ctx.fillStyle = palette.screen;
    ctx.fillRect(0, 0, 300, 400);

    ctx.fillStyle = "rgba(23, 25, 35, 0.25)";
    for (let y = 0; y < 400; y += 18) ctx.fillRect(0, y, 300, 1);
    for (let x = 0; x < 300; x += 24) ctx.fillRect(x, 0, 1, 400);

    ctx.fillStyle = palette.ink;
    ctx.font = "14px monospace";
    ctx.fillText(`S ${game.score}`, 10, 22);
    ctx.fillText(`L ${game.lives}`, 128, 22);
    ctx.fillText(`W ${game.wave}/5`, 224, 22);

    drawSprite(ctx, 28, 42, game.playerX - 16, 354, 1.9);

    ctx.fillStyle = palette.accent;
    game.bullets.forEach((bullet) => ctx.fillRect(bullet.x - 2, bullet.y, 4, 12));
    ctx.fillStyle = palette.primary;
    game.enemyBullets.forEach((bullet) => ctx.fillRect(bullet.x - 2, bullet.y, 4, 10));

    game.enemies.forEach((enemy, index) => {
      if (!enemy.alive) return;
      const sx = [138, 248, 358, 468][index % 4];
      drawSprite(ctx, sx, 42, enemy.x - 12, enemy.y - 8, 1.45);
    });
  };

  const nextWave = (game) => {
    if (game.wave >= 5) {
      game.status = "victory";
      game.score += 250;
      syncUi("victory", game);
      return false;
    }
    game.wave += 1;
    game.direction = 1;
    game.enemyStepDown = 0;
    game.enemies = makeEnemies(game.wave);
    game.bullets = [];
    game.enemyBullets = [];
    syncUi("playing", game);
    return true;
  };

  const step = () => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game || game.status !== "playing") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const speed = difficultySpeed[difficulty] + game.wave * 0.12;
    let changeDirection = false;

    game.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      enemy.x += speed * game.direction;
      if (enemy.x < 20 || enemy.x > 280) changeDirection = true;
    });

    if (changeDirection) {
      game.direction *= -1;
      game.enemies.forEach((enemy) => {
        enemy.y += 12;
        if (enemy.alive && enemy.y > 320) {
          game.status = "gameover";
          syncUi("gameover", game);
        }
      });
    }

    game.bullets = game.bullets
      .map((bullet) => ({ ...bullet, y: bullet.y - 4.8 }))
      .filter((bullet) => bullet.y > 28);

    game.enemyBullets = game.enemyBullets
      .map((bullet) => ({ ...bullet, y: bullet.y + 2.4 }))
      .filter((bullet) => bullet.y < 400);

    game.bullets.forEach((bullet) => {
      game.enemies.forEach((enemy) => {
        if (!enemy.alive) return;
        const hit =
          bullet.x > enemy.x - 16 &&
          bullet.x < enemy.x + 16 &&
          bullet.y > enemy.y - 10 &&
          bullet.y < enemy.y + 18;
        if (!hit) return;
        enemy.alive = false;
        bullet.y = -99;
        game.score += 10;
        syncUi("playing", game);
      });
    });

    if (Math.random() < 0.018 + game.wave * 0.002) {
      const activeEnemies = game.enemies.filter((enemy) => enemy.alive);
      const shooter = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
      if (shooter) game.enemyBullets.push({ x: shooter.x, y: shooter.y + 18 });
    }

    game.enemyBullets.forEach((bullet) => {
      const hit =
        bullet.x > game.playerX - 18 &&
        bullet.x < game.playerX + 18 &&
        bullet.y > 350 &&
        bullet.y < 388;
      if (!hit) return;
      bullet.y = 999;
      game.lives -= 1;
      if (game.lives <= 0) {
        game.status = "gameover";
        syncUi("gameover", game);
      } else {
        syncUi("playing", game);
      }
    });

    if (game.status !== "playing") {
      stopAnimation();
      draw(ctx, game);
      return;
    }

    if (game.enemies.every((enemy) => !enemy.alive) && !nextWave(game)) {
      stopAnimation();
      draw(ctx, game);
      return;
    }

    draw(ctx, game);
    animationRef.current = requestAnimationFrame(step);
  };

  const startGame = () => {
    const game = {
      status: "playing",
      playerX: 150,
      bullets: [],
      enemyBullets: [],
      enemies: makeEnemies(1),
      direction: 1,
      lastShot: 0,
      score: 0,
      lives: 3,
      wave: 1,
    };
    gameRef.current = game;
    syncUi("playing", game);
    stopAnimation();
    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const game = gameRef.current;
      if (!game || game.status !== "playing") return;
      if (event.key === "ArrowLeft") game.playerX = Math.max(18, game.playerX - 12);
      if (event.key === "ArrowRight") game.playerX = Math.min(282, game.playerX + 12);
      if (event.key === " ") {
        event.preventDefault();
        const now = performance.now();
        if (now - game.lastShot > 320) {
          game.bullets.push({ x: game.playerX, y: 344 });
          game.lastShot = now;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      stopAnimation();
    };
  }, []);

  const movePlayer = (clientX) => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game || game.status !== "playing") return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    game.playerX = Math.max(18, Math.min(282, (clientX - rect.left) * scaleX));
  };

  const fire = () => {
    const game = gameRef.current;
    if (!game || game.status !== "playing") return;
    const now = performance.now();
    if (now - game.lastShot <= 320) return;
    game.bullets.push({ x: game.playerX, y: 344 });
    game.lastShot = now;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {uiState.gameState === "menu" && (
        <div className="pixel-screen flex w-full flex-col gap-4 p-5">
          <p className="font-bold">Clear five waves to win.</p>
          {Object.keys(difficultySpeed).map((level) => (
            <label key={level} className="flex items-center gap-3 font-bold capitalize">
              <input
                type="radio"
                name="space-difficulty"
                checked={difficulty === level}
                onChange={() => setDifficulty(level)}
              />
              {level}
            </label>
          ))}
          <button onClick={startGame} className="pixel-button px-4 py-2">
            Start Game
          </button>
        </div>
      )}

      {(uiState.gameState === "gameover" || uiState.gameState === "victory") && (
        <div className="pixel-screen flex w-full flex-col items-center gap-4 p-5 text-center">
          <h3 className="font-pixel text-2xl font-black uppercase">
            {uiState.gameState === "victory" ? "Victory" : "Game Over"}
          </h3>
          <p className="font-bold">Score {uiState.score}</p>
          <p className="font-bold">Wave {uiState.wave}/5</p>
          <button onClick={startGame} className="pixel-button px-4 py-2">
            Play Again
          </button>
        </div>
      )}

      {uiState.gameState === "playing" && (
        <>
          <div className="flex w-full max-w-[300px] justify-between font-pixel text-xs uppercase">
            <p>Score {uiState.score}</p>
            <p>Lives {uiState.lives}</p>
            <p>Wave {uiState.wave}/5</p>
          </div>
          <canvas
            ref={canvasRef}
            width={300}
            height={400}
            className="gba-canvas"
            onMouseMove={(event) => movePlayer(event.clientX)}
            onClick={fire}
            onTouchMove={(event) => {
              event.preventDefault();
              movePlayer(event.touches[0].clientX);
            }}
            onTouchEnd={fire}
          />
          <button onClick={fire} className="pixel-button px-6 py-3 md:hidden">
            Fire
          </button>
        </>
      )}
    </div>
  );
}
