import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readLocal, writeLocal, commitToGithub, githubConfigured } from '@/lib/github';

// Always run on Node.js runtime (fs + octokit)
export const runtime = 'nodejs';
// No caching: editor should always see freshest data
export const dynamic = 'force-dynamic';

/**
 * GET /api/content
 * Returns current site.json (raw JSON object).
 * Requires auth.
 */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: '未登录' }, { status: 401 });
  }
  try {
    const text = await readLocal();
    const data = JSON.parse(text);
    return NextResponse.json({ ok: true, data, githubConfigured: githubConfigured() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

/**
 * POST /api/content
 * Body: { data: <site.json object>, message?: string, pushToGithub?: boolean }
 * - Always writes src/content/site.json locally (instant dev preview).
 * - If pushToGithub !== false AND GITHUB_PAT configured: also commits to GitHub.
 */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: '未登录' }, { status: 401 });
  }
  let body: { data?: unknown; message?: string; pushToGithub?: boolean } = {};
  try { body = await req.json(); } catch {}
  if (!body.data || typeof body.data !== 'object') {
    return NextResponse.json({ ok: false, error: '无效数据' }, { status: 400 });
  }

  const json = JSON.stringify(body.data, null, 2) + '\n';

  // 1. Local write (so dev server picks it up immediately)
  try {
    await writeLocal(json);
  } catch (e) {
    return NextResponse.json({ ok: false, error: `本地写入失败: ${e}` }, { status: 500 });
  }

  // 2. GitHub commit (optional)
  let commitInfo: { sha?: string; url?: string; pushed: boolean; error?: string } = { pushed: false };
  const wantsPush = body.pushToGithub !== false;
  if (wantsPush && githubConfigured()) {
    try {
      const msg = body.message?.trim() || `chore(content): update site.json via /edit`;
      const r = await commitToGithub(json, msg);
      commitInfo = { pushed: true, sha: r.sha, url: r.url };
    } catch (e) {
      commitInfo = { pushed: false, error: String(e) };
    }
  }

  return NextResponse.json({ ok: true, local: true, github: commitInfo });
}