'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Cpu, Film, Palette,
  Code2, Sparkles, PenTool, Music, Video, Box,
} from 'lucide-react';
import { WORKS, SKILLS, HOME, PERSONAL } from '@/lib/content';

const featured = WORKS.slice(0, 6);

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Cpu, Film, Palette, Code2, Sparkles, PenTool, Music, Video, Box,
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4 mb-10 text-[11px] font-mono tracking-[0.25em] text-ink-500 uppercase">
            <span className="w-8 h-px bg-ink-400" />
            <span>作品集 · Portfolio 2026</span>
            <span className="ml-auto">{PERSONAL.location}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display italic text-[16vw] md:text-[13vw] leading-[0.92] tracking-[-0.03em] text-ink-900"
          >
            {PERSONAL.nameEn}
          </motion.h1>
          <p className="mt-3 font-mono text-[12px] tracking-[0.4em] text-ink-600 uppercase">
            {HOME.heroTitle} &nbsp;——&nbsp; {HOME.heroSubtitle}
          </p>

          <div className="mt-6 md:mt-10 grid md:grid-cols-12 gap-8 items-end">
            <p className="md:col-span-7 font-display text-[22px] md:text-[28px] leading-[1.35] text-ink-800 max-w-[32ch]">
              <span className="text-amber-600 italic">{PERSONAL.title}</span> ——{' '}
              {HOME.heroTagline}
            </p>
            <div className="md:col-span-5 md:text-right space-y-1 text-[13px] text-ink-600 font-mono tracking-wide">
              <p>{PERSONAL.major}</p>
              <p>{PERSONAL.gradYear} · 求 AI 美术 / 动画岗位</p>
              <p>
                <Link href="/contact" className="inline-flex items-center gap-1 border-b border-ink-400 hover:border-amber-600 hover:text-amber-700 transition pb-[1px]">
                  取得联系 <ArrowUpRight size={13} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-ink-200/70 px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-baseline justify-between mb-14 flex-wrap gap-4">
            <div>
              <span className="block font-mono text-[11px] tracking-[0.3em] text-ink-500 mb-3">01 / 我能做什么</span>
              <h2 className="font-display italic text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-ink-900">一览 <span className="text-ink-400">·</span> <span className="text-ink-500 not-italic font-mono text-[0.4em] tracking-[0.3em] align-middle">AT A GLANCE</span></h2>
            </div>
            <span className="font-mono text-[11px] tracking-[0.25em] text-ink-500 uppercase">(共 {HOME.services.length} 项核心服务)</span>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {HOME.services.map((s) => {
              const Icon = ICONS[s.icon] ?? Cpu;
              return (
                <div key={s.no} className="group border-t border-ink-900 pt-6">
                  <div className="flex items-start justify-between mb-10">
                    <span className="font-mono text-[11px] text-ink-500 tracking-widest">{s.no}</span>
                    <Icon size={18} className="text-ink-700 group-hover:text-amber-600 transition" strokeWidth={1.4} />
                  </div>
                  <h3 className="font-display text-2xl text-ink-900 mb-1">{s.zh}</h3>
                  <p className="font-mono text-[11px] tracking-widest text-ink-500 uppercase mb-4">— {s.title}</p>
                  <p className="text-[14px] text-ink-700 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SELECTED WORKS */}
      <section className="border-t border-ink-200/70 px-6 md:px-10 py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-baseline justify-between mb-14 flex-wrap gap-4">
            <div>
              <span className="block font-mono text-[11px] tracking-[0.3em] text-ink-500 mb-3">02 / 精选作品</span>
              <h2 className="font-display italic text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-ink-900">作品精选 <span className="text-ink-500 not-italic font-mono text-[0.4em] tracking-[0.3em] align-middle">SELECTED WORKS</span></h2>
            </div>
            <Link href="/works" className="font-mono text-[12px] tracking-[0.25em] text-ink-700 border-b border-ink-400 hover:border-amber-600 hover:text-amber-700 pb-[1px] transition">
              查看全部作品 &nbsp;→
            </Link>
          </div>

          <div className="grid md:grid-cols-12 gap-x-6 gap-y-14">
            {featured.map((w, i) => {
              const span = (i % 3 === 0) ? 'md:col-span-7' : 'md:col-span-5';
              const aspect = (i % 3 === 0) ? 'aspect-[5/4]' : 'aspect-[4/5]';
              return (
                <Link key={w.slug} href={`/works#${w.slug}`} className={`group ${span}`}>
                  <div className={`relative ${aspect} overflow-hidden bg-paper-200`}>
                    {w.type === 'image' ? (
                      <Image src={w.cover} alt={w.title} fill className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" sizes="(max-width:768px) 90vw, 50vw" />
                    ) : (
                      <video src={w.cover} muted loop playsInline autoPlay className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-ink-500 tracking-widest tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h3 className="font-display text-[20px] text-ink-900">{w.title}</h3>
                        <span className="font-mono text-[10px] text-ink-500 tracking-[0.25em] uppercase">— {w.category}</span>
                      </div>
                      <p className="text-[13px] text-ink-600 mt-1 line-clamp-1">{w.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="border-t border-ink-200/70 px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-baseline justify-between mb-14 flex-wrap gap-4">
            <div>
              <span className="block font-mono text-[11px] tracking-[0.3em] text-ink-500 mb-3">03 / 技能矩阵</span>
              <h2 className="font-display italic text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-ink-900">能做的事 <span className="text-ink-500 not-italic font-mono text-[0.4em] tracking-[0.3em] align-middle">CRAFT</span></h2>
            </div>
            <span className="font-mono text-[11px] tracking-[0.25em] text-ink-500 uppercase">(熟练度 / 100)</span>
          </div>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
            {SKILLS.map((s, i) => (
              <div key={s.name} className="border-t border-ink-200 pt-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-ink-500 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-[17px] text-ink-900">{s.name}</span>
                  </span>
                  <span className="font-mono text-[10px] text-ink-500 tabular-nums">{s.level}</span>
                </div>
                <div className="h-px bg-ink-200 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                    className="absolute left-0 top-0 h-full bg-amber-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-200/70 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="font-mono text-[11px] tracking-[0.25em] text-ink-500 uppercase mb-6">— {PERSONAL.gradYear} · 正在寻找机会</p>
          <h2 className="font-display italic text-[clamp(2.6rem,9vw,7rem)] leading-[0.95] text-ink-900 mb-6">
            {HOME.ctaTitle}
          </h2>
          <p className="font-serif text-[clamp(1rem,2vw,1.25rem)] text-ink-600 tracking-tight max-w-[44ch] mx-auto">
            {HOME.ctaDesc}
          </p>
          <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-ink-900 text-paper-50 text-sm hover:bg-terracotta-500 transition">
              联系我 <ArrowUpRight size={14}/>
            </Link>
            <Link href="/works" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-ink-900 text-ink-900 text-sm hover:bg-ink-900 hover:text-paper-50 transition">
              看看作品
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}