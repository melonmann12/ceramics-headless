import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OURA CERAMICS — Handcrafted Matcha Bowls",
    template: "%s | OURA CERAMICS",
  },
  description:
    "Handcrafted ceramic matcha bowls built for daily rituals. Hand-glazed in kilns, shipped worldwide.",
  keywords: [
    "matcha bowl",
    "ceramic matcha bowl",
    "handcrafted ceramics",
    "Japanese ceramics",
    "matcha ceremony",
  ],
  metadataBase: new URL("https://oura-ceramics.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "OURA CERAMICS",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Fredoka (headings) + Inter (body) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
        />
        {/*
          Material Symbols Outlined icon font.
          display=swap — do NOT use display=block, it prevents rendering until loaded.
          The <link> tag inside <head> in App Router layout.tsx is correctly merged
          by Next.js with its own injected head tags.
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
