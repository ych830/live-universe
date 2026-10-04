export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="6.5" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="14.5" ry="5.6" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(-25 16 16)" />
      <circle cx="28.4" cy="10.4" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark className="h-6 w-6" />
      <span className="font-display text-[15px] font-extrabold tracking-[0.04em]">LIVE UNIVERSE</span>
    </span>
  );
}

/** 페이지 맨 위 가운데에 크게 들어가는 로고 (일레븐의 "11" 자리) */
export function BigLogo() {
  return (
    <span className="flex flex-col items-center gap-2">
      <LogoMark className="h-12 w-12 md:h-14 md:w-14" />
      <span className="font-display text-xl font-extrabold leading-none tracking-[0.02em] md:text-[28px]">LIVE UNIVERSE</span>
    </span>
  );
}
