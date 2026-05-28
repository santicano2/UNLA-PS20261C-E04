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

export async function getGames() {
  const res = await fetch(`${API_BASE}/games`);
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
