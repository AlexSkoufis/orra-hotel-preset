'use client';

import { useRef, useState } from 'react';
import { dining } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

/** Dining: the menu as a list; hovering (or focusing / tapping) a dish changes the photograph. */
export default function Dining() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.dish', { autoAlpha: 0, y: 30, stagger: 0.07, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.dining__menu', start: 'top 85%', once: true } });
      gsap.fromTo('.dining__frame', { clipPath: 'inset(18% 18% 18% 18%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.dining__frame', start: 'top 90%', end: 'top 30%', scrub: true } });
    });
  });

  return (
    <section id="dining" ref={root} className="dining" data-nav="light" aria-labelledby="dining-title">
      <div className="dining__grid wrap">
        <div className="dining__frame" data-cursor="View">
          {dining.items.map((d, i) => (
            <Img key={d.name} image={d.image} alt={d.name} sizes="(min-width: 1024px) 42vw, 90vw" className={i === active ? 'on' : ''} />
          ))}
          <span className="dining__cap">{dining.items[active].note}</span>
        </div>
        <div className="dining__text">
          <p className="eyebrow">{dining.label}</p>
          <h2 id="dining-title" className="display">
            {dining.title} <em>{dining.em}</em>
          </h2>
          <p className="dining__lede">{dining.text}</p>
          <ol className="dining__menu">
            {dining.items.map((d, i) => (
              <li key={d.name} className={`dish${i === active ? ' on' : ''}`}>
                <button onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={i === active}>
                  <span className="dish__note">{d.note}</span>
                  <span className="dish__name">{d.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <dl className="dining__hours">
            {dining.hours.map((h) => (
              <div key={h.k}>
                <dt>{h.k}</dt>
                <dd>{h.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
