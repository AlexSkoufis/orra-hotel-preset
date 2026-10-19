'use client';

import { useRef, useState } from 'react';
import { hotel, nav } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { scrollToTarget } from './SmoothScroll';

/** Footer: letter from Orra signup (demo), contacts, links and a cropped italic wordmark. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo('.ft__mark', { yPercent: 35 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'bottom bottom', scrub: 0.6 } });
    });
  });

  return (
    <footer ref={root} className="ft" data-nav="dark">
      <div className="ft__top wrap">
        <div className="ft__letter">
          <p className="eyebrow">Letters from Orra</p>
          <h2 className="display">
            Four letters a year, <em>written by the sea.</em>
          </h2>
          {sent ? (
            <p className="ft__thanks" role="status">
              Thank you — this is a demo form, nothing was sent.
            </p>
          ) : (
            <form className="ft__form" onSubmit={(e) => (e.preventDefault(), setSent(true))}>
              <label htmlFor="ft-email" className="sr-only">
                Email address
              </label>
              <input id="ft-email" type="email" required placeholder="Your email" autoComplete="email" />
              <button type="submit" data-cursor="Send">
                Subscribe
              </button>
            </form>
          )}
        </div>
        <div className="ft__cols">
          <div>
            <p className="ft__k">Find us</p>
            {hotel.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div>
            <p className="ft__k">Talk to us</p>
            <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
            <a href={hotel.phoneHref}>{hotel.phone}</a>
            {hotel.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <nav aria-label="Footer">
            <p className="ft__k">Explore</p>
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={(e) => (e.preventDefault(), scrollToTarget(n.href))}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="ft__base wrap">
        <p>{hotel.disclaimer}</p>
        <p>
          © {new Date().getFullYear()} {hotel.full} · Concept by{' '}
          <a href={hotel.credit.href} target="_blank" rel="noreferrer">
            {hotel.credit.label}
          </a>
        </p>
      </div>
      <p className="ft__mark" aria-hidden="true">
        {hotel.name}
      </p>
    </footer>
  );
}
