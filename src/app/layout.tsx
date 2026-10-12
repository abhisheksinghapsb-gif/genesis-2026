import type { Metadata, Viewport } from 'next';
import { Lilita_One, Rubik } from 'next/font/google';
import './globals.css';

const lilita = Lilita_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const rubik = Rubik({
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GENESIS 2026 — 5th Edition | GDXR Club, AIT Pune',
  description:
    'Official website for GENESIS 2026 (Fifth Edition), the flagship gaming and XR hackathon event organised by the GDXR Club (AR/VR Club) of AIT Pune.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://genesis2026.aitpune.edu.in'),
  icons: {
    icon: '/art/badge.png',
    apple: '/art/badge.png',
  },
  openGraph: {
    title: 'GENESIS 2026 — 5th Edition | GDXR Club, AIT Pune',
    description:
      'Official website for GENESIS 2026 (Fifth Edition), the flagship gaming and XR hackathon event organised by the GDXR Club of AIT Pune.',
    images: ['/art/badge.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GENESIS 2026 — 5th Edition | GDXR Club, AIT Pune',
    description:
      'Official website for GENESIS 2026 (Fifth Edition), the flagship gaming and XR hackathon event organised by the GDXR Club of AIT Pune.',
    images: ['/art/badge.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#291588',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lilita.variable} ${rubik.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 2)) {
                  document.documentElement.setAttribute('data-motion', 'lite');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#01072B] text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cta-yellow focus:text-black focus:font-bold focus:rounded focus:outline-none focus:ring-4 focus:ring-node-gold"
        >
          Skip to content
        </a>
        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
