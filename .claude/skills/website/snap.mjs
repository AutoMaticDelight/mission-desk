#!/usr/bin/env node
// website skill: screenshots + style census for a URL. Playwright + the pre-installed Chromium.
import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
// find playwright wherever it lives (this folder, the cwd, a global install); install it here once if nowhere
const resolvePw = () => { for (const base of [here, process.cwd(), path.join(process.env.HOME || '', '.npm-global/lib')]) { try { return createRequire(path.join(base, 'x.js')).resolve('playwright'); } catch {} } return null; };
let pwPath = resolvePw();
if (!pwPath) { console.error('installing playwright (one time) …'); execSync('npm i --no-save --no-audit --no-fund playwright', { cwd: here, stdio: 'inherit' }); pwPath = resolvePw(); }
const pwMod = await import(pwPath); const chromium = pwMod.chromium ?? pwMod.default?.chromium;
const [,, url, outArg] = process.argv;
if (!url) { console.error('usage: snap.mjs <url> [out-dir]'); process.exit(2); }
const host = (() => { try { const u = new URL(url.includes('://') ? url : 'https://' + url); return (u.host || path.basename(u.pathname, '.html')).replace(/^www\./, ''); } catch { return 'site'; } })();
const out = outArg || path.join(process.cwd(), 'refs', host); fs.mkdirSync(out, { recursive: true });
const target = url.includes('://') ? url : 'https://' + url;
// browser: the sandbox's Chromium, else the laptop's own Chrome, else Playwright's download (npx playwright install chromium)
const exe = process.env.PLAYWRIGHT_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await (exe ? chromium.launch({ executablePath: exe }) : chromium.launch({ channel: 'chrome' })).catch(() => chromium.launch());
const shoot = async (w, h, file, full) => {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  try { await p.goto(target, { waitUntil: 'networkidle', timeout: 45000 }); } catch (e) {
    const msg = String(e.message || e);
    if (/ERR_TUNNEL|403|ERR_PROXY|CONNECT/.test(msg)) { console.error(`BLOCKED by the environment network policy: ${host}\n${msg.split('\n')[0]}`); await browser.close(); process.exit(3); }
    if (!/Timeout/.test(msg)) throw e;
  }
  await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(out, file), fullPage: full });
  return p;
};
const p = await shoot(1440, 900, 'desktop.png', true);
await p.screenshot({ path: path.join(out, 'fold.png'), fullPage: false });
const census = await p.evaluate(() => {
  const N = 4000; const els = [...document.querySelectorAll('body *')].slice(0, N);
  const area = e => { const r = e.getBoundingClientRect(); return Math.max(0, r.width) * Math.max(0, r.height); };
  const bump = (m, k, v) => { if (!k) return; m[k] = (m[k] || 0) + v; };
  const bg = {}, fg = {}, fonts = {}, weights = {}, radii = {}, sizes = {};
  const toHex = c => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a] = m[1].split(',').map(s => +s.trim()); if (a === 0) return null; return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join(''); };
  for (const e of els) {
    const cs = getComputedStyle(e); const a = area(e); if (!a) continue;
    bump(bg, toHex(cs.backgroundColor), a);
    const txt = (e.childNodes && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) ? e.textContent.trim().length : 0;
    if (txt) { bump(fg, toHex(cs.color), txt); bump(fonts, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), txt); bump(weights, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim() + ' ' + cs.fontWeight, txt); bump(sizes, cs.fontSize, txt); }
    if (cs.borderRadius && cs.borderRadius !== '0px' && (e.tagName === 'BUTTON' || e.tagName === 'A' || /btn|button/i.test(e.className))) bump(radii, cs.borderRadius.split(' ')[0], 1);
  }
  const top = (m, n = 8) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
  const pick = sel => { const e = document.querySelector(sel); if (!e) return null; const cs = getComputedStyle(e); return { text: e.textContent.trim().slice(0, 80), font: cs.fontFamily.split(',')[0].replace(/["']/g, ''), size: cs.fontSize, weight: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, tt: cs.textTransform, color: toHex(cs.color) }; };
  const btn = [...document.querySelectorAll('button, a')].filter(e => { const cs = getComputedStyle(e); return toHex(cs.backgroundColor) && area(e) > 800 && e.textContent.trim().length < 40; }).slice(0, 3).map(e => { const cs = getComputedStyle(e); return { text: e.textContent.trim(), bg: toHex(cs.backgroundColor), color: toHex(cs.color), radius: cs.borderRadius, padding: cs.padding, size: cs.fontSize, weight: cs.fontWeight }; });
  const nav = [...document.querySelectorAll('nav a, header a')].map(a => a.textContent.trim()).filter(Boolean).slice(0, 12);
  return { title: document.title, bodyBg: toHex(getComputedStyle(document.body).backgroundColor), bg: top(bg), fg: top(fg), fonts: top(fonts), weights: top(weights, 10), sizes: top(sizes, 10), radii: top(radii, 5), h1: pick('h1'), h2: pick('h2'), body: pick('p'), buttons: btn, nav, imgs: document.images.length, height: document.documentElement.scrollHeight };
});
await p.close();
await shoot(390, 844, 'phone.png', true).then(pg => pg.close());
await browser.close();
fs.writeFileSync(path.join(out, 'styles.json'), JSON.stringify(census, null, 2));
const pct = (v, m) => { const t = m.reduce((s, [, n]) => s + n, 0) || 1; return Math.round(100 * v / t) + '%'; };
const md = `# ${host} — design cues (captured ${new Date().toISOString().slice(0, 10)})

Title: ${census.title}
Page body background: ${census.bodyBg || 'transparent'} · page height ${census.height}px · ${census.imgs} images
Nav: ${census.nav.join(' · ') || '—'}

## Palette (by pixel share)
Backgrounds: ${census.bg.map(([c, v]) => `${c} (${pct(v, census.bg)})`).join(', ')}
Text: ${census.fg.map(([c, v]) => `${c} (${pct(v, census.fg)})`).join(', ')}

## Type
Families (by characters): ${census.fonts.map(([f, v]) => `${f} (${pct(v, census.fonts)})`).join(', ')}
Weights: ${census.weights.map(([f, v]) => `${f} (${pct(v, census.weights)})`).join(', ')}
Sizes: ${census.sizes.map(([s, v]) => `${s} (${pct(v, census.sizes)})`).join(', ')}
h1: ${JSON.stringify(census.h1)}
h2: ${JSON.stringify(census.h2)}
body: ${JSON.stringify(census.body)}

## Buttons
${census.buttons.map(b => '- ' + JSON.stringify(b)).join('\n') || '- none found'}
Radii seen: ${census.radii.map(([r, n]) => `${r} ×${n}`).join(', ') || '—'}

Screens: desktop.png (1440, full page) · fold.png (first screen) · phone.png (390, full page)
`;
fs.writeFileSync(path.join(out, 'notes.md'), md);
console.log(`wrote ${out}/{desktop,fold,phone}.png, notes.md, styles.json`);
