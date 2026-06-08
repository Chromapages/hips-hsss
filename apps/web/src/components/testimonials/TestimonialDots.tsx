"use client";

import React, { useCallback } from "react";

interface TestimonialDotsProps {
  total: number;
  active: number;
  onDotClick: (index: number) => void;
}

export const TestimonialDots: React.FC<TestimonialDotsProps> = ({
  total,
  active,
  onDotClick,
}) => {
  const handleDotClick = useCallback(
    (index: number) => {
      onDotClick(index);
    },
    [onDotClick]
  );

  return (
    <div className="flex items-center justify-center gap-3" role="tablist" aria-label="Testimonial navigation">
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === active;
        return (
          <span
            key={i}
            className="w-11 h-11 flex items-center justify-center"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to testimonial ${i + 1} of ${total}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleDotClick(i)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#102A3D] ${
                isActive ? "bg-accent scale-110" : "bg-surface/40 hover:bg-surface/60"
              }`}
            />
          </span>
        );
      })}
    </div>
  );
};

export default TestimonialDots;