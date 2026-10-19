'use client';

import { useEffect, useRef, useState } from 'react';
import { rooms } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

/**
 * Rooms: a draggable strip with inertia for mouse users; native swipe (scroll-snap) on touch.
 * Arrow buttons and keyboard focus move card by card. A progress rule tracks position.
 */
export default function Rooms() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const pos = useRef({ x: 0, min: 0 });
  const dragMode = useRef(false);

  useEffect(() => {
    const vp = viewport.current!;
    const tr = track.current!;
    const fine = window.matchMedia(MQ.fine).matches;
    dragMode.current = fine;
    vp.classList.toggle('is-drag', fine);
    if (!fine) {
      const onScroll = () => setProgress(vp.scrollLeft / Math.max(1, vp.scrollWidth - vp.clientWidth));
      vp.addEventListener('scroll', onScroll, { passive: true });
      return () => vp.removeEventListener('scroll', onScroll);
    }
    const measure = () => {
      pos.current.min = Math.min(0, vp.clientWidth - tr.scrollWidth);
      go(pos.current.x, 0);
    };
    const setX = gsap.quickSetter(tr, 'x', 'px');
    let tween: gsap.core.Tween | null = null;
    function go(x: number, dur = 0.9) {
      const clamped = Math.max(pos.current.min, Math.min(0, x));
      tween?.kill();
      const o = { x: pos.current.x };
      tween = gsap.to(o, {
        x: clamped,
        duration: dur,
        ease: 'expo.out',
        onUpdate: () => {
          pos.current.x = o.x;
          setX(o.x);
          setProgress(pos.current.min ? o.x / pos.current.min : 0);
        },
      });
    }
    (vp as HTMLDivElement & { go?: typeof go }).go = go;

    let startX = 0;
    let startPos = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let dragging = false;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = lastX = e.clientX;
      startPos = pos.current.x;
      lastT = performance.now();
      vel = 0;
      tween?.kill();
      vp.classList.add('is-grabbing');
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      let x = startPos + dx;
      if (x > 0) x *= 0.35; // rubber band at the ends
      if (x < pos.current.min) x = pos.current.min + (x - pos.current.min) * 0.35;
      pos.current.x = x;
      setX(x);
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      vp.classList.remove('is-grabbing');
      go(pos.current.x + vel * 420, 1.2);
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    vp.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    vp.addEventListener('click', click, true);
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    measure();
    return () => {
      vp.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      vp.removeEventListener('click', click, true);
      ro.disconnect();
      tween?.kill();
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const vp = viewport.current as (HTMLDivElement & { go?: (x: number) => void }) | null;
    const card = track.current?.firstElementChild as HTMLElement | null;
    if (!vp || !card) return;
    const w = card.offsetWidth + parseFloat(getComputedStyle(track.current!).columnGap || '0');
    if (dragMode.current && vp.go) vp.go(pos.current.x - dir * w);
    else vp.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  // Keyboard focus on a card brings it into view in drag mode.
  const onFocus = (e: React.FocusEvent<HTMLLIElement>) => {
    const vp = viewport.current as (HTMLDivElement & { go?: (x: number) => void }) | null;
    if (!dragMode.current || !vp?.go) return;
    vp.scrollLeft = 0;
    const left = e.currentTarget.offsetLeft;
    vp.go(-left + 24);
  };

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.room', { x: 120, autoAlpha: 0, stagger: 0.08, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.rooms__viewport', start: 'top 85%', once: true } });
      gsap.from('.rooms__title .l > span', { yPercent: 110, stagger: 0.08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.rooms__title', start: 'top 85%', once: true } });
    });
  });

  return (
    <section id="rooms" ref={root} className="rooms" data-nav="light" aria-labelledby="rooms-title">
      <header className="rooms__head wrap">
        <p className="eyebrow">Rooms & suites</p>
        <h2 id="rooms-title" className="rooms__title display">
          <span className="l">
            <span>Sleep with</span>
          </span>
          <span className="l">
            <span>
              <em>the windows open</em>
            </span>
          </span>
        </h2>
        <div className="rooms__nav">
          <button onClick={() => step(-1)} aria-label="Previous room">
            ←
          </button>
          <button onClick={() => step(1)} aria-label="Next room">
            →
          </button>
        </div>
      </header>

      <div className="rooms__viewport" ref={viewport} data-cursor="Drag">
        <ul className="rooms__track" ref={track}>
          {rooms.map((r, i) => (
            <li key={r.name} className="room" onFocus={onFocus}>
              <a href="#book" onClick={(e) => (e.preventDefault(), window.dispatchEvent(new CustomEvent('orra:book', { detail: r.name })))} draggable={false}>
                <div className="room__media">
                  <Img image={r.images[0]} alt={`${r.name} interior`} sizes="(min-width: 1024px) 34vw, 82vw" className="room__a" />
                  <Img image={r.images[1]} alt="" sizes="(min-width: 1024px) 34vw, 82vw" className="room__b" />
                  <span className="room__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="room__kind">{r.kind}</span>
                </div>
                <div className="room__body">
                  <h3>{r.name}</h3>
                  <p className="room__note">{r.note}</p>
                  <ul className="room__facts">
                    <li>{r.size}</li>
                    <li>{r.view}</li>
                    <li>Sleeps {r.sleeps}</li>
                  </ul>
                  <p className="room__price">
                    from <b>€{r.from}</b> / night <span aria-hidden="true">→</span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="rooms__progress wrap" aria-hidden="true">
        <span style={{ transform: `scaleX(${0.15 + progress * 0.85})` }} />
      </div>
    </section>
  );
}
