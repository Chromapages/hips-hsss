"use client";

import { useEffect, useState } from "react";

const svgCache = new Map<string, string>();

type SvgLayerProps = {
  src: string | null;
  className?: string;
};

export function SvgLayer({ src, className }: SvgLayerProps) {
  const [svgContent, setSvgContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: any = null;
    setIsLoaded(false);

    async function loadSvg() {
      if (!src) {
        setSvgContent("");
        return;
      }

      const cached = svgCache.get(src);
      if (cached) {
        setSvgContent(cached);
        timer = setTimeout(() => {
          if (!cancelled) setIsLoaded(true);
        }, 16);
        return;
      }

      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Could not load ${src}`);
        const text = await response.text();
        svgCache.set(src, text);
        if (!cancelled) {
          setSvgContent(text);
          timer = setTimeout(() => {
            if (!cancelled) setIsLoaded(true);
          }, 16);
        }
      } catch {
        if (!cancelled) setSvgContent("");
      }
    }

    void loadSvg();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [src]);

  if (!svgContent) return null;

  // Apply premium filters and styles based on layer type
  let premiumFilterClass = "";
  let targetOpacity = 1.0;

  if (src?.includes("/face/") || src?.includes("/body/")) {
    premiumFilterClass = "[filter:url(#premium-fitzpatrick-recolor)_url(#premium-inner-glow)]";
  } else if (src?.includes("/hair-back/")) {
    premiumFilterClass = "[filter:url(#premium-drop-shadow)]";
    targetOpacity = 0.85;
  } else if (
    src?.includes("/hair-front/") ||
    src?.includes("/accessories/") ||
    src?.includes("/clothing/")
  ) {
    premiumFilterClass = "[filter:url(#premium-drop-shadow)]";
  } else if (src?.includes("/brows/") || src?.includes("/nose/")) {
    premiumFilterClass = "[filter:url(#premium-feature-shadow)]";
  }

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 ${premiumFilterClass} ${className ?? ""}`}
      style={{ opacity: targetOpacity }}
    >
      <div
        className="w-full h-full transition-all duration-300 ease-out origin-center"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "scale(1)" : "scale(0.96)",
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
