'use server';

import { revalidateTag } from 'next/cache';

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

  // 7. Extract and validate picture URLs
  const rawPictureUrls = formData.getAll('picture_urls');
  if (rawPictureUrls.length > 5) {
    return { success: false, error: 'You can only attach a maximum of 5 images.' };
  }
  
  const picture_urls: string[] = [];
  for (const url of rawPictureUrls) {
    const urlStr = url?.toString() || '';
    if (!urlStr.startsWith('https://')) {
      return { success: false, error: 'Invalid image URL provided.' };
    }
    // Verify it belongs to cloudinary domain (optional but good security)
    if (!urlStr.includes('res.cloudinary.com')) {
      return { success: false, error: 'Invalid image origin.' };
    }
    picture_urls.push(urlStr);
  }

  // 8. Submit to Judge.me
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

    // Invalidate caches so the new review immediately appears if it is auto-published
    revalidateTag(`judgeme-product-${productId}`, 'max');
    revalidateTag('judgeme-ratings', 'max');

    return { success: true };
  } catch (error) {
    console.error('Error submitting review to Judge.me REST API');
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
