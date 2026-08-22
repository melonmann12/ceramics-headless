import { NextRequest, NextResponse } from 'next/server';

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const publicAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!storeDomain || !publicAccessToken) {
    return NextResponse.json(
      { error: 'Missing Shopify configuration' },
      { status: 500 }
    );
  }

  const { path } = await params;
  
  // Construct the Shopify Storefront API URL
  const shopifyUrl = `https://${storeDomain}/api/${path.join('/')}`;

  try {
    // 1. Read request body
    const body = await req.text();

    // 2. Prepare headers for Shopify
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('X-Shopify-Storefront-Access-Token', publicAccessToken);

    // Forward buyer IP for accurate location/analytics
    const buyerIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    if (buyerIp) {
      headers.set('Shopify-Storefront-Buyer-IP', buyerIp);
    }

    // Forward existing cookies so Shopify can read/refresh _shopify_s, _shopify_y (or new tokens)
    const cookie = req.headers.get('cookie');
    if (cookie) {
      headers.set('cookie', cookie);
    }

    // 3. Proxy request to Shopify
    return fetch(shopifyUrl, {
      method: 'POST',
      headers,
      body,
    });
  } catch (error) {
    console.error('Shopify Analytics Proxy Error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
