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

  useEffect(() => {
    const saved = localStorage.getItem("lastAnalysis");

    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
      localStorage.setItem("lastAnalysis", JSON.stringify(data));
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
            description: `
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

      {/* CONTENEDOR RESPONSIVE */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* HEADER */}
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Panel de Análisis
          </h1>

          <p className="mt-2 text-sm sm:text-base lg:text-lg text-slate-500">
            Analiza tu CV frente a cualquier oferta y mejora tu perfil.
          </p>
        </header>

        {/* BLOQUE SUPERIOR */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 lg:gap-8 items-start">

          {/* IZQUIERDA */}
          <section>
            <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-200 h-[720px] flex flex-col">

              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    CV Score
                  </h2>

                  <button
                    onClick={startTour}
                    className="text-xs sm:text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg px-3 py-2 hover:bg-blue-600 hover:text-white transition w-fit"
                  >
                    ¿Cómo funciona?
                  </button>
                </div>

                <span className="text-lg sm:text-xl font-black text-blue-600">
                  {typeof result?.score === "number"
                    ? `${result.score}%`
                    : "—"}
                </span>
              </div>

              {/* PROGRESS */}
              <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, Number(result?.score ?? 0))
                    )}%`,
                  }}
                />
              </div>

              {/* MINI STATS */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="text-[10px] font-bold tracking-widest text-slate-500">
                    RELEVANCY
                  </div>

                  <div className="mt-2 text-base sm:text-lg font-bold text-slate-900">
                    {result ? "High" : "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="text-[10px] font-bold tracking-widest text-slate-500">
                    KEYWORDS
                  </div>

                  <div className="mt-2 text-base sm:text-lg font-bold text-slate-900">
                    {result
                      ? `${result?.keywordsEncontradas?.length || 0} detectadas`
                      : "—"}
                  </div>
                </div>

              </div>

              {/* FORM */}
              <div className="mt-6 rounded-2xl sm:rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 p-4 sm:p-6 flex-1 flex flex-col">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5 flex-1 flex flex-col"
                >

                  {/* FILE */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Tu CV (PDF)
                    </label>

                    <input
                      name="file"
                      type="file"
                      accept=".pdf"
                      required
                      className="cv-upload w-full p-3 border-2 border-dashed border-slate-300 rounded-xl bg-white text-blue-600 text-sm"
                    />
                  </div>

                  {/* TEXTAREA */}
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Oferta de Trabajo
                    </label>

                    <textarea
                      name="jobDescription"
                      required
                      rows={7}
                      placeholder="Pega los requisitos de la vacante..."
                      className="job-offer flex-1 w-full p-4 border-2 border-slate-200 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                    />
                  </div>

                  {/* BUTTON */}
                  <button
                    disabled={loading}
                    className={`score-btn w-full py-3 sm:py-4 rounded-xl font-bold text-white transition text-sm sm:text-base ${loading
                      ? "bg-slate-400"
                      : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading
                      ? "Analizando compatibilidad..."
                      : "Obtener Score de Reclutador"}
                  </button>

                </form>
              </div>

            </div>
          </section>

          {/* DERECHA */}
          <section>
            <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-xl border-l-[8px] sm:border-l-[12px] border-blue-500 h-[720px] flex flex-col">

              {!result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl sm:text-7xl mb-4">📄</div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Esperando análisis
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-md">
                    Sube tu currículum y pega una oferta para obtener tu compatibilidad automáticamente.
                  </p>
                </div>
              ) : (

                <div className="flex-1 overflow-y-auto pr-2">

                  {/* HEADER RESULT */}
                  <div className="flex flex-col lg:flex-row gap-5 lg:justify-between">

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Análisis Completo
                      </h2>

                      <p className="mt-2 italic text-sm sm:text-base text-slate-500">
                        "{result.resumen}"
                      </p>
                    </div>

                    <div className="rounded-3xl bg-blue-50 border border-blue-100 px-5 py-4 text-center w-fit">
                      <div className="text-4xl sm:text-5xl font-black text-blue-600">
                        {result.score}%
                      </div>

                      <div className="text-[10px] uppercase tracking-widest font-bold text-blue-400 mt-1">
                        Match Score
                      </div>
                    </div>

                  </div>

                  {/* CARDS */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
                      <h3 className="text-base sm:text-lg font-bold text-emerald-700 mb-4">
                        ✅ Puntos Fuertes
                      </h3>

                      <ul className="space-y-3">
                        {result?.puntosFuertes?.map((p: any, i: number) => (
                          <li key={i} className="text-sm text-emerald-900 flex">
                            <span className="mr-3">✦</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 sm:p-6">
                      <h3 className="text-base sm:text-lg font-bold text-amber-700 mb-4">
                        💡 Mejoras
                      </h3>

                      <ul className="space-y-3">
                        {result?.puntosMejora?.map((p: any, i: number) => (
                          <li key={i} className="text-sm text-amber-900 flex">
                            <span className="mr-3">✧</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* VEREDICTO */}
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-800 mb-3">
                      Veredicto Final
                    </h3>

                    <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 italic text-sm sm:text-base text-slate-700">
                      "{result.veredicto}"
                    </p>
                  </div>

                </div>
              )}

            </div>
          </section>

        </div>

        {/* BOTTOM GRID */}
        {result && (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

            {/* CARD 1 */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">
                ⚠️ Skills que faltan
              </h3>

              <div className="flex flex-wrap gap-2">
                {result?.keywordsFaltantes?.map((item: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-2 rounded-full bg-amber-50 border border-amber-200 text-xs sm:text-sm font-medium text-amber-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* CARD 2 */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">
                📊 Match por áreas
              </h3>

              <div className="space-y-5">
                {[
                  { name: "Tecnologías", value: Math.min(result.score + 5, 100) },
                  { name: "Experiencia", value: Math.max(result.score - 8, 0) },
                  { name: "Presentación", value: Math.min(result.score + 10, 100) },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-black">{item.name}</span>
                      <span className="font-bold text-black">{item.value}%</span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 3 */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-slate-200 md:col-span-2 xl:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">
                🚀 Próximo paso recomendado
              </h3>

              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 sm:p-5 text-sm sm:text-base text-slate-700 leading-relaxed">
                {result.score >= 80
                  ? "Tu perfil está muy bien alineado. Aplica cuanto antes."
                  : result.score >= 60
                    ? "Buen punto de partida. Refuerza skills faltantes."
                    : "Necesitas mejorar CV y skills antes de aplicar."}
              </div>

              <button className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition">
                Mejorar mi CV
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}