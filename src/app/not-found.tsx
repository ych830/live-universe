import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-extrabold md:text-9xl">404</p>
      <p className="mt-4 text-sub">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="mt-8 bg-text px-6 py-3 font-display text-[12px] font-bold tracking-[0.16em] text-paper hover:bg-brand hover:text-brand-ink">
        HOME →
      </Link>
    </div>
  );
}
