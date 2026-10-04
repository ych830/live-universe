export function Marquee({ words }: { words: string[] }) {
  const row = [...words, ...words];
  return (
    <div className="overflow-hidden border-y border-line bg-panel/50 py-4 md:py-5" aria-hidden>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((w, i) => (
              <span key={i} className="flex items-center font-display text-lg tracking-wide text-fg/80 md:text-2xl">
                <span className="px-6 md:px-10">{w}</span>
                <span className="text-pink">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
