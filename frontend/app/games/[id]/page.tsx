"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  getGame,
  addToCart,
  getOwnedGames,
  getWishlist,
  toggleWishlist,
  refundGame,
} from "../../services/api";
import {
  CartIcon,
  HeartFilledIcon,
  HeartOutlineIcon,
} from "../../components/Icons";
import { showToast } from "../../components/Toast";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<any>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [owned, setOwned] = useState(false);
  const [user, setUser] = useState<any>(null);

  const id = Number(params.id);

  useEffect(() => {
    getGame(id).then(setGame);
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
      getOwnedGames().then((ids) => setOwned(ids.includes(id)));
    }
    getWishlist().then((ids) => setWishlisted(ids.includes(id)));
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      showToast("Inicia sesión para agregar al carrito", "error");
      return;
    }
    const r = await addToCart(id);
    if (r.success) {
      window.dispatchEvent(new Event("cart-updated"));
      showToast("Agregado al carrito");
    } else {
      showToast(r.error || "Error", "error");
    }
  }

  async function handleWishlist() {
    if (!user) {
      showToast("Inicia sesión para usar la lista de deseados", "error");
      return;
    }
    const r = await toggleWishlist(id);
    if (r.added !== undefined) setWishlisted(r.added);
  }

  async function handleRefund() {
    const r = await refundGame(id);
    if (r.success) {
      setOwned(false);
      showToast("Reembolso solicitado con éxito");
    } else {
      showToast(r.error || "Error al solicitar reembolso", "error");
    }
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

      <h1 className="text-3xl text-white font-medium">{game.title}</h1>
      <div className="flex items-center gap-2 mt-1 text-zinc-500 text-sm">
        <span>{game.genre}</span>
        <span>&middot;</span>
        <span>Desarrollador: {game.publisher}</span>
      </div>
      <p className="text-zinc-400 mt-4 leading-relaxed">{game.description}</p>

      <div className="flex items-center gap-4 mt-6">
        <p className="text-2xl text-[#00d4ff] font-medium">${game.price}</p>
        <button
          onClick={handleWishlist}
          className={`transition-colors cursor-pointer ${
            wishlisted ? "text-red-500" : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          {wishlisted ? <HeartFilledIcon /> : <HeartOutlineIcon />}
        </button>
        {owned ? (
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-xs font-medium">
              En biblioteca
            </span>
            <button
              onClick={handleRefund}
              className="text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
            >
              Solicitar reembolso
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <CartIcon /> <span>Carrito</span>
          </button>
        )}
      </div>
    </div>
  );
}
