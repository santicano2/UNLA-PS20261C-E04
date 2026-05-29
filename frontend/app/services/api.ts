const API_BASE = "http://localhost:8080/api";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(
  username: string,
  email: string,
  password: string,
  role?: string,
) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  });
  return res.json();
}

export async function getGames(search?: string, genre?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (genre) params.set("genre", genre);
  const qs = params.toString();
  const res = await fetch(`${API_BASE}/games${qs ? "?" + qs : ""}`);
  return res.json();
}

export async function createGame(game: {
  title: string;
  description: string;
  genre: string;
  price: number;
  imageUrl: string;
}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers,
    body: JSON.stringify(game),
  });
  return res.json();
}

export async function getMe() {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/auth/me`, { headers });
  return res.json();
}

export async function getCart() {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/cart`, { headers });
  return res.json();
}

export async function addToCart(gameId: number) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/cart/${gameId}`, {
    method: "POST",
    headers,
  });
  return res.json();
}

export async function removeFromCart(gameId: number) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/cart/${gameId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) return { error: "Error al quitar del carrito" };
  try {
    return await res.json();
  } catch {
    return { success: true };
  }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export async function buyCart() {
  const res = await fetch(`${API_BASE}/purchases`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.json();
}

export async function getOwnedGames(): Promise<number[]> {
  const res = await fetch(`${API_BASE}/purchases`, { headers: authHeaders() });
  if (!res.ok) return [];
  try {
    return await res.json();
  } catch {
    return [];
  }
}

export async function getLibrary() {
  const res = await fetch(`${API_BASE}/purchases/library`, { headers: authHeaders() });
  if (!res.ok) return [];
  try {
    return await res.json();
  } catch {
    return [];
  }
}

export async function toggleInstall(gameId: number) {
  const res = await fetch(`${API_BASE}/purchases/${gameId}/install`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.json();
}

export async function toggleFavorite(gameId: number) {
  const res = await fetch(`${API_BASE}/purchases/${gameId}/favorite`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.json();
}

export async function getGame(id: number) {
  const res = await fetch(`${API_BASE}/games/${id}`);
  return res.json();
}

export async function getWishlist(): Promise<number[]> {
  const res = await fetch(`${API_BASE}/wishlist`, { headers: authHeaders() });
  if (!res.ok) return [];
  try { return await res.json(); } catch { return []; }
}

export async function getWishlistGames(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/wishlist/games`, { headers: authHeaders() });
  if (!res.ok) return [];
  try { return await res.json(); } catch { return []; }
}

export async function toggleWishlist(gameId: number) {
  const res = await fetch(`${API_BASE}/wishlist/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.json();
}

export async function getPurchaseHistory(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/purchases/history`, { headers: authHeaders() });
  if (!res.ok) return [];
  try { return await res.json(); } catch { return []; }
}

export async function getSalesReport(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/purchases/sales`, { headers: authHeaders() });
  if (!res.ok) return [];
  try { return await res.json(); } catch { return []; }
}

export async function refundGame(gameId: number) {
  const res = await fetch(`${API_BASE}/purchases/${gameId}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.json();
}

export async function setDiscount(gameId: number, discount: number) {
  const res = await fetch(`${API_BASE}/games/${gameId}/discount`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ discount }),
  });
  return res.json();
}
