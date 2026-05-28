"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, [pathname]);

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
              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-white text-sm transition-colors"
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
