import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import {
  AdminActivityLog,
  AdminUser,
  Announcement,
  PlatformSettings,
  PrawnCount,
  PrawnPrice,
  PrawnPriceDisplay,
  PublicMarketDataResponse,
} from '@/types';
import { getCurrentISTTimestamp } from './dateUtils';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'prawn_database.json');

// Supabase PostgreSQL Pool
const databaseUrl = process.env.DATABASE_URL;
let pgPool: Pool | null = null;

if (databaseUrl) {
  pgPool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

interface DatabaseSchema {
  admin_users: (AdminUser & { password_hash: string })[];
  prawn_counts: PrawnCount[];
  prawn_prices: PrawnPrice[];
  announcements: Announcement[];
  platform_settings: PlatformSettings;
  admin_activity_logs: AdminActivityLog[];
}

function getInitialData(): DatabaseSchema {
  const now = getCurrentISTTimestamp();
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('admin123', salt);

  const initialCounts: PrawnCount[] = [
    { id: 'count-30', count_label: '30 Count', display_order: 1, is_active: true, created_at: now, updated_at: now },
    { id: 'count-40', count_label: '40 Count', display_order: 2, is_active: true, created_at: now, updated_at: now },
    { id: 'count-50', count_label: '50 Count', display_order: 3, is_active: true, created_at: now, updated_at: now },
    { id: 'count-60', count_label: '60 Count', display_order: 4, is_active: true, created_at: now, updated_at: now },
    { id: 'count-70', count_label: '70 Count', display_order: 5, is_active: true, created_at: now, updated_at: now },
    { id: 'count-80', count_label: '80 Count', display_order: 6, is_active: true, created_at: now, updated_at: now },
    { id: 'count-90', count_label: '90 Count', display_order: 7, is_active: true, created_at: now, updated_at: now },
    { id: 'count-100', count_label: '100 Count', display_order: 8, is_active: true, created_at: now, updated_at: now },
  ];

  const initialPrices: PrawnPrice[] = [
    { id: 'p-30', count_id: 'count-30', current_price_per_kg: 520, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
    { id: 'p-40', count_id: 'count-40', current_price_per_kg: 440, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
    { id: 'p-50', count_id: 'count-50', current_price_per_kg: 380, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
    { id: 'p-60', count_id: 'count-60', current_price_per_kg: 340, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
    { id: 'p-70', count_id: 'count-70', current_price_per_kg: 310, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
    { id: 'p-80', count_id: 'count-80', current_price_per_kg: 280, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
    { id: 'p-90', count_id: 'count-90', current_price_per_kg: 255, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
    { id: 'p-100', count_id: 'count-100', current_price_per_kg: 230, publication_status: 'published', published_at: now, updated_by: 'admin-1', created_at: now, updated_at: now },
  ];

  return {
    admin_users: [
      {
        id: 'admin-1',
        email: 'buyer@aquaprice.com',
        role: 'buyer',
        is_active: true,
        name: 'M. Srinivasa Rao (Prawn Buyer)',
        password_hash: defaultPasswordHash,
        created_at: now,
      },
      {
        id: 'admin-2',
        email: 'superadmin@aquaprice.com',
        role: 'super_admin',
        is_active: true,
        name: 'Super Admin',
        password_hash: defaultPasswordHash,
        created_at: now,
      }
    ],
    prawn_counts: initialCounts,
    prawn_prices: initialPrices,
    announcements: [
      {
        id: 'ann-1',
        title: "Today's Prawn Market Rates Published",
        description: "Fresh daily procurement rates for East Godavari, West Godavari & Krishna districts are active. Direct pond harvesting available.",
        is_published: true,
        created_at: now,
        updated_at: now,
      }
    ],
    platform_settings: {
      id: 'settings-1',
      buyer_name: 'M. Srinivasa Rao',
      buyer_phone: '9848022338',
      whatsapp_number: '9848022338',
      alternate_phone: '9440188992',
      business_name: 'Sri Venkateswara Aqua Feeds & Prawn Procurement',
      contact_message: 'Direct pond-gate harvesting, immediate electronic weighing & spot bank settlement across East & West Godavari and Krishna (AP).',
      updated_at: now,
    },
    admin_activity_logs: [
      {
        id: 'log-1',
        admin_id: 'admin-1',
        action: 'PUBLISH_PRICES',
        entity_type: 'prawn_prices',
        entity_id: 'bulk',
        created_at: now,
      }
    ],
  };
}

let cachedDb: DatabaseSchema | null = null;

function ensureDataFile(): DatabaseSchema {
  if (cachedDb) return cachedDb;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    cachedDb = initial;
    return cachedDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    cachedDb = JSON.parse(raw);
    return cachedDb!;
  } catch (err) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    cachedDb = initial;
    return cachedDb;
  }
}

function saveDb(data: DatabaseSchema) {
  cachedDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

// ==========================================
// PUBLIC QUERIES
// ==========================================

export async function getPublicMarketData(): Promise<PublicMarketDataResponse> {
  if (pgPool) {
    try {
      // 1. Get published prices joined with active counts
      const pricesRes = await pgPool.query(`
        SELECT 
          c.id AS count_id,
          c.count_label,
          c.display_order,
          c.is_active,
          p.current_price_per_kg,
          p.publication_status,
          p.published_at
        FROM public.prawn_counts c
        INNER JOIN public.prawn_prices p ON p.count_id = c.id
        WHERE c.is_active = true AND p.publication_status = 'published'
        ORDER BY c.display_order ASC;
      `);

      // 2. Get active announcements
      const annRes = await pgPool.query(`
        SELECT * FROM public.announcements 
        WHERE is_published = true 
        ORDER BY created_at DESC;
      `);

      // 3. Get platform settings
      const setRes = await pgPool.query(`
        SELECT * FROM public.platform_settings 
        ORDER BY updated_at DESC LIMIT 1;
      `);

      const priceDisplays: PrawnPriceDisplay[] = pricesRes.rows.map((r) => ({
        count_id: r.count_id,
        count_label: r.count_label,
        display_order: r.display_order,
        current_price_per_kg: Number(r.current_price_per_kg),
        publication_status: 'published',
        published_at: r.published_at ? new Date(r.published_at).toISOString() : getCurrentISTTimestamp(),
        is_active: r.is_active,
      }));

      let latestTimestamp: string | null = null;
      for (const p of priceDisplays) {
        if (!latestTimestamp || new Date(p.published_at) > new Date(latestTimestamp)) {
          latestTimestamp = p.published_at;
        }
      }

      const defaultSettings: PlatformSettings = {
        id: 'settings-1',
        buyer_name: 'M. Srinivasa Rao',
        buyer_phone: '9848022338',
        whatsapp_number: '9848022338',
        alternate_phone: '9440188992',
        business_name: 'Sri Venkateswara Aqua Feeds & Prawn Procurement',
        contact_message: 'Direct pond-gate harvesting across East & West Godavari and Krishna (AP).',
        updated_at: getCurrentISTTimestamp(),
      };

      const settings: PlatformSettings = setRes.rows[0] || defaultSettings;

      return {
        prices: priceDisplays,
        announcements: annRes.rows,
        settings,
        lastUpdatedOverall: latestTimestamp,
        totalActiveCounts: priceDisplays.length,
      };
    } catch (err) {
      console.warn('Postgres query fallback to JSON file:', err);
    }
  }

  // Fallback to local DB
  const db = ensureDataFile();
  const activeCounts = db.prawn_counts
    .filter((c) => c.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  let latestTimestamp: string | null = null;
  const priceDisplays: PrawnPriceDisplay[] = [];

  for (const count of activeCounts) {
    const priceRecord = db.prawn_prices.find(
      (p) => p.count_id === count.id && p.publication_status === 'published'
    );

    if (priceRecord) {
      if (!latestTimestamp || new Date(priceRecord.published_at) > new Date(latestTimestamp)) {
        latestTimestamp = priceRecord.published_at;
      }

      priceDisplays.push({
        count_id: count.id,
        count_label: count.count_label,
        display_order: count.display_order,
        current_price_per_kg: priceRecord.current_price_per_kg,
        publication_status: 'published',
        published_at: priceRecord.published_at,
        is_active: count.is_active,
      });
    }
  }

  return {
    prices: priceDisplays,
    announcements: db.announcements.filter((a) => a.is_published),
    settings: db.platform_settings,
    lastUpdatedOverall: latestTimestamp,
    totalActiveCounts: activeCounts.length,
  };
}

// ==========================================
// ADMIN: COUNTS
// ==========================================

export async function getAllCounts(): Promise<PrawnCount[]> {
  if (pgPool) {
    try {
      const res = await pgPool.query(`
        SELECT * FROM public.prawn_counts 
        ORDER BY display_order ASC;
      `);
      return res.rows;
    } catch (err) {
      console.warn('Postgres query fallback to JSON file:', err);
    }
  }

  const db = ensureDataFile();
  return [...db.prawn_counts].sort((a, b) => a.display_order - b.display_order);
}

export async function createCount(count_label: string, display_order?: number): Promise<PrawnCount> {
  const now = getCurrentISTTimestamp();

  if (pgPool) {
    try {
      let nextOrder = display_order;
      if (!nextOrder) {
        const orderRes = await pgPool.query(`SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM public.prawn_counts;`);
        nextOrder = orderRes.rows[0].next_order;
      }

      const res = await pgPool.query(`
        INSERT INTO public.prawn_counts (count_label, display_order, is_active)
        VALUES ($1, $2, true)
        RETURNING *;
      `, [count_label.trim(), nextOrder]);

      return res.rows[0];
    } catch (err) {
      console.warn('Postgres createCount fallback:', err);
    }
  }

  const db = ensureDataFile();
  const nextOrder = display_order ?? (db.prawn_counts.length > 0 ? Math.max(...db.prawn_counts.map((c) => c.display_order)) + 1 : 1);
  const newCount: PrawnCount = {
    id: `count-${Date.now()}`,
    count_label: count_label.trim(),
    display_order: nextOrder,
    is_active: true,
    created_at: now,
    updated_at: now,
  };

  db.prawn_counts.push(newCount);
  saveDb(db);
  return newCount;
}

export async function updateCount(
  id: string,
  updates: Partial<Pick<PrawnCount, 'count_label' | 'display_order' | 'is_active'>>
): Promise<PrawnCount | null> {
  if (pgPool) {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let i = 1;

      if (updates.count_label !== undefined) {
        fields.push(`count_label = $${i++}`);
        values.push(updates.count_label);
      }
      if (updates.display_order !== undefined) {
        fields.push(`display_order = $${i++}`);
        values.push(updates.display_order);
      }
      if (updates.is_active !== undefined) {
        fields.push(`is_active = $${i++}`);
        values.push(updates.is_active);
      }
      fields.push(`updated_at = timezone('utc'::text, now())`);
      values.push(id);

      const res = await pgPool.query(`
        UPDATE public.prawn_counts 
        SET ${fields.join(', ')} 
        WHERE id = $${i} 
        RETURNING *;
      `, values);

      return res.rows[0] || null;
    } catch (err) {
      console.warn('Postgres updateCount fallback:', err);
    }
  }

  const db = ensureDataFile();
  const index = db.prawn_counts.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.prawn_counts[index] = {
    ...db.prawn_counts[index],
    ...updates,
    updated_at: getCurrentISTTimestamp(),
  };

  saveDb(db);
  return db.prawn_counts[index];
}

export async function deleteCount(id: string): Promise<boolean> {
  if (pgPool) {
    try {
      await pgPool.query(`DELETE FROM public.prawn_counts WHERE id = $1;`, [id]);
      return true;
    } catch (err) {
      console.warn('Postgres deleteCount fallback:', err);
    }
  }

  const db = ensureDataFile();
  const countIndex = db.prawn_counts.findIndex((c) => c.id === id);
  if (countIndex === -1) return false;

  db.prawn_counts.splice(countIndex, 1);
  db.prawn_prices = db.prawn_prices.filter((p) => p.count_id !== id);
  saveDb(db);
  return true;
}

export async function reorderCounts(orderedIds: string[]): Promise<boolean> {
  if (pgPool) {
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await pgPool.query(`
          UPDATE public.prawn_counts 
          SET display_order = $1, updated_at = timezone('utc'::text, now()) 
          WHERE id = $2;
        `, [i + 1, orderedIds[i]]);
      }
      return true;
    } catch (err) {
      console.warn('Postgres reorderCounts fallback:', err);
    }
  }

  const db = ensureDataFile();
  orderedIds.forEach((id, index) => {
    const item = db.prawn_counts.find((c) => c.id === id);
    if (item) {
      item.display_order = index + 1;
      item.updated_at = getCurrentISTTimestamp();
    }
  });

  saveDb(db);
  return true;
}

// ==========================================
// ADMIN: PRICES
// ==========================================

export interface AdminCountPriceRow {
  count_id: string;
  count_label: string;
  display_order: number;
  is_active: boolean;
  price_id: string | null;
  current_price_per_kg: number | null;
  publication_status: 'draft' | 'published';
  published_at: string | null;
  updated_at: string | null;
}

export async function getAdminPricesTable(): Promise<AdminCountPriceRow[]> {
  if (pgPool) {
    try {
      const res = await pgPool.query(`
        SELECT 
          c.id AS count_id,
          c.count_label,
          c.display_order,
          c.is_active,
          p.id AS price_id,
          p.current_price_per_kg,
          p.publication_status,
          p.published_at,
          p.updated_at
        FROM public.prawn_counts c
        LEFT JOIN public.prawn_prices p ON p.count_id = c.id
        ORDER BY c.display_order ASC;
      `);

      return res.rows.map((r) => ({
        count_id: r.count_id,
        count_label: r.count_label,
        display_order: r.display_order,
        is_active: r.is_active,
        price_id: r.price_id,
        current_price_per_kg: r.current_price_per_kg !== null ? Number(r.current_price_per_kg) : null,
        publication_status: r.publication_status || 'published',
        published_at: r.published_at ? new Date(r.published_at).toISOString() : null,
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : null,
      }));
    } catch (err) {
      console.warn('Postgres getAdminPricesTable fallback:', err);
    }
  }

  const db = ensureDataFile();
  const counts = [...db.prawn_counts].sort((a, b) => a.display_order - b.display_order);

  return counts.map((count) => {
    const price = db.prawn_prices.find((p) => p.count_id === count.id);
    return {
      count_id: count.id,
      count_label: count.count_label,
      display_order: count.display_order,
      is_active: count.is_active,
      price_id: price ? price.id : null,
      current_price_per_kg: price ? price.current_price_per_kg : null,
      publication_status: price ? price.publication_status : 'published',
      published_at: price ? price.published_at : null,
      updated_at: price ? price.updated_at : null,
    };
  });
}

export interface PriceBulkUpdateItem {
  count_id: string;
  new_price_per_kg: number;
  publication_status?: 'draft' | 'published';
}

export async function updateBulkPrices(
  updates: PriceBulkUpdateItem[],
  adminId: string,
  publicationStatus: 'draft' | 'published' = 'published'
): Promise<{ updatedCount: number; changedCount: number }> {
  let changed = 0;

  if (pgPool) {
    try {
      for (const item of updates) {
        if (typeof item.new_price_per_kg !== 'number' || item.new_price_per_kg <= 0) continue;

        // Check current price to only update timestamp if changed
        const curRes = await pgPool.query(`SELECT current_price_per_kg, publication_status FROM public.prawn_prices WHERE count_id = $1`, [item.count_id]);

        if (curRes.rows.length > 0) {
          const cur = curRes.rows[0];
          const priceDiff = Number(cur.current_price_per_kg) !== item.new_price_per_kg;
          const statusDiff = cur.publication_status !== publicationStatus;

          if (priceDiff || statusDiff) {
            await pgPool.query(`
              UPDATE public.prawn_prices 
              SET current_price_per_kg = $1,
                  publication_status = $2,
                  published_at = timezone('utc'::text, now()),
                  updated_by = $3,
                  updated_at = timezone('utc'::text, now())
              WHERE count_id = $4;
            `, [item.new_price_per_kg, publicationStatus, adminId, item.count_id]);
            changed++;
          }
        } else {
          await pgPool.query(`
            INSERT INTO public.prawn_prices (count_id, current_price_per_kg, publication_status, published_at, updated_by)
            VALUES ($1, $2, $3, timezone('utc'::text, now()), $4);
          `, [item.count_id, item.new_price_per_kg, publicationStatus, adminId]);
          changed++;
        }
      }

      await pgPool.query(`
        INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id)
        VALUES ($1, $2, 'prawn_prices', $3);
      `, [adminId, publicationStatus === 'published' ? 'PUBLISH_BULK_PRICES' : 'SAVE_DRAFT_PRICES', `count-${updates.length}`]);

      return { updatedCount: updates.length, changedCount: changed };
    } catch (err) {
      console.warn('Postgres updateBulkPrices fallback:', err);
    }
  }

  const db = ensureDataFile();
  const now = getCurrentISTTimestamp();

  for (const item of updates) {
    if (typeof item.new_price_per_kg !== 'number' || item.new_price_per_kg <= 0) continue;

    const existingIndex = db.prawn_prices.findIndex((p) => p.count_id === item.count_id);
    if (existingIndex >= 0) {
      const existing = db.prawn_prices[existingIndex];
      const priceChanged = existing.current_price_per_kg !== item.new_price_per_kg;
      const statusChanged = existing.publication_status !== publicationStatus;

      if (priceChanged || statusChanged) {
        db.prawn_prices[existingIndex] = {
          ...existing,
          current_price_per_kg: item.new_price_per_kg,
          publication_status: publicationStatus,
          published_at: publicationStatus === 'published' ? now : existing.published_at,
          updated_by: adminId,
          updated_at: now,
        };
        changed++;
      }
    } else {
      db.prawn_prices.push({
        id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        count_id: item.count_id,
        current_price_per_kg: item.new_price_per_kg,
        publication_status: publicationStatus,
        published_at: now,
        updated_by: adminId,
        created_at: now,
        updated_at: now,
      });
      changed++;
    }
  }

  saveDb(db);
  return { updatedCount: updates.length, changedCount: changed };
}

export async function updateSinglePrice(
  countId: string,
  newPrice: number,
  publicationStatus: 'draft' | 'published',
  adminId: string
): Promise<PrawnPrice | null> {
  if (typeof newPrice !== 'number' || newPrice <= 0) {
    throw new Error('Price must be a positive number greater than 0');
  }

  if (pgPool) {
    try {
      const curRes = await pgPool.query(`SELECT current_price_per_kg, publication_status FROM public.prawn_prices WHERE count_id = $1`, [countId]);

      let res;
      if (curRes.rows.length > 0) {
        const cur = curRes.rows[0];
        const isChanged = Number(cur.current_price_per_kg) !== newPrice || cur.publication_status !== publicationStatus;

        res = await pgPool.query(`
          UPDATE public.prawn_prices 
          SET current_price_per_kg = $1,
              publication_status = $2,
              published_at = ${isChanged ? "timezone('utc'::text, now())" : "published_at"},
              updated_by = $3,
              updated_at = timezone('utc'::text, now())
          WHERE count_id = $4
          RETURNING *;
        `, [newPrice, publicationStatus, adminId, countId]);
      } else {
        res = await pgPool.query(`
          INSERT INTO public.prawn_prices (count_id, current_price_per_kg, publication_status, published_at, updated_by)
          VALUES ($1, $2, $3, timezone('utc'::text, now()), $4)
          RETURNING *;
        `, [countId, newPrice, publicationStatus, adminId]);
      }

      await pgPool.query(`
        INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id)
        VALUES ($1, $2, 'prawn_prices', $3);
      `, [adminId, publicationStatus === 'published' ? 'PUBLISH_SINGLE_PRICE' : 'SAVE_DRAFT_SINGLE', countId]);

      return res.rows[0];
    } catch (err) {
      console.warn('Postgres updateSinglePrice fallback:', err);
    }
  }

  const db = ensureDataFile();
  const now = getCurrentISTTimestamp();
  const existingIndex = db.prawn_prices.findIndex((p) => p.count_id === countId);

  if (existingIndex >= 0) {
    const existing = db.prawn_prices[existingIndex];
    db.prawn_prices[existingIndex] = {
      ...existing,
      current_price_per_kg: newPrice,
      publication_status: publicationStatus,
      published_at: publicationStatus === 'published' ? now : existing.published_at,
      updated_by: adminId,
      updated_at: now,
    };
    saveDb(db);
    return db.prawn_prices[existingIndex];
  } else {
    const newRecord: PrawnPrice = {
      id: `p-${Date.now()}`,
      count_id: countId,
      current_price_per_kg: newPrice,
      publication_status: publicationStatus,
      published_at: now,
      updated_by: adminId,
      created_at: now,
      updated_at: now,
    };
    db.prawn_prices.push(newRecord);
    saveDb(db);
    return newRecord;
  }
}

// ==========================================
// ADMIN: SETTINGS
// ==========================================

export async function getSettings(): Promise<PlatformSettings> {
  if (pgPool) {
    try {
      const res = await pgPool.query(`SELECT * FROM public.platform_settings ORDER BY updated_at DESC LIMIT 1;`);
      if (res.rows[0]) return res.rows[0];
    } catch (err) {
      console.warn('Postgres getSettings fallback:', err);
    }
  }

  const db = ensureDataFile();
  return db.platform_settings;
}

export async function updateSettings(
  updates: Partial<Omit<PlatformSettings, 'id' | 'updated_at'>>,
  adminId: string
): Promise<PlatformSettings> {
  if (pgPool) {
    try {
      const current = await getSettings();
      const merged = { ...current, ...updates };

      const res = await pgPool.query(`
        UPDATE public.platform_settings
        SET buyer_name = $1,
            buyer_phone = $2,
            whatsapp_number = $3,
            alternate_phone = $4,
            business_name = $5,
            contact_message = $6,
            updated_at = timezone('utc'::text, now())
        WHERE id = $7
        RETURNING *;
      `, [
        merged.buyer_name,
        merged.buyer_phone,
        merged.whatsapp_number,
        merged.alternate_phone || null,
        merged.business_name,
        merged.contact_message,
        current.id,
      ]);

      await pgPool.query(`
        INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id)
        VALUES ($1, 'UPDATE_SETTINGS', 'platform_settings', $2);
      `, [adminId, current.id]);

      return res.rows[0];
    } catch (err) {
      console.warn('Postgres updateSettings fallback:', err);
    }
  }

  const db = ensureDataFile();
  db.platform_settings = {
    ...db.platform_settings,
    ...updates,
    updated_at: getCurrentISTTimestamp(),
  };
  saveDb(db);
  return db.platform_settings;
}

// ==========================================
// ADMIN: ANNOUNCEMENTS
// ==========================================

export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (pgPool) {
    try {
      const res = await pgPool.query(`SELECT * FROM public.announcements ORDER BY created_at DESC;`);
      return res.rows;
    } catch (err) {
      console.warn('Postgres getAllAnnouncements fallback:', err);
    }
  }

  const db = ensureDataFile();
  return [...db.announcements].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createAnnouncement(
  title: string,
  description: string,
  is_published: boolean,
  adminId: string
): Promise<Announcement> {
  if (pgPool) {
    try {
      const res = await pgPool.query(`
        INSERT INTO public.announcements (title, description, is_published)
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [title.trim(), description.trim(), is_published]);

      await pgPool.query(`
        INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id)
        VALUES ($1, 'CREATE_ANNOUNCEMENT', 'announcements', $2);
      `, [adminId, res.rows[0].id]);

      return res.rows[0];
    } catch (err) {
      console.warn('Postgres createAnnouncement fallback:', err);
    }
  }

  const db = ensureDataFile();
  const now = getCurrentISTTimestamp();
  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    title: title.trim(),
    description: description.trim(),
    is_published,
    created_at: now,
    updated_at: now,
  };

  db.announcements.unshift(newAnn);
  saveDb(db);
  return newAnn;
}

export async function updateAnnouncement(
  id: string,
  updates: Partial<Pick<Announcement, 'title' | 'description' | 'is_published'>>,
  adminId: string
): Promise<Announcement | null> {
  if (pgPool) {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let i = 1;

      if (updates.title !== undefined) {
        fields.push(`title = $${i++}`);
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push(`description = $${i++}`);
        values.push(updates.description);
      }
      if (updates.is_published !== undefined) {
        fields.push(`is_published = $${i++}`);
        values.push(updates.is_published);
      }
      fields.push(`updated_at = timezone('utc'::text, now())`);
      values.push(id);

      const res = await pgPool.query(`
        UPDATE public.announcements
        SET ${fields.join(', ')}
        WHERE id = $${i}
        RETURNING *;
      `, values);

      return res.rows[0] || null;
    } catch (err) {
      console.warn('Postgres updateAnnouncement fallback:', err);
    }
  }

  const db = ensureDataFile();
  const index = db.announcements.findIndex((a) => a.id === id);
  if (index === -1) return null;

  db.announcements[index] = {
    ...db.announcements[index],
    ...updates,
    updated_at: getCurrentISTTimestamp(),
  };

  saveDb(db);
  return db.announcements[index];
}

export async function deleteAnnouncement(id: string, adminId: string): Promise<boolean> {
  if (pgPool) {
    try {
      await pgPool.query(`DELETE FROM public.announcements WHERE id = $1;`, [id]);
      await pgPool.query(`
        INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id)
        VALUES ($1, 'DELETE_ANNOUNCEMENT', 'announcements', $2);
      `, [adminId, id]);
      return true;
    } catch (err) {
      console.warn('Postgres deleteAnnouncement fallback:', err);
    }
  }

  const db = ensureDataFile();
  const index = db.announcements.findIndex((a) => a.id === id);
  if (index === -1) return false;

  db.announcements.splice(index, 1);
  saveDb(db);
  return true;
}

// ==========================================
// ADMIN: AUTH
// ==========================================

export async function findAdminByEmail(email: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query(`
        SELECT * FROM public.admin_users 
        WHERE LOWER(email) = LOWER($1) AND is_active = true 
        LIMIT 1;
      `, [email.trim()]);
      if (res.rows[0]) return res.rows[0];
    } catch (err) {
      console.warn('Postgres findAdminByEmail fallback:', err);
    }
  }

  const db = ensureDataFile();
  const user = db.admin_users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.is_active
  );
  return user || null;
}

export async function changeAdminPassword(adminId: string, newPasswordPlain: string): Promise<boolean> {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPasswordPlain, salt);

  if (pgPool) {
    try {
      await pgPool.query(`
        UPDATE public.admin_users 
        SET password_hash = $1 
        WHERE id = $2;
      `, [hash, adminId]);

      await pgPool.query(`
        INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id)
        VALUES ($1, 'CHANGE_PASSWORD', 'admin_users', $1);
      `, [adminId]);

      return true;
    } catch (err) {
      console.warn('Postgres changeAdminPassword fallback:', err);
    }
  }

  const db = ensureDataFile();
  const user = db.admin_users.find((u) => u.id === adminId);
  if (!user) return false;

  user.password_hash = hash;
  saveDb(db);
  return true;
}

export async function getAdminActivityLogs(limit = 20): Promise<AdminActivityLog[]> {
  if (pgPool) {
    try {
      const res = await pgPool.query(`
        SELECT * FROM public.admin_activity_logs 
        ORDER BY created_at DESC 
        LIMIT $1;
      `, [limit]);
      return res.rows;
    } catch (err) {
      console.warn('Postgres getAdminActivityLogs fallback:', err);
    }
  }

  const db = ensureDataFile();
  return db.admin_activity_logs.slice(0, limit);
}
