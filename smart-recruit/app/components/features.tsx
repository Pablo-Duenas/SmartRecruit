'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';

const Features = () => {
    const [user, setUser] = useState<any>(null);

    // Detectar sesión para navegación inteligente
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

    return (
        <section id="features" className="bg-white py-16 md:py-24 min-h-screen">
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="text-center">
                    <div className="text-xs font-black tracking-widest text-blue-700 uppercase">El Proceso</div>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                        Precisión tecnológica para tu carrera
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                        Nuestro motor de IA analiza tu trayectoria profesional con datos del mercado para darte una ventaja competitiva.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {/* Paso 1 */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <span className="text-2xl" aria-hidden>📄</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">1. Sube tu CV</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Sube tu currículum de forma segura. Nuestros parsers extraen la información con alta precisión para compararla con la oferta.
                        </p>
                    </div>

                    {/* Paso 2 */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <span className="text-2xl" aria-hidden>🤖</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">2. Optimización con IA</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Cruzamos tus habilidades con los requisitos del puesto y generamos sugerencias de mejora y palabras clave en tiempo real.
                        </p>
                    </div>

                    {/* Paso 3 */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <span className="text-2xl" aria-hidden>💼</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">3. Consigue el trabajo</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Ajusta tu perfil, supera los filtros ATS y empieza a postular a mejores oportunidades con total confianza.
                        </p>
                    </div>
                </div>

                {/* Card de Cierre / CTA */}
                <div className="mt-14 rounded-3xl border border-blue-100 bg-blue-50/60 p-10 text-center shadow-sm md:p-14">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                        ¿Listo para transformar tu carrera?
                    </h3>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                        Anímate a optimizar tu CV con una plataforma impulsada por IA y empieza a postular con ventaja competitiva.
                    </p>
                    <div className="mt-7">
                        <Link
                            href={user ? "/dashboard" : "/login"}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 hover:scale-105 active:scale-95 transform transition"
                        >
                            {user ? "Ir a mi Dashboard" : "Optimizar mi CV ahora"}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;