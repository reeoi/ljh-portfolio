import Link from 'next/link';
import {
  Calendar, MapPin, GraduationCap, Sparkles,
  Cpu, Film, Palette, Code2, Briefcase, Star, Award, Heart,
} from 'lucide-react';
import { ABOUT, PERSONAL } from '@/lib/content';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Calendar, MapPin, GraduationCap, Sparkles, Cpu, Film, Palette, Code2, Briefcase, Star, Award, Heart,
};

/** 极简 markdown 渲染：支持 **加粗** 与 *斜体* */
function renderInline(text: string): React.ReactNode[] {
  // 先处理 **bold**，再处理 *italic*
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={key++} className="text-ink-900 font-medium">{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={key++} className="italic text-amber-700">{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function AboutPage() {
  return (
    <div className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 text-[11px] font-mono tracking-[0.25em] text-ink-500 uppercase">
          <span className="w-8 h-px bg-ink-400" />
          <span>关于我 · ABOUT — {PERSONAL.name} / {PERSONAL.nameEn}</span>
        </div>
        <h1 className="font-display italic text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-[-0.02em] text-ink-900 mb-4">
          About.
        </h1>
        <p className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] text-ink-800 leading-tight mb-14">
          {ABOUT.subtitle}
        </p>

        {/* INTRO */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-start mb-28">
          <div className="md:col-span-5">
            <div className="relative aspect-square bg-paper-200 border border-ink-200/70 flex items-center justify-center overflow-hidden">
              <span className="font-display italic text-[180px] md:text-[220px] leading-none text-amber-700/90 select-none">陸</span>
              <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-[0.25em] text-ink-600 uppercase">— 签名</span>
              <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.25em] text-ink-600 uppercase">01 · 本人</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6 text-[16px] leading-[1.8] text-ink-800">
            {ABOUT.intro.map((p, i) => (
              <p key={i}>{renderInline(p)}</p>
            ))}
            <p className="font-mono text-[12px] tracking-wider text-ink-500 uppercase pt-4 border-t border-ink-200">
              {PERSONAL.location} &nbsp;·&nbsp; 正在寻找 {PERSONAL.gradYear} 全职机会
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mb-28">
          {ABOUT.stats.map((s, i) => (
            <div key={s.v} className="border-t border-ink-900 pt-5">
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-mono text-[11px] text-ink-500 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="font-display italic text-[clamp(2.5rem,5vw,4rem)] leading-none text-ink-900 mb-3">{s.k}</p>
              <p className="font-display text-[15px] text-ink-900">{s.v}</p>
              <p className="font-mono text-[10px] tracking-widest text-ink-500 uppercase mt-1">— {s.zh}</p>
            </div>
          ))}
        </div>

        {/* TIMELINE */}
        <section className="mb-28">
          <div className="flex items-baseline justify-between mb-14 flex-wrap gap-4">
            <div>
              <span className="block font-mono text-[11px] tracking-[0.3em] text-ink-500 mb-3">02 / 时间线</span>
              <h2 className="font-display italic text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-ink-900">这些年 <span className="text-ink-500 not-italic font-mono text-[0.4em] tracking-[0.3em] align-middle">TIMELINE</span></h2>
            </div>
            <span className="font-mono text-[11px] tracking-[0.25em] text-ink-500 uppercase">(时序 → 现在)</span>
          </div>

          <ol className="relative border-l border-ink-200 pl-8 md:pl-12 space-y-14">
            {ABOUT.timeline.map((t, i) => {
              const Icon = ICONS[t.icon] ?? Calendar;
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[37px] md:-left-[49px] top-1 w-2 h-2 rounded-full bg-amber-600 ring-4 ring-paper-50" />
                  <p className="font-mono text-[11px] tracking-[0.25em] text-ink-500 uppercase mb-2 flex items-center gap-2">
                    <Icon size={12} className="text-amber-700" strokeWidth={1.6} />
                    {t.year}
                  </p>
                  <h3 className="font-display text-[22px] md:text-[26px] text-ink-900 mb-2 leading-tight">{t.title}</h3>
                  <p className="text-[14px] text-ink-700 leading-relaxed max-w-[58ch]">{t.desc}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* PREFERRED DIRECTIONS */}
        <section className="border-t border-ink-200/70 pt-16 pb-8">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <p className="font-mono text-[11px] tracking-[0.25em] text-ink-500 uppercase mb-4">— 想做的方向 / PREFERRED</p>
              <h2 className="font-display italic text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] text-ink-900">喜欢的<br/>方向。</h2>
            </div>
            <ul className="md:col-span-7 space-y-0 divide-y divide-ink-200 border-y border-ink-200">
              {ABOUT.preferred.map((p, i) => (
                <li key={p} className="flex items-baseline gap-4 py-5">
                  <span className="font-mono text-[11px] text-ink-500 tabular-nums tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-[18px] md:text-[20px] text-ink-900 flex-1">{p}</span>
                  <span className="font-mono text-[10px] text-amber-700 tracking-widest uppercase">— 开放</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-14 text-center">
            <Link href="/contact" className="inline-flex items-baseline gap-2 font-display italic text-[28px] md:text-[36px] text-ink-900 underline decoration-amber-600 decoration-2 underline-offset-[0.14em] hover:text-amber-700 transition">
              聊聊吧 &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}