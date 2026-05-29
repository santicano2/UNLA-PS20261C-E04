"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWishlistGames, toggleWishlist } from "../services/api";
import { HeartFilledIcon } from "../components/Icons";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const [games, setGames] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(u));
    getWishlistGames()
      .then(setGames)
      .catch(() => setGames([]));
  }, []);

  async function handleRemove(gameId: number) {
    await toggleWishlist(gameId);
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-xl text-zinc-300 mb-6">Lista de Deseados</h2>

      {games.length === 0 && (
        <p className="text-zinc-500 text-center py-20">
          No tenés juegos en tu lista de deseados
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <div
            key={game.id}
            className="bg-[#111827] border border-[#1e293b] rounded-lg overflow-hidden group"
          >
            <Link href={`/games/${game.id}`}>
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
                  {game.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{game.discount}%
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-white font-medium">{game.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-zinc-500 text-xs">{game.genre}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500 text-xs">
                    {game.publisher}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {game.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-xs line-through">${game.price}</span>
                      <span className="text-[#00d4ff] font-medium">${game.discountedPrice}</span>
                    </div>
                  ) : (
                    <span className="text-[#00d4ff] font-medium">${game.price}</span>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <button
                onClick={() => handleRemove(game.id)}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
              >
                <HeartFilledIcon />
                <span>Quitar de deseados</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
