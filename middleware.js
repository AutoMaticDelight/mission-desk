// Vercel Edge Middleware: HTTP Basic Auth for the desk.
// Password: DESK_PASS from the Vercel project's Environment Variables, or the fallback below when it is not set.
// Username is ignored; type anything in that box.
// The fallback is in a public repo, so it keeps out casual visitors, not a determined one.
// To make the password private: set DESK_PASS in Vercel → Project → Settings → Environment Variables and delete FALLBACK_PASS.
export const config = { matcher: '/(.*)' };

const FALLBACK_PASS = '12345';

export default function middleware(request) {
  // Public, share-safe pages: the /show page and the hosted work under /portfolio. No client data lives there.
  const path = new URL(request.url).pathname;
  if (path === '/show' || path.startsWith('/show/') || path.startsWith('/portfolio/')) return;
  const pass = process.env.DESK_PASS || FALLBACK_PASS;
  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch (e) { decoded = ''; }
    const i = decoded.indexOf(':');
    if (i >= 0 && decoded.slice(i + 1) === pass) return; // allow, any username
  }
  return new Response('Sign in to Mission Desk.', {
    status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Mission Desk", charset="UTF-8"', 'content-type': 'text/plain; charset=utf-8' },
  });
}
