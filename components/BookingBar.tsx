'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { booking, rooms } from '@/lib/content';

const DAY = 86_400_000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const fmt = (d: Date | null) => (d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Add date');
const long = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function Month({ base, from, to, hover, onPick, onHover, today }: { base: Date; from: Date | null; to: Date | null; hover: Date | null; onPick: (d: Date) => void; onHover: (d: Date | null) => void; today: Date }) {
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const end = to ?? (from && hover && hover > from ? hover : null);
  return (
    <div className="cal__month">
      <p className="cal__title">{first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      <div className="cal__grid" role="grid">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className="cal__dow" aria-hidden="true">
            {d}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`l${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = new Date(base.getFullYear(), base.getMonth(), i + 1);
          const past = d < today;
          const isFrom = !!from && +d === +from;
          const isTo = !!end && +d === +end;
          const inRange = !!from && !!end && d > from && d < end;
          return (
            <button
              key={i}
              type="button"
              disabled={past}
              className={`cal__day${isFrom || isTo ? ' sel' : ''}${inRange ? ' in' : ''}`}
              aria-pressed={isFrom || isTo}
              aria-label={long(d)}
              onClick={() => onPick(d)}
              onPointerEnter={() => onHover(d)}
              onFocus={() => onHover(d)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Floating booking bar with a two-month range picker, guests stepper and room choice (demo). */
export default function BookingBar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<null | 'dates' | 'sheet'>(null);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const [guests, setGuests] = useState(booking.guests);
  const [room, setRoom] = useState('Any room');
  const [result, setResult] = useState('');
  const [offset, setOffset] = useState(0);
  const [today, setToday] = useState<Date | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => setToday(startOfDay(new Date())), []);

  // Appear after the hero has opened; step aside over the footer.
  useEffect(() => {
    const on = () => {
      const footer = document.querySelector('.ft');
      const nearEnd = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      setVisible(window.scrollY > window.innerHeight * 1.4 && !nearEnd);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // "Book" buttons elsewhere open the bar (optionally with a room preselected).
  useEffect(() => {
    const onBook = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (typeof name === 'string') setRoom(name);
      setVisible(true);
      setOpen(window.matchMedia('(max-width: 759px)').matches ? 'sheet' : 'dates');
    };
    window.addEventListener('orra:book', onBook);
    return () => window.removeEventListener('orra:book', onBook);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const outside = (e: PointerEvent) => bar.current && !bar.current.contains(e.target as Node) && setOpen(null);
    document.addEventListener('keydown', esc);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', esc);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);

  const pick = (d: Date) => {
    setResult('');
    if (!from || (from && to) || d <= from) {
      setFrom(d);
      setTo(null);
    } else {
      setTo(d);
      if (open === 'dates') setOpen(null);
    }
  };

  const nights = from && to ? Math.round((+to - +from) / DAY) : 0;
  const price = useMemo(() => {
    const r = rooms.find((x) => x.name === room);
    return r ? r.from : Math.min(...rooms.map((x) => x.from));
  }, [room]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) {
      setOpen(window.matchMedia('(max-width: 759px)').matches ? 'sheet' : 'dates');
      return;
    }
    setResult(`${nights} night${nights > 1 ? 's' : ''} · ${guests} guest${guests > 1 ? 's' : ''} · ${room} — from €${(price * nights).toLocaleString('en-GB')}`);
  };

  const months = today ? [new Date(today.getFullYear(), today.getMonth() + offset, 1), new Date(today.getFullYear(), today.getMonth() + offset + 1, 1)] : [];

  const calendar = today && (
    <div className="cal" role="dialog" aria-label="Choose dates">
      <div className="cal__nav">
        <button type="button" onClick={() => setOffset((o) => Math.max(0, o - 1))} disabled={offset === 0} aria-label="Previous month">
          ←
        </button>
        <span>{from && !to ? 'Now choose check-out' : 'Choose check-in'}</span>
        <button type="button" onClick={() => setOffset((o) => Math.min(10, o + 1))} aria-label="Next month">
          →
        </button>
      </div>
      <div className="cal__months" onPointerLeave={() => setHover(null)}>
        {months.map((m) => (
          <Month key={+m} base={m} from={from} to={to} hover={hover} onPick={pick} onHover={setHover} today={today} />
        ))}
      </div>
    </div>
  );

  return (
    <div id="book" ref={bar} className={`book${visible || open ? ' is-on' : ''}${open === 'sheet' ? ' is-sheet' : ''}`}>
      <form className="book__bar" onSubmit={submit} aria-label="Book a stay">
        <button type="button" className="book__field" onClick={() => setOpen(open === 'dates' ? null : 'dates')} aria-expanded={open === 'dates'}>
          <small>Check-in</small>
          <b>{fmt(from)}</b>
        </button>
        <button type="button" className="book__field" onClick={() => setOpen(open === 'dates' ? null : 'dates')} aria-expanded={open === 'dates'}>
          <small>Check-out</small>
          <b>{fmt(to)}</b>
        </button>
        <div className="book__field book__guests">
          <small id="guests-label">Guests</small>
          <div role="group" aria-labelledby="guests-label">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests">
              −
            </button>
            <b aria-live="polite">{guests}</b>
            <button type="button" onClick={() => setGuests((g) => Math.min(6, g + 1))} aria-label="More guests">
              +
            </button>
          </div>
        </div>
        <label className="book__field book__room">
          <small>Room</small>
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option>Any room</option>
            {rooms.map((r) => (
              <option key={r.name}>{r.name}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="book__cta" data-cursor="Book">
          {booking.cta}
        </button>
        <button type="button" className="book__mobile" onClick={() => setOpen('sheet')}>
          Book a stay <span>{from && to ? `${fmt(from)} – ${fmt(to)}` : `from €${Math.min(...rooms.map((r) => r.from))}`}</span>
        </button>
      </form>
      {(open === 'dates' || open === 'sheet') && (
        <div className="book__pop">
          {open === 'sheet' && (
            <div className="book__sheet-head">
              <b>Book a stay</b>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close">
                ×
              </button>
            </div>
          )}
          {calendar}
          {open === 'sheet' && (
            <button type="button" className="book__cta book__cta--wide" onClick={(e) => submit(e as unknown as React.FormEvent)}>
              {from && to ? `${booking.cta} · ${nights} nights` : 'Choose your dates'}
            </button>
          )}
        </div>
      )}
      {result && (
        <p className="book__result" role="status">
          {result}
          <small>{booking.result}</small>
        </p>
      )}
    </div>
  );
}
