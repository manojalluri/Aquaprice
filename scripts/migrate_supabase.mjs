import { Client } from 'pg';
import bcrypt from 'bcryptjs';

async function runCleanMigration() {
  console.log('Connecting to Supabase PostgreSQL in ap-northeast-2...');

  const client = new Client({
    host: 'aws-0-ap-northeast-2.pooler.supabase.com',
    port: 5432,
    user: 'postgres.ozlbgcznyehngnfgkgqy',
    password: 'MANOJALURI27227',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL!');

    // 1. Enable UUID Extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 2. Table: admin_users (Prompt Section 13.1)
    console.log('Setting up admin_users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.admin_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        auth_user_id UUID,
        role VARCHAR(50) NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'super_admin')),
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
      );
    `);

    // 3. Table: prawn_counts (Prompt Section 13.2)
    console.log('Setting up prawn_counts...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.prawn_counts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        count_label VARCHAR(100) UNIQUE NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 1,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
      );
    `);

    // 4. Table: prawn_prices (Prompt Section 13.3)
    console.log('Aligning prawn_prices table to Section 13 specifications...');
    // Drop legacy table if schema differed
    await client.query(`DROP TABLE IF EXISTS public.prawn_prices CASCADE;`);
    await client.query(`
      CREATE TABLE public.prawn_prices (
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
    `);

    // 5. Table: announcements (Prompt Section 13.4)
    console.log('Setting up announcements...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.announcements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
      );
    `);

    // 6. Table: platform_settings (Prompt Section 13.5)
    console.log('Setting up platform_settings...');
    await client.query(`DROP TABLE IF EXISTS public.platform_settings CASCADE;`);
    await client.query(`
      CREATE TABLE public.platform_settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        buyer_name VARCHAR(255) NOT NULL,
        buyer_phone VARCHAR(20) NOT NULL,
        whatsapp_number VARCHAR(20) NOT NULL,
        alternate_phone VARCHAR(20),
        business_name VARCHAR(255) NOT NULL,
        contact_message TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
      );
    `);

    // 7. Table: admin_activity_logs (Prompt Section 13.6)
    console.log('Setting up admin_activity_logs...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        admin_id VARCHAR(255) NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
      );
    `);

    // Indexes
    console.log('Creating database indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_prawn_counts_order ON public.prawn_counts (display_order ASC) WHERE is_active = true;
      CREATE INDEX IF NOT EXISTS idx_prawn_prices_count ON public.prawn_prices (count_id);
      CREATE INDEX IF NOT EXISTS idx_prawn_prices_status ON public.prawn_prices (publication_status);
      CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements (is_published, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.admin_activity_logs (created_at DESC);
    `);

    // Row Level Security (RLS)
    console.log('Configuring Row Level Security (RLS)...');
    await client.query(`
      ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.prawn_counts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.prawn_prices ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Public can view active prawn counts" ON public.prawn_counts;
      CREATE POLICY "Public can view active prawn counts" ON public.prawn_counts FOR SELECT USING (is_active = true);

      DROP POLICY IF EXISTS "Public can view published prawn prices" ON public.prawn_prices;
      CREATE POLICY "Public can view published prawn prices" ON public.prawn_prices FOR SELECT USING (publication_status = 'published');

      DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;
      CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (is_published = true);

      DROP POLICY IF EXISTS "Public can view platform settings" ON public.platform_settings;
      CREATE POLICY "Public can view platform settings" ON public.platform_settings FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Admins have full access to prawn_counts" ON public.prawn_counts;
      CREATE POLICY "Admins have full access to prawn_counts" ON public.prawn_counts FOR ALL USING (true);

      DROP POLICY IF EXISTS "Admins have full access to prawn_prices" ON public.prawn_prices;
      CREATE POLICY "Admins have full access to prawn_prices" ON public.prawn_prices FOR ALL USING (true);

      DROP POLICY IF EXISTS "Admins have full access to announcements" ON public.announcements;
      CREATE POLICY "Admins have full access to announcements" ON public.announcements FOR ALL USING (true);

      DROP POLICY IF EXISTS "Admins have full access to platform_settings" ON public.platform_settings;
      CREATE POLICY "Admins have full access to platform_settings" ON public.platform_settings FOR ALL USING (true);

      DROP POLICY IF EXISTS "Admins have full access to admin_users" ON public.admin_users;
      CREATE POLICY "Admins have full access to admin_users" ON public.admin_users FOR ALL USING (true);

      DROP POLICY IF EXISTS "Admins have full access to activity logs" ON public.admin_activity_logs;
      CREATE POLICY "Admins have full access to activity logs" ON public.admin_activity_logs FOR ALL USING (true);
    `);

    // Enable Supabase Realtime
    console.log('Enabling Realtime replication on public tables...');
    try {
      await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE public.prawn_prices;`);
    } catch (e) {}
    try {
      await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE public.prawn_counts;`);
    } catch (e) {}
    try {
      await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;`);
    } catch (e) {}

    // SEEDING
    console.log('Seeding initial data for East Godavari, West Godavari & Krishna (AP)...');
    
    // Seed Platform Settings
    await client.query(`
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
      );
    `);

    // Seed Announcement
    await client.query(`
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
    `);

    // Seed Admin Users
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);

    await client.query(`
      INSERT INTO public.admin_users (email, name, role, is_active, password_hash)
      VALUES 
        ('buyer@aquaprice.com', 'M. Srinivasa Rao (Prawn Buyer)', 'buyer', true, $1),
        ('superadmin@aquaprice.com', 'Super Admin', 'super_admin', true, $1)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash;
    `, [hash]);

    // Seed Prawn Counts & Prices
    const counts = [
      { id: 'c0000000-0000-0000-0000-000000000030', label: '30 Count', order: 1, price: 520 },
      { id: 'c0000000-0000-0000-0000-000000000040', label: '40 Count', order: 2, price: 440 },
      { id: 'c0000000-0000-0000-0000-000000000050', label: '50 Count', order: 3, price: 380 },
      { id: 'c0000000-0000-0000-0000-000000000060', label: '60 Count', order: 4, price: 340 },
      { id: 'c0000000-0000-0000-0000-000000000070', label: '70 Count', order: 5, price: 310 },
      { id: 'c0000000-0000-0000-0000-000000000080', label: '80 Count', order: 6, price: 280 },
      { id: 'c0000000-0000-0000-0000-000000000090', label: '90 Count', order: 7, price: 255 },
      { id: 'c0000000-0000-0000-0000-000000000100', label: '100 Count', order: 8, price: 230 },
    ];

    for (const c of counts) {
      await client.query(`
        INSERT INTO public.prawn_counts (id, count_label, display_order, is_active)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (count_label) DO UPDATE SET
          display_order = EXCLUDED.display_order,
          is_active = true;
      `, [c.id, c.label, c.order]);

      await client.query(`
        INSERT INTO public.prawn_prices (count_id, current_price_per_kg, publication_status, published_at, updated_by)
        VALUES ($1, $2, 'published', timezone('utc'::text, now()), 'Admin')
        ON CONFLICT (count_id) DO UPDATE SET
          current_price_per_kg = EXCLUDED.current_price_per_kg,
          published_at = timezone('utc'::text, now()),
          publication_status = 'published';
      `, [c.id, c.price]);
    }

    // Verify row counts
    const countsRes = await client.query(`SELECT COUNT(*) FROM public.prawn_counts;`);
    const pricesRes = await client.query(`SELECT COUNT(*) FROM public.prawn_prices;`);
    const usersRes = await client.query(`SELECT COUNT(*) FROM public.admin_users;`);
    const settingsRes = await client.query(`SELECT * FROM public.platform_settings;`);

    console.log(`\n🎉 SUPABASE POSTGRESQL VERIFICATION:`);
    console.log(`   - Prawn Counts: ${countsRes.rows[0].count}`);
    console.log(`   - Published Prices: ${pricesRes.rows[0].count}`);
    console.log(`   - Admin Users: ${usersRes.rows[0].count}`);
    console.log(`   - Buyer Name: ${settingsRes.rows[0].buyer_name}`);
    console.log(`   - Buyer Phone: +91 ${settingsRes.rows[0].buyer_phone}`);
    console.log(`   - WhatsApp: +91 ${settingsRes.rows[0].whatsapp_number}`);

    await client.end();
    console.log('\n✓ All 6 tables, indexes, RLS policies, and seed data live on Supabase!');
  } catch (err) {
    console.error('Migration failed:', err);
    await client.end();
    process.exit(1);
  }
}

runCleanMigration();
