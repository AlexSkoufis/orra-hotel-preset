'use client';

import { useEffect, useRef, useState } from 'react';
import { hotel } from '@/lib/content';
import { gsap, MQ } from '@/lib/motion';
import { markReady } from '@/lib/ready';
import { getLenis } from './SmoothScroll';

const MIN_MS = 1200; // long enough to read as intentional, short enough not to annoy

/**
 * Sand curtain shown from the very first paint (server-rendered). It counts to 100 while
 * the webfonts and the hero photograph load, then lifts — revealing the hero's sand veil
 * underneath, so the wordmark mask appears without the bare photo ever flashing.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const reduced = window.matchMedia(MQ.reduced).matches;
    // Hold the page still while loading.
    const lenisStop = window.setTimeout(() => getLenis()?.stop(), 0);
    if (window.scrollY < 20) window.scrollTo(0, 0);

    const heroImg = document.querySelector<HTMLImageElement>('.hero__photo img');
    const imgLoaded = new Promise<void>((res) => {
      if (!heroImg || heroImg.complete) return res();
      heroImg.addEventListener('load', () => res(), { once: true });
      heroImg.addEventListener('error', () => res(), { once: true });
    });
    const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
    const minWait = new Promise<void>((res) => window.setTimeout(res, reduced ? 0 : MIN_MS));
    const timeout = new Promise<void>((res) => window.setTimeout(res, 6000)); // never block forever

    // The counter eases toward 90 while waiting, then finishes to 100 once assets are in.
    const p = { v: 0 };
    const render = () => {
      if (num.current) num.current.textContent = String(Math.round(p.v)).padStart(2, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${p.v / 100})`;
    };
    const crawl = gsap.to(p, { v: 90, duration: 2.4, ease: 'power2.out', onUpdate: render });

    let done = false;
    let cancelled = false; // Strict Mode remounts: ignore the first run's promise
    Promise.race([Promise.all([imgLoaded, fonts, minWait]), timeout]).then(() => {
      if (done || cancelled) return;
      done = true;
      crawl.kill();
      const finish = () => {
        getLenis()?.start();
        markReady();
        setGone(true); // unmount via React, never by removing the node by hand
      };
      if (reduced) {
        gsap.to(el, { autoAlpha: 0, duration: 0.2, onComplete: finish });
        return;
      }
      gsap
        .timeline({ onComplete: finish })
        .to(p, { v: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render })
        .to('.pre__inner', { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, '+=0.1')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.25');
    });

    return () => {
      cancelled = true;
      window.clearTimeout(lenisStop);
      crawl.kill();
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="pre" aria-hidden="true">
      <div className="pre__inner">
        <p className="pre__mark">{hotel.name}</p>
        <p className="pre__count">
          <span ref={num}>00</span>
        </p>
        <span className="pre__track">
          <span ref={bar} className="pre__bar" />
        </span>
        <p className="pre__place">{hotel.place}</p>
      </div>
    </div>
  );
}
