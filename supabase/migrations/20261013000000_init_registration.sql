-- ==============================================================================
-- GENESIS 2026 - Registration Database Schema
-- Migration: 20261013000000_init_registration.sql
-- ==============================================================================

-- 1. Create registrations table
create table if not exists public.registrations (
    id uuid primary key default gen_random_uuid(),
    team_id text not null unique,
    edition text not null default 'genesis-2026',
    team_name text not null,
    track text not null check (track in ('gaming', 'vr')),
    college text not null default '',
    city text not null default '',
    leader_name text not null,
    leader_email text not null,
    leader_phone text not null,
    members jsonb not null default '[]'::jsonb,
    consent boolean not null default true,
    consent_timestamp timestamptz not null default now(),
    privacy_version text not null default '1.0',
    created_at timestamptz not null default now()
);

-- 2. Indexes for fast lookup & duplicate enforcement per edition
create index if not exists idx_registrations_edition on public.registrations (edition);
create index if not exists idx_registrations_track on public.registrations (track);
create index if not exists idx_registrations_created_at on public.registrations (created_at desc);

-- Enforce unique leader email and phone per tournament edition
create unique index if not exists idx_registrations_edition_leader_email 
    on public.registrations (edition, lower(leader_email));

create unique index if not exists idx_registrations_edition_leader_phone 
    on public.registrations (edition, leader_phone);

-- 3. Row Level Security (RLS)
alter table public.registrations enable row level security;

-- Public can insert new registrations (validated by API / Turnstile upstream)
create policy "Allow public registration insert"
    on public.registrations
    for insert
    with check (true);

-- Authenticated admins or service role can select all registrations
create policy "Allow service role full access"
    on public.registrations
    for all
    using (auth.role() = 'service_role');

create policy "Allow authenticated admin read"
    on public.registrations
    for select
    to authenticated
    using (true);

-- 4. Aggregated stats helper function (Security Definer, protects PII)
create or replace function public.get_registration_stats(p_edition text default 'genesis-2026')
returns json
language plpgsql
security definer
as $$
declare
    v_total int;
    v_gaming int;
    v_vr int;
begin
    select count(*) into v_total
    from public.registrations
    where edition = p_edition;

    select count(*) into v_gaming
    from public.registrations
    where edition = p_edition and track = 'gaming';

    select count(*) into v_vr
    from public.registrations
    where edition = p_edition and track = 'vr';

    return json_build_object(
        'edition', p_edition,
        'total', v_total,
        'gaming', v_gaming,
        'vr', v_vr
    );
end;
$$;
