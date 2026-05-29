"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPurchaseHistory } from "../services/api";

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    getPurchaseHistory().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-xl text-zinc-300 mb-6">Historial de Compras</h2>

      {items.length === 0 && (
        <p className="text-zinc-500 text-center py-20">
          No realizaste compras todavía
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.gameId}
            href={`/games/${item.gameId}`}
            className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 flex items-center gap-4 hover:border-[#00d4ff]/30 transition-colors"
          >
            {item.imageUrl && (
              <div className="relative w-24 aspect-video shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="96px"
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{item.title}</h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                <span>{item.genre}</span>
                <span>·</span>
                <span>{item.publisher}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div>
                {item.discount > 0 ? (
                  <>
                    <span className="text-zinc-500 text-xs line-through">${item.price}</span>
                    <span className="text-[#00d4ff] font-medium ml-1">${item.discountedPrice}</span>
                  </>
                ) : (
                  <span className="text-[#00d4ff] font-medium">${item.price}</span>
                )}
                {item.refunded && (
                  <span className="text-red-500 text-xs ml-2">Reembolsado</span>
                )}
              </div>
              <p className="text-zinc-600 text-xs mt-0.5">
                {new Date(item.purchasedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
