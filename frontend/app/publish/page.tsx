"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "../services/api";

export default function PublishPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Acción");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await createGame({
      title,
      description,
      genre,
      price: parseFloat(price),
      imageUrl,
      downloadUrl,
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h2 className="text-xl text-zinc-300 mb-6">Publicar juego</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
            >
              <option>Acción</option>
              <option>Aventura</option>
              <option>RPG</option>
              <option>Estrategia</option>
              <option>Carreras</option>
              <option>Puzzle</option>
              <option>Simulación</option>
              <option>Deportes</option>
            </select>
          </div>

          <div className="flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <input
            type="url"
            placeholder="URL de la imagen"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
          />
        </div>

        <div>
          <input
            type="url"
            placeholder="URL de descarga"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium rounded-lg py-3 text-sm transition-colors"
        >
          PUBLICAR
        </button>
      </form>
    </div>
  );
}
