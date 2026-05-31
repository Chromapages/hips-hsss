"use client";

import React, { useCallback, useRef, useEffect } from "react";
import type { Testimonial } from "./testimonials.data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "./testimonials.data";

interface TestimonialCarouselProps {
  className?: string;
}

const DotIndicators: React.FC<{
  testimonials: Testimonial[];
  onDotClick: (index: number) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}> = ({ testimonials, onDotClick, scrollRef }) => {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handler = (e: Event) => setActive((e as CustomEvent<number>).detail);
    container.addEventListener("testimonial-scroll", handler);
    return () => container.removeEventListener("testimonial-scroll", handler);
  }, [scrollRef]);

  return (
    <div className="mt-10 flex items-center justify-center gap-3 px-6" role="tablist" aria-label="Testimonial navigation">
      {testimonials.map((_, i) => (
        <span key={i} className="w-11 h-11 flex items-center justify-center">
          <button
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Go to testimonial ${i + 1} of ${testimonials.length}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => onDotClick(i)}
            className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#102A3D] ${
              active === i ? "bg-accent scale-110" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        </span>
      ))}
    </div>
  );
};

export default function TestimonialCarousel({ className }: TestimonialCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-testimonial]");
    const target = cards[index] as HTMLElement;
    if (!target) return;
    const left = target.offsetLeft - (container.offsetWidth - target.offsetWidth) / 2;
    container.scrollTo({ left, behavior: "smooth" });
    currentIndex.current = index;
  }, []);

  const goNext = useCallback(() => {
    const next = (currentIndex.current + 1) % testimonials.length;
    scrollToIndex(next);
  }, [scrollToIndex]);

  const goPrev = useCallback(() => {
    const prev = (currentIndex.current - 1 + testimonials.length) % testimonials.length;
    scrollToIndex(prev);
  }, [scrollToIndex]);

  const handleDotClick = useCallback(
    (index: number) => {
      scrollToIndex(index);
    },
    [scrollToIndex]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = container.querySelectorAll("[data-testimonial]");
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = (card as HTMLElement).offsetLeft + (card as HTMLElement).offsetWidth / 2;
        const dist = Math.abs(cardCenter - containerCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      currentIndex.current = closest;
      // Dispatch custom event for dots to listen to
      container.dispatchEvent(new CustomEvent("testimonial-scroll", { detail: closest }));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`relative bg-[#102A3D] py-24 md:py-32 px-0 border-t border-b border-[#102A3D]/50 ${className ?? ""}`}
      aria-label="Member testimonials"
    >
      {/* Section header */}
      <div className="max-w-4xl mx-auto text-center mb-12 px-6">
        <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-1 text-[10px] font-black uppercase tracking-brand text-accent font-ui mb-6">
          Member Stories
        </span>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
          What members are saying.
        </h2>
      </div>

      {/* Scroll container with snap */}
      <div
        className="relative"
        aria-live="polite"
        aria-label="Testimonial navigation"
      >
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-[#102A3D] to-transparent md:w-16" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[#102A3D] to-transparent md:w-16" />

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto scroll-snap-x-mandatory snap-x snap-mandatory hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
          tabIndex={0}
          aria-label="Testimonial carousel"
          role="region"
        >
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              data-testimonial={i}
              className="snap-x snap-center shrink-0 w-full md:w-[780px] px-6 md:px-12"
              role="group"
              aria-roledescription="slide"
              aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
            >
              <div className="max-w-[720px] mx-auto text-center">
                {/* Opening quote mark */}
                <span
                  className="text-8xl font-serif leading-none select-none bg-clip-text text-transparent bg-gradient-to-r from-[#173B57] to-[#C59A35]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Quote */}
                <p className="font-heading text-xl md:text-3xl font-medium text-white leading-relaxed mt-4">
                  {testimonial.quote}
                </p>

                {/* Attribution */}
                <p className="font-semibold text-white text-base mt-8">
                  &mdash; {testimonial.name}
                </p>
                <p className="text-white/60 text-sm mt-1">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next buttons — desktop only */}
        <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 pl-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={goPrev}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#102A3D]"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
        </div>
        <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 pr-4">
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={goNext}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#102A3D]"
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <DotIndicators testimonials={testimonials} onDotClick={handleDotClick} scrollRef={scrollRef} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          .hide-scrollbar { scroll-behavior: auto; }
        }
      `}</style>
    </section>
  );
}