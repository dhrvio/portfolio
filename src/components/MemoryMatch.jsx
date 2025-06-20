"use client";
import { useState, useEffect } from "react";

const cardSymbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

export function MemoryMatchGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const doubledSymbols = [...cardSymbols, ...cardSymbols];
    const shuffled = doubledSymbols
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, flipped: false }));
    
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || solved.includes(id) || flipped.includes(id)) return;
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    const newCards = cards.map(card => 
      card.id === id ? {...card, flipped: true} : card
    );
    setCards(newCards);
    
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard.symbol === secondCard.symbol) {
        setSolved(prev => [...prev, firstId, secondId]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            newFlipped.includes(card.id) ? {...card, flipped: false} : card
          ));
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <p>Moves: {moves}</p>
        {solved.length === cards.length && cards.length > 0 && (
          <div className="mt-2 p-2 bg-green-800 rounded">
            <p>You won in {moves} moves!</p>
            <button 
              onClick={initializeGame}
              className="mt-2 px-4 py-1 bg-blue-600 rounded"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 flex items-center justify-center text-2xl rounded cursor-pointer 
              ${card.flipped || solved.includes(card.id) ? 'bg-white' : 'bg-blue-600'}
              ${solved.includes(card.id) ? 'opacity-50' : ''}`}
          >
            {card.flipped || solved.includes(card.id) ? card.symbol : '?'}
          </div>
        ))}
      </div>
    </div>
  );
}