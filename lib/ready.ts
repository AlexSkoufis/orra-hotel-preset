'use client';

// The preloader announces when the page is ready (fonts + hero photo loaded and the
// curtain lifted). Anything that should start only then awaits `whenReady()`.
let ready = false;
const waiting: (() => void)[] = [];

export function markReady() {
  if (ready) return;
  ready = true;
  document.documentElement.classList.remove('is-loading');
  waiting.splice(0).forEach((fn) => fn());
}

export function whenReady(fn: () => void) {
  if (ready) fn();
  else waiting.push(fn);
  return () => {
    const i = waiting.indexOf(fn);
    if (i >= 0) waiting.splice(i, 1);
  };
}
