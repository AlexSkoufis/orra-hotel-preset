'use client';

import { useRef } from 'react';
import { hotel, heroCopy } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { whenReady } from '@/lib/ready';
import { Img } from './Img';

/**
 * Hero: the photograph is first seen only through the letters of the wordmark (an SVG
 * mask cut out of a sand-coloured veil). Scrolling zooms the letters until the veil falls
 * away and the whole view opens. Reduced motion: the open photograph with its caption.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      el.classList.add('is-masked');
      el.dataset.nav = 'light'; // dark text over the sand veil until the photo opens
      window.dispatchEvent(new Event('orra:nav'));
      // Intro plays when the preloader lifts: the letters settle from a slight zoom.
      gsap.set('.hero__kicker, .hero__hint', { autoAlpha: 0 });
      const cancel = whenReady(() => {
        gsap.fromTo('.hero__veil', { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'scale' });
        gsap.to('.hero__kicker, .hero__hint', { autoAlpha: 1, y: 0, duration: 1.2, delay: 0.5, stagger: 0.1 });
      });

      let dark = false;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const d = self.progress > 0.55;
            if (d !== dark) {
              dark = d;
              el.dataset.nav = d ? 'dark' : 'light';
              window.dispatchEvent(new Event('orra:nav'));
            }
          },
        },
      });
      tl.to('.hero__veil', { scale: 26, duration: 1, ease: 'power2.in' }, 0)
        .to('.hero__veil', { autoAlpha: 0, duration: 0.25 }, 0.62)
        .fromTo('.hero__photo', { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .to('.hero__kicker, .hero__hint', { autoAlpha: 0, duration: 0.15 }, 0.05)
        .from('.hero__mask-line > span', { yPercent: 110, stagger: 0.06, duration: 0.3, ease: 'power3.out' }, 0.7)
        .from('.hero__meta', { autoAlpha: 0, duration: 0.2 }, 0.8);
      return () => {
        cancel();
        el.classList.remove('is-masked');
        el.dataset.nav = 'dark';
      };
    });
  });

  return (
    <section id="top" ref={root} className="hero" data-nav="dark" aria-labelledby="hero-title">
      <div className="hero__stage">
        <div className="hero__photo">
          <Img image="hero" alt="Saltwater infinity pool on the cliff edge, facing the open sea" sizes="100vw" priority />
        </div>
        <span className="hero__shade" aria-hidden="true" />

        <svg className="hero__veil" aria-hidden="true" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1600 1000">
          <defs>
            <mask id="hero-mask" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="9600" height="9000">
              {/* Oversized so the veil covers any aspect ratio while the word stays fully visible. */}
              <rect x="-4000" y="-4000" width="9600" height="9000" fill="white" />
              <text x="800" y="560" textAnchor="middle" dominantBaseline="middle">
                {hotel.wordmark}
              </text>
            </mask>
          </defs>
          <rect x="-4000" y="-4000" width="9600" height="9000" className="hero__veil-fill" mask="url(#hero-mask)" />
        </svg>

        <p className="hero__kicker">{heroCopy.kicker}</p>
        <p className="hero__hint" aria-hidden="true">
          <span />
          {heroCopy.scroll}
        </p>

        <h1 id="hero-title" className="hero__line">
          <span className="sr-only">{hotel.full} — </span>
          {heroCopy.line.map((l) => (
            <span key={l} className="hero__mask-line">
              <span>{l}</span>
            </span>
          ))}
        </h1>
        <p className="hero__meta">
          <span>{hotel.place}</span>
          <span>{hotel.coords}</span>
          <span>{hotel.line}</span>
        </p>
      </div>
    </section>
  );
}
