"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGames, addToCart, getOwnedGames } from "./services/api";
import { CartIcon } from "./components/Icons";
import { showToast } from "./components/Toast";

const GENRES = [
  "Acción", "Aventura", "RPG", "Estrategia",
  "Carreras", "Puzzle", "Simulación", "Deportes",
];

export default function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [owned, setOwned] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token)
      getOwnedGames()
        .then(setOwned)
        .catch(() => {});
  }, []);

  const fetchGames = useCallback(async (q: string, g: string) => {
    try {
      const data = await getGames(q || undefined, g || undefined);
      setGames(data);
    } catch {
      setGames([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchGames(search, genre), 300);
    return () => clearTimeout(timer);
  }, [search, genre, fetchGames]);

  async function handleAddToCart(gameId: number) {
    const userData = localStorage.getItem("user");
    if (!userData) {
      showToast("Iniciá sesión para agregar juegos al carrito", "error");
      return;
    }
    const result = await addToCart(gameId);
    if (result.success) {
      window.dispatchEvent(new Event("cart-updated"));
      showToast("Agregado al carrito");
    } else {
      showToast(result.error || "Error al agregar al carrito", "error");
    }
  }

  function isOwned(gameId: number) {
    return owned.includes(gameId);
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl text-zinc-300 shrink-0">Tienda</h2>
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
          >
            <option value="">Todos</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {games.length === 0 && (
        <p className="text-zinc-500 text-center py-20">
          No hay juegos disponibles
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
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
                <span className="text-zinc-500 text-xs">Desarrollador: {game.publisher}</span>
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
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(game.id);
                    }}
                    className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black text-xs font-medium px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    Agregar <CartIcon />
                  </button>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
