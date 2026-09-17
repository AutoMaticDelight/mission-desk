// Vercel Edge Middleware: HTTP Basic Auth for the whole site.
// Set DESK_USER and DESK_PASS in the Vercel project's Environment Variables.
// Until both are set, every request is refused, so the desk is never public by accident.
export const config = { matcher: '/(.*)' };

export default function middleware(request) {
  // AUTH OFF (2026-09-17): the whole desk is open during interviews. Too much friction on a call.
  // To lock it again, delete the next line. DESK_USER / DESK_PASS in Vercel are untouched.
  return;
  // Public, share-safe pages: the /show page and the hosted work under /portfolio. No client data lives there.
  const path = new URL(request.url).pathname;
  if (path === '/show' || path.startsWith('/show/') || path.startsWith('/portfolio/')) return;
  const user = process.env.DESK_USER;
  const pass = process.env.DESK_PASS;
  if (!user || !pass) {
    return new Response('Mission Desk is locked. Set DESK_USER and DESK_PASS in Vercel → Project → Settings → Environment Variables, then redeploy.', {
      status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch (e) { decoded = ''; }
    const i = decoded.indexOf(':');
    if (i > 0 && decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) return; // allow
  }
  return new Response('Sign in to Mission Desk.', {
    status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Mission Desk", charset="UTF-8"', 'content-type': 'text/plain; charset=utf-8' },
  });
}
