'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import PriceTable from '@/components/PriceTable';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useMarketPrices } from '@/hooks/useMarketPrices';
import { Scale, Banknote, Clock, Award, ShieldCheck, MapPin } from 'lucide-react';

export default function HomePage() {
  const {
    prices,
    announcements,
    settings,
    lastUpdatedOverall,
    totalActiveCounts,
    isLoading,
    isRefreshing,
    refresh,
  } = useMarketPrices();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
      {/* Top Announcement Bar */}
      <AnnouncementBar announcements={announcements} />

      {/* Navigation Header */}
      <Header settings={settings} />

      {/* Hero Section */}
      <HeroSection
        totalCounts={totalActiveCounts}
        latestUpdated={lastUpdatedOverall}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-8 sm:space-y-14">
        
        {/* Live Prawn Price Table Section */}
        <section>
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#E5EBE7] p-12 text-center shadow-xs">
              <div className="inline-block w-8 h-8 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-[#202B28]">Loading today&apos;s published prawn rates...</p>
              <p className="text-xs text-[#78837F] mt-1">Connecting to live market price server</p>
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
        </section>

        {/* 3-Step Simple Process for Farmers */}
        <section className="bg-white rounded-3xl border border-[#E5EBE7] p-8 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-wider font-bold text-[#176B5B] bg-[#EAF6F0] px-3 py-1 rounded-full border border-[#69B9A6]/30">
              Simple & Direct Selling Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B28] mt-3">
              How Selling Your Prawns Works
            </h2>
            <p className="text-sm text-[#78837F] mt-2">
              No registration required. Check today&apos;s listed rate, talk directly with our designated buyer, and arrange your harvest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#F8FAF8] border border-[#E5EBE7] hover:border-[#69B9A6] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#176B5B] text-white flex items-center justify-center font-black text-xl mb-4 shadow-sm shadow-[#176B5B]/30">
                1
              </div>
              <h3 className="text-lg font-bold text-[#202B28] mb-2">Check Count Rate</h3>
              <p className="text-xs text-[#78837F] leading-relaxed">
                Review the exact rate for your pond&apos;s prawn count (e.g. 30, 40, 50, 60 Count) updated daily on our table.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#F8FAF8] border border-[#E5EBE7] hover:border-[#69B9A6] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-black text-xl mb-4 shadow-sm shadow-[#25D366]/30">
                2
              </div>
              <h3 className="text-lg font-bold text-[#202B28] mb-2">Click SELL Button</h3>
              <p className="text-xs text-[#78837F] leading-relaxed">
                Choose WhatsApp or Call. A pre-filled message mentioning your count opens instantly with the buyer&apos;s number.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#F8FAF8] border border-[#E5EBE7] hover:border-[#69B9A6] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#2185D0] text-white flex items-center justify-center font-black text-xl mb-4 shadow-sm shadow-[#2185D0]/30">
                3
              </div>
              <h3 className="text-lg font-bold text-[#202B28] mb-2">Harvest & Settlement</h3>
              <p className="text-xs text-[#78837F] leading-relaxed">
                Our harvest team arrives with digital scales. Electronic weigh-bridge slip generated and payment transferred on spot.
              </p>
            </div>
          </div>
        </section>

        {/* Buyer Commitment & Trust Features */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-[#E5EBE7] shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#EAF6F0] text-[#176B5B] shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#202B28]">Digital Weighing</h4>
              <p className="text-xs text-[#78837F] mt-1">Calibrated electronic scales ensure 100% accurate count and weight.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EBE7] shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#EAF6F0] text-[#176B5B] shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#202B28]">Spot Payment</h4>
              <p className="text-xs text-[#78837F] mt-1">Immediate RTGS, NEFT, or cash settlement right at the pond gate.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EBE7] shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#EAF6F0] text-[#176B5B] shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#202B28]">Prompt Harvesting</h4>
              <p className="text-xs text-[#78837F] mt-1">Experienced netting labor and insulated ice containers on schedule.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EBE7] shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#EAF6F0] text-[#176B5B] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#202B28]">Direct Procurement</h4>
              <p className="text-xs text-[#78837F] mt-1">Direct connect with the primary buyer with zero broker commissions.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
