import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Hud } from '@/components/hud/Hud';
import { GameLoader } from '@/components/ui/GameLoader';
import { CursorSparkles } from '@/components/ambient/CursorSparkles';

const lilitaOne = localFont({
  src: '../public/fonts/lilita-one.woff2',
  variable: '--font-heading',
  display: 'swap',
});

const nunito = localFont({
  src: '../public/fonts/nunito.woff2',
  variable: '--font-body',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'GENESIS 2026 | 5th Edition GDXR Event • AIT Pune',
  description:
    'The 5th edition of the GDXR (AR/VR) Club flagship gaming and virtual reality competition at Army Institute of Technology, Pune. ₹60,000 cash prize pool.',
  keywords: ['GENESIS 2026', 'GDXR', 'AIT Pune', 'Gaming Event', 'VR Competition', 'AR VR Club', 'Esports Pune'],
  authors: [{ name: 'GDXR Club, AIT Pune' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'GENESIS 2026 | 5th Edition GDXR Event • AIT Pune',
    description:
      'The 5th edition of the GDXR (AR/VR) Club flagship gaming and virtual reality competition at Army Institute of Technology, Pune. ₹60,000 cash prize pool.',
    url: siteUrl,
    siteName: 'GENESIS 2026',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GENESIS 2026 - 5th Edition GDXR Event at AIT Pune',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GENESIS 2026 | 5th Edition GDXR Event • AIT Pune',
    description:
      'The 5th edition of the GDXR (AR/VR) Club flagship gaming and virtual reality competition at Army Institute of Technology, Pune. ₹60,000 cash prize pool.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060D24',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lilitaOne.variable} ${nunito.variable}`}>
      <body className="antialiased min-h-screen bg-[#060D24] text-white selection:bg-amber-400 selection:text-black">
        <GameLoader />
        <Hud />
        <CursorSparkles />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
