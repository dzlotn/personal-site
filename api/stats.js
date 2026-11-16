import { timingSafeEqual } from 'node:crypto';
import { redis, INDEX_KEY, pvKey } from './_lib';

const MAX_ROWS = 2000;

const authorized = (key) => {
  const expected = process.env.STATS_KEY;
  if (!expected || !key) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const refHost = (ref) => {
  if (!ref) return '(direct)';
  try {
    return new URL(ref).host.replace(/^www\./, '');
  } catch {
    return ref;
  }
};

const place = (r) => [r.city, r.region, r.country].filter(Boolean).join(', ') || '(unknown)';

const countBy = (rows, keyFn) => {
  const m = new Map();
  rows.forEach((r) => {
    const k = keyFn(r);
    m.set(k, (m.get(k) || 0) + 1);
  });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const fmtSec = (s) => {
  if (s == null) return '–';
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
};

const table = (title, head, rows) => `
  <section><h2>${esc(title)}</h2><div class="scroll"><table>
    <thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div></section>`;

const render = (rows) => {
  const visits = new Set(rows.map((r) => r.vid)).size;

  const pageStats = new Map();
  rows.forEach((r) => {
    const s = pageStats.get(r.path) || { n: 0, read: 0, scroll: 0 };
    s.n += 1;
    s.read += r.readSec || 0;
    s.scroll += r.scrollPct || 0;
    pageStats.set(r.path, s);
  });
  const pages = [...pageStats.entries()]
    .sort((a, b) => b[1].n - a[1].n)
    .map(([p, s]) => [p, s.n, fmtSec(s.read / s.n), `${Math.round(s.scroll / s.n)}%`]);

  const entries = rows.filter((r) => !r.prev);
  const referrers = countBy(entries, (r) => refHost(r.ref));
  const flows = countBy(rows, (r) => `${r.prev || refHost(r.ref)} → ${r.path}`).slice(0, 30);
  const places = countBy(rows, place).slice(0, 50);

  const pins = new Map();
  rows.forEach((r) => {
    if (r.lat == null || r.lon == null) return;
    const k = `${r.lat},${r.lon}`;
    const p = pins.get(k) || {
      lat: r.lat, lon: r.lon, label: place(r), n: 0,
    };
    p.n += 1;
    pins.set(k, p);
  });

  const recent = rows.slice(0, 300).map((r) => [
    new Date(r.t).toLocaleString('en-US', { timeZone: 'America/New_York' }),
    r.path,
    r.prev || `↪ ${refHost(r.ref)}`,
    place(r),
    fmtSec(r.readSec),
    r.scrollPct != null ? `${r.scrollPct}%` : '–',
    `${r.device} · ${r.browser} · ${r.os}`,
    r.utm || '',
  ]);

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Site Visits</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>
  :root{--bg:#fafafa;--fg:#222;--muted:#666;--line:#e3e3e3;--card:#fff;--accent:#2e6be6}
  @media (prefers-color-scheme:dark){:root{--bg:#141414;--fg:#eee;--muted:#999;--line:#2c2c2c;--card:#1c1c1c;--accent:#6c9bff}}
  body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif}
  h1{margin:0 0 4px} h2{font-size:15px;margin:0 0 8px}
  .muted{color:var(--muted)} .kpis{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0}
  .kpi{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 14px}
  .kpi b{display:block;font-size:22px}
  #map{height:420px;border-radius:8px;border:1px solid var(--line);margin-bottom:16px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
  section{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px;margin-bottom:16px}
  .scroll{overflow-x:auto;max-height:520px;overflow-y:auto}
  table{border-collapse:collapse;width:100%} th,td{text-align:left;padding:4px 8px;border-bottom:1px solid var(--line);white-space:nowrap}
  th{position:sticky;top:0;background:var(--card)}
</style></head><body>
<h1>Site visits</h1>
<div class="muted">Last ${rows.length} pageviews</div>
<div class="kpis">
  <div class="kpi"><b>${rows.length}</b>pageviews</div>
  <div class="kpi"><b>${visits}</b>visits</div>
  <div class="kpi"><b>${new Set(rows.map(place)).size}</b>places</div>
  <div class="kpi"><b>${fmtSec(rows.reduce((a, r) => a + (r.readSec || 0), 0) / (rows.length || 1))}</b>avg read time</div>
</div>
<div id="map"></div>
<div class="grid">
  ${table('Pages', ['Page', 'Views', 'Avg read', 'Avg scroll'], pages)}
  ${table('Where visits came from', ['Referrer', 'Visits'], referrers)}
  ${table('Places', ['Place', 'Pageviews'], places)}
  ${table('Top paths (from → to)', ['Flow', 'Count'], flows)}
</div>
${table('Recent pageviews (ET)', ['Time', 'Page', 'Came from', 'Location', 'Read', 'Scroll', 'Device', 'UTM'], recent)}
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const pins = ${JSON.stringify([...pins.values()]).replace(/</g, '\\u003c')};
  const map = L.map('map', { worldCopyJump: true }).setView([30, -40], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18,
  }).addTo(map);
  const max = Math.max(1, ...pins.map((p) => p.n));
  pins.forEach((p) => {
    L.circleMarker([p.lat, p.lon], {
      radius: 5 + 15 * Math.sqrt(p.n / max), color: '#2e6be6', weight: 1, fillOpacity: 0.5,
    }).bindTooltip(p.label + ': ' + p.n).addTo(map);
  });
</script>
</body></html>`;
};

// eslint-disable-next-line import/prefer-default-export
export async function GET(request) {
  const url = new URL(request.url);
  if (!authorized(url.searchParams.get('key'))) {
    return new Response('Not found', { status: 404 });
  }

  const ids = await redis.zrange(INDEX_KEY, 0, MAX_ROWS - 1, { rev: true });
  const rows = ids.length
    ? (await redis.mget(...ids.map(pvKey))).filter(Boolean)
    : [];

  if (url.searchParams.get('format') === 'json') {
    return Response.json(rows, { headers: { 'Cache-Control': 'no-store' } });
  }
  return new Response(render(rows), {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
