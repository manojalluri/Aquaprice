export type AdminRole = 'buyer' | 'super_admin';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  name?: string;
  created_at: string;
}

export interface PrawnCount {
  id: string;
  count_label: string; // e.g. "30 Count", "40 Count"
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrawnPrice {
  id: string;
  count_id: string;
  current_price_per_kg: number;
  publication_status: 'draft' | 'published';
  published_at: string; // ISO Timestamp
  updated_by: string; // Admin User ID or Name
  created_at: string;
  updated_at: string;
}

export interface PrawnPriceDisplay {
  count_id: string;
  count_label: string;
  display_order: number;
  current_price_per_kg: number;
  publication_status: 'draft' | 'published';
  published_at: string;
  is_active: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformSettings {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  whatsapp_number: string;
  alternate_phone?: string;
  business_name: string;
  contact_message: string;
  updated_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

export interface PublicMarketDataResponse {
  prices: PrawnPriceDisplay[];
  announcements: Announcement[];
  settings: PlatformSettings;
  lastUpdatedOverall: string | null;
  totalActiveCounts: number;
}

