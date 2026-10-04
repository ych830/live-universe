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
};

export default nextConfig;
