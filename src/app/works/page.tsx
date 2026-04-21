'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import { WORKS, CATEGORIES, Work } from '@/data/works';

export default function WorksPage() {
  const [filter, setFilter] = useState<string>('全部');
  const list = useMemo(
    () => (filter === '全部' ? WORKS : WORKS.filter((w) => w.category === filter)),
    [filter]
  );

  return (
    <div className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 text-[11px] font-mono tracking-[0.25em] text-ink-500 uppercase">
          <span className="w-8 h-px bg-ink-400" />
          <span>作品索引 · INDEX — {String(list.length).padStart(3, '0')} 项</span>
        </div>
        <h1 className="font-display italic text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-[-0.02em] text-ink-900 mb-4">
          Works.
        </h1>
        <p className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] text-ink-800 leading-tight mb-8">
          全部<em className="italic text-terracotta-500"> 作品 </em>一览
        </p>
        <p className="max-w-[52ch] text-[15px] text-ink-700 leading-relaxed mb-14">
          涵盖 <b className="text-ink-900">ComfyUI 工作流</b>、<b className="text-ink-900">动漫短片</b>、<b className="text-ink-900">分镜辅助工具</b>、<b className="text-ink-900">Novi 创作平台</b> 四个方向。按时间顺序排列，视频卡片可悬停预览、点击播放。使用下方分类可筛选。
        </p>

        {/* FILTER */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-16 border-y border-ink-200 py-4">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`group flex items-baseline gap-2 font-mono text-[11px] tracking-[0.2em] uppercase transition ${
                filter === c ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800'
              }`}
            >
              <span className="tabular-nums">{String(i).padStart(2, '0')}</span>
              <span className="relative">
                {c}
                {filter === c && (
                  <motion.span layoutId="filterbar" className="absolute left-0 right-0 -bottom-[5px] h-px bg-amber-600" />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* GRID */}
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {list.map((w, i) => (
              <motion.div
                key={w.slug}
                id={w.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 }}
              >
                <WorkItem work={w} index={i + 1} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function WorkItem({ work, index }: { work: Work; index: number }) {
  if (work.type === 'video') {
    return <VideoCard src={work.cover} title={work.title} description={work.description} tags={work.tags} index={index} />;
  }

  const isExe = work.type === 'exe';
  return (
    <article className="group">
      <div className={`relative overflow-hidden bg-paper-200 border border-ink-200/70 ${isExe ? 'aspect-video' : 'aspect-[4/5]'}`}>
        <Image
          src={work.cover}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          sizes="(max-width:768px) 90vw, 400px"
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] text-ink-900 bg-paper-50/85 backdrop-blur-sm px-2 py-[3px] uppercase">
          {isExe ? '桌面应用 · EXE' : work.category === 'Novi 平台' ? '平台产品' : '工作流'}
        </span>
      </div>
      <div className="pt-4 flex items-baseline gap-4">
        <span className="font-mono text-[11px] text-ink-500 tracking-widest tabular-nums">{String(index).padStart(2, '0')}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="font-display text-[18px] text-ink-900">{work.title}</h3>
            <span className="font-mono text-[10px] text-ink-500 tracking-[0.25em] uppercase">— {work.category}</span>
          </div>
          <p className="text-[13px] text-ink-600 leading-relaxed mt-1 line-clamp-2">{work.description}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {work.tags.map((t) => (
              <span key={t} className="font-mono text-[10px] text-ink-500 tracking-wider uppercase">· {t}</span>
            ))}
          </div>
          {isExe && work.downloadUrl && (
            <a href={work.downloadUrl} target="_blank" rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] uppercase text-ink-900 border-b border-ink-400 hover:border-amber-600 hover:text-amber-700 pb-[1px] transition">
              下载 · Download <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}