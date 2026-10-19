'use client';

import { useEffect, useRef, useState } from 'react';
import { arrive, hotel } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

/** Getting here: routes as a timetable beside a parallax photograph, with the island's local time. */
export default function Arrive() {
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: hotel.timeZone });
    const t = () => setTime(f.format(new Date()));
    t();
    const id = window.setInterval(t, 20_000);
    return () => window.clearInterval(id);
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo('.arrive__photo picture', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.arrive__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.route', { autoAlpha: 0, x: -20, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.arrive__routes', start: 'top 85%', once: true } });
    });
  });

  return (
    <section id="arrive" ref={root} className="arrive" data-nav="light" aria-labelledby="arrive-title">
      <div className="arrive__grid wrap">
        <div className="arrive__text">
          <p className="eyebrow">{arrive.label}</p>
          <h2 id="arrive-title" className="display">
            {arrive.title} <em>{arrive.em}</em>
          </h2>
          <p className="arrive__lede">{arrive.text}</p>
          <ol className="arrive__routes">
            {arrive.routes.map((r) => (
              <li key={r.from} className="route">
                <span className="route__from">{r.from}</span>
                <span className="route__line" aria-hidden="true" />
                <span className="route__how">{r.how}</span>
                <b>{r.time}</b>
              </li>
            ))}
          </ol>
          <dl className="arrive__facts">
            <div>
              <dt>Local time</dt>
              <dd>{time}</dd>
            </div>
            <div>
              <dt>Coordinates</dt>
              <dd>{hotel.coords}</dd>
            </div>
            <div>
              <dt>Season</dt>
              <dd>{hotel.season}</dd>
            </div>
          </dl>
        </div>
        <div className="arrive__photo" data-cursor="View">
          <Img image={arrive.image} alt="Whitewashed houses on the cliffs above the sea" sizes="(min-width: 1024px) 46vw, 92vw" />
        </div>
      </div>
    </section>
  );
}
