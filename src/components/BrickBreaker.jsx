"use client";
import { useEffect, useRef, useState } from "react";

export function BrickBreakerGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("playing");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Game setup
    const paddle = {
      width: 80,
      height: 10,
      x: canvas.width / 2 - 40,
    };
    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 8,
      dx: 4,
      dy: -4,
    };
    const brick = {
      rowCount: 3,
      colCount: 5,
      width: 75,
      height: 20,
      padding: 10,
      offsetTop: 60,
      offsetLeft: 30,
    };

    let bricks = [];
    for (let c = 0; c < brick.colCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brick.rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    // Mouse movement
    const mouseMoveHandler = (e) => {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
      }
    };

    // Draw functions
    function drawBall() {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brick.colCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
            const brickY = r * (brick.height + brick.padding) + brick.offsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brick.width, brick.height);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    // Collision detection
    function collisionDetection() {
      for (let c = 0; c < brick.colCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ball.x > b.x &&
              ball.x < b.x + brick.width &&
              ball.y > b.y &&
              ball.y < b.y + brick.height
            ) {
              ball.dy = -ball.dy;
              b.status = 0;
              setScore(prev => prev + 10);
            }
          }
        }
      }
    }

    // Game loop
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // Ball movement
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision
      if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          ball.dy = -ball.dy;
        } else {
          setGameState("gameover");
          return;
        }
      }

      if (gameState === "playing") {
        requestAnimationFrame(draw);
      }
    }

    canvas.addEventListener("mousemove", mouseMoveHandler);
    draw();

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={480} height={320} className="border border-white rounded-md" />
      {gameState === "gameover" && (
        <div className="mt-4 p-4 bg-red-900 rounded-lg">
          <p className="text-white">Game Over! Score: {score}</p>
        </div>
      )}
    </div>
  );
}