'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV = [
  { href: '/',        label: '首页',   en: 'Index',   no: '01' },
  { href: '/works',   label: '作品',   en: 'Works',   no: '02' },
  { href: '/about',   label: '关于',   en: 'About',   no: '03' },
  { href: '/contact', label: '联系',   en: 'Contact', no: '04' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-paper-50/85 backdrop-blur-md border-b border-hair' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-full border border-ink-800/80 text-ink-900 font-serif italic">
            陸
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-serif text-[15px] text-ink-900 tracking-tight">Lu&nbsp;Jihou</span>
            <span className="font-mono text-[10px] text-ink-500 tracking-[0.18em] mt-0.5">陆 继 厚 · 2026</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => {
            const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="group flex items-baseline gap-2 text-sm"
              >
                <span className="font-mono text-[10px] text-ink-400">{n.no}</span>
                <span
                  className={`link-underline pb-0.5 transition-colors font-serif text-[15px] tracking-tight ${
                    active ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {n.label}
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-ink-400 uppercase">
                  {n.en}
                </span>
              </Link>
            );
          })}
          <Link
            href="/downloads/简历.pdf"
            target="_blank"
            className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink-900 text-ink-900 text-xs tracking-widest hover:bg-ink-900 hover:text-paper-50 transition-colors"
          >
            下载简历
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="菜单"
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-full border border-hair text-ink-800"
        >
          {open ? <X size={16}/> : <Menu size={16}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-paper-50/95 backdrop-blur-md border-t border-hair">
          <ul className="px-6 py-3">
            {NAV.map((n) => {
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
              return (
                <li key={n.href} className="border-b border-hair/80 last:border-b-0">
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-3 py-4 ${
                      active ? 'text-ink-900' : 'text-ink-600'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-ink-400">{n.no}</span>
                    <span className="font-serif text-2xl tracking-tight">{n.label}</span>
                    <span className="ml-auto font-mono text-[10px] tracking-[0.2em] text-ink-500 uppercase">{n.en}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
