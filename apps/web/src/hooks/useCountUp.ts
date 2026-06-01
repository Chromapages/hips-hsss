'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startOnView?: boolean;
  suffix?: string;
  prefix?: string;
}

export function useCountUp<T extends HTMLElement = HTMLElement>(
  endValue: number,
  options: UseCountUpOptions = {}
) {
  const { duration = 1500, startOnView = true, suffix = '', prefix = '' } = options;
  const [displayValue, setDisplayValue] = useState(prefix + '0' + suffix);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<T | null>(null);
  const hasViewedRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  const formatNumber = useCallback(
    (num: number) => {
      const formatted = num.toLocaleString('en-US');
      return prefix + formatted + suffix;
    },
    [prefix, suffix]
  );

  const startAnimation = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(formatNumber(endValue));
      return;
    }

    const startTime = performance.now();
    const startValue = 0;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);

      setDisplayValue(formatNumber(currentValue));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [hasStarted, endValue, duration, formatNumber]);

  useEffect(() => {
    if (!startOnView) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasViewedRef.current) {
            hasViewedRef.current = true;
            startAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef as HTMLElement);
    }

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [startOnView, startAnimation]);

  return { ref, displayValue, hasStarted };
}
