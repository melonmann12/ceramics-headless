// This module is server-only. It will never be sent to the browser.
// The 'server-only' package causes a build error if imported from a Client Component.
import 'server-only';

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
if (!storeDomain) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable');
}
if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain,
  apiVersion: '2026-07',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});
