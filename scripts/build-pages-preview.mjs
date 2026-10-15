// GitHub Pages 임시 미리보기용 정적 사본을 만든다 (사용자 결정 2026-10-14, CLAUDE.md 참고).
// 사용법: node scripts/build-pages-preview.mjs   → .pages-preview/ 에 만들어진다 (gh-pages 브랜치로 올림)
//
// 1. basePath(/live-universe)를 넣어 .next-pages/ 에 따로 빌드하고 next start 로 띄운다
// 2. 공개 페이지(메인·공연 목록·공연 상세·계열사·404)의 HTML 을 저장한다
// 3. _next/static 과 public(cms 제외)을 복사하고, basePath 가 안 붙는 경로(이미지·별 배경·검색 폼)를 고친다
// 4. 검색엔진에 안 걸리게 noindex 를 넣는다
// 정적 사본이라 검색·필터는 동작하지 않고, 상태(예매 중 등)는 만든 시점 기준으로 멈춰 있다.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = "/live-universe";
const PORT = 3123;
const ROOT = process.cwd();
const OUT = path.join(ROOT, ".pages-preview");
const env = { ...process.env, PAGES_BASE_PATH: BASE, CONTENT_SOURCE: "files" };

const run = (args) => {
  const r = spawnSync("npx", args, { cwd: ROOT, env, stdio: "inherit" });
  if (r.status !== 0) throw new Error(`npx ${args.join(" ")} 실패`);
};

run(["next", "build"]);

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, env, stdio: "ignore", detached: true });
const stop = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};
process.on("exit", stop);

const origin = `http://localhost:${PORT}`;
for (let i = 0; ; i++) {
  try {
    await fetch(`${origin}${BASE}`);
    break;
  } catch {
    if (i > 60) throw new Error("next start 가 뜨지 않았습니다");
    await new Promise((r) => setTimeout(r, 500));
  }
}

const slugs = fs
  .readdirSync(path.join(ROOT, "content/performances"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));
const routes = ["/", "/performances", "/companies", ...slugs.map((s) => `/performances/${s}`)];

function fix(html) {
  return html
    .replaceAll('"/uploads/', `"${BASE}/uploads/`)
    .replaceAll('action="/performances"', `action="${BASE}/performances/"`)
    .replaceAll('\\"action\\":\\"/performances\\"', `\\"action\\":\\"${BASE}/performances/\\"`)
    .replace("<head>", '<head><meta name="robots" content="noindex, nofollow"/>');
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const route of routes) {
  const res = await fetch(`${origin}${BASE}${route === "/" ? "" : route}`);
  if (!res.ok) throw new Error(`${route}: ${res.status}`);
  const file = path.join(OUT, route, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, fix(await res.text()));
  console.log("저장", route);
}
const missing = await fetch(`${origin}${BASE}/__not-found__`);
fs.writeFileSync(path.join(OUT, "404.html"), fix(await missing.text()));
const icon = await fetch(`${origin}${BASE}/favicon.ico`);
fs.writeFileSync(path.join(OUT, "favicon.ico"), Buffer.from(await icon.arrayBuffer()));
stop();

// _next/static. CSS 의 url(/space/...) 와 상단 검색창(JS 로 그려짐)의 form action 에도 basePath 를 붙인다
fs.cpSync(path.join(ROOT, ".next-pages/static"), path.join(OUT, "_next/static"), { recursive: true });
for (const f of fs.readdirSync(path.join(OUT, "_next/static"), { recursive: true })) {
  const p = path.join(OUT, "_next/static", String(f));
  if (String(f).endsWith(".css")) {
    fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/url\((["']?)\/(?!live-universe\/)/g, `url($1${BASE}/`));
  } else if (String(f).endsWith(".js")) {
    const js = fs.readFileSync(p, "utf8");
    if (js.includes('action:"/performances"')) fs.writeFileSync(p, js.replaceAll('action:"/performances"', `action:"${BASE}/performances/"`));
  }
}
// public 폴더 (Decap CMS 화면은 뺀다)
for (const name of fs.readdirSync(path.join(ROOT, "public"))) {
  if (name === "cms") continue;
  fs.cpSync(path.join(ROOT, "public", name), path.join(OUT, name), { recursive: true });
}
// _next 처럼 _ 로 시작하는 폴더를 GitHub Pages(Jekyll)가 숨기지 않게 한다
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
console.log(`완료: ${path.relative(ROOT, OUT)}/ (${routes.length}개 페이지 + 404)`);
process.exit(0);
