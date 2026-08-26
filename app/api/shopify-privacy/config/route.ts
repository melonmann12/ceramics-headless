import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checkoutRootDomain =
    process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN ||
    process.env.SHOPIFY_CHECKOUT_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN;

  if (!checkoutRootDomain) {
    return NextResponse.json(
      { error: 'Missing Shopify privacy configuration' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      checkoutRootDomain,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
