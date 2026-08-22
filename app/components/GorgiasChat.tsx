'use client';

import { useState } from 'react';
import Script from 'next/script';

export default function GorgiasChat() {
  const [primaryLoaded, setPrimaryLoaded] = useState(false);

  return (
    <>
      <Script
        id="gorgias-chat-widget-install-v3"
        src="https://config.gorgias.chat/bundle-loader/01M0N4MTBXTMCA7Y1F9MJ1EBQJ"
        strategy="afterInteractive"
        onLoad={() => {
          setPrimaryLoaded(true);
        }}
      />
      {primaryLoaded && (
        <Script
          id="gorgias-secondary-loader"
          src="https://static.9gtb.com/loader.js?g_cvt_id=c03f1b04-3601-45f0-bab8-5a3d77c26792&shop=matcha-9500.myshopify.com"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
