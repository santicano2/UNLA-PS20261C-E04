"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getGames, addToCart, getOwnedGames } from "./services/api";

export default function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [owned, setOwned] = useState<number[]>([]);

  useEffect(() => {
    getGames().then(setGames).catch(() => setGames([]));
    const token = localStorage.getItem("token");
    if (token) getOwnedGames().then(setOwned).catch(() => {});
  }, []);

  async function handleAddToCart(gameId: number) {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Iniciá sesión para agregar juegos al carrito");
      return;
    }
    const result = await addToCart(gameId);
    if (result.success) {
      window.dispatchEvent(new Event("cart-updated"));
      alert("Agregado al carrito");
    } else {
      alert(result.error || "Error al agregar al carrito");
    }
  }

  function isOwned(gameId: number) {
    return owned.includes(gameId);
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8">
      <h2 className="text-xl text-zinc-300 mb-6">Tienda</h2>

      {games.length === 0 && (
        <p className="text-zinc-500 text-center py-20">
          No hay juegos disponibles
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <div
            key={game.id}
            className="bg-[#111827] border border-[#1e293b] rounded-lg overflow-hidden hover:border-[#00d4ff]/30 transition-colors cursor-pointer"
          >
            {game.imageUrl && (
              <div className="relative aspect-video w-full">
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-white font-medium">{game.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-zinc-500 text-xs">{game.genre}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-500 text-xs">{game.publisher}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[#00d4ff] font-medium">
                  ${game.price}
                </span>
                {isOwned(game.id) ? (
                  <span className="text-zinc-500 text-xs font-medium px-4 py-2">
                    En biblioteca
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddToCart(game.id)}
                    className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black text-xs font-medium px-4 py-2 rounded transition-colors"
                  >
                    Agregar al carrito
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
