// Decap CMS GitHub 로그인 1단계: GitHub 인증 화면으로 보낸다
import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.DECAP_GITHUB_CLIENT_ID;
  if (!clientId) return new NextResponse("DECAP_GITHUB_CLIENT_ID 가 설정되지 않았습니다.", { status: 500 });

  const state = randomBytes(16).toString("hex");
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", new URL("/api/decap/callback", req.nextUrl.origin).toString());
  authorize.searchParams.set("scope", req.nextUrl.searchParams.get("scope") ?? "repo,user");
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize);
  res.cookies.set("decap_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/api/decap", maxAge: 600 });
  return res;
}
