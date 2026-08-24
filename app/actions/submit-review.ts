'use server';

import crypto from 'crypto';

export async function submitJudgeMeReview(formData: FormData) {
  // 1. Honeypot check
  const honeypot = formData.get('bot_field')?.toString();
  if (honeypot) {
    // If the hidden field is filled, silently reject it as a bot
    return { success: true }; // Pretend it succeeded
  }

  // 2. Extract fields
  const productId = formData.get('productId')?.toString();
  const name = formData.get('name')?.toString()?.trim();
  const email = formData.get('email')?.toString()?.trim();
  const ratingStr = formData.get('rating')?.toString();
  const title = formData.get('title')?.toString()?.trim();
  const body = formData.get('body')?.toString()?.trim();

  // 3. Validate presence
  if (!productId || !name || !email || !ratingStr || !body) {
    return { success: false, error: 'Please fill out all required fields.' };
  }

  // 4. Validate rating
  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: 'Invalid rating submitted.' };
  }

  // 5. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // 6. Validate lengths
  if (name.length > 100 || email.length > 200 || (title && title.length > 200) || body.length > 5000) {
    return { success: false, error: 'Input exceeds maximum allowed length.' };
  }

  // 7. Extract and validate images
  const images = formData.getAll('images') as File[];
  if (images.length > 5) {
    return { success: false, error: 'You can only upload a maximum of 5 images.' };
  }

  for (const image of images) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
      return { success: false, error: 'Please only upload images (JPEG, PNG, WEBP).' };
    }
    if (image.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Each image must be smaller than 5MB.' };
    }
  }

  // 8. Upload images to Cloudinary
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (images.length > 0 && (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret)) {
    console.error('Missing Cloudinary credentials in environment');
    return { success: false, error: 'System configuration error. Image upload is currently unavailable.' };
  }

  const picture_urls: string[] = [];

  if (images.length > 0) {
    try {
      for (const image of images) {
        const timestamp = Math.round(Date.now() / 1000).toString();
        const folder = 'ashpia/reviews';
        
        // Create signature
        const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
        const signature = crypto.createHash('sha1').update(paramsToSign + cloudinaryApiSecret).digest('hex');
        
        const arrayBuffer = await image.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: image.type });
        
        const uploadFormData = new FormData();
        uploadFormData.append('folder', folder);
        uploadFormData.append('api_key', cloudinaryApiKey!);
        uploadFormData.append('timestamp', timestamp);
        uploadFormData.append('signature', signature);
        uploadFormData.append('file', blob, image.name || 'upload.jpg');
        
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          body: uploadFormData
        });
        
        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          const diagnosticMsg = `\n--- CLOUDINARY UPLOAD FAILURE DIAGNOSTICS ---\nHTTP status: ${uploadRes.status}\nResponse body: ${errorText}\nUpload endpoint: ${uploadUrl}\nCLOUDINARY_CLOUD_NAME exists: ${!!cloudinaryCloudName}\nCLOUDINARY_API_KEY exists: ${!!cloudinaryApiKey}\nCLOUDINARY_API_SECRET exists: ${!!cloudinaryApiSecret}\nImage MIME type: ${image.type}\nImage byte size: ${image.size}\nSigned parameters: folder, timestamp\n---------------------------------------------\n`;
          console.error(diagnosticMsg);
          require('fs').writeFileSync('/tmp/cloudinary-error.log', diagnosticMsg);
          return { success: false, error: 'Failed to upload images. Please try again or submit without images.' };
        }
        
        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          picture_urls.push(uploadData.secure_url);
        }
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return { success: false, error: 'Failed to upload images. Please try again or submit without images.' };
    }
  }

  // 9. Submit to Judge.me
  const publicToken = process.env.JUDGEME_PUBLIC_TOKEN;
  const storeDomain = process.env.JUDGEME_SHOP_DOMAIN;

  if (!publicToken || !storeDomain) {
    console.error('Missing Judge.me tokens in environment');
    return { success: false, error: 'System configuration error. Please try again later.' };
  }

  try {
    const res = await fetch('https://judge.me/api/v1/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_token: publicToken,
        shop_domain: storeDomain,
        platform: 'shopify',
        id: productId,
        email,
        name,
        rating,
        title: title || '',
        body,
        picture_urls
      })
    });

    if (!res.ok) {
      // Don't log full response or email to avoid exposing PII/secrets unnecessarily
      console.error('Judge.me API submission failed with status:', res.status);
      return { success: false, error: 'Failed to submit review. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting review to Judge.me REST API');
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
