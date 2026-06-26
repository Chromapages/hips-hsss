"use client";

import { useEffect, useState } from "react";

const svgCache = new Map<string, string>();

type SvgLayerProps = {
  src: string | null;
  className?: string;
};

export function SvgLayer({ src, className }: SvgLayerProps) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSvg() {
      if (!src) {
        setSvgContent("");
        return;
      }

      const cached = svgCache.get(src);
      if (cached) {
        setSvgContent(cached);
        return;
      }

      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Could not load ${src}`);
        const text = await response.text();
        svgCache.set(src, text);
        if (!cancelled) setSvgContent(text);
      } catch {
        if (!cancelled) setSvgContent("");
      }
    }

    void loadSvg();
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!svgContent) return null;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
