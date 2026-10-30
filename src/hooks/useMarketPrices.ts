'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicMarketDataResponse } from '@/types';
import { supabasePublic } from '@/lib/supabase';

export function useMarketPrices(initialData?: PublicMarketDataResponse | null) {
  const [data, setData] = useState<PublicMarketDataResponse | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/market', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch market data');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error fetching market prices:', err);
      setError(err.message || 'Error updating market data');
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch if initialData was not provided
    if (!initialData) {
      fetchData();
    }

    // Polling fallback every 15 seconds to ensure live updates without user refresh
    const interval = setInterval(() => {
      fetchData(false);
    }, 15000);

    // Supabase Realtime listener if Supabase is active
    let channel: any = null;
    if (supabasePublic) {
      try {
        channel = supabasePublic
          .channel('public:prawn_prices')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'prawn_prices' },
            () => {
              fetchData(false);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'prawn_counts' },
            () => {
              fetchData(false);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'announcements' },
            () => {
              fetchData(false);
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('Realtime channel subscription failed:', e);
      }
    }

    return () => {
      clearInterval(interval);
      if (channel && supabasePublic) {
        supabasePublic.removeChannel(channel);
      }
    };
  }, [fetchData, initialData]);

  return {
    data,
    prices: data?.prices || [],
    announcements: data?.announcements || [],
    settings: data?.settings || null,
    lastUpdatedOverall: data?.lastUpdatedOverall || null,
    totalActiveCounts: data?.totalActiveCounts || 0,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchData(true),
  };
}

