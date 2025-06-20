"use client";
import { Game2048 } from "@/components/2048Clone";
import { BrickBreakerGame } from "@/components/BrickBreaker";
import DotLineGame from "@/components/DotLineGame";
import GameModal from "@/components/GameModel";
import { MemoryMatchGame } from "@/components/MemoryMatch";
import { SnakeGame } from "@/components/Sanke";
import { SpaceInvadersGame } from "@/components/SpaceInvaders";
import { useState } from "react";

const games = [
  {
    title: "Dot & Line Game",
    description: "Protect your goal with a line",
    id: "dot-line",
    component: <DotLineGame />
  },
  {
    title: "Brick Breaker",
    description: "Break all the bricks with your ball",
    id: "brick-breaker",
    component: <BrickBreakerGame />
  },
  {
    title: "Memory Match",
    description: "Find all matching pairs",
    id: "memory-match",
    component: <MemoryMatchGame />
  },
  {
    title: "Snake Game",
    description: "Classic snake game",
    id: "snake-game",
    component: <SnakeGame />
  },
  {
    title: "Space Invaders",
    description: "Defend against alien invaders",
    id: "space-invaders",
    component: <SpaceInvadersGame />
  },
  {
    title: "2048",
    description: "Combine tiles to reach 2048",
    id: "game-2048",
    component: <Game2048 />
  }
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-900 p-6 rounded-2xl cursor-pointer shadow-lg hover:scale-105 transition"
            onClick={() => setSelectedGame(game.id)}
          >
            <h2 className="text-xl font-semibold">{game.title}</h2>
            <p className="text-gray-400">{game.description}</p>
          </div>
        ))}
      </div>

      <GameModal
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
        title={games.find(g => g.id === selectedGame)?.title || "Game"}
      >
        {games.find(g => g.id === selectedGame)?.component || <div>Game not found</div>}
      </GameModal>
    </div>
  );
}