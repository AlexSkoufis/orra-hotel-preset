'use client';

import { useEffect, useRef, useState } from 'react';
import { gallery, reviews } from '@/lib/content';
import { gsap, MQ, useInView } from '@/lib/motion';
import { Img } from './Img';

const ROW_A = gallery.slice(0, 6);
const ROW_B = gallery.slice(6);
const RATIO = ['r-land', 'r-port', 'r-sq', 'r-land', 'r-port', 'r-wide'];

function Row({ items, dir, offset }: { items: typeof gallery; dir: 1 | -1; offset: number }) {
  const list = [...items, ...items];
  return (
    <div className="gal__row" data-dir={dir}>
      <div className="gal__track">
        {list.map((k, i) => (
          <figure key={i} className={`gal__item ${RATIO[(i + offset) % RATIO.length]}`} aria-hidden={i >= items.length || undefined}>
            <Img image={k} alt={i >= items.length ? '' : 'Orra journal photograph'} sizes="(min-width: 1024px) 28vw, 60vw" />
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Journal: two rows drifting in opposite directions; scroll speed pushes them faster. Then reviews. */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root);
  const [q, setQ] = useState(0);

  useEffect(() => {
    if (!inView || !window.matchMedia(MQ.motion).matches) return;
    const rows = [...root.current!.querySelectorAll<HTMLElement>('.gal__row')];
    const state = rows.map(() => ({ x: 0 }));
    let boost = 0;
    let lastY = window.scrollY;
    const tick = (_t: number, dt: number) => {
      // Scroll distance this frame → a smoothed speed boost for the drift.
      const v = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost += (Math.min(v, 60) / 8 - boost) * 0.08;
      rows.forEach((row, i) => {
        const track = row.firstElementChild as HTMLElement;
        const half = track.scrollWidth / 2;
        const dir = Number(row.dataset.dir);
        state[i].x -= dir * (0.035 + boost * 0.12) * dt;
        if (state[i].x <= -half) state[i].x += half;
        if (state[i].x > 0) state[i].x -= half;
        track.style.transform = `translate3d(${state[i].x}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [inView]);

  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;
    const id = window.setInterval(() => setQ((x) => (x + 1) % reviews.length), 5200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="gallery" ref={root} className="gal" data-nav="light" aria-labelledby="gal-title">
      <header className="gal__head wrap">
        <p className="eyebrow">Journal</p>
        <h2 id="gal-title" className="display">
          Days that feel <em>like weeks</em>
        </h2>
      </header>
      <Row items={ROW_A} dir={1} offset={0} />
      <Row items={ROW_B} dir={-1} offset={3} />

      <div className="rev wrap" aria-roledescription="carousel" aria-label="What people say">
        <div className="rev__stage">
          {reviews.map((r, i) => (
            <figure key={r.by} className={`rev__item${i === q ? ' on' : ''}`} aria-hidden={i !== q}>
              <blockquote>“{r.quote}”</blockquote>
              <figcaption>
                <b>{r.by}</b> · {r.kind}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="rev__dots" role="tablist" aria-label="Choose review">
          {reviews.map((r, i) => (
            <button key={r.by} role="tab" aria-selected={i === q} aria-label={`Review ${i + 1}: ${r.by}`} onClick={() => setQ(i)} className={i === q ? 'on' : ''} />
          ))}
        </div>
      </div>
    </section>
  );
}
