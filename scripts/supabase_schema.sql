-- ============================================================
-- ThermoWash — Supabase SQL Schema for Leads
-- Выполните этот SQL в Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Создаем таблицу leads
create table if not exists public.leads (
  id text primary key,
  name text not null,
  phone text not null,
  service text,
  problem text,
  location text,
  language text default 'uz',
  source text,
  ip_hash text,
  created_at timestamptz default now()
);

-- 2. Включаем Row Level Security (RLS)
alter table public.leads enable row level security;

-- 3. Разрешаем анонимную вставку новых заявок с сайта
create policy "Allow anonymous insert for leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- 4. Разрешаем чтение заявок только авторизованным пользователям (сервисной роли / админам)
create policy "Allow service role full access"
  on public.leads
  for select
  to authenticated
  using (true);

-- 5. Индекс по дате создания для быстрой сортировки
create index if not exists idx_leads_created_at on public.leads(created_at desc);
