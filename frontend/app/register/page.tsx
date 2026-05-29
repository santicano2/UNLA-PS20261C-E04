"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "../services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const data = await register(username, email, password, role);

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } else {
      setError(data.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0a0e1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-zinc-500 text-sm tracking-wide">CREAR CUENTA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
              required
            />
          </div>

          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
            >
              <option value="user">Usuario</option>
              <option value="developer">Desarrollador</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-medium rounded-lg py-3 text-sm transition-colors cursor-pointer"
          >
            REGISTRARSE
          </button>
        </form>

        <p className="text-zinc-500 text-sm text-center mt-8">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="text-[#00d4ff] hover:underline cursor-pointer"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
