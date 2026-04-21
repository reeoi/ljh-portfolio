'use client';
import { useState } from 'react';
import { Mail, Phone, Github, Download, Copy, Check, ArrowUpRight } from 'lucide-react';

const CONTACTS = [
  { k: 'email',  label: '邮箱 / Email',  value: '1797209815@qq.com',         href: 'mailto:1797209815@qq.com', icon: Mail },
  { k: 'phone',  label: '电话 / Phone',  value: '+86 180 6878 2892',         href: 'tel:+8618068782892',       icon: Phone },
  { k: 'github', label: 'GitHub',       value: 'github.com/reeoi',          href: 'https://github.com/reeoi', icon: Github },
];

export default function ContactPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (v: string, k: string) => {
    navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 text-[11px] font-mono tracking-[0.25em] text-ink-500 uppercase">
          <span className="w-8 h-px bg-ink-400" />
          <span>联系 · CONTACT — 2026 届可接洽</span>
        </div>

        <h1 className="font-display italic text-[clamp(4rem,16vw,14rem)] leading-[0.88] tracking-[-0.03em] text-ink-900 mb-6">
          Say<br/>hello.
        </h1>
        <p className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-ink-800 leading-tight mb-10">
          你好，<em className="italic text-terracotta-500">很高兴</em>认识你。
        </p>

        <p className="max-w-[58ch] text-[16px] md:text-[17px] leading-[1.8] text-ink-700 mb-20">
          欢迎和我聊聊 —— 关于 <span className="text-amber-700">AIGC 工作流</span>、动画短片、
          Novi 平台，或 2026 届校招机会。<br/>
          邮件或电话我都看，一般 24 小时内回复。
        </p>

        {/* CONTACT LIST */}
        <ul className="divide-y divide-ink-200 border-y border-ink-200 mb-24">
          {CONTACTS.map((c, i) => (
            <li key={c.k} className="group grid grid-cols-12 items-center gap-4 py-6 md:py-8 transition hover:bg-paper-100">
              <span className="col-span-1 font-mono text-[11px] text-ink-500 tabular-nums tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="col-span-3 md:col-span-2 font-mono text-[11px] tracking-[0.25em] text-ink-500 uppercase">
                — {c.label}
              </span>
              <a href={c.href} target={c.k === 'github' ? '_blank' : undefined} rel="noreferrer"
                 className="col-span-8 md:col-span-7 font-display text-[20px] md:text-[28px] text-ink-900 hover:text-amber-700 transition truncate flex items-baseline gap-2">
                {c.value}
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition -translate-y-1" />
              </a>
              <button
                onClick={() => copy(c.value, c.k)}
                className="hidden md:flex col-span-2 justify-end items-center gap-1 font-mono text-[10px] tracking-[0.25em] uppercase text-ink-500 hover:text-amber-700 transition"
              >
                {copied === c.k ? (<><Check size={12} /> 已复制</>) : (<><Copy size={12} /> 复制</>)}
              </button>
            </li>
          ))}
        </ul>

        {/* RESUME + SOCIAL */}
        <div className="grid md:grid-cols-2 gap-10 mb-24">
          <a
            href="/downloads/简历.pdf"
            download
            className="group relative block border border-ink-200 hover:border-amber-600 transition p-10 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-16">
              <span className="font-mono text-[11px] text-ink-500 tracking-widest">01 · 简历 / RESUME</span>
              <Download size={18} className="text-ink-700 group-hover:text-amber-700 group-hover:-translate-y-1 transition" strokeWidth={1.4} />
            </div>
            <p className="font-display text-[26px] md:text-[32px] leading-tight text-ink-900 mb-2">下载我的简历</p>
            <p className="font-mono text-[11px] tracking-widest text-ink-500 uppercase">— 陆继厚 · PDF · 2026</p>
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-amber-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </a>

          <a
            href="https://novi.ljhwmm.top"
            target="_blank"
            rel="noreferrer"
            className="group relative block bg-ink-900 text-paper-50 p-10 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-16">
              <span className="font-mono text-[11px] text-paper-300 tracking-widest">02 · 上线产品 / LIVE</span>
              <ArrowUpRight size={18} className="text-paper-200 group-hover:text-amber-400 group-hover:-translate-y-1 group-hover:translate-x-1 transition" strokeWidth={1.4} />
            </div>
            <p className="font-display italic text-[28px] md:text-[36px] leading-tight mb-2">去看看 <span className="text-amber-400">Novi</span></p>
            <p className="font-mono text-[11px] tracking-widest text-paper-300 uppercase">— novi.ljhwmm.top</p>
          </a>
        </div>

        {/* TAILPIECE */}
        <div className="border-t border-ink-200 pt-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <p className="font-display italic text-[clamp(2rem,5vw,3.8rem)] leading-[1] text-ink-900 max-w-[14ch]">
            感谢你 <br/>看到这里。
          </p>
          <div className="font-mono text-[11px] tracking-[0.2em] text-ink-500 uppercase space-y-1 md:text-right">
            <p>南京 · 中国</p>
            <p>作品集 v2 · 2026</p>
            <p className="text-amber-700">正在寻找机会</p>
          </div>
        </div>
      </div>
    </div>
  );
}