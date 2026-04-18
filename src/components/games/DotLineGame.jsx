"use client";

import { useEffect, useRef, useState } from "react";

const palette = {
  ink: "#171923",
  screen: "#a7c957",
  screenDark: "#2f4f2f",
  accent: "#ff6b6b",
  highlight: "#ffd166",
};

const difficultyConfig = {
  easy: { paddleWidth: 126, speed: 2 },
  medium: { paddleWidth: 88, speed: 2.55 },
  hard: { paddleWidth: 60, speed: 3.1 },
};

export default function DotLineGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gameRef = useRef(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [uiState, setUiState] = useState({
    gameState: "menu",
    score: 0,
    lives: 3,
  });

  const stopAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  };

  const syncUi = (gameState, game) => {
    setUiState({ gameState, score: game.score, lives: game.lives });
  };

  const draw = (ctx, game) => {
    ctx.fillStyle = palette.screen;
    ctx.fillRect(0, 0, 300, 400);

    ctx.fillStyle = "rgba(23, 25, 35, 0.16)";
    for (let y = 0; y < 400; y += 16) ctx.fillRect(0, y, 300, 1);

    ctx.fillStyle = palette.ink;
    ctx.font = "14px monospace";
    ctx.fillText(`Score ${game.score}`, 10, 22);
    ctx.fillText(`Lives ${game.lives}`, 220, 22);

    ctx.fillStyle = palette.accent;
    ctx.fillRect(game.ballX - 8, game.ballY - 8, 16, 16);
    ctx.fillStyle = palette.highlight;
    ctx.fillRect(game.ballX - 3, game.ballY - 3, 5, 5);

    ctx.fillStyle = palette.ink;
    ctx.fillRect(game.paddleX - game.paddleWidth / 2, 372, game.paddleWidth, 8);
  };

  const step = () => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game || game.status !== "playing") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    game.ballX += game.dx;
    game.ballY += game.dy;

    if (game.ballX <= 10 || game.ballX >= 290) game.dx *= -1;
    if (game.ballY <= 34) game.dy = Math.abs(game.dy);

    if (
      game.ballY >= 360 &&
      game.ballY <= 382 &&
      game.ballX >= game.paddleX - game.paddleWidth / 2 &&
      game.ballX <= game.paddleX + game.paddleWidth / 2
    ) {
      const hit = (game.ballX - (game.paddleX - game.paddleWidth / 2)) / game.paddleWidth;
      game.dx = (hit - 0.5) * 4;
      game.dy = -Math.abs(game.dy) - 0.08;
      game.score += 10;
      syncUi("playing", game);
    }

    if (game.ballY > 410) {
      game.lives -= 1;
      if (game.lives <= 0) {
        game.status = "gameover";
        syncUi("gameover", game);
        stopAnimation();
        draw(ctx, game);
        return;
      }
      game.ballX = Math.random() * 220 + 40;
      game.ballY = 100;
      game.dx = Math.random() > 0.5 ? 2 : -2;
      game.dy = difficultyConfig[difficulty].speed;
      syncUi("playing", game);
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
      ballY: 100,
      dx: 2,
      dy: config.speed,
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

  return (
    <div className="flex flex-col items-center gap-4">
      {uiState.gameState === "menu" && (
        <div className="pixel-screen flex w-full flex-col gap-4 p-5">
          <h3 className="font-pixel text-lg font-black uppercase">Difficulty</h3>
          {Object.keys(difficultyConfig).map((level) => (
            <label key={level} className="flex items-center gap-3 font-bold capitalize">
              <input
                type="radio"
                name="dot-line-difficulty"
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

      {uiState.gameState === "gameover" && (
        <div className="pixel-screen flex w-full flex-col items-center gap-4 p-5 text-center">
          <h3 className="font-pixel text-2xl font-black uppercase">Game Over</h3>
          <p className="font-bold">Score {uiState.score}</p>
          <button onClick={startGame} className="pixel-button px-4 py-2">
            Play Again
          </button>
        </div>
      )}

      {uiState.gameState === "playing" && (
        <div className="flex w-full max-w-[300px] justify-between font-pixel text-xs uppercase">
          <p>Score {uiState.score}</p>
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
