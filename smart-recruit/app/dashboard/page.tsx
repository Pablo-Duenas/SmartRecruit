"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  // Protección de ruta: Si no hay sesión, vuelve al login
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error al analizar el CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 pt-12">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">Panel de Análisis</h1>
          <p className="text-slate-500">Sube tus archivos para comparar tu perfil.</p>
        </header>

        {/* --- SECCIÓN DE FORMULARIO QUE PEDISTE --- */}
        <section className="md:pt-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-5">
                <h2 className="text-xl font-bold text-slate-900">CV Score</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base font-black text-blue-600">
                  {typeof result?.score === "number" ? `${result.score}%` : "—"}
                </span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-xs">ⓘ</span>
              </div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-700"
                style={{ width: `${Math.max(0, Math.min(100, Number(result?.score ?? 0)))}%` }}
              />
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-dashed border-blue-200 bg-blue-50/30 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Tu CV (PDF)</label>
                    <input name="file" type="file" accept=".pdf" required className="w-full p-3 border-2 border-dashed border-slate-200 rounded-2xl bg-white cursor-pointer hover:border-blue-400 transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Oferta de Trabajo</label>
                    <textarea name="jobDescription" required rows={4} className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white" placeholder="Requisitos de la vacante..."></textarea>
                  </div>
                </div>
                <button 
                  disabled={loading} 
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transform transition active:scale-95 disabled:bg-slate-300 shadow-lg shadow-blue-500/20"
                >
                  {loading ? "Analizando compatibilidad..." : "Obtener Score IA"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN DE RESULTADOS QUE PEDISTE --- */}
        {result && (
          <div className="mt-12 bg-white rounded-[2rem] p-8 shadow-2xl border-l-[12px] border-blue-500 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Análisis Completo</h2>
                <p className="text-slate-500 italic mt-2">"{result.resumen}"</p>
              </div>
              <div className="text-center bg-blue-50 p-5 rounded-3xl border border-blue-100">
                <div className="text-4xl font-black text-blue-600">{result.score}%</div>
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Match Score</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-6 rounded-[1.5rem] border border-emerald-100">
                <h3 className="text-emerald-700 font-bold mb-4 flex items-center text-lg">✅ Puntos Fuertes</h3>
                <ul className="space-y-3">
                  {result?.puntosFuertes?.map((p: any, i: number) => (
                    <li key={i} className="text-emerald-900 text-sm flex items-start leading-relaxed">
                      <span className="mr-3 text-emerald-500 font-bold">✦</span> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-[1.5rem] border border-amber-100">
                <h3 className="text-amber-700 font-bold mb-4 flex items-center text-lg">💡 Sugerencias</h3>
                <ul className="space-y-3">
                  {result?.puntosMejora?.map((p: any, i: number) => (
                    <li key={i} className="text-amber-900 text-sm flex items-start leading-relaxed">
                      <span className="mr-3 text-amber-500 font-bold">✧</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3">Veredicto Final:</h3>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200 font-medium italic">
                "{result.veredicto}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}