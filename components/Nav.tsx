'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { hotel, nav, type ImageKey } from '@/lib/content';
import { gsap, ScrollTrigger, MQ } from '@/lib/motion';
import { Img } from './Img';
import { getLenis, scrollToTarget } from './SmoothScroll';

function useLocalTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: hotel.timeZone });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

/** Minimal bar: Menu left, wordmark centre, Book right. Colour follows the section underneath. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [preview, setPreview] = useState<ImageKey>(nav[0].image);
  const menu = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const time = useLocalTime();

  useEffect(() => {
    const read = () => {
      // The section under the bar decides the colour; the hero sets data-nav itself as it opens.
      const el = document.elementsFromPoint(window.innerWidth / 2, 34).find((e) => e.closest('[data-nav]'));
      const t = el?.closest<HTMLElement>('[data-nav]')?.dataset.nav;
      setTheme(t === 'dark' ? 'dark' : 'light');
      setScrolled(window.scrollY > 40);
    };
    read();
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: read });
    window.addEventListener('orra:nav', read);
    return () => {
      st.kill();
      window.removeEventListener('orra:nav', read);
    };
  }, []);

  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const reduced = window.matchMedia(MQ.reduced).matches;
    const t = gsap.timeline({ paused: true, onReverseComplete: () => void (m.hidden = true) });
    if (reduced) t.fromTo(m, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
    else
      t.fromTo(m, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' })
        .from(m.querySelectorAll('.menu__rise'), { yPercent: 110, stagger: 0.05, duration: 1.1, ease: 'expo.out' }, 0.4)
        .from(m.querySelector('.menu__img'), { scale: 1.15, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, 0.45)
        .from(m.querySelectorAll('.menu__meta > *'), { autoAlpha: 0, y: 10, stagger: 0.05, duration: 0.8 }, 0.7);
    tl.current = t;
    return () => void t.kill();
  }, []);

  const close = useCallback((then?: string) => {
    setOpen(false);
    getLenis()?.start();
    tl.current?.timeScale(1.5).reverse();
    btn.current?.focus({ preventScroll: true });
    if (then) window.setTimeout(() => scrollToTarget(then), 320);
  }, []);
  const openMenu = () => {
    if (!menu.current) return;
    menu.current.hidden = false;
    setOpen(true);
    getLenis()?.stop();
    tl.current?.timeScale(1).play();
    window.setTimeout(() => menu.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }), 350);
  };

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !menu.current) return;
      const f = [btn.current!, ...menu.current.querySelectorAll<HTMLElement>('a, button')];
      const i = f.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i + 1) % f.length].focus();
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open, close]);

  return (
    <>
      <header className={`nav nav--${open ? 'light' : theme}${scrolled ? ' is-scrolled' : ''}`}>
        <button ref={btn} className="nav__menu" onClick={() => (open ? close() : openMenu())} aria-expanded={open} aria-controls="menu" data-cursor={open ? 'Close' : 'Open'}>
          <span className="nav__lines" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
        <a href="#top" className="nav__mark" onClick={(e) => (e.preventDefault(), open ? close('#top') : scrollToTarget(0))} aria-label={`${hotel.full} — top`}>
          {hotel.name}
        </a>
        <div className="nav__right">
          <span className="nav__time" aria-label={`Local time in Milos ${time}`}>
            Milos {time}
          </span>
          <a href="#book" className="nav__book" onClick={(e) => (e.preventDefault(), window.dispatchEvent(new Event('orra:book')))} data-cursor="Book">
            Book a stay
          </a>
        </div>
      </header>

      <div id="menu" ref={menu} className="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
        <nav className="menu__list" aria-label="Sections">
          {nav.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              className="menu__item"
              onClick={(e) => (e.preventDefault(), close(n.href))}
              onPointerEnter={() => setPreview(n.image)}
              onFocus={() => setPreview(n.image)}
            >
              {/* Outer span rises on open (GSAP); inner label slides on hover (CSS) — never both on one element. */}
              <span className="menu__rise">
                <em>{String(i + 1).padStart(2, '0')}</em>
                <span className="menu__lab">{n.label}</span>
              </span>
            </a>
          ))}
        </nav>
        <div className="menu__img" aria-hidden="true">
          {nav.map((n) => (
            <Img key={n.href} image={n.image} alt="" sizes="(min-width: 1024px) 30vw, 1px" className={preview === n.image ? 'on' : ''} />
          ))}
        </div>
        <div className="menu__meta">
          <p>{hotel.address.join(', ')}</p>
          <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
          <a href={hotel.phoneHref}>{hotel.phone}</a>
          <p>{hotel.season}</p>
        </div>
      </div>
    </>
  );
}
