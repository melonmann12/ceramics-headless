import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST() {
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    return NextResponse.json({ error: 'Missing Cloudinary configuration' }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000).toString();
  const folder = 'ashpia/reviews';
  
  // Sign only the parameters that will be passed to Cloudinary
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(paramsToSign + cloudinaryApiSecret).digest('hex');

  // Do not expose the API Secret
  return NextResponse.json({
    timestamp,
    signature,
    apiKey: cloudinaryApiKey,
    cloudName: cloudinaryCloudName,
    folder
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    }
  });
}
