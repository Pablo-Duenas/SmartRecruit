"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const PricingPage = () => {
  const tiers = [
    {
      name: 'Básico',
      id: 'tier-basic',
      href: '/signup',
      priceMonthly: '€0',
      description: 'Perfecto para quienes están empezando su búsqueda laboral.',
      features: [
        '3 Análisis de CV al mes',
        'Sugerencias básicas de mejora',
        'Score de compatibilidad',
        'Soporte por email',
      ],
      mostPopular: false,
      buttonText: 'Empezar Gratis',
    },
    {
      name: 'Profesional',
      id: 'tier-pro',
      href: '/signup',
      priceMonthly: '€12',
      description: 'La mejor opción para candidatos activos que quieren resultados.',
      features: [
        'Análisis ilimitados',
        'Sugerencias detalladas por IA',
        'Extracción de Keywords críticas',
        'Análisis de tono y lenguaje profesional',
        'Soporte prioritario',
      ],
      mostPopular: true,
      buttonText: 'Elegir Plan Pro',
    },
    {
      name: 'Enterprise',
      id: 'tier-enterprise',
      href: '/contact',
      priceMonthly: 'Consultar',
      description: 'Soluciones personalizadas para agencias de reclutamiento.',
      features: [
        'API de acceso directo',
        'Análisis por lotes (Bulk)',
        'Personalización de marca blanca',
        'Account Manager dedicado',
        'SLA garantizado',
      ],
      mostPopular: false,
      buttonText: 'Contactar Ventas',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Encabezado */}
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">Precios</h2>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
              Invierte en tu próximo <span className="text-blue-600">gran paso</span>
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
            Elige el plan que mejor se adapte a tus necesidades. Todos nuestros planes incluyen tecnología de IA de última generación.
          </p>

          {/* Grid de Tarjetas */}
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-[2.5rem] p-8 ring-1 transition-all duration-300 hover:shadow-2xl ${
                  tier.mostPopular
                    ? 'bg-white ring-blue-600 shadow-xl scale-105 z-10'
                    : 'bg-white/60 ring-slate-200 hover:bg-white'
                }`}
              >
                {tier.mostPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                    Más Popular
                  </div>
                )}
                
                <div>
                  <h3 className={`text-lg font-bold leading-8 ${tier.mostPopular ? 'text-blue-600' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-black tracking-tight text-slate-900">{tier.priceMonthly}</span>
                    {tier.priceMonthly !== 'Consultar' && <span className="text-sm font-semibold leading-6 text-slate-600">/mes</span>}
                  </p>
                  
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.176a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={tier.href}
                  className={`mt-8 block rounded-2xl px-3 py-4 text-center text-sm font-bold leading-6 shadow-sm transition-all active:scale-95 ${
                    tier.mostPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            ))}
          </div>

          {/* Sección de FAQ rápida (Opcional) */}
          <div className="mt-24 sm:mt-32 border-t border-slate-200 pt-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">Preguntas Frecuentes</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div>
                <dt className="font-bold text-slate-900">¿Puedo cancelar mi plan Pro en cualquier momento?</dt>
                <dd className="mt-2 text-slate-600 text-sm">Sí, no hay permanencia. Puedes cancelar tu suscripción desde los ajustes de tu cuenta con un solo clic.</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-900">¿Cómo funciona el análisis de IA?</dt>
                <dd className="mt-2 text-slate-600 text-sm">Utilizamos modelos avanzados que comparan semánticamente tu experiencia con los requisitos específicos de la oferta.</dd>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;