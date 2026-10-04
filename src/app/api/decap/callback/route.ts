// Decap CMS GitHub 로그인 2단계: code 를 토큰으로 바꿔 CMS 창(opener)에 넘긴다
import { NextResponse, type NextRequest } from "next/server";

function reply(status: "success" | "error", content: object) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  // CMS 와 같은 출처(origin)로만 토큰을 보낸다
  const html = `<!doctype html><html><body><script>
(function () {
  var message = ${JSON.stringify(message)};
  function receive(e) {
    if (e.origin !== window.location.origin) return;
    window.opener.postMessage(message, e.origin);
    window.removeEventListener("message", receive);
  }
  window.addEventListener("message", receive, false);
  window.opener && window.opener.postMessage("authorizing:github", window.location.origin);
})();
</script></body></html>`;
  const res = new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  res.cookies.delete({ name: "decap_oauth_state", path: "/api/decap" });
  return res;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!code || !state || state !== req.cookies.get("decap_oauth_state")?.value) {
    return reply("error", { message: "로그인 요청이 올바르지 않습니다. 다시 시도해 주세요." });
  }

  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.DECAP_GITHUB_CLIENT_ID,
      client_secret: process.env.DECAP_GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = (await r.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!data.access_token) return reply("error", { message: data.error_description ?? "GitHub 토큰을 받지 못했습니다." });
  return reply("success", { token: data.access_token, provider: "github" });
}
