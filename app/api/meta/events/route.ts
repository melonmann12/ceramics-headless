import { NextRequest, NextResponse } from 'next/server';
import { sendMetaCapiEvent, MetaCapiEvent } from '@/lib/meta-capi';

const ALLOWED_EVENTS = ['PageView', 'ViewContent', 'AddToCart'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { event_name, event_id, custom_data, event_source_url } = body;

    if (!event_name || !ALLOWED_EVENTS.includes(event_name)) {
      return NextResponse.json(
        { error: 'Invalid or unsupported event name' },
        { status: 400 }
      );
    }

    if (!event_id) {
      return NextResponse.json(
        { error: 'event_id is required' },
        { status: 400 }
      );
    }

    const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const client_ip_address = rawIp ? rawIp.split(',').map(ip => ip.trim()).find(ip => ip.length > 0) || null : null;
    const client_user_agent = req.headers.get('user-agent');
    
    // Retrieve Meta cookies if available
    const fbp = req.cookies.get('_fbp')?.value;
    const fbc = req.cookies.get('_fbc')?.value;

    const eventPayload: MetaCapiEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      action_source: 'website',
      event_source_url: event_source_url || req.headers.get('referer') || '',
      user_data: {
        client_ip_address,
        client_user_agent,
        ...(fbp ? { fbp } : {}),
        ...(fbc ? { fbc } : {}),
      },
      ...(custom_data ? { custom_data } : {}),
    };

    // We do NOT await sendMetaCapiEvent to keep the route non-blocking.
    // However, in Next.js Serverless environments, background tasks may be killed if the response returns immediately.
    // Next.js waitUntil allows extending the execution context.
    
    // Fallback: Awaiting it ensures it fires before the lambda dies, but it blocks the client response.
    // To make it non-blocking for storefront functionality, the client should not block on this fetch.
    await sendMetaCapiEvent(eventPayload);

    return NextResponse.json({ success: true, event_id });
  } catch (error) {
    console.error('Meta CAPI Route Error:', error);
    // Return 200 even on error to keep it non-blocking from the client perspective if needed,
    // but returning 500 is standard and the client should catch it.
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
