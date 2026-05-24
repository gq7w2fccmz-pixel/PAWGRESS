/**
 * Pawgress – Shared SVG Icons
 * Ausgelagert aus ProfilScreen.tsx
 */

const ORANGE = "#f97316";

export function IconPaw({ size = 28, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="17" rx="6.5" ry="6" fill={color}/>
      <ellipse cx="6.5" cy="12.5" rx="2.5" ry="3.5" fill={color}/>
      <ellipse cx="21.5" cy="12.5" rx="2.5" ry="3.5" fill={color}/>
      <ellipse cx="10" cy="7.5" rx="2" ry="2.8" fill={color}/>
      <ellipse cx="18" cy="7.5" rx="2" ry="2.8" fill={color}/>
    </svg>
  );
}

export function IconFlame({ size = 24, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 7 7 7 12.5C7 15.5 9 18 12 18C15 18 17 15.5 17 12.5C17 10 15.5 8 14 7C14 8.5 13 10 12 10C10 10 9 8 9 7C9 4.5 12 2 12 2Z" fill={color}/>
      <path d="M12 18C10.3 18 9 16.7 9 15C9 13.5 10 12.5 12 12C14 12.5 15 13.5 15 15C15 16.7 13.7 18 12 18Z" fill="#fff" opacity="0.3"/>
    </svg>
  );
}

export function IconTarget({ size = 22, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="5.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="2" fill={color}/>
      <line x1="16" y1="6" x2="19" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="17,3 19,3 19,5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconBars({ size = 22, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="13" width="4" height="7" rx="1" fill={color} opacity="0.4"/>
      <rect x="9" y="8" width="4" height="12" rx="1" fill={color} opacity="0.7"/>
      <rect x="16" y="3" width="4" height="17" rx="1" fill={color}/>
    </svg>
  );
}

export function IconCalendar({ size = 22, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
      <line x1="2" y1="9" x2="20" y2="9" stroke={color} strokeWidth="1.5"/>
      <line x1="7" y1="2" x2="7" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="2" x2="15" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <text x="11" y="17" textAnchor="middle" fontSize="7" fontWeight="bold" fill={color}>17</text>
    </svg>
  );
}

export function IconUser({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth="1.5"/>
      <path d="M3 18C3 14.5 6 12 10 12C14 12 17 14.5 17 18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconBell({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2C7 2 5 4.5 5 7V12L3 14H17L15 12V7C15 4.5 13 2 10 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.5 16C8.5 16.8 9.2 17.5 10 17.5C10.8 17.5 11.5 16.8 11.5 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconLock({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="9" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M7 9V6.5C7 4.6 8.3 3 10 3C11.7 3 13 4.6 13 6.5V9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14" r="1.5" fill={color}/>
    </svg>
  );
}

export function IconInfo({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5"/>
      <line x1="10" y1="9" x2="10" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="6.5" r="1" fill={color}/>
    </svg>
  );
}
