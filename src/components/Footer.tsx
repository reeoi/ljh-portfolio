'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, ExternalLink, FileDown, Github } from 'lucide-react';
import { PERSONAL } from '@/lib/content';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/edit')) return null;
  const telHref = `tel:${PERSONAL.phone.replace(/\s+/g, '')}`;
  return (
    <footer className="mt-32 border-t border-hair bg-paper-50/60">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* 大标题区 */}
          <div className="lg:col-span-7">
            <div className="font-mono text-[10px] tracking-[0.24em] text-ink-500 mb-4">/ 聊聊合作 — GET IN TOUCH · 05</div>
            <h2 className="font-serif font-light text-5xl sm:text-6xl lg:text-7xl tracking-tighter2 text-ink-900 leading-[0.95] mb-4">
              做点<em className="italic text-terracotta-500"> 值得留下 </em>的东西。
            </h2>
            <p className="font-serif italic text-ink-500 text-2xl sm:text-3xl tracking-tight">
              Let&rsquo;s make something worth keeping.
            </p>
          </div>

          {/* 联系列 */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-8 text-sm">
            <div>
              <div className="font-mono text-[10px] tracking-[0.24em] text-ink-500 mb-3">联系方式 · CONTACT</div>
              <ul className="space-y-2.5 text-ink-700">
                <li>
                  <a href={`mailto:${PERSONAL.email}`} className="inline-flex items-center gap-2 link-underline">
                    <Mail size={14} /> {PERSONAL.email}
                  </a>
                </li>
                <li>
                  <a href={telHref} className="inline-flex items-center gap-2 link-underline">
                    <Phone size={14} /> {PERSONAL.phone}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.24em] text-ink-500 mb-3">其他链接 · ELSEWHERE</div>
              <ul className="space-y-2.5 text-ink-700">
                {PERSONAL.noviUrl ? (
                  <li>
                    <a href={PERSONAL.noviUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 link-underline">
                      <ExternalLink size={14} /> Novi · 小说创作平台
                    </a>
                  </li>
                ) : null}
                {PERSONAL.githubUrl ? (
                  <li>
                    <a href={PERSONAL.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 link-underline">
                      <Github size={14} /> GitHub · @{PERSONAL.github}
                    </a>
                  </li>
                ) : null}
                {PERSONAL.resumeUrl ? (
                  <li>
                    <Link href={PERSONAL.resumeUrl} target="_blank" className="inline-flex items-center gap-2 link-underline">
                      <FileDown size={14} /> 下载简历 PDF
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-hair flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono tracking-[0.2em] text-ink-500">
          <span>© {new Date().getFullYear()} {PERSONAL.name} · {PERSONAL.nameEn}</span>
          <span>{PERSONAL.location} · 动画与 AIGC</span>
          <span className="text-ink-400">本站由 Next.js · Tailwind 构建</span>
        </div>
      </div>
    </footer>
  );
}
