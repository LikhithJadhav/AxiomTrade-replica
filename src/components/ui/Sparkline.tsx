// src/components/ui/Sparkline.tsx
"use client";
import React from "react";

type SparklineProps = {
  data: number[];           // numeric values (recent -> latest)
  width?: number;           // svg width
  height?: number;          // svg height
  stroke?: string;          // line color
  fill?: string | null;     // optional area fill
  strokeWidth?: number;
  className?: string;
};

function normalize(data: number[], width: number, height: number) {
  if (!data || data.length === 0) return { points: "", min: 0, max: 1 };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const n = data.length;
  const stepX = width / Math.max(1, n - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return { points, min, max };
}

export default function Sparkline({ data, width = 120, height = 32, stroke = "#18b07a", fill = "rgba(24,176,122,0.08)", strokeWidth = 2, className }: SparklineProps) {
  const { points } = normalize(data, width, height);
  if (!points) {
    return <svg width={width} height={height} className={className}><rect width="100%" height="100%" fill="transparent" /></svg>;
  }

  // Build path from points
  const pathD = points.split(" ").map(p => p.split(",")).map(([x, y]) => `${x},${y}`).join(" L ");
  const first = points.split(" ")[0];

  // closed area points for fill polygon
  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none" aria-hidden>
      {fill ? <polygon points={areaPoints} fill={fill} /> : null}
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* last-point circle */}
      {points ? (() => {
        const pts = points.split(" ");
        const last = pts[pts.length - 1].split(",");
        return <circle cx={parseFloat(last[0])} cy={parseFloat(last[1])} r={2.2} fill={stroke} />;
      })() : null}
    </svg>
  );
}
