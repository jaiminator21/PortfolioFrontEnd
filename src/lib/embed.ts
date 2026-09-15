import { SITE_URL } from '@/lib/metadata';

/**
 * Whether `url` lets this site show it in an iframe.
 *
 * Most production sites send `X-Frame-Options` or a CSP `frame-ancestors`
 * directive, and a blocked iframe renders as a blank box with no event to catch
 * on the client. Checking the headers on the server lets the page fall back to
 * the cover image instead. Any failure counts as "no": a broken preview reads
 * worse than no preview.
 */
export async function canEmbed(url: string): Promise<boolean> {
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return false;
  }
  // An http page inside an https site is blocked as mixed content.
  if (target.protocol !== 'https:') return false;

  try {
    let res = await request(url, 'HEAD');
    // Some servers reject HEAD outright; their GET headers are the real ones.
    if (res.status === 405 || res.status === 501 || res.status === 403) {
      res = await request(url, 'GET');
    }
    if (!res.ok) return false;

    const xfo = res.headers.get('x-frame-options');
    if (xfo && /deny|sameorigin/i.test(xfo)) return false;

    const frameAncestors = res.headers
      .get('content-security-policy')
      ?.split(';')
      .map((directive) => directive.trim().split(/\s+/))
      .find(([name]) => name?.toLowerCase() === 'frame-ancestors');

    return frameAncestors ? allowsSite(frameAncestors.slice(1)) : true;
  } catch {
    return false;
  }
}

async function request(url: string, method: 'HEAD' | 'GET'): Promise<Response> {
  const res = await fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(5000),
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; PortfolioPreviewCheck/1.0)' },
    // Framing policy rarely changes; re-check daily rather than per request.
    next: { revalidate: 86_400 },
  });
  // Only the headers matter — don't download the page.
  await res.body?.cancel();
  return res;
}

function allowsSite(sources: string[]): boolean {
  const site = new URL(SITE_URL);

  return sources.some((source) => {
    if (source === '*' || source === 'https:') return true;
    if (source.startsWith("'")) return false; // 'none', 'self'

    const host = source.replace(/^https?:\/\//, '').split(/[/:]/)[0] ?? '';
    if (host.startsWith('*.')) return site.hostname.endsWith(host.slice(1));
    return host === site.hostname;
  });
}
