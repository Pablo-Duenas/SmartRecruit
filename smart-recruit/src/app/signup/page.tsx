"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
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
        text: "¡Registro éxito! Revisa tu email para confirmar tu cuenta." 
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 relative overflow-hidden">
      {/* Fondo decorativo coherente con tu landing */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

      <form 
        onSubmit={handleSignUp} 
        className="relative z-10 bg-white p-10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.06)] w-full max-w-[420px] flex flex-col gap-5 border border-slate-100"
      >

        {/* Logo / Título */}
        <div className="text-center mb-2">

          <h1 className="text-3xl font-black tracking-tight text-slate-900">Crear Cuenta</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Empieza a optimizar tu CV hoy mismo</p>
        </div>
        
        {/* Campo: Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
          <input 
            type="email" 
            placeholder="ejemplo@correo.com" 
            className="w-full border-2 border-slate-100 bg-slate-50/50 p-4 rounded-2xl text-black outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        {/* Campo: Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full border-2 border-slate-100 bg-slate-50/50 p-4 rounded-2xl text-black outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all active:scale-[0.97] mt-2 ${
            loading ? "bg-slate-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creando cuenta..." : "Registrarse Ahora"}
        </button>

        {msg.text && (
          <div className={`text-sm py-3 px-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-top-2 ${
            msg.type === "error" 
              ? "bg-red-50 text-red-600 border border-red-100" 
              : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}>
            {msg.text}
          </div>
        )}

        <div className="mt-4 pt-6 border-t border-slate-100 text-center flex flex-col gap-3">
          <p className="text-sm text-slate-500 font-medium">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">
              Inicia sesión
            </Link>
          </p>
          
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest font-bold">
            ← Volver al inicio
          </Link>
        </div>
      </form>
    </div>
  );
}