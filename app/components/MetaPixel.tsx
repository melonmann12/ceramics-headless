'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, trackPageView } from '@/lib/meta-pixel';

/**
 * MetaPixel – drop into root layout to load the Meta Pixel base script
 * and fire a PageView on every client-side route change.
 *
 * Uses next/script with `afterInteractive` (default) so the pixel loads
 * after hydration and does not block rendering.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  // Track PageView on client-side navigations (pathname changes).
  // The initial PageView is fired in handleScriptLoad once fbq is ready,
  // so we skip the first render here to avoid a duplicate.
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  /**
   * Called once the fbevents.js script has loaded.
   * We initialise the pixel and fire the first PageView here, which
   * guarantees fbq is a real function (not just the stub queue).
   */
  function handleScriptLoad() {
    window.fbq('init', META_PIXEL_ID);
    trackPageView();
  }

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      src="https://connect.facebook.net/en_US/fbevents.js"
      onLoad={handleScriptLoad}
    />
  );
}
