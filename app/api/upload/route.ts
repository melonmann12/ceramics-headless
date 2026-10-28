import crypto from 'crypto';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const UPLOAD_FOLDER = 'ashpia/product-customizations';
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function hasValidImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === 'image/png') {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= signature.length && signature.every((byte, index) => bytes[index] === byte);
  }

  if (mimeType === 'image/webp') {
    return bytes.length >= 12
      && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
      && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('[product-photo-upload] Cloudinary configuration is incomplete');
      return NextResponse.json(
        { error: 'Photo uploads are temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please choose an image to upload.' }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG, or WEBP image.' }, { status: 415 });
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'The image must be 5MB or smaller.' }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasValidImageSignature(bytes, file.type)) {
      return NextResponse.json({ error: 'The selected file is not a valid supported image.' }, { status: 415 });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const publicId = crypto.randomUUID();
    const parameters = `folder=${UPLOAD_FOLDER}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = crypto.createHash('sha1').update(parameters + apiSecret).digest('hex');

    const cloudinaryForm = new FormData();
    cloudinaryForm.set('file', new Blob([bytes], { type: file.type }), 'upload');
    cloudinaryForm.set('api_key', apiKey);
    cloudinaryForm.set('timestamp', timestamp);
    cloudinaryForm.set('signature', signature);
    cloudinaryForm.set('folder', UPLOAD_FOLDER);
    cloudinaryForm.set('public_id', publicId);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: 'POST', body: cloudinaryForm, signal: AbortSignal.timeout(30_000) }
    );

    if (!uploadResponse.ok) {
      console.error('[product-photo-upload] Cloudinary rejected upload with status', uploadResponse.status);
      return NextResponse.json({ error: 'The photo could not be uploaded. Please try again.' }, { status: 502 });
    }

    const uploadResult: unknown = await uploadResponse.json();
    const secureUrl = typeof uploadResult === 'object' && uploadResult !== null
      && 'secure_url' in uploadResult && typeof uploadResult.secure_url === 'string'
      ? uploadResult.secure_url
      : null;

    if (!secureUrl || new URL(secureUrl).hostname !== 'res.cloudinary.com') {
      console.error('[product-photo-upload] Cloudinary response did not contain a valid secure URL');
      return NextResponse.json({ error: 'The photo could not be uploaded. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ url: secureUrl });
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? 'timed out' : 'failed';
    console.error(`[product-photo-upload] Upload ${reason}`);
    return NextResponse.json({ error: 'The photo could not be uploaded. Please try again.' }, { status: 500 });
  }
}
