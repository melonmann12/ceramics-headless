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

// ── Pixel ID ──────────────────────────────────────────────────────────

export const META_PIXEL_ID = '1752147842650225';

// ── Helpers ───────────────────────────────────────────────────────────

function fbq(...args: Parameters<FbqFunction>): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

// ── Public tracking API ───────────────────────────────────────────────

/** Fire a standard Meta "PageView" event. */
export function trackPageView(): void {
  fbq('track', 'PageView');
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
export function trackViewContent(params: ViewContentParams): void {
  fbq('track', 'ViewContent', params);
}

/**
 * Fire a standard Meta "AddToCart" event.
 * @stub – not wired up yet.
 */
export function trackAddToCart(params: Record<string, unknown>): void {
  fbq('track', 'AddToCart', params);
}

/**
 * Fire a standard Meta "InitiateCheckout" event.
 * @stub – not wired up yet.
 */
export function trackInitiateCheckout(params: Record<string, unknown>): void {
  fbq('track', 'InitiateCheckout', params);
}
