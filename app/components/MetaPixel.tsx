'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { META_PIXEL_ID, trackPageView } from '@/lib/meta-pixel';

/**
 * MetaPixel – renders in root layout to bootstrap the Meta Pixel and
 * fire a PageView on every page load + client-side route change.
 *
 * The standard Meta Pixel bootstrap creates window.fbq as a queue stub
 * BEFORE fbevents.js loads, so the external script can use fbq internally.
 * The previous implementation skipped this step (loaded fbevents.js as a
 * standalone src), which caused "fbq is not defined" in production.
 *
 * This version uses an inline <Script> to run the bootstrap, then
 * fbevents.js picks up the queued init/track calls when it executes.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const hasInitialised = useRef(false);

  // Bootstrap the pixel exactly once (survives re-renders + Strict Mode).
  useEffect(() => {
    if (hasInitialised.current) return;
    if (typeof window === 'undefined') return;
    // Guard: if fbq is already a real function, we've been here before.
    if (typeof window.fbq === 'function' && window.fbq.loaded) return;

    hasInitialised.current = true;

    // ── Standard Meta Pixel bootstrap ────────────────────────────────
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const fbqStub = function (...args: any[]) {
      if (fbqStub.callMethod) {
        fbqStub.callMethod.apply(fbqStub, args);
      } else {
        fbqStub.queue!.push(args);
      }
    } as any;
    fbqStub.push = fbqStub;
    fbqStub.loaded = true;
    fbqStub.version = '2.0';
    fbqStub.queue = [] as any[];
    /* eslint-enable @typescript-eslint/no-explicit-any */

    window.fbq = fbqStub;
    if (!window._fbq) window._fbq = fbqStub;

    // Dynamically load fbevents.js
    const t = document.createElement('script');
    t.async = true;
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const s = document.getElementsByTagName('script')[0];
    s?.parentNode?.insertBefore(t, s);

    // Init + first PageView (queued; fbevents.js will flush when it loads)
    window.fbq('init', META_PIXEL_ID);
    
    const eventId = crypto.randomUUID();
    trackPageView(eventId);
    fetch('/api/meta/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'PageView',
        event_id: eventId,
        event_source_url: window.location.href,
      }),
    }).catch(console.error);
  }, []);

  // Track PageView on client-side navigations (pathname changes).
  // Skip the very first call because the useEffect above already sent
  // the initial PageView.
  const isFirstPathChange = useRef(true);
  useEffect(() => {
    if (isFirstPathChange.current) {
      isFirstPathChange.current = false;
      return;
    }
    const eventId = crypto.randomUUID();
    trackPageView(eventId);
    fetch('/api/meta/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'PageView',
        event_id: eventId,
        event_source_url: window.location.href,
      }),
    }).catch(console.error);
  }, [pathname]);

  // noscript fallback image for browsers with JS disabled
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
