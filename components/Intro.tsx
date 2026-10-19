'use client';

import { useRef } from 'react';
import { intro, introAside } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

/** A single sentence with photographs set inline between the words; pills widen on hover. */
export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.intro__w', {
        yPercent: 60,
        autoAlpha: 0,
        stagger: 0.03,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.intro__text', start: 'top 80%', once: true },
      });
      // Clip (not width): the pill's width belongs to the CSS hover transition.
      gsap.from('.intro__pill', {
        clipPath: 'inset(0% 50% 0% 50% round 999px)',
        duration: 1.4,
        stagger: 0.12,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.intro__text', start: 'top 75%', once: true },
      });
      gsap.from('.intro__aside > *', { autoAlpha: 0, y: 20, stagger: 0.08, duration: 1, scrollTrigger: { trigger: '.intro__aside', start: 'top 85%', once: true } });
    });
  });

  return (
    <section ref={root} className="intro wrap" data-nav="light" aria-label="About Orra">
      <p className="intro__text">
        {intro.map((part, i) =>
          typeof part === 'string' ? (
            part.split(' ').map((w, j) => (
              <span key={`${i}-${j}`} className="intro__w">
                {w}{' '}
              </span>
            ))
          ) : (
            <span key={i} className="intro__pill" data-cursor="View">
              <Img image={part.image} alt={part.alt} sizes="240px" />
            </span>
          ),
        )}
      </p>
      <div className="intro__aside">
        <p>{introAside.text}</p>
        <dl>
          {introAside.stats.map((s) => (
            <div key={s.k}>
              <dt>{s.k}</dt>
              <dd>{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
