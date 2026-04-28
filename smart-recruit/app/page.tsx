'use client';

import { useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

import Navbar from './components/navbar';
import Footer from './components/footer';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
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
            description: "Selecciona aquí tu currículum PDF.",
          },
        },
        {
          element: ".job-offer",
          popover: {
            title: "📋 Oferta de trabajo",
            description: "Pega aquí los requisitos.",
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
      <main className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="mx-auto w-full max-w-6xl pt-8 md:pt-14">
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
                <a
                  href="#signup"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Get Started
                  <span className="ml-2">→</span>
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  View Demo
                </a>
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
                    <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transform transition active:scale-95 disabled:bg-slate-300">
                      {loading ? "Analizando compatibilidad..." : "Obtener Score de Reclutador"}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>

          {result && (
            <div className="mt-12 bg-white rounded-3xl p-8 shadow-2xl border-l-12 border-blue-500 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Análisis Completo</h2>
                  <p className="text-slate-500 italic mt-1">"{result.resumen}"</p>
                </div>
                <div className="text-center bg-blue-50 p-4 rounded-2xl">
                  <div className="text-4xl font-black text-blue-600">{result.score}%</div>
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Match Score</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <h3 className="text-emerald-700 font-bold mb-3 flex items-center tracking-tight text-lg">✅ Puntos Fuertes</h3>
                  <ul className="space-y-2">{result.puntosFuertes.map((p: any, i: number) => <li key={i} className="text-emerald-900 text-sm flex items-start"><span className="mr-2">✦</span>{p}</li>)}</ul>
                </div>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                  <h3 className="text-amber-700 font-bold mb-3 flex items-center tracking-tight text-lg">💡 Sugerencias de Mejora</h3>
                  <ul className="space-y-2">{result.puntosMejora.map((p: any, i: number) => <li key={i} className="text-amber-900 text-sm flex items-start"><span className="mr-2">✧</span>{p}</li>)}</ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 mb-2">Veredicto Final:</h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{result.veredicto}</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}