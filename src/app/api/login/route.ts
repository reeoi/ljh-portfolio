import { NextResponse } from 'next/server';
import { checkPassword, issueSession } from '@/lib/auth';

export async function POST(req: Request) {
  let body: { password?: string } = {};
  try { body = await req.json(); } catch {}
  const ok = checkPassword(body.password || '');
  if (!ok) {
    return NextResponse.json({ ok: false, error: '密码错误' }, { status: 401 });
  }
  await issueSession();
  return NextResponse.json({ ok: true });
}