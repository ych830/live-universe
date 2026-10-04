import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-extrabold md:text-9xl">404</p>
      <p className="mt-4 text-muted">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="mt-8 rounded-full border border-fg/30 px-6 py-3 text-sm hover:border-fg">
        홈으로
      </Link>
    </div>
  );
}
