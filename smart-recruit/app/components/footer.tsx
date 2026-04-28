"use client";

import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a href="/" className="text-lg font-black tracking-tight text-slate-900">
              SmartRecruiter
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
              Optimiza tu currículum con IA, mejora tu compatibilidad con vacantes y postula con confianza.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:col-span-2">
            <div>
              <div className="text-xs font-black tracking-widest text-slate-500">PRODUCTO</div>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                    El proceso
                  </a>
                </li>
                <li>
                  <a href="#demo" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#signup" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Empezar
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-black tracking-widest text-slate-500">LEGAL</div>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p> {year} SmartRecruiter. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-700 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-slate-700 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer