"use client";

import { useEffect, useMemo, useState } from "react";

const shipSprites = [
  { id: "blue", position: "-28px -42px" },
  { id: "green", position: "-138px -42px" },
  { id: "red", position: "-248px -42px" },
  { id: "yellow", position: "-358px -42px" },
  { id: "pink", position: "-468px -42px" },
  { id: "station", position: "-28px -170px" },
  { id: "star", position: "-438px -468px" },
  { id: "asteroid", position: "-324px -468px" },
];

function ShipIcon({ sprite }) {
  return (
    <span
      className="pixelated h-12 w-12 bg-[url('/images/gba/ships.png')] bg-[length:1024px_576px]"
      style={{ backgroundPosition: sprite.position }}
      aria-hidden="true"
    />
  );
}

export function MemoryMatchGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);

  const solvedSet = useMemo(() => new Set(solved), [solved]);

  const initializeGame = () => {
    const doubledSymbols = [...shipSprites, ...shipSprites];
    const shuffled = doubledSymbols
      .map((sprite, index) => ({ id: index, sprite, flipped: false }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id) => {
    if (flipped.length === 2 || solvedSet.has(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );

    if (newFlipped.length !== 2) return;

    setMoves((prev) => prev + 1);
    const [firstId, secondId] = newFlipped;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (firstCard?.sprite.id === secondCard?.sprite.id) {
      setSolved((prev) => [...prev, firstId, secondId]);
      setFlipped([]);
      return;
    }

    window.setTimeout(() => {
      setCards((currentCards) =>
        currentCards.map((card) =>
          newFlipped.includes(card.id) ? { ...card, flipped: false } : card
        )
      );
      setFlipped([]);
    }, 700);
  };

  const isComplete = solved.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between gap-4 font-pixel text-xs uppercase">
        <p>Moves: {moves}</p>
        <button onClick={initializeGame} className="pixel-button px-3 py-2">
          Reset
        </button>
      </div>

      {isComplete && (
        <div className="pixel-screen w-full p-4 text-center font-bold">
          Cleared in {moves} moves.
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const visible = card.flipped || solvedSet.has(card.id);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              className={`flex h-16 w-16 items-center justify-center border-2 border-ink shadow-raised ${
                visible ? "bg-screen" : "bg-cartridge"
              } ${solvedSet.has(card.id) ? "opacity-60" : ""}`}
            >
              {visible ? (
                <ShipIcon sprite={card.sprite} />
              ) : (
                <span className="font-pixel text-xl font-black text-ink">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
