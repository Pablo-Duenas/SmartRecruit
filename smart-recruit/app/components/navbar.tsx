"use client";

import React, { useEffect, useRef, useState } from 'react'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const items = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Enterprise', href: '#enterprise' },
  ];

  const auth = [
    { label: 'Login', href: '#login', variant: 'ghost' as const },
    { label: 'Sign Up', href: '#signup', variant: 'primary' as const },
  ];

  const activeHref = '#features';

  return (
    <nav className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="relative flex h-16 items-center justify-between gap-4">
          <a href="/" className="text-lg font-semibold whitespace-nowrap">
            SmartRecruiter
          </a>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
               {items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={
                      item.href === activeHref
                        ? 'text-blue-600 underline underline-offset-8 decoration-2 font-medium'
                        : 'text-slate-500 hover:text-slate-900 transition-colors'
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))} 
            </ul>

            <div className="flex items-center gap-3">
              {auth.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className={
                    a.variant === 'primary'
                      ? 'inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 outline-blue-300 outline-offset-2'
                      : 'inline-flex items-center justify-center rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50'
                  }
                >
                  {a.label}
                </a>
              ))}
            </div>
          </div>

          <div className="md:hidden" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            </button>

            {mobileOpen && (
              <div id="mobile-nav" className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-4">
                  <ul className="flex flex-col gap-3">
                    {items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={
                            item.href === activeHref
                              ? 'block rounded-md px-3 py-2 text-blue-600 font-medium'
                              : 'block rounded-md px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }
                        >
                          {item.label}
                        </a>
                      </li>
                    ))} 
                  </ul>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {auth.map((a) => (
                      <a
                        key={a.href}
                        href={a.href}
                        onClick={() => setMobileOpen(false)}
                        className={
                          a.variant === 'primary'
                            ? 'inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 outline-2 outline-dashed outline-blue-300 outline-offset-2'
                            : 'inline-flex items-center justify-center rounded-md border border-dashed border-blue-400 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50'
                        }
                      >
                        {a.label}
                      </a>
                    ))}
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