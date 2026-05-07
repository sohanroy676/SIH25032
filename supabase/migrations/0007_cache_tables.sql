-- Add caching tables for festivals and chat responses
create extension if not exists pgcrypto;

-- festivals_cache table for caching Gemini festival data
create table if not exists public.festivals_cache (
    cache_id uuid primary key default gen_random_uuid(),
    state text not null,
    gemini_response jsonb not null,
    cached_at timestamptz not null default now(),
    expires_at timestamptz not null default (now() + interval '7 days')
);

-- chat_cache table for caching similar chat responses
create table if not exists public.chat_cache (
    cache_id uuid primary key default gen_random_uuid(),
    prompt_hash text not null,
    prompt text not null,
    response text not null,
    language text,
    cached_at timestamptz not null default now(),
    expires_at timestamptz not null default (now() + interval '1 day')
);

-- Enable RLS
alter table public.festivals_cache enable row level security;
alter table public.chat_cache enable row level security;

-- Policies for festivals_cache (read-only for all, write for service role)
drop policy if exists "festivals_cache_read_all" on public.festivals_cache;
create policy "festivals_cache_read_all" on public.festivals_cache for select using (true);

drop policy if exists "festivals_cache_write_service" on public.festivals_cache;
create policy "festivals_cache_write_service" on public.festivals_cache for all using (
  auth.role() = 'service_role'
);

-- Policies for chat_cache (read-only for all, write for service role)
drop policy if exists "chat_cache_read_all" on public.chat_cache;
create policy "chat_cache_read_all" on public.chat_cache for select using (true);

drop policy if exists "chat_cache_write_service" on public.chat_cache;
create policy "chat_cache_write_service" on public.chat_cache for all using (
  auth.role() = 'service_role'
);

-- Indexes for performance
create index if not exists idx_festivals_cache_state on public.festivals_cache(state);
create index if not exists idx_festivals_cache_expires on public.festivals_cache(expires_at);
create index if not exists idx_chat_cache_hash on public.chat_cache(prompt_hash);
create index if not exists idx_chat_cache_expires on public.chat_cache(expires_at);

-- Function to clean up expired cache entries
create or replace function cleanup_expired_cache()
returns void as $$
begin
  delete from public.festivals_cache where expires_at < now();
  delete from public.chat_cache where expires_at < now();
end;
$$ language plpgsql;
