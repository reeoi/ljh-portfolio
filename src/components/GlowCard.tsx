'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Accent = 'sakura' | 'electric' | 'neon' | 'amber' | 'terracotta';
interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverLift?: boolean;
  accent?: Accent;
}

const ACCENT_BORDER: Record<Accent, string> = {
  sakura:     'group-hover:border-amber-500/40',
  electric:   'group-hover:border-amber-600/40',
  neon:       'group-hover:border-terracotta-500/40',
  amber:      'group-hover:border-amber-500/40',
  terracotta: 'group-hover:border-terracotta-500/40',
};

/**
 * Editorial paper card：米白背景 + 细线边 + hover 轻抬起，不再发光。
 * 保留组件名 GlowCard 以兼容现有引用。
 */
export default function GlowCard({ children, className = '', delay = 0, hoverLift = true, accent = 'amber' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
      whileHover={hoverLift ? { y: -3 } : undefined}
      className={`relative group rounded-2xl bg-paper-50/90 backdrop-blur-[2px] border border-hair ${ACCENT_BORDER[accent]} shadow-soft hover:shadow-card transition-all duration-500 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
