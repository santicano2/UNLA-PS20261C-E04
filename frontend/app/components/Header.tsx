"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCart } from "../services/api";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCart()
        .then((items) => setCartCount(items.length || 0))
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [pathname]);

  useEffect(() => {
    function onCartUpdate() {
      const token = localStorage.getItem("token");
      if (token)
        getCart()
          .then((items) => setCartCount(items.length || 0))
          .catch(() => {});
    }
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <header className="border-b border-[#1e293b] px-6 py-4 flex items-center justify-between bg-[#0a0e1a]">
      <Link
        href="/"
        className="text-2xl font-bold tracking-wider text-white hover:text-[#00d4ff] transition-colors"
      >
        Steam
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-zinc-400 text-sm">{user.username}</span>
            {user.role === "developer" && (
              <Link
                href="/publish"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Publicar
              </Link>
            )}
            <Link
              href="/library"
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Biblioteca
            </Link>
            <Link
              href="/cart"
              className="relative text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Carrito
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-[#00d4ff] text-black text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="bg-[#00d4ff] hover:bg-[#00b8e6] text-black text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
