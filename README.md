# Orra Cliff House — Boutique Hotel Preset

An ultra-modern homepage for a **fictional** 22-room boutique hotel on Milos. Warm sand and cream with a single terracotta accent, Bodoni Moda + Hanken Grotesk.

Next.js 15 (static export) · GSAP 3 + ScrollTrigger · Lenis · plain CSS. No UI libraries.

```bash
npm install
npm run dev       # dev output goes to .next-dev, so builds never disturb a running dev server
npm run build     # static site in ./out
npm run images    # rebuild responsive AVIF/WebP after changing photos in assets-src/
```

## Signature pieces

| Section | What it does |
|---|---|
| Hero | The photograph is first seen only through the letters of the wordmark (SVG mask on a sand veil). Scrolling zooms into the letters until the view opens; then the tagline rises. |
| Intro | One sentence with photographs set inline between the words; the pills widen on hover. |
| Rooms | Draggable carousel with inertia and rubber-band edges (mouse); native swipe with snap (touch). Second photo on hover; any card opens booking with that room preselected. |
| A day at Orra | Pinned timeline 07:00 → 21:00: the sun travels an arc, the palette moves from dawn to night, the time, copy and photograph change per moment. |
| Dining | The menu as a list; hovering / focusing / tapping a dish changes the arched photograph. |
| Baths | Photograph opens from a small circle to full bleed as the section scrolls in. |
| Journal | Two rows of photographs drifting in opposite directions; scrolling speeds them up. Rotating guest/press quotes. |
| Arrive | Routes as a timetable, island local time, parallax photo. |
| Booking bar | Floats in after the hero. Two-month range calendar, guests, room choice, estimate (demo). On phones it becomes a bottom sheet. |

Cursor: a soft ring that becomes a terracotta label ("Drag", "View", "Book") — fine pointers only.

## Re-skin

- **Copy & data** — `lib/content.ts` (hotel details, nav, hero lines, intro sentence + inline images, rooms & rates, the day timeline and its colours, dining, baths, gallery, reviews, routes).
- **Photos** — drop `<key>.jpg` into `assets-src/`, add the key to `ImageKey`, run `npm run images`. Credits in `assets-src/CREDITS.md`.
- **Colour** — tokens at the top of `app/globals.css` (`--cream`, `--sand`, `--ink`, `--terra`, `--sea`). Each moment in `day` carries its own background/text colours.
- **Type** — `app/layout.tsx`. The hero mask uses the serif at weight 800; a heavier display face shows more photograph through the letters.

## Accessibility & motion

`prefers-reduced-motion` disables smoothing, the mask sequence (the hero shows the open photograph), pinning, drifting rows and auto-rotating quotes. The menu is a focus-trapped dialog; the calendar days are labelled with full dates; every hover effect has a focus or tap equivalent.

## Demo content

Orra, its rooms, rates, reviews and press names are fictional; photographs are Unsplash (free licence) placeholders.
