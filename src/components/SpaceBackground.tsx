/** 네이비 밤하늘: 위쪽 코발트 빛 + 별 (일부는 천천히 반짝임) */
export function SpaceBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(47,84,255,0.38),transparent_70%),radial-gradient(40%_35%_at_90%_85%,rgba(110,80,255,0.14),transparent_70%)]" />
      <div className="absolute inset-0 bg-[url(/space/stars.svg)] bg-[length:1600px_1000px] opacity-70" />
      <div className="absolute inset-0 animate-twinkle bg-[url(/space/twinkle-a.svg)] bg-[length:1600px_1000px]" />
      <div className="absolute inset-0 animate-twinkle bg-[url(/space/twinkle-b.svg)] bg-[length:1600px_1000px] [animation-delay:-2.5s] [animation-duration:7s]" />
    </div>
  );
}
