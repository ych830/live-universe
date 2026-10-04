# LIVE UNIVERSE 홈페이지

대중음악 콘서트 기획 그룹 **라이브유니버스(LIVE UNIVERSE)** 홈페이지입니다.
Next.js 16 (App Router) + Tailwind CSS 4.

## 페이지

| 주소 | 내용 |
|---|---|
| `/` | 메인 — 로고 + 예매 중·오픈 예정 공연 포스터 패널, 스크롤하면 지난 공연(ARCHIVE), 그룹 소개, 문의 |
| `/performances` | 공연 목록 — 상태(예매 중/오픈 예정/공개 예정/지난 공연)·계열사로 거르기 |
| `/performances/[주소]` | 공연 상세 — 포스터, 공연 정보, 티켓 오픈 카운트다운, 예매처 버튼, 사진 |
| `/companies` | 계열사 소개 |
| `/admin` | 관리자 페이지 (방식 A) |
| `/cms` | Decap CMS (방식 B) |

### 공연 상태는 날짜로 자동 계산됩니다 (한국 시간)

- 종료일이 지났으면 → **ARCHIVE** (지난 공연)
- 티켓 오픈 일시 전이면 → **OPEN SOON** + 카운트다운
- 티켓 오픈 일시가 지났거나, 오픈 일시 없이 예매처 링크만 있으면 → **NOW ON SALE**
- 둘 다 없으면 → **COMING SOON**

예매처 버튼은 오픈 전에도 보입니다 (예매처 공연 페이지로 연결).

## 실행

```bash
npm install
cp .env.example .env.local   # 필요한 값만 채우기
npm run dev                  # http://localhost:3000
npm test                     # 상태·날짜 계산 테스트
npm run build
```

## 공연·포스터 올리기 — 두 가지 방식

홈페이지는 `CONTENT_SOURCE` 값에 따라 **한쪽** 데이터만 보여줍니다.

| | A. 관리자 페이지 `/admin` | B. Decap CMS `/cms` |
|---|---|---|
| `CONTENT_SOURCE` | `supabase` | `files` (기본값) |
| 데이터 저장 | Supabase DB, 이미지는 Supabase Storage | 이 레포의 `content/*.json`, 이미지는 `public/uploads/` |
| 로그인 | 이메일 + 비밀번호 | GitHub 계정 |
| 반영 | 저장 후 1분 안에 | 저장 = 커밋 → 재배포(보통 1~2분) |
| 비용 | Supabase 무료 플랜으로 시작 가능 | 무료 |

### A. Supabase + `/admin` 연결

1. https://supabase.com 에서 프로젝트를 만듭니다.
2. **SQL Editor** 에 `supabase/schema.sql` 을 붙여 넣고 Run. (테이블, 권한, 이미지 저장소가 만들어집니다)
3. **Authentication → Users → Add user** 로 관리자 계정(이메일·비밀번호)을 만듭니다.
4. SQL Editor 에서 그 이메일을 관리자로 등록합니다.
   ```sql
   insert into public.admins (email) values ('관리자@이메일.com');
   ```
   `admins` 에 없는 계정은 로그인해도 아무것도 바꿀 수 없습니다.
5. **Project Settings → API** 의 URL 과 anon key 를 환경변수에 넣습니다.
   ```
   CONTENT_SOURCE=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
6. `/admin` 에서 로그인 → 계열사 등록 → 공연 등록.

### B. Decap CMS + `/cms` 연결

- **내 컴퓨터에서**: 터미널 두 개로 `npm run dev`, `npm run cms` 를 띄우고 http://localhost:3000/cms → 로그인 버튼. 저장하면 `content/` 파일이 바로 바뀝니다. 커밋·푸시는 직접.
- **배포 사이트에서**:
  1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**
     - Homepage URL: `https://내도메인`
     - Authorization callback URL: `https://내도메인/api/decap/callback`
  2. Client ID / Client Secret 을 환경변수 `DECAP_GITHUB_CLIENT_ID`, `DECAP_GITHUB_CLIENT_SECRET` 에 넣습니다.
  3. `public/cms/index.html` 의 `repo` 가 실제 레포(`ych830/live-universe`)·브랜치(`main`)와 같은지 확인합니다.
  4. `/cms` → GitHub 로 로그인 → 저장하면 레포에 커밋되고 호스팅이 다시 배포합니다.

## 배포 (Vercel 추천)

1. https://vercel.com 에서 이 GitHub 레포를 Import.
2. Environment Variables 에 위 값들을 넣고 Deploy.
3. 도메인 연결은 Vercel → Settings → Domains.

## 바꿔야 할 것

- 회사 정보(이메일·전화·주소·대표·사업자번호·SNS): `src/lib/site.ts`
- 예시 데이터: `content/companies/*.json`, `content/performances/*.json`, `public/uploads/samples/` (모두 `※ 예시`)
- 예매처 목록: `src/lib/vendors.ts` (+ Decap 쓰면 `public/cms/config.yml` 의 vendor 옵션)

## 폴더

```text
content/               공연·계열사 JSON (방식 B)
public/cms/            Decap CMS 화면·설정
public/uploads/        Decap 으로 올린 이미지, 예시 포스터
supabase/schema.sql    Supabase 테이블·권한 (방식 A)
src/app/(site)/        공개 페이지
src/app/admin/         관리자 페이지 (방식 A)
src/app/api/decap/     Decap CMS GitHub 로그인
src/components/        화면 조각 (admin/ 은 관리자용)
src/lib/content/       데이터 읽기 — files / supabase 전환
src/lib/status.ts      공연 상태·날짜 계산 (한국 시간)
```
