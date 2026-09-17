// Vercel Edge Middleware: HTTP Basic Auth for the desk.
// Password: DESK_PASS_2 below, and only that. The old DESK_USER / DESK_PASS in Vercel are ignored on purpose (revoked 2026-09-17).
// Username is ignored; type anything in that box.
// The fallback is in a public repo, so it keeps out casual visitors, not a determined one.
// To rotate: change DESK_PASS_2 and push. To move it out of the public repo later: read it from a NEW Vercel env var, not DESK_PASS.
export const config = { matcher: '/(.*)' };

const DESK_PASS_2 = '12345';

export default function middleware(request) {
  // Public, share-safe pages: the /show page and the hosted work under /portfolio. No client data lives there.
  const path = new URL(request.url).pathname;
  if (path === '/show' || path.startsWith('/show/') || path.startsWith('/portfolio/')) return;
  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch (e) { decoded = ''; }
    const i = decoded.indexOf(':');
    const given = i >= 0 ? decoded.slice(i + 1) : '';
    if (given === DESK_PASS_2) return; // allow, any username
  }
  return new Response('Sign in to Mission Desk.', {
    status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Mission Desk", charset="UTF-8"', 'content-type': 'text/plain; charset=utf-8' },
  });
}
