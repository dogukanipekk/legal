// Builds afterlit/privacy.html (and index.html) from fitil/legal/privacy-policy.md. Run: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const md = readFileSync('../fitil/legal/privacy-policy.md', 'utf8');
const [tr, en] = md.split(/\n---\n/);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1">$1</a>').replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>');
function html(src) {
  let out = '', list = false;
  for (const line of src.trim().split('\n')) {
    if (line.startsWith('- ')) { if (!list) { out += '<ul>'; list = true; } out += `<li>${inline(line.slice(2))}</li>`; continue; }
    if (list) { out += '</ul>'; list = false; }
    if (line.startsWith('# ')) out += `<h1>${inline(line.slice(2))}</h1>`;
    else if (line.startsWith('## ')) out += `<h2>${inline(line.slice(3))}</h2>`;
    else if (line.trim()) out += `<p>${inline(line)}</p>`;
  }
  return out + (list ? '</ul>' : '');
}
const page = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Afterlit – Gizlilik Politikası / Privacy Policy</title>
<style>
:root{--bg:#4a1029;--card:#fff;--ink:#2a1020;--muted:#8b7080;--accent:#ff3d6e}
body{margin:0;background:var(--bg);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--ink)}
main{max-width:760px;margin:24px auto;padding:0 16px}
.card{background:var(--card);border-radius:20px;padding:24px 22px;margin-bottom:20px}
nav{display:flex;gap:8px;justify-content:center;margin:24px 0 0}
nav a{color:#fff;text-decoration:none;font-weight:700;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.14)}
h1{font-size:26px;margin:0 0 4px}h2{font-size:18px;margin:22px 0 6px}
p,li{color:#3a2430}a{color:var(--accent)}
</style></head><body>
<nav><a href="#tr">Türkçe</a><a href="#en">English</a></nav>
<main><section class="card" id="tr" lang="tr">${html(tr)}</section><section class="card" id="en" lang="en">${html(en)}</section></main>
</body></html>
`;
writeFileSync('afterlit/privacy.html', page);
writeFileSync('index.html', '<!doctype html><meta charset="utf-8"><title>Apps</title><p><a href="afterlit/privacy.html">Afterlit – Privacy Policy</a></p>\n');
console.log('built', page.length, 'bytes');
