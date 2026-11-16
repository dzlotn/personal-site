import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Records one event per pageview: page, previous page, external referrer,
// time actively spent on the page, and max scroll depth. Location is added
// server-side from Vercel's IP geolocation headers (see /api/track.js).
// Nothing is stored in the browser: the visit id lives in memory only.

const enabled = typeof window !== 'undefined'
  && process.env.NODE_ENV === 'production'
  && !navigator.webdriver
  && !/ReactSnap/i.test(navigator.userAgent);

const makeId = () => (window.crypto?.randomUUID
  ? window.crypto.randomUUID()
  : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);

const visitId = enabled ? makeId() : null;
let prevPath = null;
let isEntry = true;

const externalReferrer = () => {
  try {
    const ref = document.referrer;
    if (!ref || new URL(ref).host === window.location.host) return null;
    return ref;
  } catch {
    return null;
  }
};

const utmString = () => {
  const params = new URLSearchParams(window.location.search);
  const parts = ['utm_source', 'utm_medium', 'utm_campaign', 'ref']
    .filter((k) => params.get(k))
    .map((k) => `${k}=${params.get(k)}`);
  return parts.length ? parts.join('&') : null;
};

const send = (payload) => {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))) {
      return;
    }
  } catch {
    // fall through to fetch
  }
  fetch('/api/track', {
    method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' },
  }).catch(() => {});
};

const VisitTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!enabled) return undefined;

    const base = {
      pid: makeId(),
      vid: visitId,
      path: pathname,
      prev: prevPath,
      ref: isEntry ? externalReferrer() : null,
      utm: isEntry ? utmString() : null,
      start: Date.now(),
      screen: `${window.screen.width}x${window.screen.height}`,
    };
    isEntry = false;

    let activeMs = 0;
    let visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    let maxScroll = 0;

    const readSec = () => (activeMs + (visibleSince ? Date.now() - visibleSince : 0)) / 1000;

    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
      if (pct > maxScroll) maxScroll = pct;
    };

    const flush = () => send({ ...base, readSec: readSec(), scrollPct: maxScroll });

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (visibleSince) activeMs += Date.now() - visibleSince;
        visibleSince = null;
        // Mobile browsers often never fire pagehide, so send on hide too.
        // The server overwrites by pid, so repeated sends are harmless.
        flush();
      } else {
        visibleSince = Date.now();
      }
    };

    // Send an initial event so very short visits still register.
    const initial = setTimeout(flush, 1000);

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);

    return () => {
      clearTimeout(initial);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      flush();
      prevPath = pathname;
    };
  }, [pathname]);

  return null;
};

export default VisitTracker;
