export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="6" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(-25 16 16)" />
      <circle cx="28.5" cy="10.5" r="2" fill="#ff5c8a" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark className="h-7 w-7 text-fg" />
      <span className="font-display text-[15px] font-semibold tracking-[0.08em]">LIVE UNIVERSE</span>
    </span>
  );
}
