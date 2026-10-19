import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';
import { Bodoni_Moda, Hanken_Grotesk } from 'next/font/google';
import { srcSet } from '@/components/Img';
import { hotel } from '@/lib/content';
import './globals.css';

const serif = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: `${hotel.full} — ${hotel.line}`,
  description: `${hotel.full}: a boutique cliff-house hotel on ${hotel.place}. A fictional hotel design concept.`,
};

export const viewport: Viewport = { themeColor: '#f3eee6', width: 'device-width', initialScale: 1 };

// Set before first paint: `motion` sizes the scroll sequences and shows the hero veil;
// `is-loading` holds scroll under the preloader (with an 8s safety release).
const motionFlag = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')}catch(e){}var d=document.documentElement;d.classList.add('is-loading');setTimeout(function(){d.classList.remove('is-loading')},8000)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  preload('/img/hero-1200.avif', { as: 'image', imageSrcSet: srcSet('hero', 'avif'), imageSizes: '100vw', type: 'image/avif', fetchPriority: 'high' });
  return (
    // suppressHydrationWarning: the inline script adds the `motion` class to <html> before
    // React hydrates; that intentional pre-paint change must not count as a mismatch.
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
