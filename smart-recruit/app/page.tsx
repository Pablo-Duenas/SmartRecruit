'use client';

import { useState, useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Navbar from './components/navbar';
import Footer from './components/footer';
import Features from './components/features';
import LiquidEther from "./components/LiquidEther";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false); // Estado para el Pop-up
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      const hasUsedFreeTrial = localStorage.getItem('free_trial_used');
      if (hasUsedFreeTrial) {
        setShowModal(true); // En lugar de alert, activamos el modal
        return;
      }
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);

      if (!user) {
        localStorage.setItem('free_trial_used', 'true');
      }

    } catch (err) {
      alert("Error al conectar con la IA");
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
    <>
      <Navbar />
      
      {/* --- POP UP / MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md scale-in-center bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">¡Límite alcanzado!</h3>
            <p className="text-slate-600 mb-8">
              Has usado tu análisis gratuito como invitado. Regístrate para obtener escaneos ilimitados y optimizar tu CV al máximo.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/signup"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Crear cuenta gratis
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
              >
                Tal vez luego
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative isolate min-h-screen overflow-hidden bg-slate-50 p-6 md:p-12">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <LiquidEther />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl pt-8 md:pt-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <section className="pt-4 md:pt-10">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-widest text-blue-700 border border-blue-100">
                POWERED BY AI ANALYTICS
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Optimiza tu CV con IA y encuentra tu trabajo ideal
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                SmartRecruiter utiliza algoritmos avanzados para escanear, puntuar y reestructurar tu currículum en comparación con miles de pilares de rendimiento de la industria.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* BOTÓN GET STARTED DINÁMICO */}
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  {user ? "Ir al Dashboard" : "Get Started"}
                  <span className="ml-2">→</span>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="h-9 w-9 rounded-full bg-slate-200 ring-2 ring-slate-50" />
                  <div className="h-9 w-9 rounded-full bg-slate-200 ring-2 ring-slate-50" />
                  <div className="h-9 w-9 rounded-full bg-slate-200 ring-2 ring-slate-50" />
                </div>
                <span>Trusted by 10,000+ top candidates worldwide</span>
              </div>
            </section>

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
                    
                    {!user && (
                      <p className="text-[10px] text-center text-slate-500 mt-1 italic">
                        Prueba gratuita: 1 análisis disponible como invitado.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Features />
      <Footer />
    </>
  );
}