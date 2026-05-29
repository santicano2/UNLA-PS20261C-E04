"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSalesReport } from "../services/api";

export default function SalesPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    setUser(parsed);
    if (parsed.role !== "developer") { router.push("/"); return; }
    getSalesReport().then(setItems).catch(() => setItems([]));
  }, []);

  const total = items.reduce((sum: number, i: any) => sum + (i.refunded ? 0 : Number(i.price)), 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-zinc-300">Informe de Ventas</h2>
        <p className="text-zinc-400 text-sm">
          Total: <span className="text-[#00d4ff] font-medium">${total.toFixed(2)}</span>
        </p>
      </div>

      {items.length === 0 && (
        <p className="text-zinc-500 text-center py-20">
          No tenés ventas todavía
        </p>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 flex items-center justify-between"
          >
            <div>
              <p className="text-white text-sm font-medium">{item.gameTitle}</p>
              <p className="text-zinc-500 text-xs">Comprado por {item.buyerUsername}</p>
            </div>
            <div className="text-right">
              <p className="text-[#00d4ff] text-sm font-medium">
                ${item.price}
                {item.refunded && (
                  <span className="text-red-500 text-xs ml-2">Reembolsado</span>
                )}
              </p>
              <p className="text-zinc-600 text-xs">
                {new Date(item.purchasedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
