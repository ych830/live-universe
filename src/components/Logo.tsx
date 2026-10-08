/** 행성 기호 — 관리자 화면과 첫 화면 배경 무늬에 쓴다 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="6.5" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="14.5" ry="5.6" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(-25 16 16)" />
      <circle cx="28.4" cy="10.4" r="2.2" fill="currentColor" />
    </svg>
  );
}

/** 반짝이 (네 갈래 별) */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="flex items-start gap-0.5">
        <span className="font-display text-[20px] font-extrabold tracking-[-0.01em] md:text-[22px]">LIVE UNIVERSE</span>
        <Sparkle className="-mt-1.5 h-5 w-5 text-brand-soft md:h-6 md:w-6" />
      </span>
      <span className="mt-1 font-display text-[7.5px] font-medium tracking-[0.46em] md:text-[8px]">CONCERT CREATIVE GROUP</span>
    </span>
  );
}
