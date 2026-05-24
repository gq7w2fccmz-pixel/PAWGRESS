/**
 * Pawgress – Shared Chart Components
 * Ausgelagert aus ProfilScreen.tsx
 */

import { memo } from "react";

export const LineChart = memo(function LineChart({
  data,
  color,
  height = 80,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  if (data.length < 2) return <div style={{ height }} />;
  const max   = Math.max(...data, 1);
  const min   = Math.min(...data, 0);
  const range = max - min || 1;
  const W = 300; const H = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 10) - 5;
    return `${x},${y}`;
  });
  const last = pts[pts.length - 1].split(",");
  const gradId = `g-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0"   />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill={`url(#${gradId})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color}
        strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="5" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#080808" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
    </svg>
  );
});

export const BarChart = memo(function BarChart({
  data,
  color,
  height = 70,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const max  = Math.max(...data, 1);
  const barW = (100 / data.length) * 0.6;
  const gap  = (100 / data.length) * 0.4;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height }}>
      {data.map((v, i) => {
        const barH = (v / max) * 85;
        const x    = i * (barW + gap) + gap / 2;
        return (
          <rect key={i} x={x} y={100 - barH} width={barW} height={barH}
            rx="1" fill={i === data.length - 1 ? color : `${color}88`} />
        );
      })}
    </svg>
  );
});
