import React from "react";
import { images } from "../assets/images";

// ── Progress Bar ───────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
}
export function ProgressBar({ value, max, color = "#f97316", className = "" }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={`h-1 bg-[#2a2a2a] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Paw Image ──────────────────────────────────────────────────
interface PawImgProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}
export function PawImg({ size = 28, className = "", style = {} }: PawImgProps) {
  return (
    <img
      src={images.paw}
      alt="paw"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={style}
    />
  );
}

// ── Section Header ─────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-3">
      <div>
        <h2 className="font-black italic text-lg text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-orange-500 text-xs font-bold tracking-wide"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {action.label} ›
        </button>
      )}
    </div>
  );
}

// ── Timer Ring ─────────────────────────────────────────────────
interface TimerRingProps {
  seconds: number;
  total?: number;
  color?: string;
  size?: number;
}
export function TimerRing({ seconds, total = 90, color = "#f97316", size = 100 }: TimerRingProps) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const offset = circ * (seconds / total);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-2xl text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {seconds}
        </span>
        <span className="text-[9px] text-gray-400">SEK.</span>
      </div>
    </div>
  );
}

// ── Back Button ────────────────────────────────────────────────
export function BackButton({ onClick, color = "rgba(255,255,255,0.6)" }: { onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-bold tracking-widest mb-4"
      style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
    >
      ← ZURÜCK
    </button>
  );
}
