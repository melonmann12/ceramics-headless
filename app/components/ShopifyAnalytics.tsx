'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import {
  ShopifyProvider,
  useShopifyCookies,
  sendShopifyAnalytics,
  getClientBrowserParameters,
  getTrackingValues,
} from '@shopify/hydrogen-react';

type ShopifyPrivacyApi = {
  analyticsProcessingAllowed: () => boolean;
  marketingAllowed: () => boolean;
  saleOfDataAllowed: () => boolean;
  shouldShowBanner: () => boolean;
  currentVisitorConsent: () => {
    analytics?: string;
    marketing?: string;
    preferences?: string;
    sale_of_data?: string;
  };
  setTrackingConsent: (
    consent: {
      analytics?: boolean;
      marketing?: boolean;
      preferences?: boolean;
      sale_of_data?: boolean;
      headlessStorefront: true;
      checkoutRootDomain: string;
      storefrontRootDomain: string;
      storefrontAccessToken: string;
    },
    callback: () => void
  ) => void;
};

type ShopifyPrivacyState = {
  status: 'loading' | 'ready' | 'error';
  analyticsAllowed: boolean | null;
  marketingAllowed: boolean | null;
  saleOfDataAllowed: boolean | null;
  shouldShowBanner: boolean;
};

type ShopifyPrivacyConfig = {
  checkoutRootDomain: string;
};

type ResolvedShopifyPrivacyState = ShopifyPrivacyState & {
  status: 'ready';
  analyticsAllowed: boolean;
  marketingAllowed: boolean;
  saleOfDataAllowed: boolean;
};

declare global {
  interface Window {
    Shopify?: {
      loadFeatures?: (
        features: { name: string; version: string }[],
        callback: (error?: unknown) => void
      ) => void;
      customerPrivacy?: ShopifyPrivacyApi;
    };
  }
}

const initialPrivacyState: ShopifyPrivacyState = {
  status: 'loading',
  analyticsAllowed: null,
  marketingAllowed: null,
  saleOfDataAllowed: null,
  shouldShowBanner: false,
};

// Must be a PUBLIC Shopify Storefront API token that is safe for browser exposure.
const publicStorefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

function getStorefrontRootDomain() {
  const hostname = window.location.hostname.replace(/^www\./, '');
  return hostname || window.location.hostname;
}

async function getPrivacyConfig(): Promise<ShopifyPrivacyConfig> {
  const response = await fetch('/api/shopify-privacy/config', {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Shopify privacy config failed: ${response.status}`);
  }

  return response.json();
}

function readPrivacyState(): ShopifyPrivacyState {
  const customerPrivacy = window.Shopify?.customerPrivacy;

  if (!customerPrivacy) {
    return initialPrivacyState;
  }

  return {
    status: 'ready',
    analyticsAllowed: customerPrivacy.analyticsProcessingAllowed(),
    marketingAllowed: customerPrivacy.marketingAllowed(),
    saleOfDataAllowed: customerPrivacy.saleOfDataAllowed(),
    shouldShowBanner: customerPrivacy.shouldShowBanner(),
  };
}

function isResolvedPrivacyState(
  privacyState: ShopifyPrivacyState
): privacyState is ResolvedShopifyPrivacyState {
  return (
    privacyState.status === 'ready' &&
    typeof privacyState.analyticsAllowed === 'boolean' &&
    typeof privacyState.marketingAllowed === 'boolean' &&
    typeof privacyState.saleOfDataAllowed === 'boolean'
  );
}

function loadCustomerPrivacyApi(): Promise<ShopifyPrivacyApi> {
  return new Promise((resolve, reject) => {
    const customerPrivacy = window.Shopify?.customerPrivacy;
    if (customerPrivacy) {
      resolve(customerPrivacy);
      return;
    }

    const loadFeatures = window.Shopify?.loadFeatures;

    if (!loadFeatures) {
      reject(new Error('Shopify Customer Privacy loader is unavailable'));
      return;
    }

    loadFeatures(
      [
        {
          name: 'consent-tracking-api',
          version: '0.1',
        },
      ],
      (error?: unknown) => {
        if (error) {
          reject(error);
          return;
        }

        const customerPrivacy = window.Shopify?.customerPrivacy;
        if (!customerPrivacy) {
          reject(new Error('Shopify Customer Privacy API is unavailable'));
          return;
        }

        resolve(customerPrivacy);
      }
    );
  });
}

function useShopifyPrivacy(scriptLoaded: boolean) {
  const [privacyState, setPrivacyState] = useState<ShopifyPrivacyState>(initialPrivacyState);
  const [privacyConfig, setPrivacyConfig] = useState<ShopifyPrivacyConfig | null>(null);

  useEffect(() => {
    if (!scriptLoaded) return;

    let isMounted = true;

    async function initialisePrivacy() {
      try {
        const [config] = await Promise.all([getPrivacyConfig(), loadCustomerPrivacyApi()]);

        if (!isMounted) return;

        setPrivacyConfig(config);
        setPrivacyState(readPrivacyState());
      } catch (error) {
        console.error('[ShopifyPrivacy] failed to initialise:', error);

        if (isMounted) {
          setPrivacyState({
            ...initialPrivacyState,
            status: 'error',
          });
        }
      }
    }

    function handleConsentChange() {
      setPrivacyState(readPrivacyState());
    }

    document.addEventListener('visitorConsentCollected', handleConsentChange);
    initialisePrivacy();

    return () => {
      isMounted = false;
      document.removeEventListener('visitorConsentCollected', handleConsentChange);
    };
  }, [scriptLoaded]);

  const setTrackingConsent = async (analytics: boolean, marketing: boolean) => {
    if (!publicStorefrontAccessToken) {
      throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    }

    if (!privacyConfig) {
      throw new Error('Shopify privacy config is not ready');
    }

    const customerPrivacy = window.Shopify?.customerPrivacy;
    if (!customerPrivacy) {
      throw new Error('Shopify Customer Privacy API is not ready');
    }

    await new Promise<void>((resolve) => {
      customerPrivacy.setTrackingConsent(
        {
          analytics,
          marketing,
          preferences: false,
          headlessStorefront: true,
          checkoutRootDomain: privacyConfig.checkoutRootDomain,
          storefrontRootDomain: getStorefrontRootDomain(),
          storefrontAccessToken: publicStorefrontAccessToken,
        },
        resolve
      );
    });

    setPrivacyState(readPrivacyState());
  };

  return {
    privacyState,
    privacyConfig,
    acceptTracking: () => setTrackingConsent(true, true),
    rejectTracking: () => setTrackingConsent(false, false),
  };
}

function ShopifyPrivacyBanner({
  privacyState,
  onAccept,
  onReject,
}: {
  privacyState: ShopifyPrivacyState;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (privacyState.status !== 'ready' || !privacyState.shouldShowBanner) {
    return null;
  }

  const submit = async (action: () => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await action();
    } catch (error) {
      console.error('[ShopifyPrivacy] failed to update consent:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="shopify-privacy-banner" aria-label="Cookie preferences">
      <p>
        We use cookies to measure site activity and improve ASHPIA. You can accept analytics
        and marketing cookies or keep only essential cookies.
      </p>
      <div className="shopify-privacy-actions">
        <button type="button" className="pill-btn pill-btn-outline" onClick={() => submit(onReject)} disabled={isSubmitting}>
          Reject non-essential
        </button>
        <button type="button" className="pill-btn" onClick={() => submit(onAccept)} disabled={isSubmitting}>
          Accept
        </button>
      </div>
    </section>
  );
}

function AnalyticsTracker() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { privacyState, privacyConfig, acceptTracking, rejectTracking } = useShopifyPrivacy(scriptLoaded);

  return (
    <>
      <Script
        src="https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => {
          console.error('[ShopifyPrivacy] failed to load Customer Privacy script');
          setScriptLoaded(true);
        }}
      />
      <ShopifyPrivacyBanner
        privacyState={privacyState}
        onAccept={acceptTracking}
        onReject={rejectTracking}
      />
      {isResolvedPrivacyState(privacyState) && privacyConfig && (
        <ShopifyTrackingSync
          privacyState={privacyState}
          privacyConfig={privacyConfig}
        />
      )}
    </>
  );
}

function ShopifyTrackingSync({
  privacyState,
  privacyConfig,
}: {
  privacyState: ResolvedShopifyPrivacyState;
  privacyConfig: ShopifyPrivacyConfig;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  const isReady = useShopifyCookies({ 
    hasUserConsent: privacyState.analyticsAllowed, 
    checkoutDomain: privacyConfig.checkoutRootDomain,
    storefrontAccessToken: publicStorefrontAccessToken,
    fetchTrackingValues: true,
    ignoreDeprecatedCookies: true // Use modern Storefront API tokens, not legacy _shopify_y/s
  });

  useEffect(() => {
    if (!isReady || !privacyState.analyticsAllowed) return;
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
            hasUserConsent: privacyState.analyticsAllowed,
            analyticsAllowed: privacyState.analyticsAllowed,
            marketingAllowed: privacyState.marketingAllowed,
            saleOfDataAllowed: privacyState.saleOfDataAllowed,
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

  }, [pathname, searchParams, isReady, privacyState]);

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
