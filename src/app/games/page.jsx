"use client";

import { useState } from "react";
import { Game2048 } from "@/components/games/2048Clone";
import { BrickBreakerGame } from "@/components/games/BrickBreaker";
import DotLineGame from "@/components/games/DotLineGame";
import GameModal from "@/components/games/GameModel";
import { MemoryMatchGame } from "@/components/games/MemoryMatch";
import { SnakeGame } from "@/components/games/Snake";
import { SpaceInvadersGame } from "@/components/games/SpaceInvaders";

const games = [
  {
    title: "Dot & Line Game",
    description: "Protect your goal with a line",
    id: "dot-line",
    component: <DotLineGame />,
  },
  {
    title: "Brick Breaker",
    description: "Break all the bricks with your ball",
    id: "brick-breaker",
    component: <BrickBreakerGame />,
  },
  {
    title: "Memory Match",
    description: "Find all matching pairs",
    id: "memory-match",
    component: <MemoryMatchGame />,
  },
  {
    title: "Snake Game",
    description: "Classic snake game",
    id: "snake-game",
    component: <SnakeGame />,
  },
  {
    title: "Space Invaders",
    description: "Defend against alien invaders",
    id: "space-invaders",
    component: <SpaceInvadersGame />,
  },
  {
    title: "2048",
    description: "Combine tiles to reach 2048",
    id: "game-2048",
    component: <Game2048 />,
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="relative min-h-screen text-text-primary">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src="/images/gamesbg.png"
          alt="bg"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 p-6 pt-[74px]">
        <h1 className="text-3xl font-bold mb-6 text-shadow-accent">Games</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="p-6 rounded-2xl border bg-primary border-accent cursor-pointer shadow-neon hover:scale-105 transition transform duration-300"
              onClick={() => setSelectedGame(game.id)}
            >
              <h2 className="text-xl font-semibold text-text-primary">
                {game.title}
              </h2>
              <p className="text-text-light/80">{game.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      <GameModal
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
        title={games.find((g) => g.id === selectedGame)?.title || "Game"}
      >
        {games.find((g) => g.id === selectedGame)?.component || (
          <div>Game not found</div>
        )}
      </GameModal>
    </div>
  );
}
