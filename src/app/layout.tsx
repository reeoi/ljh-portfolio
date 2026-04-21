import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300','400','500','600'],
  style: ['normal','italic'],
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: '陆继厚 · Lu Jihou | AI 美术工程师作品集',
  description:
    '陆继厚（南京邮电大学 · 动画 AIGC 方向）个人作品集：ComfyUI 工作流、动漫片段、分镜工具、Novi AI 创作平台。',
  keywords: ['陆继厚','Lu Jihou','AI 美术工程师','ComfyUI','AIGC 动画','Novi','作品集'],
  openGraph: {
    title: '陆继厚 · AI 美术工程师作品集',
    description: 'ComfyUI / 动漫 / 分镜工具 / Novi 平台',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="relative min-h-screen font-sans bg-paper-100 text-ink-800 selection:bg-terracotta-500/25 antialiased">
        {/* paper-grain overlay */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.35] bg-paper-grain" />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
