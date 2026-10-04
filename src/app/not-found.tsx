import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cobalt px-4 text-center">
      <p className="font-display text-7xl font-extrabold md:text-9xl">404</p>
      <p className="mt-4 text-white/80">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="mt-8 border border-white/60 px-6 py-3 text-sm hover:border-white">
        홈으로
      </Link>
    </div>
  );
}
