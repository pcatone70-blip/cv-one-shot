-- ============================================================
-- CV ONE SHOT — Database Schema (Supabase / PostgreSQL)
-- ============================================================
-- Esegui questo SQL nel SQL Editor di Supabase
-- Supabase Dashboard → SQL Editor → New query → incolla e Run
-- ============================================================

-- ─── Tabella: profiles ──────────────────────────────────────
-- Estende auth.users di Supabase con dati aggiuntivi
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  plan text default 'free' check (plan in ('free', 'pro', 'lifetime')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Aggiorna updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ─── Tabella: cvs ───────────────────────────────────────────
create table if not exists public.cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Il mio CV',
  language text default 'it' check (language in ('it', 'en')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger cvs_updated_at
  before update on public.cvs
  for each row execute function public.handle_updated_at();

-- ─── Indici per performance ──────────────────────────────────
create index if not exists idx_cvs_user_id on public.cvs(user_id);
create index if not exists idx_profiles_stripe on public.profiles(stripe_customer_id);

-- ─── Row Level Security (RLS) ────────────────────────────────
-- Abilita RLS: ogni utente vede solo i propri dati
alter table public.profiles enable row level security;
alter table public.cvs enable row level security;

-- Policy: profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Policy: cvs
create policy "Users can view own CVs"
  on public.cvs for select
  using (auth.uid() = user_id);

create policy "Users can create own CVs"
  on public.cvs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own CVs"
  on public.cvs for update
  using (auth.uid() = user_id);

create policy "Users can delete own CVs"
  on public.cvs for delete
  using (auth.uid() = user_id);

-- ─── Trigger: crea profilo automaticamente alla registrazione ─
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
