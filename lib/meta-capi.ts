import { META_PIXEL_ID } from './meta-pixel';

export interface MetaCapiEvent {
  event_name: 'PageView' | 'ViewContent' | 'AddToCart';
  event_time: number;
  event_id: string;
  action_source: 'website';
  event_source_url: string;
  user_data: {
    client_ip_address?: string | null;
    client_user_agent?: string | null;
    fbp?: string | null;
    fbc?: string | null;
  };
  custom_data?: Record<string, any>;
}

export async function sendMetaCapiEvent(event: MetaCapiEvent) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn('META_CAPI_ACCESS_TOKEN is not defined. CAPI event skipped.');
    return;
  }

  const testEventCode = process.env.META_TEST_EVENT_CODE;
  
  const rawVersion = process.env.META_GRAPH_API_VERSION;
  if (!rawVersion) {
    throw new Error('META_GRAPH_API_VERSION is not configured');
  }
  
  const graphApiVersion = rawVersion.trim().replace(/\//g, '');
  
  if (!/^v\d+\.\d+$/.test(graphApiVersion)) {
    throw new Error(`Invalid META_GRAPH_API_VERSION format: ${graphApiVersion}. Expected format like v20.0`);
  }

  const payload = {
    data: [event],
    ...(testEventCode && { test_event_code: testEventCode }),
  };

  const url = `https://graph.facebook.com/${graphApiVersion}/${META_PIXEL_ID}/events?access_token=${accessToken}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Meta CAPI Error (${response.status}):`, errorText);
    }
  } catch (err) {
    console.error('Failed to send Meta CAPI event:', err);
  }
}
