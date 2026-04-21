// GitHub content persistence. In dev (no PAT / NODE_ENV=development):
// writes to local src/content/site.json for instant preview.
// In prod: commits via Octokit to the configured repo.
import fs from 'fs/promises';
import path from 'path';
import { Octokit } from '@octokit/rest';

const LOCAL_FILE = path.join(process.cwd(), 'src', 'content', 'site.json');

function env() {
  return {
    pat: process.env.GITHUB_PAT || '',
    owner: process.env.GITHUB_OWNER || 'reeoi',
    repo: process.env.GITHUB_REPO || 'portfolio-ljh',
    branch: process.env.GITHUB_BRANCH || 'main',
    file: process.env.GITHUB_FILE || 'src/content/site.json',
  };
}

export async function readLocal(): Promise<string> {
  return await fs.readFile(LOCAL_FILE, 'utf8');
}

export async function writeLocal(json: string): Promise<void> {
  await fs.writeFile(LOCAL_FILE, json, 'utf8');
}

/**
 * Commit the JSON string to the configured GitHub repo. Returns sha & commit url.
 * Throws if GITHUB_PAT not set.
 */
export async function commitToGithub(json: string, message: string): Promise<{ sha: string; url: string; }> {
  const { pat, owner, repo, branch, file } = env();
  if (!pat) throw new Error('GITHUB_PAT not configured');
  const octo = new Octokit({ auth: pat });

  // Need current file SHA
  let currentSha: string | undefined;
  try {
    const { data } = await octo.repos.getContent({ owner, repo, path: file, ref: branch });
    if (!Array.isArray(data) && 'sha' in data) currentSha = data.sha;
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err?.status !== 404) throw e;
  }

  const contentB64 = Buffer.from(json, 'utf8').toString('base64');
  const { data } = await octo.repos.createOrUpdateFileContents({
    owner, repo, path: file, branch,
    message,
    content: contentB64,
    sha: currentSha,
    committer: { name: 'Portfolio Editor', email: 'editor@ljhwmm.top' },
    author:    { name: 'Portfolio Editor', email: 'editor@ljhwmm.top' },
  });
  return { sha: data.content?.sha ?? '', url: data.commit?.html_url ?? '' };
}

export function githubConfigured(): boolean {
  return !!process.env.GITHUB_PAT;
}