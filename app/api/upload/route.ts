import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // ignore if dir exists
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    // Since we are running on localhost, returning the relative path is fine.
    // In production, we would return a full URL to the CDN/storage bucket.
    // Ensure the domain is provided if needed by Shopify line item properties.
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    
    // Some platforms require an absolute URL for line item properties to render correctly in emails
    const imageUrl = `${protocol}://${host}/uploads/${filename}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
