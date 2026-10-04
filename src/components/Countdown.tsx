"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** 티켓 오픈까지 남은 시간. 서버·클라이언트 시간이 달라 첫 렌더는 비워 둔다. */
export function Countdown({ to, className = "" }: { to: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (now === null) return <span className={className}>&nbsp;</span>;
  const left = new Date(to).getTime() - now;
  if (left <= 0) return <span className={className}>지금 예매할 수 있어요</span>;

  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return (
    <span className={`whitespace-nowrap tabular-nums ${className}`}>
      {d > 0 && `D-${d} · `}
      {pad(h)}:{pad(m)}:{pad(s % 60)}
    </span>
  );
}
