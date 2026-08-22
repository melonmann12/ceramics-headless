'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  ShopifyProvider,
  useShopifyCookies,
  sendShopifyAnalytics,
  getClientBrowserParameters,
  getTrackingValues,
} from '@shopify/hydrogen-react';

function AnalyticsTracker() {
  const [cookiesReady, setCookiesReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);
  
  const isReady = useShopifyCookies({ 
    hasUserConsent: true, 
    fetchTrackingValues: true,
    ignoreDeprecatedCookies: true // Use modern Storefront API tokens, not legacy _shopify_y/s
  });

  useEffect(() => {
    if (isReady) {
      setCookiesReady(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (!cookiesReady) return;
    if (typeof window === 'undefined') return;

    const currentPath = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`;
    if (lastPath.current === currentPath) return;

    const browserParams = getClientBrowserParameters();
    // Use the authoritative source for modern tokens
    const { uniqueToken, visitToken } = getTrackingValues();
    
    if (!uniqueToken || !visitToken) {
      return;
    }

    // Optimistically mark tracked to prevent strict-mode/hydration double fire
    lastPath.current = currentPath;

    const fireAnalytics = async () => {
      try {
        await sendShopifyAnalytics({
          eventName: 'PAGE_VIEW',
          payload: {
            ...browserParams,
            uniqueToken,
            visitToken,
            hasUserConsent: true,
            shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID || '', 
            shopifySalesChannel: 'headless',
            currency: 'USD',
          }
        });
      } catch (err: any) {
        console.error('[ShopifyAnalytics] PAGE_VIEW failed:', err?.message || String(err));
        // Reset so a valid retry can happen if needed
        lastPath.current = null;
      }
    };

    fireAnalytics();

  }, [pathname, searchParams, cookiesReady]);

  return null;
}

export default function ShopifyAnalytics() {
  // Use a fallback for the public token in the client, but it won't actually be sent from the client
  // because the proxy attaches the real token on the server side.
  // We just need to satisfy the ShopifyProvider prop types.
  return (
    <ShopifyProvider
      storeDomain={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'matcha-9500.myshopify.com'}
      storefrontToken={'proxy-token'} 
      storefrontApiVersion="2026-04"
      countryIsoCode="US"
      languageIsoCode="EN"
      sameDomainForStorefrontApi={true}
    >
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </ShopifyProvider>
  );
}
