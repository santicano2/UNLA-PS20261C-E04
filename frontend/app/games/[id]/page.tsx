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
  getReviews,
  createReview,
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");

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
    getReviews(id).then(setReviews);
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

  async function handleSubmitReview() {
    if (!user) { showToast("Inicia sesión para reseñar", "error"); return; }
    const r = await createReview(id, reviewRating, reviewContent);
    if (r.id) {
      setReviews((prev) => [r, ...prev]);
      setReviewContent("");
      showToast("Reseña publicada");
    } else {
      showToast(r.error || "Error", "error");
    }
  }

  function Stars({ rating, interactive, onChange }: { rating: number; interactive?: boolean; onChange?: (n: number) => void }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            className={`text-lg ${interactive ? "cursor-pointer" : ""} ${n <= rating ? "text-yellow-500" : "text-zinc-700"}`}
          >
            ★
          </button>
        ))}
      </div>
    );
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

      <div className="mt-10 border-t border-[#1e293b] pt-8">
        <h3 className="text-lg text-zinc-300 font-medium mb-4">Reseñas</h3>

        {user && owned && (
          <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 mb-6">
            <Stars rating={reviewRating} interactive onChange={setReviewRating} />
            <textarea
              placeholder="Escribí tu reseña..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              rows={3}
              className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-lg px-3 py-2 text-white placeholder-zinc-500 text-sm mt-3 focus:outline-none focus:border-[#00d4ff] transition-colors resize-none"
            />
            <button
              onClick={handleSubmitReview}
              disabled={!reviewContent.trim()}
              className="mt-3 bg-[#00d4ff] hover:bg-[#00b8e6] disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-medium px-4 py-2 rounded transition-colors"
            >
              Publicar reseña
            </button>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 && (
            <p className="text-zinc-600 text-sm text-center py-8">No hay reseñas todavía</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#111827] border border-[#1e293b] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{r.username}</span>
                  <Stars rating={r.rating} />
                </div>
                <span className="text-zinc-600 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.content && <p className="text-zinc-400 text-sm mt-2">{r.content}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
