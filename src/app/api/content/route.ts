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

  // 运行环境：Vercel / Serverless 文件系统只读（/var/task），跳过 writeLocal
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  // 1. Local write（仅本地 dev，生产环境跳过以避免 EROFS）
  let localWritten = false;
  if (!isServerless) {
    try {
      await writeLocal(json);
      localWritten = true;
    } catch (e) {
      // dev 环境写失败才算致命；prod 不会走到这里
      return NextResponse.json({ ok: false, error: `本地写入失败: ${e}` }, { status: 500 });
    }
  }

  // 2. GitHub commit（生产环境唯一持久化途径；没配 PAT 直接报错）
  let commitInfo: { sha?: string; url?: string; pushed: boolean; error?: string } = { pushed: false };
  const wantsPush = body.pushToGithub !== false;
  if (wantsPush) {
    if (!githubConfigured()) {
      if (isServerless) {
        return NextResponse.json({
          ok: false,
          error: 'GITHUB_PAT 未配置：生产环境文件系统只读，必须通过 GitHub 提交才能持久化。请在 Vercel 项目 Settings → Environment Variables 添加 GITHUB_PAT。',
        }, { status: 500 });
      }
      // dev 无 PAT 时，仅本地写入也算成功
    } else {
      try {
        const msg = body.message?.trim() || `chore(content): update site.json via /edit`;
        const r = await commitToGithub(json, msg);
        commitInfo = { pushed: true, sha: r.sha, url: r.url };
      } catch (e) {
        commitInfo = { pushed: false, error: String(e) };
        // 生产环境必须 push 成功，否则数据根本没落盘
        if (isServerless) {
          return NextResponse.json({ ok: false, error: `GitHub 提交失败: ${e}` }, { status: 500 });
        }
      }
    }
  }

  return NextResponse.json({ ok: true, local: localWritten, github: commitInfo });
}