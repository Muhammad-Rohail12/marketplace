// Plain-function versions for non-React contexts.
// For React components, prefer the useDebounce hook (Phase 4).
export function debounce(fn, delayMs = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

export function throttle(fn, limitMs = 300) {
  let inThrottle = false;
  return (...args) => {
    if (inThrottle) return;
    fn(...args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
    }, limitMs);
  };
}