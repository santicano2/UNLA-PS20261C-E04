"use client";

import { useEffect, useState } from "react";

const placeholderGames = [
  { id: 1, title: "Cyber Odyssey", genre: "RPG", price: "$19.99" },
  { id: 2, title: "Neon Racer X", genre: "Carreras", price: "$14.99" },
  { id: 3, title: "Shadow Protocol", genre: "Acción", price: "$29.99" },
  { id: 4, title: "Pixel Kingdoms", genre: "Estrategia", price: "$9.99" },
  { id: 5, title: "Void Walker", genre: "Aventura", price: "$24.99" },
  { id: 6, title: "Quantum Shift", genre: "Puzzle", price: "$12.99" },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  function handleBuy(game: any) {
    if (!user) {
      alert("Iniciá sesión para comprar juegos");
      return;
    }
    alert(`Compraste ${game.title}`);
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8">
      <h2 className="text-xl text-zinc-300 mb-6">Tienda</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {placeholderGames.map((game) => (
          <div
            key={game.id}
            className="bg-[#111827] border border-[#1e293b] rounded-lg p-5 hover:border-[#00d4ff]/30 transition-colors"
          >
            <div className="aspect-video bg-[#1e293b] rounded mb-4 flex items-center justify-center text-zinc-600 text-sm">
              {game.title}
            </div>
            <h3 className="text-white font-medium">{game.title}</h3>
            <p className="text-zinc-500 text-sm mt-1">{game.genre}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[#00d4ff] font-medium">{game.price}</span>
              <button
                onClick={() => handleBuy(game)}
                className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black text-xs font-medium px-4 py-2 rounded transition-colors"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
