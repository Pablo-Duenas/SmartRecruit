"use client";

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase' // Asegúrate de que la ruta es correcta
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Estado para el usuario
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Verificar sesión al cargar
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // 2. Escuchar cambios en la autenticación (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!menuRef.current?.contains(target)) setMobileOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [mobileOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  };

  const items = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Enterprise', href: '#enterprise' },
  ];

  const activeHref = '#features';

  return (
    <nav className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="relative flex h-16 items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold whitespace-nowrap">
            SmartRecruiter
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
               {items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={item.href === activeHref ? 'text-blue-600 underline underline-offset-8 decoration-2 font-medium' : 'text-slate-500 hover:text-slate-900 transition-colors'}>
                    {item.label}
                  </a>
                </li>
              ))} 
            </ul>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-slate-600 mr-2">Hola, {user.email.split('@')[0]}</span>
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                    Login
                  </Link>
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menú Móvil */}
          <div className="md:hidden" ref={menuRef}>
            <button type="button" onClick={() => setMobileOpen((v) => !v)} className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-slate-700">
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            </button>

            {mobileOpen && (
              <div className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white shadow-lg">
                <div className="mx-auto max-w-6xl px-4 py-4">
                  <ul className="flex flex-col gap-3">
                    {items.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2 text-slate-600 hover:bg-slate-50">
                          {item.label}
                        </a>
                      </li>
                    ))} 
                  </ul>

                  <div className="mt-4 flex flex-col gap-3">
                    {user ? (
                      <button onClick={handleLogout} className="w-full inline-flex items-center justify-center rounded-md border border-red-200 py-2 text-sm font-semibold text-red-600">
                        Logout ({user.email})
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link href="/login" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center rounded-md border border-blue-400 py-2 text-sm font-semibold text-blue-600">
                          Login
                        </Link>
                        <Link href="/signup" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center rounded-md bg-blue-600 py-2 text-sm font-semibold text-white">
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar