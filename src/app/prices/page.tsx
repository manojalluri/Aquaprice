'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTable from '@/components/PriceTable';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useMarketPrices } from '@/hooks/useMarketPrices';

export default function PricesPage() {
  const {
    prices,
    announcements,
    settings,
    lastUpdatedOverall,
    isLoading,
    isRefreshing,
    refresh,
  } = useMarketPrices();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
      <AnnouncementBar announcements={announcements} />
      <Header settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] bg-[#EAF6F0] px-3 py-1 rounded-full border border-[#69B9A6]/30">
            Official Daily Rate Card
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#202B28] tracking-tight">
            Today&apos;s Prawn Market Prices
          </h1>
          <p className="text-sm text-[#78837F]">
            Published spot buying rates for Vannamei counts in East Godavari, West Godavari &amp; Krishna (AP). Click SELL on any row to connect with our buyer.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5EBE7] p-12 text-center shadow-xs">
            <div className="inline-block w-8 h-8 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-[#202B28]">Loading current rates...</p>
          </div>
        ) : (
          <PriceTable
            prices={prices}
            settings={settings}
            lastUpdatedOverall={lastUpdatedOverall}
            onRefresh={refresh}
            isRefreshing={isRefreshing}
          />
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}

