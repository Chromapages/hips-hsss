"use client";

import React, { memo, useCallback, useRef } from "react";
import type { Testimonial } from "./testimonials.data";

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onNext,
  onPrev,
}) => {
  const { quote, name, title } = testimonial;
  const dragStartX = useRef<number | null>(null);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragStartX.current === null) return;

      const offsetX = event.clientX - dragStartX.current;
      dragStartX.current = null;
      if (offsetX > 50) {
        onNext();
      } else if (offsetX < -50) {
        onPrev();
      }
    },
    [onNext, onPrev]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      dragStartX.current = event.clientX;
    },
    []
  );

  const handlePointerCancel = useCallback(() => {
    dragStartX.current = null;
  }, []);

  return (
    <div
      className="max-w-[780px] mx-auto text-center cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerCancel={handlePointerCancel}
      onPointerUp={handlePointerUp}
      role="region"
      aria-roledescription="carousel slide"
    >
      {/* Oversized decorative opening quotation mark with gradient */}
      <span
        className="text-8xl font-serif leading-none select-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <p className="font-heading text-xl md:text-3xl font-medium text-white leading-relaxed mt-4">
        {quote}
      </p>

      {/* Attribution */}
      <p className="font-semibold text-white text-base mt-8">
        &mdash; {name}
      </p>

      {/* Title */}
      <p className="text-white/60 text-sm mt-1">
        {title}
      </p>
    </div>
  );
};

export default memo(TestimonialCard);
