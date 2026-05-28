"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCart, removeFromCart } from "../services/api";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    getCart().then(setItems).catch(() => setItems([]));
  }, []);

  async function handleRemove(gameId: number) {
    const result = await removeFromCart(gameId);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.gameId !== gameId));
      window.dispatchEvent(new Event("cart-updated"));
    }
  }

  const total = items.reduce((sum, i) => sum + Number(i.price), 0);

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-8">
      <h2 className="text-xl text-zinc-300 mb-6">Carrito</h2>

      {items.length === 0 && (
        <p className="text-zinc-500 text-center py-20">
          El carrito está vacío
        </p>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 flex items-center gap-4"
          >
            {item.imageUrl && (
              <div className="relative w-24 aspect-video shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="96px"
                  className="object-cover rounded"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{item.title}</h3>
              <p className="text-zinc-500 text-xs mt-0.5">{item.genre}</p>
              <p className="text-zinc-500 text-xs">{item.publisher}</p>
            </div>
            <span className="text-[#00d4ff] font-medium shrink-0">
              ${item.price}
            </span>
            <button
              onClick={() => handleRemove(item.gameId)}
              className="text-zinc-500 hover:text-red-400 text-sm transition-colors shrink-0"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-8 flex items-center justify-between border-t border-[#1e293b] pt-6">
          <span className="text-zinc-300 font-medium">
            Total: <span className="text-[#00d4ff]">${total.toFixed(2)}</span>
          </span>
          <button className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
            Comprar ahora
          </button>
        </div>
      )}
    </div>
  );
}
