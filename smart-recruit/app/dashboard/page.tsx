"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';


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
   const startTour = () => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
  
        nextBtnText: "Siguiente",
        prevBtnText: "Atrás",
        doneBtnText: "Finalizar",
  
        popoverClass: "smart-tour",
  
        steps: [
          {
            element: ".cv-upload",
            popover: {
              title: "📄 Sube tu CV",
              description: "Sube aquí tu currículum en formato PDF.",
            },
          },
          {
            element: ".job-offer",
            popover: {
              title: "🎯 Oferta de trabajo",
              description:`
        <div>
          <p style="margin-bottom:10px;">
            Copia la parte donde la empresa indica requisitos,
            tecnologías o experiencia, y pégala aquí. (ejemplo en la foto de abajo)
          </p>
  
          <img
            src="/requisitos-ejemplo.png"
            style="
              width:100%;
              border-radius:14px;
              border:1px solid #e2e8f0;
              box-shadow:0 8px 20px rgba(0,0,0,.08);
            "
          />
        </div>`
      ,
            },
          },
          {
            element: ".score-btn",
            popover: {
              title: "⚡ Analiza compatibilidad",
              description: "Haz clic aquí para obtener tu score.",
            },
          },
        ],
      });
  
      driverObj.drive();
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
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex gap-5">
                    <h2 className="text-xl font-bold text-slate-900">CV Score</h2>
                    <button onClick={startTour} className="text-xs font-semibold text-blue-600 cursor-pointer decoration-2 transition-colors duration-200 ease-in-out bg-transparent border border-blue-600 rounded-md px-2 py-1 hover:bg-blue-600 hover:text-white">
                      ¿Cómo funciona?
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-blue-600">
                      {typeof result?.score === 'number' ? `${result.score}%` : '—'}
                    </span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                      ⓘ
                    </span>
                  </div>
                </div>

                <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${Math.max(0, Math.min(100, Number(result?.score ?? 0)))}%` }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[10px] font-bold tracking-widest text-slate-500">RELEVANCY</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">{result ? 'High' : '—'}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[10px] font-bold tracking-widest text-slate-500">KEYWORDS</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">{result ? '—' : '—'}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-5">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Tu CV (PDF)</label>
                        <input name="file" type="file" accept=".pdf" required className="cv-upload w-full p-2 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 transition text-blue-500 bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Oferta de Trabajo</label>
                        <textarea name="jobDescription" required rows={4} className="job-offer w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white" placeholder="Pega los requisitos de la vacante..."></textarea>
                      </div>
                    </div>
                    <button 
                      disabled={loading} 
                      className={`score-btn w-full text-white font-bold py-3 rounded-xl transform transition active:scale-95 disabled:bg-slate-300 ${
                        loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {loading ? "Analizando compatibilidad..." : "Obtener Score de Reclutador"}
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