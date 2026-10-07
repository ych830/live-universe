-- LIVE UNIVERSE — Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여 넣고 Run.

-- 1) 관리자 목록: 여기 들어 있는 이메일로 로그인한 사람만 수정할 수 있다
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- admins 테이블은 대시보드에서만 편집한다 (정책 없음 = API 로는 읽기/쓰기 불가)

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;

-- 2) 계열사
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  name_en text,
  tagline text,
  description text,
  logo text,
  website text,
  instagram text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 3) 공연
create table if not exists public.performances (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  subtitle text,
  artist text,
  company_slug text references public.companies (slug) on update cascade on delete set null,
  poster text,
  gallery text[] not null default '{}',
  detail_images text[] not null default '{}',
  start_date date not null,
  end_date date,
  time_text text,
  venue text,
  age_rating text,
  running_time text,
  price text,
  ticket_open_at timestamptz,
  ticket_links jsonb not null default '[]',
  featured boolean not null default false,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 이미 만들어 둔 DB 에 '상세 이미지' 칸 추가 (처음 만드는 DB 에서는 아무 일도 안 함)
alter table public.performances add column if not exists detail_images text[] not null default '{}';

-- 4) 권한: 누구나 읽기, 관리자만 쓰기
alter table public.companies enable row level security;
alter table public.performances enable row level security;

drop policy if exists "public read" on public.companies;
create policy "public read" on public.companies for select using (true);
drop policy if exists "admin write" on public.companies;
create policy "admin write" on public.companies for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.performances;
create policy "public read" on public.performances for select using (true);
drop policy if exists "admin write" on public.performances;
create policy "admin write" on public.performances for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5) 포스터·사진 저장소 (공개 버킷)
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- 6) 관리자 이메일 등록 (본인 이메일로 바꿔서 실행)
-- insert into public.admins (email) values ('you@example.com');
