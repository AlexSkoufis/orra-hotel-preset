'use client';

import { useRef } from 'react';
import { baths } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

/** The baths: the photograph opens from a small circle to full bleed as the section scrolls in. */
export default function Baths() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center center', scrub: 0.6 } });
      tl.fromTo('.baths__photo', { clipPath: 'circle(9% at 50% 55%)' }, { clipPath: 'circle(75% at 50% 50%)' }, 0)
        .fromTo('.baths__photo picture', { scale: 1.4 }, { scale: 1 }, 0)
        .from('.baths__copy > *', { autoAlpha: 0, y: 40, stagger: 0.1, duration: 0.4 }, 0.55);
    });
  });

  return (
    <section id="baths" ref={root} className="baths" data-nav="dark" aria-labelledby="baths-title">
      <div className="baths__photo">
        <Img image={baths.image} alt="Freestanding stone bath beside a rough stone wall" sizes="100vw" />
      </div>
      <div className="baths__copy wrap">
        <p className="eyebrow">{baths.label}</p>
        <h2 id="baths-title" className="display">
          {baths.title}
          <br />
          <em>{baths.em}</em>
        </h2>
        <p className="baths__text">{baths.text}</p>
        <ul className="baths__rituals">
          {baths.rituals.map((r) => (
            <li key={r.name}>
              <span>{r.name}</span>
              <span>{r.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
