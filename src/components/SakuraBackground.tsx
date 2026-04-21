'use client';
/**
 * 原"樱花粒子"被替换为 editorial 级「纸质噪点 + 暖色光斑」背景。
 * 保留原组件名以免上游引用变动。
 */
export default function SakuraBackground() {
  // 用内联 SVG 产生极淡噪点（约 4% 透明度）—— 1KB 以内，无网络请求
  const noise =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
         <filter id="n">
           <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
           <feColorMatrix values="0 0 0 0 0.11  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.35 0"/>
         </filter>
         <rect width="100%" height="100%" filter="url(#n)"/>
       </svg>`
    );

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 基色 */}
      <div className="absolute inset-0 bg-paper-100" />
      {/* 两个暖色径向光斑 */}
      <div
        className="absolute -top-32 -left-32 w-[60vw] h-[60vw] rounded-full opacity-70 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(212,163,115,0.35), transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 -right-24 w-[55vw] h-[55vw] rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(178,94,75,0.22), transparent 70%)' }}
      />
      {/* 纸质噪点覆盖 */}
      <div
        className="absolute inset-0 opacity-[0.55] mix-blend-multiply"
        style={{ backgroundImage: `url("${noise}")`, backgroundSize: '240px 240px' }}
      />
      {/* 顶部非常淡的分隔渐变 */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-paper-50/80 to-transparent" />
    </div>
  );
}
