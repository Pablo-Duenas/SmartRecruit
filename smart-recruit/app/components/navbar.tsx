"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const close = (e: PointerEvent) => {
      const target = e.target as Node;

      if (!menuRef.current?.contains(target)) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("pointerdown", close);

    return () => window.removeEventListener("pointerdown", close);
  }, [mobileOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setShowLogoutModal(false);
    setMobileOpen(false);

    router.push("/");
    router.refresh();
  };

  const navItems = user
    ? [
      { label: "Inicio", href: "/" },
      { label: "Precios", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ]
    : [];

  const username =
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "Usuario";

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/40 bg-white backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex h-20 items-center justify-between">

            {/* LOGO */}
            <Link
              href="/"
              className="text-xl sm:text-2xl font-black tracking-tight text-slate-900"
            >
              Smart<span className="text-blue-600">Recruiter</span>
            </Link>

            {/* DESKTOP */}
            <div className="hidden md:flex items-center gap-8">

              {user && (
                <ul className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-2 py-2 shadow-sm">
                  {navItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {user ? (
                <div className="flex items-center gap-3">

                  <div className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <span className="text-sm font-semibold text-slate-700">
                      Hola, {username}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Cerrar sesión
                  </button>

                </div>
              ) : (
                <div className="flex items-center gap-3">

                  <Link
                    href="/login"
                    className="rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
                  >
                    Crear cuenta
                  </Link>

                </div>
              )}
            </div>

            {/* MOBILE */}
            <div className="md:hidden relative" ref={menuRef}>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="h-0.5 w-5 bg-slate-700" />
                  <span className="h-0.5 w-5 bg-slate-700" />
                  <span className="h-0.5 w-5 bg-slate-700" />
                </div>
              </button>

              {mobileOpen && (
                <div className="absolute right-0 top-16 w-72 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl p-4 shadow-2xl">

                  {user ? (
                    <>
                      <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        Hola, {username}
                      </div>

                      <div className="flex flex-col gap-2 mb-4">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">

                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700"
                      >
                        Login
                      </Link>

                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white"
                      >
                        Crear cuenta
                      </Link>

                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mx-auto mb-4">
              <span className="text-2xl">🚪</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 text-center">
              ¿Cerrar sesión?
            </h3>

            <p className="mt-2 text-sm text-slate-500 text-center leading-relaxed">
              Vas a salir de tu cuenta actual y tendrás que volver a iniciar sesión.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleLogout}
                className="rounded-2xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
              >
                Sí, salir
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;