-- ==============================================================================
-- GENESIS 2026 - Seed Data for Local Development & Testing
-- File: supabase/seed.sql
-- ==============================================================================

insert into public.registrations (
    team_id,
    edition,
    team_name,
    track,
    college,
    city,
    leader_name,
    leader_email,
    leader_phone,
    members,
    consent,
    consent_timestamp,
    privacy_version,
    created_at
) values
(
    'GEN-2026-1001',
    'genesis-2026',
    'Apex Brawlers',
    'gaming',
    'Army Institute of Technology',
    'Pune',
    'Aarav Sharma',
    'aarav.sharma@example.com',
    '+919876543210',
    '[
        {"name": "Rohan Gupta", "email": "rohan.gupta@example.com", "phone": "+919876543211"},
        {"name": "Vikram Singh", "email": "vikram.singh@example.com"}
    ]'::jsonb,
    true,
    '2026-10-10 10:00:00+00',
    '1.0',
    '2026-10-10 10:00:00+00'
),
(
    'GEN-2026-1002',
    'genesis-2026',
    'Cyber Vortex VR',
    'vr',
    'COEP Technological University',
    'Pune',
    'Neha Patel',
    'neha.patel@example.com',
    '+919876543220',
    '[
        {"name": "Ananya Joshi", "email": "ananya.joshi@example.com"}
    ]'::jsonb,
    true,
    '2026-10-11 14:30:00+00',
    '1.0',
    '2026-10-11 14:30:00+00'
),
(
    'GEN-2026-1003',
    'genesis-2026',
    'HyperNova Strike',
    'gaming',
    'Symbiosis Institute of Technology',
    'Pune',
    'Karan Mehta',
    'karan.mehta@example.com',
    '+919876543230',
    '[]'::jsonb,
    true,
    '2026-10-12 18:00:00+00',
    '1.0',
    '2026-10-12 18:00:00+00'
)
on conflict (team_id) do nothing;
