import { geolocation } from '@vercel/functions';
import {
  redis, INDEX_KEY, RETENTION_DAYS, pvKey,
} from './_lib';

const BOT_RE = new RegExp([
  'bot', 'crawl', 'spider', 'slurp', 'preview', 'headless', 'lighthouse',
  'reactsnap', 'facebookexternalhit', 'embedly', 'quora link',
].join('|'), 'i');
const ID_RE = /^[a-zA-Z0-9-]{8,64}$/;

const str = (v, max = 300) => (typeof v === 'string' ? v.slice(0, max) : null);
const num = (v, min, max) => (
  Number.isFinite(v) ? Math.min(Math.max(Math.round(v), min), max) : null
);

const parseUA = (ua = '') => {
  let device = 'desktop';
  if (/iPad|Tablet/i.test(ua)) device = 'tablet';
  else if (/Mobi|Android|iPhone/i.test(ua)) device = 'mobile';

  let browser = 'other';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/OPR\//.test(ua)) browser = 'Opera';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  let os = 'other';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/iPhone|iPad|iOS/.test(ua)) os = 'iOS';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Linux/.test(ua)) os = 'Linux';

  return { device, browser, os };
};

const decode = (v) => {
  try {
    return v ? decodeURIComponent(v) : null;
  } catch {
    return v;
  }
};

const noContent = () => new Response(null, { status: 204 });

// eslint-disable-next-line import/prefer-default-export
export async function POST(request) {
  const ua = request.headers.get('user-agent') || '';
  if (BOT_RE.test(ua)) return noContent();

  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response('bad request', { status: 400 });
  }

  const { pid, vid } = body;
  const path = str(body.path, 200);
  if (!ID_RE.test(pid || '') || !ID_RE.test(vid || '') || !path || !path.startsWith('/')) {
    return new Response('bad request', { status: 400 });
  }

  const geo = geolocation(request);
  const start = num(body.start, 0, Date.now() + 60000) || Date.now();

  const record = {
    pid,
    vid,
    t: new Date(start).toISOString(),
    path,
    prev: str(body.prev, 200), // previous page within the site (null = entry page)
    ref: str(body.ref), // external referrer, only on the entry page
    utm: str(body.utm, 200),
    readSec: num(body.readSec, 0, 6 * 3600),
    scrollPct: num(body.scrollPct, 0, 100),
    city: decode(geo.city) || null,
    region: geo.countryRegion || null,
    country: geo.country || null,
    lat: geo.latitude ? Number(geo.latitude) : null,
    lon: geo.longitude ? Number(geo.longitude) : null,
    lang: str(request.headers.get('accept-language'), 40)?.split(',')[0] || null,
    screen: str(body.screen, 20),
    ...parseUA(ua),
  };

  const ttl = RETENTION_DAYS * 86400;
  const cutoff = Date.now() - ttl * 1000;

  // The client may send several updates for one pageview (tab hidden, then
  // closed); keying by pid means later updates overwrite earlier ones.
  await redis
    .pipeline()
    .set(pvKey(pid), record, { ex: ttl })
    .zadd(INDEX_KEY, { score: start, member: pid })
    .zremrangebyscore(INDEX_KEY, 0, cutoff)
    .exec();

  return noContent();
}
