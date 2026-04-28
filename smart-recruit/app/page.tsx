'use client';
import { useState } from 'react';

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

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-2 text-center">SmartRecruit <span className="text-blue-600 italic">AI</span></h1>
        <p className="text-center text-slate-500 mb-10 text-lg">Tu CV analizado por inteligencia artificial en segundos.</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-slate-700">Tu CV (PDF)</label>
              <input name="file" type="file" accept=".pdf" required className="w-full p-2 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 transition" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-slate-700">Oferta de Trabajo</label>
              <textarea name="jobDescription" required rows={4} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Pega los requisitos de la vacante..."></textarea>
            </div>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transform transition active:scale-95 disabled:bg-slate-300">
            {loading ? "Analizando compatibilidad..." : "Obtener Score de Reclutador"}
          </button>
        </form>

        {result && (
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-2xl border-l-[12px] border-blue-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                <ul className="space-y-2">{result.puntosFuertes.map((p:any, i:number) => <li key={i} className="text-emerald-900 text-sm flex items-start"><span className="mr-2">✦</span>{p}</li>)}</ul>
              </div>
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                <h3 className="text-amber-700 font-bold mb-3 flex items-center tracking-tight text-lg">💡 Sugerencias de Mejora</h3>
                <ul className="space-y-2">{result.puntosMejora.map((p:any, i:number) => <li key={i} className="text-amber-900 text-sm flex items-start"><span className="mr-2">✧</span>{p}</li>)}</ul>
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
  );
}