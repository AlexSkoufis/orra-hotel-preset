'use client';

import { useRef, useState } from 'react';
import { day } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

const ARC = 'M 40 220 A 460 210 0 0 1 960 220';

/**
 * A day at Orra. Pinned stage: the sun travels along an arc from dawn to night while the
 * palette, time, copy and photograph change for each moment. Reduced motion: a plain list.
 */
export default function Day() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const iRef = useRef(0);

  useGsap(root, () => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      el.classList.add('is-pinned');
      const arc = el.querySelector<SVGPathElement>('.day__arc')!;
      const sun = el.querySelector<SVGGElement>('.day__sun')!;
      const trail = el.querySelector<SVGPathElement>('.day__trail')!;
      const len = arc.getTotalLength();
      gsap.set(trail, { strokeDasharray: len, strokeDashoffset: len });

      const n = day.length;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
        onUpdate: () => {
          const p = tl.progress();
          const pt = arc.getPointAtLength(len * (0.04 + p * 0.92));
          sun.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
          trail.style.strokeDashoffset = String(len * (1 - (0.04 + p * 0.92)));
          const idx = Math.min(n - 1, Math.floor(p * n * 0.999));
          if (idx !== iRef.current) {
            iRef.current = idx;
            setI(idx);
          }
        },
      });
      // Palette: each moment's sky arrives just before its step begins and then holds,
      // so colours never run ahead of the copy (step k spans timeline time k..k+1).
      day.forEach((d, k) => {
        if (k === 0) gsap.set(el, { '--sky': d.sky[0], '--ink-day': d.sky[1] });
        else tl.to(el, { '--sky': d.sky[0], '--ink-day': d.sky[1], duration: 0.35 }, k - 0.2);
      });
      tl.to({}, { duration: day.length - tl.duration() });
      return () => {
        el.classList.remove('is-pinned');
        gsap.set(el, { clearProps: '--sky,--ink-day' });
      };
    });
  });

  const d = day[i];
  return (
    <section id="day" ref={root} className="day" data-nav="light" aria-labelledby="day-title" style={{ '--steps': day.length } as React.CSSProperties}>
      <div className="day__stage">
        <header className="day__head wrap">
          <p className="eyebrow">A day at Orra</p>
          <h2 id="day-title" className="sr-only">
            A day at Orra
          </h2>
        </header>

        <svg className="day__sky" viewBox="0 0 1000 240" aria-hidden="true">
          <path className="day__arc" d={ARC} />
          <path className="day__trail" d={ARC} />
          <line className="day__horizon" x1="0" y1="220" x2="1000" y2="220" />
          {day.map((m, k) => {
            const x = 40 + (k / (day.length - 1)) * 920;
            return (
              <g key={m.time} className={`day__tick${k === i ? ' on' : ''}`}>
                <line x1={x} y1="214" x2={x} y2="226" />
                <text x={x} y="238" textAnchor="middle">
                  {m.time}
                </text>
              </g>
            );
          })}
          <g className="day__sun" transform="translate(77 180)">
            <circle r="26" className="day__halo" />
            <circle r="11" />
          </g>
        </svg>

        <div className="day__body wrap">
          <div className="day__text" aria-live="polite">
            <p className="day__time">
              {day.map((m, k) => (
                <span key={m.time} className={k === i ? 'on' : k < i ? 'past' : ''}>
                  {m.time}
                </span>
              ))}
            </p>
            <div className="day__copy">
              {day.map((m, k) => (
                <div key={m.time} className={`day__moment${k === i ? ' on' : k < i ? ' past' : ''}`} aria-hidden={k !== i}>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="day__photos" data-cursor="View">
            {day.map((m, k) => (
              <div key={m.time} className={`day__photo${k === i ? ' on' : ''}`}>
                <Img image={m.image} alt={m.title} sizes="(min-width: 1024px) 44vw, 90vw" />
              </div>
            ))}
            <span className="day__stamp" aria-hidden="true">
              {d.time}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
