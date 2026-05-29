"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getLibrary,
  searchUsers,
  updateUsername,
  getFriends,
  addFriend,
  removeFriend,
} from "../services/api";
import { showToast } from "../components/Toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [tab, setTab] = useState<"games" | "friends">("games");
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    setUser(parsed);
    setNewUsername(parsed.username);
    getLibrary().then(setGames);
    getFriends().then(setFriends);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchUsers(searchQuery);
      setSearchResults(results.filter((r: any) => r.id !== user?.id));
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  async function handleUpdateUsername() {
    if (!newUsername.trim()) return;
    const r = await updateUsername(newUsername);
    if (r.success) {
      setUser((prev: any) => ({ ...prev, username: r.username }));
      localStorage.setItem("user", JSON.stringify({ ...user, username: r.username }));
      setEditingUsername(false);
      showToast("Nombre de usuario actualizado");
    } else {
      showToast(r.error || "Error", "error");
    }
  }

  async function handleAddFriend(friendId: number) {
    const r = await addFriend(friendId);
    if (r.success) {
      setFriends((prev) => [...prev, r.friend]);
      showToast("Amigo agregado");
      setSearchQuery("");
      setSearchResults([]);
    } else {
      showToast(r.error || "Error", "error");
    }
  }

  async function handleRemoveFriend(friendId: number) {
    const r = await removeFriend(friendId);
    if (r.success) {
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      showToast("Amigo eliminado");
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#00d4ff]/20 border-2 border-[#00d4ff] flex items-center justify-center text-[#00d4ff] text-3xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            {editingUsername ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-[#0a0e1a] border border-[#1e293b] rounded px-3 py-1.5 text-white text-lg focus:outline-none focus:border-[#00d4ff]"
                />
                <button
                  onClick={handleUpdateUsername}
                  className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black text-xs font-medium px-3 py-1.5 rounded transition-colors cursor-pointer"
                >
                  Guardar
                </button>
                <button
                  onClick={() => { setEditingUsername(false); setNewUsername(user.username); }}
                  className="text-zinc-500 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl text-white font-medium">{user.username}</h1>
                <button
                  onClick={() => setEditingUsername(true)}
                  className="text-zinc-500 hover:text-[#00d4ff] text-xs transition-colors cursor-pointer"
                >
                  Editar
                </button>
              </div>
            )}
            <p className="text-zinc-500 text-sm mt-1">
              {games.length} juegos &middot; {friends.length} amigos
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-[#1e293b] mb-6">
        <button
          onClick={() => setTab("games")}
          className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
            tab === "games" ? "text-[#00d4ff] border-b-2 border-[#00d4ff]" : "text-zinc-500 hover:text-white"
          }`}
        >
          Juegos ({games.length})
        </button>
        <button
          onClick={() => setTab("friends")}
          className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
            tab === "friends" ? "text-[#00d4ff] border-b-2 border-[#00d4ff]" : "text-zinc-500 hover:text-white"
          }`}
        >
          Amigos ({friends.length})
        </button>
      </div>

      {tab === "games" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {games.length === 0 && (
            <p className="text-zinc-600 text-sm col-span-full text-center py-8">
              No tenés juegos adquiridos
            </p>
          )}
              {games.map((g: any) => (
            <Link
              key={g.gameId}
              href={`/games/${g.gameId}`}
              className="bg-[#111827] border border-[#1e293b] rounded-lg overflow-hidden hover:border-[#00d4ff]/50 transition-all group"
            >
              {g.imageUrl && (
                <div className="aspect-video bg-zinc-800 overflow-hidden">
                  <img
                    src={g.imageUrl}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{g.title}</p>
                <p className="text-zinc-600 text-xs mt-0.5">{g.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "friends" && (
        <div>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar usuarios por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#00d4ff] transition-colors"
            />
            {searching && (
              <span className="absolute right-4 top-3 text-zinc-500 text-xs">Buscando...</span>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="bg-[#111827] border border-[#1e293b] rounded-lg mb-6 overflow-hidden">
              {searchResults.map((u: any) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b] last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-bold">
                      {u.username[0].toUpperCase()}
                    </div>
                    <span className="text-white text-sm">{u.username}</span>
                  </div>
                  <button
                    onClick={() => handleAddFriend(u.id)}
                    disabled={friends.some((f) => f.id === u.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded transition-colors cursor-pointer ${
                      friends.some((f) => f.id === u.id)
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-[#00d4ff] hover:bg-[#00b8e6] text-black"
                    }`}
                  >
                    {friends.some((f) => f.id === u.id) ? "Agregado" : "Agregar"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {friends.length === 0 && !searchQuery && (
              <p className="text-zinc-600 text-sm text-center py-8">
                No tenés amigos. Buscalos por nombre de usuario.
              </p>
            )}
            {friends.map((f: any) => (
              <div
                key={f.id}
                className="bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">
                    {f.username[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium">{f.username}</span>
                    <p className="text-zinc-600 text-xs">
                      Amigo desde {new Date(f.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFriend(f.id)}
                  className="text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
