"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  getGame,
  addToCart,
  getWishlist,
  toggleWishlist,
} from "../../services/api";
import {
  CartIcon,
  HeartFilledIcon,
  HeartOutlineIcon,
} from "../../components/Icons";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<any>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const id = Number(params.id);

  useEffect(() => {
    getGame(id).then(setGame);
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    getWishlist().then((ids) => setWishlisted(ids.includes(id)));
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      alert("Inicia sesion para agregar al carrito");
      return;
    }
    const r = await addToCart(id);
    if (r.success) {
      window.dispatchEvent(new Event("cart-updated"));
      alert("Agregado al carrito");
    } else {
      alert(r.error || "Error");
    }
  }

  async function handleWishlist() {
    if (!user) {
      alert("Inicia sesion para usar la lista de deseados");
      return;
    }
    const r = await toggleWishlist(id);
    if (r.added !== undefined) setWishlisted(r.added);
  }

  if (!game) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={() => router.back()}
        className="text-zinc-500 hover:text-white text-sm mb-4 transition-colors cursor-pointer"
      >
        &larr; Volver
      </button>

      {game.imageUrl && (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6">
          <Image
            src={game.imageUrl}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-white font-medium">{game.title}</h1>
          <div className="flex items-center gap-2 mt-1 text-zinc-500 text-sm">
            <span>{game.genre}</span>
            <span>&middot;</span>
            <span>Desarrollador: {game.publisher}</span>
          </div>
          <p className="text-zinc-400 mt-4 leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-2xl text-[#00d4ff] font-medium">${game.price}</p>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <button
              onClick={handleWishlist}
              className={`transition-colors cursor-pointer ${
                wishlisted
                  ? "text-red-500"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {wishlisted ? <HeartFilledIcon /> : <HeartOutlineIcon />}
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <CartIcon /> <span>Carrito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
