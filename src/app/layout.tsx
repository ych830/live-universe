import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { SITE } from "@/lib/site";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: { default: `${SITE.name} | ${SITE.nameKo}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={unbounded.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
