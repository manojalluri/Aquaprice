-- ====================================================================
-- AQUAPRICE INDIA: PRODUCTION SEED DATA
-- Default Prawn Counts, Daily Rates, Contact Settings & Announcements
-- ====================================================================

-- 1. Seed Platform Settings
INSERT INTO public.platform_settings (
    id,
    buyer_name,
    buyer_phone,
    whatsapp_number,
    alternate_phone,
    business_name,
    contact_message,
    updated_at
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'M. Srinivasa Rao',
    '9848022338',
    '9848022338',
    '9440188992',
    'Sri Venkateswara Aqua Feeds & Prawn Procurement',
    'Direct pond-gate harvesting, immediate electronic weighing & spot bank settlement across East & West Godavari and Krishna (AP).',
    timezone('utc'::text, now())
) ON CONFLICT (id) DO NOTHING;

-- 2. Seed Announcements
INSERT INTO public.announcements (
    id,
    title,
    description,
    is_published,
    created_at,
    updated_at
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'Today''s Prawn Market Rates Published',
    'Fresh daily procurement rates for East Godavari, West Godavari & Krishna districts are active. Direct pond harvesting available.',
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
) ON CONFLICT (id) DO NOTHING;

-- 3. Seed Prawn Counts
INSERT INTO public.prawn_counts (id, count_label, display_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000030', '30 Count', 1, true),
('c0000000-0000-0000-0000-000000000040', '40 Count', 2, true),
('c0000000-0000-0000-0000-000000000050', '50 Count', 3, true),
('c0000000-0000-0000-0000-000000000060', '60 Count', 4, true),
('c0000000-0000-0000-0000-000000000070', '70 Count', 5, true),
('c0000000-0000-0000-0000-000000000080', '80 Count', 6, true),
('c0000000-0000-0000-0000-000000000090', '90 Count', 7, true),
('c0000000-0000-0000-0000-000000000100', '100 Count', 8, true)
ON CONFLICT (count_label) DO NOTHING;

-- 4. Seed Prawn Prices
INSERT INTO public.prawn_prices (count_id, current_price_per_kg, publication_status, published_at, updated_by) VALUES
('c0000000-0000-0000-0000-000000000030', 520.00, 'published', timezone('utc'::text, now()), 'Admin'),
('c0000000-0000-0000-0000-000000000040', 440.00, 'published', timezone('utc'::text, now()), 'Admin'),
('c0000000-0000-0000-0000-000000000050', 380.00, 'published', timezone('utc'::text, now()), 'Admin'),
('c0000000-0000-0000-0000-000000000060', 340.00, 'published', timezone('utc'::text, now()), 'Admin'),
('c0000000-0000-0000-0000-000000000070', 310.00, 'published', timezone('utc'::text, now()), 'Admin'),
('c0000000-0000-0000-0000-000000000080', 280.00, 'published', timezone('utc'::text, now()), 'Admin'),
('c0000000-0000-0000-0000-000000000090', 255.00, 'published', timezone('utc'::text, now()), 'Admin'),
('c0000000-0000-0000-0000-000000000100', 230.00, 'published', timezone('utc'::text, now()), 'Admin')
ON CONFLICT (count_id) DO UPDATE SET
    current_price_per_kg = EXCLUDED.current_price_per_kg,
    published_at = EXCLUDED.published_at,
    updated_at = timezone('utc'::text, now());

