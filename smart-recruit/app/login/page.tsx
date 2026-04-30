"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Credenciales incorrectas o usuario no encontrado.");
      setLoading(false);
    } else {
      // Si todo sale bien, lo mandamos al home o dashboard
      router.push("/"); 
      router.refresh(); // Refresca para que el Navbar detecte la sesión
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm flex flex-col gap-4 border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-900 text-center">Bienvenido de nuevo</h1>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input 
            type="email" 
            placeholder="tu@email.com" 
            className="border p-2 rounded text-black outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="border p-2 rounded text-black outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`p-2 rounded font-semibold text-white transition-colors ${
            loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Entrando..." : "Iniciar Sesión"}
        </button>

        {errorMsg && (
          <p className="text-sm bg-red-50 text-red-600 p-2 rounded text-center">
            {errorMsg}
          </p>
        )}

        <p className="text-center text-sm text-slate-600 mt-2">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
}