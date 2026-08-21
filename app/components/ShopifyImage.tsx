'use client';

import Image, { ImageProps, ImageLoaderProps } from 'next/image';

const shopifyLoader = ({ src, width }: ImageLoaderProps) => {
  if (!src || !src.includes('cdn.shopify.com')) return src;
  try {
    const parsedUrl = new URL(src);
    parsedUrl.searchParams.set('width', width.toString());
    return parsedUrl.toString();
  } catch (e) {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}width=${width}`;
  }
};

export default function ShopifyImage(props: ImageProps) {
  return <Image {...props} loader={shopifyLoader} />;
}
