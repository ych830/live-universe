import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /cms → Decap CMS 화면 (public/cms/index.html)
  async rewrites() {
    return [{ source: "/cms", destination: "/cms/index.html" }];
  },
  // CONTENT_SOURCE=files 일 때 서버가 content/ 의 JSON 을 읽는다
  outputFileTracingIncludes: {
    "/**/*": ["./content/**/*"],
  },
  // GitHub Pages 임시 미리보기용 빌드 (scripts/build-pages-preview.mjs 에서만 켜진다)
  ...(process.env.PAGES_BASE_PATH ? { basePath: process.env.PAGES_BASE_PATH, distDir: ".next-pages" } : {}),
};

export default nextConfig;
