"use client";

import { useState } from "react";

type GrowthDataPoint = {
  date: string;
  sessions: number;
};

interface GrowthChartProps {
  data?: GrowthDataPoint[];
}

export function GrowthChart({ data = [] }: GrowthChartProps) {
  const [timeframe, setTimeframe] = useState<"7D" | "30D">("30D");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter data by timeframe
  const activeData = timeframe === "7D" ? data.slice(-7) : data;

  // SVG parameters
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate scales
  const maxVal = Math.max(10, ...activeData.map((d) => d.sessions));
  const points = activeData.map((item, index) => {
    const x = paddingLeft + (index / (activeData.length - 1)) * chartWidth;
    const y = paddingTop + (1 - item.sessions / maxVal) * chartHeight;
    return { x, y, ...item };
  });

  // Build the line path
  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    : "";

  // Build the area path (closed polygon at bottom)
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1]!.x} ${paddingTop + chartHeight} L ${points[0]!.x} ${paddingTop + chartHeight} Z`
    : "";

  // Build grid lines
  const gridLinesY = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = paddingTop + ratio * chartHeight;
    const val = Math.round((1 - ratio) * maxVal);
    return { y, val };
  });

  return (
    <div className="flex-1 flex flex-col h-full space-y-4">
      {/* Chart controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["7D", "30D"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTimeframe(t);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border font-ui uppercase tracking-wider ${
                timeframe === t
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-foreground/75 border-border hover:bg-muted/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Dynamic Tooltip Header when hovering */}
        <div className="h-6 flex items-center">
          {hoveredIdx !== null && points[hoveredIdx] && (
            <span className="text-xs font-bold text-accent font-ui animate-in fade-in duration-200">
              {points[hoveredIdx]?.date}: {points[hoveredIdx]?.sessions} sessions
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 bg-muted/20 border border-border rounded-2xl p-4">
        {activeData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
            No statistics data available
          </div>
        ) : (
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="growth-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent, #C59A35)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-accent, #C59A35)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {gridLinesY.map((g, idx) => (
              <g key={idx} className="opacity-10">
                <line
                  x1={paddingLeft}
                  y1={g.y}
                  x2={svgWidth - paddingRight}
                  y2={g.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={g.y + 4}
                  textAnchor="end"
                  className="text-[9px] font-bold font-mono fill-current"
                >
                  {g.val}
                </text>
              </g>
            ))}

            {/* Area under the line */}
            <path d={areaPath} fill="url(#growth-gradient)" />

            {/* The line itself */}
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-accent, #C59A35)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />

            {/* Horizontal dates labels */}
            {points.map((p, i) => {
              // Only draw a subset of labels for 30D to avoid overcrowding
              const shouldDrawLabel = timeframe === "7D" || i % 5 === 0 || i === points.length - 1;
              if (!shouldDrawLabel) return null;

              return (
                <text
                  key={i}
                  x={p.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className="text-[8px] font-bold font-ui fill-foreground/50 opacity-75"
                >
                  {p.date}
                </text>
              );
            })}

            {/* Hover points dots and interactive columns */}
            {points.map((p, i) => (
              <g key={i}>
                {/* Highlight dot */}
                {hoveredIdx === i && (
                  <>
                    <line
                      x1={p.x}
                      y1={paddingTop}
                      x2={p.x}
                      y2={paddingTop + chartHeight}
                      stroke="var(--color-accent, #C59A35)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="opacity-40"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="5"
                      fill="var(--color-accent, #C59A35)"
                      className="animate-ping opacity-30"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="var(--color-accent, #C59A35)"
                      stroke="var(--bg-card, #ffffff)"
                      strokeWidth="1.5"
                    />
                  </>
                )}

                {/* Invisible hover trigger columns */}
                <rect
                  x={p.x - chartWidth / (activeData.length * 2)}
                  y={paddingTop}
                  width={chartWidth / activeData.length}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
