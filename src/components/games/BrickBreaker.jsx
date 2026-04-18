"use client";

import { useEffect, useRef, useState } from "react";

const palette = {
  ink: "#171923",
  screen: "#a7c957",
  screenDark: "#2f4f2f",
  accent: "#ff6b6b",
  highlight: "#ffd166",
  primary: "#4f4a7f",
  text: "#f8f4df",
};

const difficultyConfig = {
  easy: { paddleWidth: 120, speed: 2.2 },
  medium: { paddleWidth: 86, speed: 2.7 },
  hard: { paddleWidth: 62, speed: 3.2 },
};

function buildBricks() {
  const bricks = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      bricks.push({
        x: 48 + col * 70,
        y: 48 + row * 26,
        width: 58,
        height: 18,
        alive: true,
      });
    }
  }
  return bricks;
}

export function BrickBreakerGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gameRef = useRef(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [uiState, setUiState] = useState({
    gameState: "menu",
    score: 0,
    lives: 3,
  });

  const draw = (ctx, game) => {
    ctx.fillStyle = palette.screen;
    ctx.fillRect(0, 0, 300, 400);

    ctx.fillStyle = "rgba(23, 25, 35, 0.16)";
    for (let y = 0; y < 400; y += 16) ctx.fillRect(0, y, 300, 1);
    for (let x = 0; x < 300; x += 16) ctx.fillRect(x, 0, 1, 400);

    ctx.fillStyle = palette.ink;
    ctx.font = "14px monospace";
    ctx.fillText(`Score ${game.score}`, 10, 22);
    ctx.fillText(`Lives ${game.lives}`, 220, 22);

    game.bricks.forEach((brick, index) => {
      if (!brick.alive) return;
      ctx.fillStyle = [palette.primary, palette.highlight, palette.accent][index % 3];
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    });

    ctx.fillStyle = palette.ink;
    ctx.fillRect(game.paddleX - game.paddleWidth / 2, 374, game.paddleWidth, 10);
    ctx.fillStyle = palette.highlight;
    ctx.fillRect(game.paddleX - game.paddleWidth / 2 + 4, 376, game.paddleWidth - 8, 3);

    ctx.fillStyle = palette.accent;
    ctx.fillRect(game.ballX - 7, game.ballY - 7, 14, 14);
    ctx.fillStyle = palette.highlight;
    ctx.fillRect(game.ballX - 3, game.ballY - 3, 4, 4);
  };

  const stopAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  };

  const syncUi = (gameState, game) => {
    setUiState({
      gameState,
      score: game.score,
      lives: game.lives,
    });
  };

  const step = () => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game || game.status !== "playing") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    game.ballX += game.dx;
    game.ballY += game.dy;

    if (game.ballX <= 8 || game.ballX >= 292) game.dx *= -1;
    if (game.ballY <= 36) game.dy = Math.abs(game.dy);

    if (
      game.ballY >= 364 &&
      game.ballY <= 382 &&
      game.ballX >= game.paddleX - game.paddleWidth / 2 &&
      game.ballX <= game.paddleX + game.paddleWidth / 2
    ) {
      const hit = (game.ballX - (game.paddleX - game.paddleWidth / 2)) / game.paddleWidth;
      game.dx = (hit - 0.5) * 4.2;
      game.dy = -Math.abs(game.dy);
    }

    game.bricks.forEach((brick) => {
      if (!brick.alive) return;
      const hit =
        game.ballX > brick.x &&
        game.ballX < brick.x + brick.width &&
        game.ballY > brick.y &&
        game.ballY < brick.y + brick.height;
      if (!hit) return;
      brick.alive = false;
      game.score += 10;
      game.dy *= -1;
      syncUi("playing", game);
    });

    if (game.ballY > 410) {
      game.lives -= 1;
      if (game.lives <= 0) {
        game.status = "gameover";
        syncUi("gameover", game);
        stopAnimation();
        draw(ctx, game);
        return;
      }
      game.ballX = 150;
      game.ballY = 300;
      game.dx = 1.1;
      game.dy = -difficultyConfig[difficulty].speed;
      syncUi("playing", game);
    }

    if (game.bricks.every((brick) => !brick.alive)) {
      game.status = "win";
      syncUi("win", game);
      stopAnimation();
      draw(ctx, game);
      return;
    }

    draw(ctx, game);
    animationRef.current = requestAnimationFrame(step);
  };

  const startGame = () => {
    const config = difficultyConfig[difficulty];
    const game = {
      status: "playing",
      paddleX: 150,
      paddleWidth: config.paddleWidth,
      ballX: 150,
      ballY: 300,
      dx: 1.1,
      dy: -config.speed,
      bricks: buildBricks(),
      score: 0,
      lives: 3,
    };
    gameRef.current = game;
    syncUi("playing", game);
    stopAnimation();
    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => stopAnimation(), []);

  const movePaddle = (clientX) => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game || game.status !== "playing") return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    game.paddleX = Math.max(
      game.paddleWidth / 2,
      Math.min(300 - game.paddleWidth / 2, (clientX - rect.left) * scaleX)
    );
  };

  const formatScore = (score) => score.toString().padStart(3, "0");

  return (
    <div className="flex flex-col items-center gap-4">
      {uiState.gameState === "menu" && (
        <div className="pixel-screen flex w-full flex-col gap-4 p-5">
          <h3 className="font-pixel text-lg font-black uppercase">Difficulty</h3>
          {Object.keys(difficultyConfig).map((level) => (
            <label key={level} className="flex items-center gap-3 font-bold capitalize">
              <input
                type="radio"
                name="brick-difficulty"
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

      {(uiState.gameState === "gameover" || uiState.gameState === "win") && (
        <div className="pixel-screen flex w-full flex-col items-center gap-4 p-5 text-center">
          <h3 className="font-pixel text-2xl font-black uppercase">
            {uiState.gameState === "win" ? "Cleared" : "Game Over"}
          </h3>
          <p className="font-bold">Score {formatScore(uiState.score)}</p>
          <button onClick={startGame} className="pixel-button px-4 py-2">
            Play Again
          </button>
        </div>
      )}

      {uiState.gameState === "playing" && (
        <div className="flex w-full max-w-[300px] justify-between font-pixel text-xs uppercase">
          <p>Score {formatScore(uiState.score)}</p>
          <p>Lives {uiState.lives}</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={300}
        height={400}
        className={`gba-canvas ${uiState.gameState === "menu" ? "hidden" : ""}`}
        onMouseMove={(event) => movePaddle(event.clientX)}
        onTouchMove={(event) => {
          event.preventDefault();
          movePaddle(event.touches[0].clientX);
        }}
      />
    </div>
  );
}
