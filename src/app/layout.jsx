import React from 'react';
import './globals.css';

export const metadata = {
  title: 'AI Memory Wall - Leave your mark in digital history',
  description: 'Interactive guestbook with AI personalization. Share thoughts, get reactions, and be inspired by messages from other users.',
  keywords: 'guestbook, AI, memory wall, messages, community',
  openGraph: {
    title: 'AI Memory Wall',
    description: 'Interactive guestbook with AI personalization',
    url: 'https://ai-memory-wall.vercel.app',
    siteName: 'AI Memory Wall',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Memory Wall',
    description: 'Interactive guestbook with AI personalization',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  themeColor: '#00E0FF',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
        
        {/* Structured data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AI Memory Wall',
              url: 'https://ai-memory-wall.vercel.app',
              description: 'Interactive guestbook with AI personalization',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://ai-memory-wall.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
