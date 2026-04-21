// Simple HMAC-signed cookie session. No DB, no deps.
import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'edit_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  return process.env.EDIT_SECRET || 'dev-only-secret-please-set-env';
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function makeToken(): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `v1.${exp}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [v, expStr, sig] = parts;
  if (v !== 'v1') return false;
  const exp = parseInt(expStr, 10);
  if (!exp || exp < Math.floor(Date.now() / 1000)) return false;
  const expect = sign(`${v}.${expStr}`);
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expect, 'hex'));
  } catch {
    return false;
  }
}

export function checkPassword(pwd: string): boolean {
  const expected = process.env.EDIT_PASSWORD || '';
  if (!expected || !pwd) return false;
  const a = Buffer.from(pwd);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function issueSession() {
  const token = makeToken();
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const c = (await cookies()).get(COOKIE_NAME);
  return verifyToken(c?.value);
}