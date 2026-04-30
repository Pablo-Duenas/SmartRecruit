"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase"; // Usamos @ para evitar los ../../
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setMsg({ 
        type: "success", 
        text: "¡Registro éxito! Revisa tu email para confirmar." 
      });
    } catch (error: any) {
      setMsg({ 
        type: "error", 
        text: error.message || "Ocurrió un error al registrarse" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <form 
        onSubmit={handleSignUp} 
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm flex flex-col gap-4 border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-900 text-center">Crear Cuenta</h1>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input 
            type="email" 
            placeholder="ejemplo@correo.com" 
            className="border p-2 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="border p-2 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`p-2 rounded font-semibold text-white transition-colors ${
            loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        {msg.text && (
          <p className={`text-sm p-2 rounded text-center ${
            msg.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          }`}>
            {msg.text}
          </p>
        )}

        <p className="text-center text-sm text-slate-600 mt-2">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}