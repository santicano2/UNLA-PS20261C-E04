"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getLibrary, toggleInstall, toggleFavorite } from "../services/api";

type Filter = "all" | "installed" | "favorite";

export default function LibraryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getLibrary()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q)) return false;
    if (filter === "installed" && !item.installed) return false;
    if (filter === "favorite" && !item.favorite) return false;
    return true;
  });

  function select(item: any) {
    setSelected(item);
    setDownloading(false);
  }

  async function handleDownload() {
    if (!selected) return;
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 3000));
    await toggleInstall(selected.gameId);
    setItems((prev) =>
      prev.map((i) =>
        i.gameId === selected.gameId ? { ...i, installed: true } : i,
      ),
    );
    setSelected((prev: any) => (prev ? { ...prev, installed: true } : null));
    setDownloading(false);
  }

  async function handleUninstall() {
    if (!selected) return;
    await toggleInstall(selected.gameId);
    setItems((prev) =>
      prev.map((i) =>
        i.gameId === selected.gameId ? { ...i, installed: false } : i,
      ),
    );
    setSelected((prev: any) => (prev ? { ...prev, installed: false } : null));
  }

  async function handleFavorite(gameId: number) {
    await toggleFavorite(gameId);
    setItems((prev) =>
      prev.map((i) =>
        i.gameId === gameId ? { ...i, favorite: !i.favorite } : i,
      ),
    );
    if (selected?.gameId === gameId) {
      setSelected((prev: any) =>
        prev ? { ...prev, favorite: !prev.favorite } : null,
      );
    }
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "installed", label: "Instalados" },
    { key: "favorite", label: "Favoritos" },
  ];

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <aside className="w-72 border-r border-[#1e293b] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#1e293b]">
          <input
            type="text"
            placeholder="Buscar en biblioteca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
          />
        </div>

        <div className="flex border-b border-[#1e293b]">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "text-[#00d4ff] border-b-2 border-[#00d4ff]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item.gameId}
              onClick={() => select(item)}
              className={`w-full text-left px-4 py-3 border-b border-[#1e293b]/50 transition-colors ${
                selected?.gameId === item.gameId
                  ? "bg-[#1e293b] text-white"
                  : "text-zinc-400 hover:text-white hover:bg-[#111827]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm truncate">{item.title}</span>
                {item.installed && (
                  <span className="text-[10px] text-green-500 shrink-0">●</span>
                )}
                {item.favorite && (
                  <span className="text-[10px] text-yellow-500 shrink-0">
                    ★
                  </span>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-zinc-600 text-xs text-center py-8">
              {search ? "Sin resultados" : "No hay juegos"}
            </p>
          )}
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8">
        {selected ? (
          <div className="w-full max-w-2xl">
            {selected.imageUrl && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6">
                <Image
                  src={selected.imageUrl}
                  alt={selected.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <h2 className="text-2xl text-white font-medium">
              {selected.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-zinc-500 text-sm">
              <span>{selected.genre}</span>
              <span>·</span>
              <span>{selected.publisher}</span>
            </div>
            <p className="text-zinc-600 text-xs mt-1">
              Adquirido {new Date(selected.purchasedAt).toLocaleDateString()}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => handleFavorite(selected.gameId)}
                className={`text-lg cursor-pointer transition-colors ${
                  selected.favorite
                    ? "text-yellow-500"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {selected.favorite ? "★" : "☆"}
              </button>

              {selected.installed ? (
                <>
                  <button className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium px-8 py-2.5 rounded-lg text-sm transition-colors cursor-pointer">
                    Jugar
                  </button>
                  <button
                    onClick={handleUninstall}
                    className="text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
                  >
                    Desinstalar
                  </button>
                </>
              ) : downloading ? (
                <button
                  disabled
                  className="bg-zinc-700 text-zinc-400 font-medium px-8 py-2.5 rounded-lg text-sm cursor-not-allowed"
                >
                  Descargando...
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium px-8 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Descargar
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">
            Seleccioná un juego de la lista
          </p>
        )}
      </main>
    </div>
  );
}
