// ─────────────────────────────────────────────────────────────────────────────
//  PRESET CONFIG — Orra, a FICTIONAL boutique cliff-house hotel.
//  All names, prices, reviews and details are demo content.
//  Photos: assets-src/<key>.jpg → `npm run images` → reference by key below.
//  Colours & type: tokens at the top of app/globals.css; fonts in app/layout.tsx.
// ─────────────────────────────────────────────────────────────────────────────

export type ImageKey =
  | 'hero' | 'cliff' | 'seapool' | 'rock' | 'window' | 'viewdark' | 'boat' | 'cove' | 'umbrella'
  | 'winesunset' | 'wine' | 'dinner' | 'bar' | 'tub' | 'marble' | 'loungers' | 'poolaerial'
  | 'roomarch' | 'roomsea' | 'roomneutral' | 'breakfast' | 'palmpool';

export const hotel = {
  name: 'Orra',
  wordmark: 'ORRA',
  full: 'Orra Cliff House',
  line: 'Twenty-two rooms above the Aegean',
  place: 'Milos, Cyclades',
  coords: '36.72° N  24.42° E',
  timeZone: 'Europe/Athens',
  address: ['Orra Cliff House', 'Plaka, 848 00', 'Milos, Greece'],
  phone: '+30 22870 00000',
  phoneHref: 'tel:+302287000000',
  email: 'stay@orra.example',
  season: 'Open April — October',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
  ],
  credit: { label: 'Core Concepts Design', href: 'https://coreconcepts.design' },
  disclaimer: 'Orra is a fictional hotel created as a design concept. Rates, reviews and details are illustrative.',
};

export const nav = [
  { label: 'Rooms', href: '#rooms', image: 'roomarch' as ImageKey },
  { label: 'A day at Orra', href: '#day', image: 'seapool' as ImageKey },
  { label: 'Dining', href: '#dining', image: 'dinner' as ImageKey },
  { label: 'Baths', href: '#baths', image: 'tub' as ImageKey },
  { label: 'Journal', href: '#gallery', image: 'boat' as ImageKey },
  { label: 'Arrive', href: '#arrive', image: 'cliff' as ImageKey },
];

export const heroCopy = {
  kicker: 'Cliff house · Milos · Est. 2019',
  line: ['A quiet place', 'at the edge of the sea.'],
  scroll: 'Scroll to open',
};

// Intro sentence with inline pictures: strings are words, objects are image "pills".
export const intro: (string | { image: ImageKey; alt: string })[] = [
  'Twenty-two rooms cut into volcanic rock,',
  { image: 'rock', alt: 'Volcanic rock above the sea' },
  'a saltwater pool that meets the horizon,',
  { image: 'hero', alt: 'Infinity pool facing the sea' },
  'and dinners that begin when the sun',
  { image: 'winesunset', alt: 'Glass of wine at sunset' },
  'touches the water.',
];

export const introAside = {
  text: 'Orra is small on purpose. No lobby, no queues — just a host who knows your name, rooms that open to the wind, and a kitchen that follows the fishing boats.',
  stats: [
    { v: '22', k: 'Rooms & suites' },
    { v: '1', k: 'Saltwater pool' },
    { v: '14', k: 'Tables at dinner' },
  ],
};

export type Room = {
  name: string;
  kind: string;
  size: string;
  view: string;
  sleeps: string;
  from: number;
  images: [ImageKey, ImageKey];
  note: string;
};

export const rooms: Room[] = [
  { name: 'Arch Room', kind: 'Room', size: '28 m²', view: 'Garden & sea', sleeps: '2', from: 380, images: ['roomarch', 'marble'], note: 'Lime-plaster walls, a carved arch and linen that smells of the sun.' },
  { name: 'Horizon Suite', kind: 'Suite', size: '46 m²', view: 'Open sea', sleeps: '2', from: 620, images: ['roomsea', 'window'], note: 'A wall of glass to the west; the bed faces the sunset.' },
  { name: 'Stone Suite', kind: 'Suite', size: '52 m²', view: 'Cliff & sea', sleeps: '3', from: 690, images: ['roomneutral', 'tub'], note: 'A freestanding stone bath under a skylight, carved into the rock.' },
  { name: 'Cliff Villa', kind: 'Villa', size: '110 m²', view: 'Private pool', sleeps: '4', from: 1450, images: ['loungers', 'viewdark'], note: 'Two bedrooms, a terrace and a plunge pool of your own.' },
  { name: 'Sea Pool Room', kind: 'Room', size: '32 m²', view: 'Pool terrace', sleeps: '2', from: 440, images: ['seapool', 'breakfast'], note: 'Steps from the saltwater pool; breakfast served on your terrace.' },
];

// A day at Orra — the page's time-of-day sequence. `sky` drives the section colours.
export const day = [
  { time: '07:00', title: 'First swim', text: 'The pool is still and the sea is glass. Towels, a thermos of mountain tea, nobody else.', image: 'seapool' as ImageKey, sky: ['#f3e6d6', '#1f2a2c'] },
  { time: '09:30', title: 'Breakfast in bed', text: 'Island cheese, figs, warm bread from the village oven — on a tray, or on your terrace.', image: 'breakfast' as ImageKey, sky: ['#f5ecdf', '#1f2a2c'] },
  { time: '13:00', title: 'Out on the boat', text: 'Our skipper knows the coves no road reaches. Swim, lunch on deck, back by four.', image: 'boat' as ImageKey, sky: ['#e2ecee', '#15313a'] },
  { time: '18:30', title: 'The golden hour', text: 'Drinks on the cliff edge while the sun drops behind Antimilos.', image: 'umbrella' as ImageKey, sky: ['#f0cfb0', '#3a1f14'] },
  { time: '21:00', title: 'Dinner under the sky', text: 'Fourteen tables, one menu, whatever came in on the boats this morning.', image: 'dinner' as ImageKey, sky: ['#1a2230', '#efe6d8'] },
];

export const dining = {
  label: 'Dining',
  title: 'Salt, fire',
  em: '& the day’s catch',
  text: 'One menu each night, written after the boats come in. Wood fire, island olive oil, wines from the Cyclades.',
  items: [
    { name: 'Raw red mullet, citrus, sea fennel', note: 'To start', image: 'wine' as ImageKey },
    { name: 'Wood-fired octopus, fava, capers', note: 'From the fire', image: 'dinner' as ImageKey },
    { name: 'Whole fish of the day, lemon & salt', note: 'To share', image: 'winesunset' as ImageKey },
    { name: 'Island honey, sheep’s yoghurt, thyme', note: 'To finish', image: 'breakfast' as ImageKey },
    { name: 'Assyrtiko from Santorini — by the glass', note: 'Cellar', image: 'bar' as ImageKey },
  ],
  hours: [
    { k: 'Breakfast', v: '08:00 — 11:30' },
    { k: 'Pool kitchen', v: '12:30 — 17:00' },
    { k: 'Dinner', v: '20:00 — 23:00' },
  ],
};

export const baths = {
  label: 'The baths',
  title: 'Warm stone,',
  em: 'cold sea.',
  text: 'A small bathhouse carved into the cliff: a hot pool, a cold plunge fed by seawater, two treatment rooms and a steam room lit only by the sea.',
  image: 'tub' as ImageKey,
  rituals: [
    { name: 'Salt & clay scrub', time: '45 min' },
    { name: 'Volcanic stone massage', time: '75 min' },
    { name: 'Sea-plunge circuit', time: '30 min' },
  ],
};

export const gallery: ImageKey[] = ['cove', 'loungers', 'window', 'wine', 'rock', 'poolaerial', 'marble', 'palmpool', 'umbrella', 'cliff', 'bar', 'viewdark'];

export const reviews = [
  { quote: 'The kind of place you don’t tell your friends about.', by: 'The Slow Traveller', kind: 'Magazine' },
  { quote: 'Twenty-two rooms, zero noise. Milos at its most beautiful.', by: 'Coastline Journal', kind: 'Guide' },
  { quote: 'We booked two nights and stayed six.', by: 'Anna & Tom, London', kind: 'Guests' },
  { quote: 'Dinner on the cliff is the best table in the Cyclades.', by: 'Table & Tide', kind: 'Food' },
  { quote: 'Design that disappears so the sea can do the talking.', by: 'Quiet Spaces', kind: 'Design' },
];

export const arrive = {
  label: 'Arrive',
  title: 'Getting',
  em: 'here.',
  text: 'Milos is a short hop from Athens. We meet every guest at the port or airport — the last kilometre is ours.',
  routes: [
    { from: 'Athens (ATH)', how: 'Flight', time: '40 min' },
    { from: 'Piraeus', how: 'Fast ferry', time: '3 h' },
    { from: 'Santorini', how: 'Ferry', time: '2 h' },
    { from: 'Milos airport', how: 'Our car', time: '15 min' },
  ],
  image: 'cliff' as ImageKey,
};

export const booking = {
  cta: 'Check availability',
  guests: 2,
  result: 'This is a demo — rates shown are illustrative.',
};
