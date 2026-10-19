'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, MQ } from '@/lib/motion';

// Elements the pointer snaps onto (iPadOS-style). Big areas (cards, photos) keep the dot.
const SNAP = 'a, button, select, [role="tab"], label.book__field';
const TEXT = 'input, textarea';
const MAX_W = 420;
const MAX_H = 120;
const DOT = 18;
const PAD_X = 12;
const PAD_Y = 8;

type Mode = 'dot' | 'snap' | 'text';

/**
 * iPad-style pointer: a soft translucent dot that morphs into a highlight around the
 * button or link under it — matching its shape (pills stay pills), leaning a little
 * toward the finger's direction — and becomes an I-beam over text fields.
 * Mouse/trackpad only; touch and reduced-motion users keep the system cursor.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`${MQ.fine} and ${MQ.motion}`);
    const s = () => setOn(mq.matches);
    s();
    mq.addEventListener('change', s);
    return () => mq.removeEventListener('change', s);
  }, []);

  useEffect(() => {
    if (!on || !ref.current) return;
    const el = ref.current;
    document.documentElement.classList.add('has-cursor');
    gsap.set(el, { xPercent: -50, yPercent: -50, width: DOT, height: DOT, borderRadius: DOT / 2 });
    const qx = gsap.quickTo(el, 'x', { duration: 0.22, ease: 'power3.out' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.22, ease: 'power3.out' });

    let mode: Mode = 'dot';
    let target: HTMLElement | null = null;
    let mx = -100;
    let my = -100;
    let shown = false;

    const radiusFor = (t: HTMLElement, h: number) => {
      const r = parseFloat(getComputedStyle(t).borderTopLeftRadius) || 0;
      return Math.min(r > 0 ? r + PAD_Y : 10, (h + PAD_Y * 2) / 2);
    };

    const place = () => {
      if (mode === 'snap' && target) {
        // Sit on the element's centre, drifting a fraction toward the pointer.
        const r = target.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        qx(cx + (mx - cx) * 0.14);
        qy(cy + (my - cy) * 0.14);
      } else {
        qx(mx);
        qy(my);
      }
    };

    const setMode = (next: Mode, t: HTMLElement | null) => {
      if (next === mode && t === target) return;
      mode = next;
      target = t;
      el.dataset.mode = next;
      if (next === 'snap' && t) {
        const r = t.getBoundingClientRect();
        gsap.to(el, { width: r.width + PAD_X * 2, height: r.height + PAD_Y * 2, borderRadius: radiusFor(t, r.height), duration: 0.32, ease: 'power3.out' });
      } else if (next === 'text' && t) {
        const fs = parseFloat(getComputedStyle(t).fontSize) || 16;
        gsap.to(el, { width: 3, height: fs * 1.3, borderRadius: 2, duration: 0.25, ease: 'power3.out' });
      } else {
        gsap.to(el, { width: DOT, height: DOT, borderRadius: DOT / 2, duration: 0.3, ease: 'power3.out' });
      }
    };

    const resolve = (node: Element | null) => {
      if (!node) return setMode('dot', null);
      const text = node.closest<HTMLElement>(TEXT);
      if (text) return setMode('text', text);
      const snap = node.closest<HTMLElement>(SNAP);
      if (snap) {
        const r = snap.getBoundingClientRect();
        if (r.width <= MAX_W && r.height <= MAX_H) return setMode('snap', snap);
      }
      setMode('dot', null);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: mx, y: my });
        el.classList.add('is-on');
      }
      resolve(e.target as Element);
      place();
    };
    // Content moves under a still pointer while scrolling: re-check what's beneath it.
    const scroll = () => {
      if (!shown) return;
      resolve(document.elementFromPoint(mx, my));
      place();
    };
    const down = () => gsap.to(el, { scale: 0.88, duration: 0.15 });
    const up = () => gsap.to(el, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
    const leave = () => {
      shown = false;
      el.classList.remove('is-on');
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [on]);

  if (!on) return null;
  return <div ref={ref} className="ptr" data-mode="dot" aria-hidden="true" />;
}
