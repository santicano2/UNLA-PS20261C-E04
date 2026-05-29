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
  setDiscount,
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
  const [discount, setDiscountVal] = useState(0);

  const id = Number(params.id);

  useEffect(() => {
    getGame(id).then((g) => {
      setGame(g);
      setDiscountVal(g.discount || 0);
    });
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
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

  async function handleSetDiscount() {
    const r = await setDiscount(id, discount);
    if (r.id) {
      setGame(r);
      showToast("Descuento actualizado");
    } else {
      showToast(r.error || "Error", "error");
    }
  }

  const isDeveloper = user && user.role === "developer" && game && user.username === game.publisher;

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
          {game.discount > 0 && (
            <span className="absolute top-3 left-3 bg-green-600 text-white text-sm font-bold px-2.5 py-1 rounded">
              -{game.discount}%
            </span>
          )}
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
        <div className="flex items-center gap-2">
          {game.discount > 0 ? (
            <>
              <span className="text-zinc-500 text-lg line-through">${game.price}</span>
              <span className="text-2xl text-[#00d4ff] font-medium">${game.discountedPrice}</span>
            </>
          ) : (
            <span className="text-2xl text-[#00d4ff] font-medium">${game.price}</span>
          )}
        </div>
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

      {isDeveloper && (
        <div className="mt-8 p-4 bg-[#111827] border border-[#1e293b] rounded-lg flex items-center gap-3">
          <label className="text-zinc-400 text-sm">Descuento:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscountVal(Number(e.target.value))}
            className="w-20 bg-[#0a0e1a] border border-[#1e293b] rounded px-3 py-1.5 text-white text-sm text-center focus:outline-none focus:border-[#00d4ff]"
          />
          <span className="text-zinc-500 text-sm">%</span>
          <button
            onClick={handleSetDiscount}
            className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black text-xs font-medium px-4 py-1.5 rounded transition-colors cursor-pointer"
          >
            Aplicar
          </button>
          {game.discount > 0 && (
            <button
              onClick={async () => {
                const r = await setDiscount(id, 0);
                if (r.id) {
                  setGame(r);
                  setDiscountVal(0);
                  showToast("Descuento eliminado");
                } else {
                  showToast(r.error || "Error", "error");
                }
              }}
              className="text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
            >
              Quitar descuento
            </button>
          )}
        </div>
      )}
    </div>
  );
}
