'use client';

import { useEffect, useState } from 'react';

/* /edit — 单页管理后台 */
type AnyObj = Record<string, unknown>;
interface Work {
  slug: string; title: string; description: string;
  category: string; type: 'image' | 'video' | 'exe';
  cover: string; tags: string[];
  liveUrl?: string; downloadUrl?: string;
}
interface Skill { name: string; level: number; color: 'sakura' | 'electric' | 'neon'; }

export default function EditPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pwd, setPwd] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [data, setData] = useState<AnyObj | null>(null);
  const [rawJson, setRawJson] = useState('');

  const [tab, setTab] = useState<'personal' | 'home' | 'about' | 'skills' | 'works' | 'raw'>('works');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [pushGithub, setPushGithub] = useState(true);
  const [commitMsg, setCommitMsg] = useState('');
  const [githubConfigured, setGithubConfigured] = useState(false);

  async function loadContent() {
    const r = await fetch('/api/content', { cache: 'no-store' });
    if (r.status === 401) { setAuthed(false); setLoading(false); return; }
    const j = await r.json();
    if (j.ok) {
      setData(j.data);
      setRawJson(JSON.stringify(j.data, null, 2));
      setGithubConfigured(!!j.githubConfigured);
      setAuthed(true);
    }
    setLoading(false);
  }
  useEffect(() => { loadContent(); }, []);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault(); setLoginErr('');
    const r = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });
    if (r.ok) { setPwd(''); loadContent(); }
    else {
      const j = await r.json().catch(() => ({}));
      setLoginErr(j.error || '登录失败');
    }
  }
  async function doLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setAuthed(false); setData(null);
  }

  async function doSave() {
    if (!data) return;
    let payload: AnyObj = data;
    if (tab === 'raw') {
      try { payload = JSON.parse(rawJson); }
      catch (e) { setSaveMsg('❌ JSON 解析失败: ' + (e as Error).message); return; }
    }
    setSaving(true); setSaveMsg('保存中…');
    const r = await fetch('/api/content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload, message: commitMsg || undefined, pushToGithub: pushGithub }),
    });
    const j = await r.json();
    setSaving(false);
    if (!j.ok) { setSaveMsg('❌ ' + (j.error || '保存失败')); return; }
    setData(payload);
    setRawJson(JSON.stringify(payload, null, 2));
    const parts = ['✅ 本地已保存'];
    if (j.github?.pushed) parts.push(`已推送 GitHub (${String(j.github.sha || '').slice(0, 7)})`);
    else if (j.github?.error) parts.push(`GitHub 推送失败: ${j.github.error}`);
    else if (!githubConfigured) parts.push('(未配置 GITHUB_PAT)');
    setSaveMsg(parts.join(' · '));
  }

  if (loading) return <Center><p className="text-ink-500">Loading…</p></Center>;

  if (!authed) {
    return (
      <Center>
        <form onSubmit={doLogin} className="w-[360px] bg-paper-100 border border-ink-200 rounded-xl p-8 shadow-sm">
          <h1 className="font-display text-[28px] text-ink-900 mb-2">编辑器登录</h1>
          <p className="text-sm text-ink-500 mb-6">输入管理密码以编辑站点内容。</p>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="密码" autoFocus
                 className="w-full px-4 py-3 rounded-lg border border-ink-200 bg-paper-50 text-ink-900 mb-3 focus:outline-none focus:border-amber-600" />
          {loginErr && <p className="text-sm text-red-600 mb-3">{loginErr}</p>}
          <button type="submit" className="w-full py-3 rounded-lg bg-ink-900 text-paper-50 font-medium hover:bg-ink-800 transition">登录</button>
        </form>
      </Center>
    );
  }

  if (!data) return <Center><p>无数据</p></Center>;

  return (
    <div className="min-h-screen bg-paper-100 text-ink-800">
      <header className="sticky top-0 z-20 border-b border-ink-300 bg-paper-50/95 backdrop-blur">
        {/* 第一行：品牌 + 全局操作 */}
        <div className="max-w-[1400px] mx-auto px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <span className="font-display italic text-[22px] text-ink-900">LJH · 编辑器</span>
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-ink-700">
              <input type="checkbox" checked={pushGithub} disabled={!githubConfigured}
                     onChange={(e) => setPushGithub(e.target.checked)} />
              推送 GitHub{!githubConfigured && ' (未配置)'}
            </label>
            <input placeholder="commit 说明（可选）" value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)}
                   className="w-56 px-3 py-1.5 rounded border border-ink-300 bg-paper-100 text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-amber-500" />
            <button onClick={doSave} disabled={saving}
                    className="px-4 py-1.5 rounded bg-amber-500 text-paper-100 font-medium hover:bg-amber-400 disabled:opacity-50">
              {saving ? '保存中…' : '保存'}
            </button>
            <button onClick={doLogout} className="px-3 py-1.5 rounded border border-ink-300 text-ink-700 hover:bg-paper-200">登出</button>
          </div>
        </div>
        {/* 第二行：分栏 tabs（可横向滚动，避免重合） */}
        <div className="max-w-[1400px] mx-auto px-6 border-t border-ink-300/60">
          <nav className="flex gap-1 text-sm overflow-x-auto py-2 scrollbar-thin">
            {(['works', 'personal', 'home', 'about', 'skills', 'raw'] as const).map(k => (
              <button key={k} onClick={() => setTab(k)}
                      className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${tab === k ? 'bg-amber-500 text-paper-100' : 'text-ink-700 hover:bg-paper-200'}`}>
                {labelOf(k)}
              </button>
            ))}
          </nav>
        </div>
        {saveMsg && <div className="max-w-[1400px] mx-auto px-6 pb-2 text-[13px] text-ink-600">{saveMsg}</div>}
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {tab === 'personal' && <PersonalEditor data={data} onChange={setData} />}
        {tab === 'home'     && <HomeEditor     data={data} onChange={setData} />}
        {tab === 'about'    && <AboutEditor    data={data} onChange={setData} />}
        {tab === 'skills'   && <SkillsEditor   data={data} onChange={setData} />}
        {tab === 'works'    && <WorksEditor    data={data} onChange={setData} />}
        {tab === 'raw'      && <RawEditor      raw={rawJson} setRaw={setRawJson} />}
      </main>
    </div>
  );
}

/* ---------- 通用 ---------- */
function Center({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper-50 flex items-center justify-center">{children}</div>;
}
function labelOf(k: string) {
  return ({ personal: '个人信息', home: '首页', about: '关于', skills: '技能', works: '作品', raw: 'JSON' } as Record<string, string>)[k] || k;
}
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-[24px] mb-1">{title}</h2>
      {desc && <p className="text-sm text-ink-500 mb-4">{desc}</p>}
      <div className="bg-paper-100 border border-ink-200 rounded-xl p-6">{children}</div>
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <div className="text-[12px] uppercase tracking-wider text-ink-500 mb-1">{label}</div>
      {children}
    </label>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input {...rest} className={`w-full px-3 py-2 rounded border border-ink-200 bg-paper-50 focus:outline-none focus:border-amber-600 ${className || ''}`} />;
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea {...rest} className={`w-full px-3 py-2 rounded border border-ink-200 bg-paper-50 focus:outline-none focus:border-amber-600 font-mono text-[13px] ${className || ''}`} />;
}

/* ---------- 个人信息 ---------- */
function PersonalEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const p = (data.personal || {}) as AnyObj;
  const set = (k: string, v: unknown) => onChange({ ...data, personal: { ...p, [k]: v } });
  const fields: [string, string][] = [
    ['name', '姓名'], ['nameEn', '英文名'],
    ['title', '头衔'], ['major', '专业'], ['gradYear', '毕业年份'],
    ['location', '所在地'],
    ['email', '邮箱'], ['phone', '电话'],
    ['github', 'GitHub 用户名'], ['githubUrl', 'GitHub URL'],
    ['resumeUrl', '简历 URL'], ['noviUrl', 'Novi URL'], ['siteUrl', '主站 URL'],
  ];
  return (
    <Section title="个人信息" desc="影响页脚、联系方式、关于页等全站。">
      <div className="grid grid-cols-2 gap-x-6">
        {fields.map(([k, lb]) => (
          <Field key={k} label={lb}>
            <Input value={String(p[k] ?? '')} onChange={(e) => set(k, e.target.value)} />
          </Field>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 首页 ---------- */
function HomeEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const h = (data.home || {}) as AnyObj;
  const set = (k: string, v: unknown) => onChange({ ...data, home: { ...h, [k]: v } });
  const services = (h.services as AnyObj[]) || [];
  const upd = (i: number, k: string, v: string) => {
    const arr = [...services]; arr[i] = { ...arr[i], [k]: v }; set('services', arr);
  };
  return (
    <>
      <Section title="首页 Hero">
        <Field label="主标题"><Input value={String(h.heroTitle ?? '')} onChange={(e) => set('heroTitle', e.target.value)} /></Field>
        <Field label="副标题"><Input value={String(h.heroSubtitle ?? '')} onChange={(e) => set('heroSubtitle', e.target.value)} /></Field>
        <Field label="Tagline"><TextArea rows={2} value={String(h.heroTagline ?? '')} onChange={(e) => set('heroTagline', e.target.value)} /></Field>
      </Section>
      <Section title="服务卡片" desc="首页中部 3 张能力卡片。">
        {services.map((s, i) => (
          <div key={i} className="grid grid-cols-[80px_140px_1fr_1fr_2fr] gap-2 mb-3 pb-3 border-b border-ink-200 last:border-0 last:pb-0">
            <Input value={String(s.no ?? '')}    onChange={(e) => upd(i, 'no', e.target.value)}    placeholder="01" />
            <Input value={String(s.icon ?? '')}  onChange={(e) => upd(i, 'icon', e.target.value)}  placeholder="icon (Cpu)" />
            <Input value={String(s.title ?? '')} onChange={(e) => upd(i, 'title', e.target.value)} placeholder="英文标题" />
            <Input value={String(s.zh ?? '')}    onChange={(e) => upd(i, 'zh', e.target.value)}    placeholder="中文子标" />
            <Input value={String(s.desc ?? '')}  onChange={(e) => upd(i, 'desc', e.target.value)}  placeholder="描述" />
          </div>
        ))}
      </Section>
      <Section title="CTA">
        <Field label="标题"><Input value={String(h.ctaTitle ?? '')} onChange={(e) => set('ctaTitle', e.target.value)} /></Field>
        <Field label="描述"><TextArea rows={2} value={String(h.ctaDesc ?? '')} onChange={(e) => set('ctaDesc', e.target.value)} /></Field>
      </Section>
    </>
  );
}

/* ---------- 关于 ---------- */
function AboutEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const a = (data.about || {}) as AnyObj;
  const set = (k: string, v: unknown) => onChange({ ...data, about: { ...a, [k]: v } });
  const intro = (a.intro as string[]) || [];
  const stats = (a.stats as AnyObj[]) || [];
  const tl    = (a.timeline as AnyObj[]) || [];
  const pref  = (a.preferred as string[]) || [];
  return (
    <>
      <Section title="副标题 & 介绍段落">
        <Field label="副标题"><Input value={String(a.subtitle ?? '')} onChange={(e) => set('subtitle', e.target.value)} /></Field>
        {intro.map((p, i) => (
          <Field key={i} label={`段落 ${i + 1}（支持 **粗体**、*斜体*）`}>
            <TextArea rows={3} value={p} onChange={(e) => { const arr = [...intro]; arr[i] = e.target.value; set('intro', arr); }} />
          </Field>
        ))}
        <div className="flex gap-2 mt-2">
          <button onClick={() => set('intro', [...intro, ''])} className="px-3 py-1 text-sm rounded border border-ink-200 hover:bg-paper-200">+ 段落</button>
          {intro.length > 0 && <button onClick={() => set('intro', intro.slice(0, -1))} className="px-3 py-1 text-sm rounded border border-ink-200 hover:bg-paper-200">- 删末段</button>}
        </div>
      </Section>
      <Section title="数字名片">
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 mb-3">
            <Input value={String(s.k ?? '')}  onChange={(e) => { const arr = [...stats]; arr[i] = { ...s, k: e.target.value };  set('stats', arr); }} placeholder="数字 4+" />
            <Input value={String(s.v ?? '')}  onChange={(e) => { const arr = [...stats]; arr[i] = { ...s, v: e.target.value };  set('stats', arr); }} placeholder="英文" />
            <Input value={String(s.zh ?? '')} onChange={(e) => { const arr = [...stats]; arr[i] = { ...s, zh: e.target.value }; set('stats', arr); }} placeholder="中文" />
          </div>
        ))}
      </Section>
      <Section title="时间线">
        {tl.map((t, i) => (
          <div key={i} className="grid grid-cols-[130px_220px_1fr_130px_40px] gap-2 mb-3 items-start">
            <Input value={String(t.year ?? '')}  onChange={(e) => { const arr = [...tl]; arr[i] = { ...t, year: e.target.value };  set('timeline', arr); }} placeholder="年份" />
            <Input value={String(t.title ?? '')} onChange={(e) => { const arr = [...tl]; arr[i] = { ...t, title: e.target.value }; set('timeline', arr); }} placeholder="标题" />
            <TextArea rows={2} value={String(t.desc ?? '')} onChange={(e) => { const arr = [...tl]; arr[i] = { ...t, desc: e.target.value }; set('timeline', arr); }} placeholder="描述" />
            <Input value={String(t.icon ?? '')}  onChange={(e) => { const arr = [...tl]; arr[i] = { ...t, icon: e.target.value };  set('timeline', arr); }} placeholder="icon" />
            <button onClick={() => set('timeline', tl.filter((_, j) => j !== i))} className="h-9 rounded border border-ink-200 hover:bg-red-50 hover:text-red-600">✕</button>
          </div>
        ))}
        <button onClick={() => set('timeline', [...tl, { year: '', title: '', desc: '', icon: 'Sparkles' }])}
                className="px-3 py-1 text-sm rounded border border-ink-200 hover:bg-paper-200">+ 添加时间节点</button>
      </Section>
      <Section title="偏好方向">
        {pref.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={p} onChange={(e) => { const arr = [...pref]; arr[i] = e.target.value; set('preferred', arr); }} />
            <button onClick={() => set('preferred', pref.filter((_, j) => j !== i))} className="px-3 rounded border border-ink-200 hover:bg-red-50 hover:text-red-600">✕</button>
          </div>
        ))}
        <button onClick={() => set('preferred', [...pref, ''])} className="px-3 py-1 text-sm rounded border border-ink-200 hover:bg-paper-200">+ 添加</button>
      </Section>
    </>
  );
}

/* ---------- 技能 ---------- */
function SkillsEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const skills = (data.skills as Skill[]) || [];
  const set = (arr: Skill[]) => onChange({ ...data, skills: arr });
  return (
    <Section title="技能条" desc="level 0-100，颜色三选一。">
      {skills.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr_100px_180px_40px] gap-3 mb-3 items-center">
          <Input value={s.name} onChange={(e) => { const a = [...skills]; a[i] = { ...s, name: e.target.value }; set(a); }} placeholder="技能名" />
          <Input type="number" min={0} max={100} value={s.level}
                 onChange={(e) => { const a = [...skills]; a[i] = { ...s, level: Number(e.target.value) }; set(a); }} />
          <select value={s.color}
                  onChange={(e) => { const a = [...skills]; a[i] = { ...s, color: e.target.value as Skill['color'] }; set(a); }}
                  className="px-3 py-2 rounded border border-ink-200 bg-paper-50">
            <option value="sakura">sakura (琥珀)</option>
            <option value="electric">electric (砖红)</option>
            <option value="neon">neon (墨绿)</option>
          </select>
          <button onClick={() => set(skills.filter((_, j) => j !== i))}
                  className="h-9 rounded border border-ink-200 hover:bg-red-50 hover:text-red-600">✕</button>
        </div>
      ))}
      <button onClick={() => set([...skills, { name: '新技能', level: 70, color: 'electric' }])}
              className="px-3 py-1 text-sm rounded border border-ink-200 hover:bg-paper-200">+ 添加技能</button>
    </Section>
  );
}/* ---------- 作品（最复杂） ---------- */
function WorksEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const works = (data.works as Work[]) || [];
  const categories = (data.categories as string[]) || [];
  const set = (arr: Work[]) => onChange({ ...data, works: arr });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const upd = (i: number, patch: Partial<Work>) => {
    const arr = [...works]; arr[i] = { ...arr[i], ...patch }; set(arr);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= works.length) return;
    const arr = [...works]; [arr[i], arr[j]] = [arr[j], arr[i]]; set(arr);
    if (openIdx === i) setOpenIdx(j); else if (openIdx === j) setOpenIdx(i);
  };
  const del = (i: number) => {
    if (!confirm(`删除「${works[i].title}」？`)) return;
    set(works.filter((_, j) => j !== i));
    if (openIdx === i) setOpenIdx(null);
  };
  const add = () => {
    const newW: Work = {
      slug: 'work-' + Date.now(),
      title: '新作品',
      description: '',
      category: categories[0] || '3D',
      type: 'image',
      cover: '',
      tags: [],
    };
    set([newW, ...works]);
    setOpenIdx(0);
  };

  /* 分类管理 */
  const catSet = (arr: string[]) => onChange({ ...data, categories: arr });

  return (
    <>
      <Section title="分类标签" desc="这些分类将作为作品筛选按钮出现。">
        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <div key={i} className="flex items-center gap-1 bg-paper-50 border border-ink-200 rounded px-2 py-1">
              <input value={c} onChange={(e) => {
                const arr = [...categories]; arr[i] = e.target.value; catSet(arr);
              }} className="bg-transparent outline-none w-32 text-sm" />
              <button onClick={() => catSet(categories.filter((_, j) => j !== i))}
                      className="text-ink-400 hover:text-red-600">✕</button>
            </div>
          ))}
          <button onClick={() => catSet([...categories, '新分类'])}
                  className="px-3 py-1 text-sm rounded border border-dashed border-ink-300 hover:bg-paper-200">+ 分类</button>
        </div>
      </Section>

      <Section title={`作品列表（共 ${works.length} 件）`} desc="点击展开编辑，支持上下排序。">
        <button onClick={add} className="mb-4 px-4 py-2 rounded bg-ink-900 text-paper-50 text-sm hover:bg-ink-800">
          + 添加作品（插入到顶部）
        </button>

        <div className="space-y-2">
          {works.map((w, i) => (
            <div key={w.slug + i} className="border border-ink-200 rounded-lg bg-paper-50 overflow-hidden">
              {/* 行头 */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-16 h-12 bg-paper-200 rounded overflow-hidden flex-shrink-0">
                  {w.cover && <img src={w.cover} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="font-medium truncate">{w.title || <em className="text-ink-400">(未命名)</em>}</span>
                    <span className="text-ink-400">·</span>
                    <span className="text-ink-500">{w.category}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-paper-200 text-ink-600 uppercase">{w.type}</span>
                  </div>
                  <div className="text-[11px] text-ink-400 truncate">slug: {w.slug}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0}
                          className="w-8 h-8 rounded hover:bg-paper-200 disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === works.length - 1}
                          className="w-8 h-8 rounded hover:bg-paper-200 disabled:opacity-30">↓</button>
                  <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                          className="px-3 h-8 rounded border border-ink-200 hover:bg-paper-200 text-sm">
                    {openIdx === i ? '收起' : '编辑'}
                  </button>
                  <button onClick={() => del(i)}
                          className="w-8 h-8 rounded hover:bg-red-50 hover:text-red-600">✕</button>
                </div>
              </div>
              {/* 展开编辑 */}
              {openIdx === i && (
                <div className="px-4 py-4 border-t border-ink-200 bg-paper-100">
                  <div className="grid grid-cols-2 gap-x-4">
                    <Field label="标题"><Input value={w.title} onChange={(e) => upd(i, { title: e.target.value })} /></Field>
                    <Field label="Slug（URL 路径片段，需唯一）">
                      <Input value={w.slug} onChange={(e) => upd(i, { slug: e.target.value })} />
                    </Field>
                    <Field label="分类">
                      <select value={w.category} onChange={(e) => upd(i, { category: e.target.value })}
                              className="w-full px-3 py-2 rounded border border-ink-200 bg-paper-50">
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="类型">
                      <select value={w.type} onChange={(e) => upd(i, { type: e.target.value as Work['type'] })}
                              className="w-full px-3 py-2 rounded border border-ink-200 bg-paper-50">
                        <option value="image">image（图片）</option>
                        <option value="video">video（视频）</option>
                        <option value="exe">exe（游戏/程序）</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="封面路径（/images/... 或完整 URL）">
                    <div className="flex gap-3">
                      <Input value={w.cover} onChange={(e) => upd(i, { cover: e.target.value })} placeholder="/images/xxx/cover.png" />
                      {w.cover && (
                        <div className="w-24 h-16 bg-paper-200 rounded overflow-hidden flex-shrink-0">
                          <img src={w.cover} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </Field>
                  <Field label="描述">
                    <TextArea rows={3} value={w.description} onChange={(e) => upd(i, { description: e.target.value })} />
                  </Field>
                  <Field label="标签（英文逗号分隔）">
                    <Input value={(w.tags || []).join(', ')}
                           onChange={(e) => upd(i, { tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                           placeholder="3D, Modeling, Substance" />
                  </Field>
                  <div className="grid grid-cols-2 gap-x-4">
                    <Field label="Live URL（视频/在线演示，可空）">
                      <Input value={w.liveUrl || ''} onChange={(e) => upd(i, { liveUrl: e.target.value || undefined })}
                             placeholder="/videos/xxx.mp4" />
                    </Field>
                    <Field label="Download URL（exe/下载，可空）">
                      <Input value={w.downloadUrl || ''} onChange={(e) => upd(i, { downloadUrl: e.target.value || undefined })}
                             placeholder="/downloads/xxx.zip" />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ---------- 原始 JSON ---------- */
function RawEditor({ raw, setRaw }: { raw: string; setRaw: (s: string) => void }) {
  return (
    <Section title="原始 JSON" desc="高级模式：直接编辑整个 site.json。保存时若解析失败会回滚。">
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        spellCheck={false}
        className="w-full h-[70vh] px-4 py-3 rounded border border-ink-200 bg-paper-50 font-mono text-[13px] leading-relaxed focus:outline-none focus:border-amber-600"
      />
    </Section>
  );
}