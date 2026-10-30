-- ====================================================================
-- AQUAPRICE INDIA: PRODUCTION POSTGRESQL SCHEMA FOR SUPABASE
-- Tables: admin_users, prawn_counts, prawn_prices, announcements, 
--         platform_settings, admin_activity_logs
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. admin_users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. prawn_counts Table
CREATE TABLE IF NOT EXISTS public.prawn_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_label VARCHAR(100) UNIQUE NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. prawn_prices Table
-- Enforces ONE price record per count_id
CREATE TABLE IF NOT EXISTS public.prawn_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_id UUID NOT NULL REFERENCES public.prawn_counts(id) ON DELETE CASCADE,
    current_price_per_kg NUMERIC(10, 2) NOT NULL CHECK (current_price_per_kg > 0),
    publication_status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (publication_status IN ('draft', 'published')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_prawn_prices_count UNIQUE (count_id)
);

-- 5. announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. platform_settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    business_name VARCHAR(255) NOT NULL,
    contact_message TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. admin_activity_logs Table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_prawn_counts_order ON public.prawn_counts (display_order ASC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_prawn_prices_count ON public.prawn_prices (count_id);
CREATE INDEX IF NOT EXISTS idx_prawn_prices_status ON public.prawn_prices (publication_status);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.admin_activity_logs (created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prawn_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prawn_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS (Farmers)
-- Public can read active prawn counts
CREATE POLICY "Public can view active prawn counts"
ON public.prawn_counts FOR SELECT
USING (is_active = true);

-- Public can read published prices only
CREATE POLICY "Public can view published prawn prices"
ON public.prawn_prices FOR SELECT
USING (publication_status = 'published');

-- Public can view published announcements
CREATE POLICY "Public can view active announcements"
ON public.announcements FOR SELECT
USING (is_published = true);

-- Public can view platform settings (phone numbers for Call & WhatsApp)
CREATE POLICY "Public can view platform settings"
ON public.platform_settings FOR SELECT
USING (true);

-- ADMIN FULL ACCESS POLICIES
-- Authenticated users with valid admin role have full CRUD access
CREATE POLICY "Admins have full access to prawn_counts"
ON public.prawn_counts FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to prawn_prices"
ON public.prawn_prices FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to announcements"
ON public.announcements FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to platform_settings"
ON public.platform_settings FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to admin_users"
ON public.admin_users FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to activity logs"
ON public.admin_activity_logs FOR ALL
USING (auth.role() = 'authenticated');

-- REALTIME REPLICATION ENABLEMENT
ALTER PUBLICATION supabase_realtime ADD TABLE public.prawn_prices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prawn_counts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

