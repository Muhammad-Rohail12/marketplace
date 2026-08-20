'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { HERO_SLIDES } from '@/constants/heroSlides';

const AUTO_ROTATE_MS = 6000;

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return undefined;
    timerRef.current = setInterval(() => goTo(activeIndex + 1), AUTO_ROTATE_MS);
    return () => clearInterval(timerRef.current);
  }, [activeIndex, isPaused, goTo]);

  const slide = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-none sm:rounded-xl"
    >
      <div className={cn('relative flex min-h-[260px] items-center bg-gradient-to-br px-6 py-10 text-white transition-colors duration-500 sm:min-h-[360px] sm:px-12', slide.theme)}>
        <div className="max-w-lg animate-fade-in" key={slide.id}>
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{slide.eyebrow}</span>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-balance sm:text-5xl">{slide.title}</h1>
          <p className="mt-3 max-w-md text-sm text-white/85 sm:text-base">{slide.subtitle}</p>
          <Link
            href={slide.ctaHref}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-elevated transition-transform hover:scale-[1.02] focus-visible:focus-ring"
          >
            {slide.ctaLabel}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/30 sm:flex"
        >
          <FiChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/30 sm:flex"
        >
          <FiChevronRight />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex}
            className={cn('h-1.5 rounded-full transition-all', i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40')}
          />
        ))}
      </div>
    </section>
  );
}