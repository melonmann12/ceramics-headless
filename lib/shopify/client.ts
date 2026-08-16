// This module is server-only. It will never be sent to the browser.
// The 'server-only' package causes a build error if imported from a Client Component.
import 'server-only';

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

if (!process.env.SHOPIFY_STORE_DOMAIN) {
  throw new Error('Missing SHOPIFY_STORE_DOMAIN environment variable');
}
if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
  apiVersion: '2025-01',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});
