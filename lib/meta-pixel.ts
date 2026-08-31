/**
 * Meta Pixel analytics utility.
 *
 * Provides type-safe wrappers around the Meta Pixel `fbq` global.
 * Only `trackPageView` is active for now — the remaining stubs are
 * included so future event work can import from the same module.
 */

// ── Global type declaration ───────────────────────────────────────────
// Meta Pixel's fbq loader pushes to a queue before the real script loads,
// so the global can be a function *and* have a queue/version properties.

type FbqCommand = 'init' | 'track' | 'trackCustom' | 'trackSingle' | 'trackSingleCustom';

interface FbqFunction {
  (command: FbqCommand, ...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    fbq: FbqFunction;
    _fbq: FbqFunction;
  }
}


// ── Helpers ───────────────────────────────────────────────────────────

function fbq(...args: Parameters<FbqFunction>): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

// ── Public tracking API ───────────────────────────────────────────────

/** Fire a standard Meta "PageView" event. */
export function trackPageView(eventId: string): void {
  fbq('track', 'PageView', undefined, { eventID: eventId });
}

export interface ViewContentParams {
  content_ids: string[];
  content_name: string;
  content_type: 'product';
  value: number;
  currency: string;
}

/**
 * Fire a standard Meta "ViewContent" event.
 */
export function trackViewContent(params: ViewContentParams, eventId: string): void {
  fbq('track', 'ViewContent', params, { eventID: eventId });
}

export interface MetaCartContent {
  id: string;
  quantity: number;
  item_price: number;
}

export interface AddToCartParams {
  content_ids: string[];
  content_type: 'product';
  content_name: string;
  value: number;
  currency: string;
  contents: MetaCartContent[];
}

/**
 * Fire a standard Meta "AddToCart" event.
 */
export function trackAddToCart(params: AddToCartParams, eventId: string): void {
  fbq('track', 'AddToCart', params, { eventID: eventId });
}



/**
 * Normalizes a Shopify GID to its numeric ID.
 * e.g. "gid://shopify/ProductVariant/54346604446009" -> "54346604446009"
 */
export function normalizeVariantId(gid: string): string {
  return gid.split('/').pop()?.split('?')[0] || gid;
}

/**
 * Wait for a Meta cookie (like _fbp) to become available, bounded by a timeout.
 * Does not block UI.
 */
export async function waitForMetaCookie(cookieName: string = '_fbp', maxWaitMs: number = 1500): Promise<string | null> {
  if (typeof document === 'undefined') return null;

  const getCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const initial = getCookie();
  if (initial) return initial;

  return new Promise((resolve) => {
    const interval = 100;
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += interval;
      const val = getCookie();
      if (val) {
        clearInterval(timer);
        resolve(val);
      } else if (elapsed >= maxWaitMs) {
        clearInterval(timer);
        resolve(null);
      }
    }, interval);
  });
}
