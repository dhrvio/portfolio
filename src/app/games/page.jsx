"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Game2048 } from "@/components/games/2048Clone";
import { BrickBreakerGame } from "@/components/games/BrickBreaker";
import DotLineGame from "@/components/games/DotLineGame";
import GameModal from "@/components/games/GameModel";
import { MemoryMatchGame } from "@/components/games/MemoryMatch";
import { SnakeGame } from "@/components/games/Snake";
import { SpaceInvadersGame } from "@/components/games/SpaceInvaders";

const games = [
  {
    title: "Dot & Line",
    description: "Guard the bottom rail with clean paddle timing.",
    id: "dot-line",
    component: <DotLineGame />,
    sprite: "bg-[position:-28px_-42px]",
  },
  {
    title: "Brick Breaker",
    description: "Clear the cartridge blocks before your lives run out.",
    id: "brick-breaker",
    component: <BrickBreakerGame />,
    sprite: "bg-[position:-138px_-42px]",
  },
  {
    title: "Memory Match",
    description: "Flip pixel ships and lock every matching pair.",
    id: "memory-match",
    component: <MemoryMatchGame />,
    sprite: "bg-[position:-248px_-42px]",
  },
  {
    title: "Snake",
    description: "Classic grid chase with pocket-console pacing.",
    id: "snake-game",
    component: <SnakeGame />,
    sprite: "bg-[position:-358px_-42px]",
  },
  {
    title: "Space Invaders",
    description: "Defend the screen from a tiny alien fleet.",
    id: "space-invaders",
    component: <SpaceInvadersGame />,
    sprite: "bg-[position:-468px_-42px]",
  },
  {
    title: "2048",
    description: "Merge tiles until the numbers hit max power.",
    id: "game-2048",
    component: <Game2048 />,
    sprite: "bg-[position:-28px_-170px]",
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const activeGame = useMemo(
    () => games.find((game) => game.id === selectedGame),
    [selectedGame]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 pb-16 pt-28 text-text-primary">
      <Image
        src="/images/gba/desert-forest.png"
        alt=""
        fill
        priority
        className="pixelated object-cover opacity-45"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-background/65" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="font-pixel text-xs uppercase text-highlight">
            Mini Arcade
          </p>
          <h1 className="mt-3 font-pixel text-3xl font-black uppercase md:text-5xl">
            Games
          </h1>
          <p className="mt-5 text-lg leading-8 text-text-light">
            Small browser games with a pocket-console coat of paint.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              className="pixel-card group min-h-56 cursor-pointer overflow-hidden text-left transition hover:-translate-y-1 focus-visible:-translate-y-1"
              onClick={() => setSelectedGame(game.id)}
            >
              <div className="pixel-grid flex h-28 items-center justify-center border-b-2 border-ink bg-screen">
                <span
                  className={`pixelated h-16 w-16 scale-[2] bg-[url('/images/gba/ships.png')] bg-[length:1024px_576px] ${game.sprite}`}
                  aria-hidden="true"
                />
              </div>
              <div className="p-5">
                <h2 className="font-pixel text-xl font-black uppercase">
                  {game.title}
                </h2>
                <p className="mt-3 leading-7">{game.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <GameModal
        isOpen={!!activeGame}
        onClose={() => setSelectedGame(null)}
        title={activeGame?.title || "Game"}
      >
        {activeGame?.component || <div>Game not found</div>}
      </GameModal>
    </main>
  );
}
