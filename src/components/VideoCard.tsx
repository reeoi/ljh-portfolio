'use client';
import { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export default function VideoCard({ src, title, description, tags, index }: {
  src: string; title: string; description: string; tags: string[]; index?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-200 border border-ink-200/70">
        <video
          ref={ref}
          src={src}
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          loop
          muted
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
        />
        <button
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center bg-ink-900/0 hover:bg-ink-900/10 transition"
          aria-label={playing ? 'pause' : 'play'}
        >
          <span className="w-14 h-14 rounded-full border border-paper-50 text-paper-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm bg-ink-900/30">
            {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
          </span>
        </button>
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] text-paper-50 mix-blend-difference">
          VIDEO
        </span>
      </div>
      <div className="pt-4 flex items-baseline gap-4">
        {index !== undefined && (
          <span className="font-mono text-[11px] text-ink-500 tracking-widest tabular-nums">
            {String(index).padStart(2, '0')}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[17px] text-ink-900 leading-snug">{title}</h3>
          <p className="text-[13px] text-ink-600 leading-relaxed mt-1 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {tags.map((t) => (
              <span key={t} className="font-mono text-[10px] text-ink-500 tracking-wider uppercase">
                · {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}