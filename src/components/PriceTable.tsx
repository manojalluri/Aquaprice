'use client';

import React, { useState } from 'react';
import { PrawnPriceDisplay, PlatformSettings } from '@/types';
import { formatISTSplit } from '@/lib/dateUtils';
import SellModal from './SellModal';
import { RefreshCw, Search, CheckCircle2, ArrowRight } from 'lucide-react';

interface PriceTableProps {
  prices: PrawnPriceDisplay[];
  settings: PlatformSettings | null;
  lastUpdatedOverall?: string | null;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

export default function PriceTable({
  prices,
  settings,
  lastUpdatedOverall,
  onRefresh,
  isRefreshing = false,
}: PriceTableProps) {
  const [selectedForSale, setSelectedForSale] = useState<PrawnPriceDisplay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const handleOpenSell = (item: PrawnPriceDisplay) => {
    setSelectedForSale(item);
    setModalOpen(true);
  };

  const filteredPrices = prices.filter((p) =>
    p.count_label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div id="prices-section" className="w-full scroll-mt-24">
      {/* Header bar of the pricing module */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#176B5B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#176B5B]"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-[#176B5B] bg-[#EAF6F0] px-2.5 py-0.5 rounded-full border border-[#69B9A6]/30">
                Live Published Rates
              </span>
              <span className="text-xs text-[#78837F] hidden sm:inline">
                • East Godavari, West Godavari & Krishna (AP)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B28] tracking-tight">
              Today&apos;s Prawn Buying Rates
            </h2>
            <p className="text-sm text-[#78837F] mt-1">
              Select your count and click <strong className="text-[#176B5B]">SELL</strong> to contact the buyer directly via WhatsApp or Call.
            </p>
          </div>

          {/* Quick controls: Count filter & Refresh button */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 text-[#78837F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter count..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B] text-[#202B28]"
              />
            </div>

            {onRefresh && (
              <button
                onClick={() => onRefresh()}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#176B5B] bg-[#EAF6F0] hover:bg-[#d8efe4] border border-[#69B9A6]/30 rounded-xl transition-all disabled:opacity-60"
                title="Refresh latest prices from server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP & TABLET VIEW: EXACT FOUR COLUMNS AS REQUIRED
          | COUNT | PRICE / KG | LAST UPDATED | SELL |
          ========================================================================= */}
      <div className="hidden sm:block overflow-hidden bg-white rounded-2xl border border-[#E5EBE7] shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#176B5B] text-white text-xs uppercase tracking-wider font-bold">
              <th scope="col" className="py-4 px-6">COUNT</th>
              <th scope="col" className="py-4 px-6">PRICE / KG</th>
              <th scope="col" className="py-4 px-6">LAST UPDATED</th>
              <th scope="col" className="py-4 px-6 text-right">SELL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EBE7]">
            {filteredPrices.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-[#78837F]">
                  No prawn counts found matching &ldquo;{filterQuery}&rdquo;.
                </td>
              </tr>
            ) : (
              filteredPrices.map((item, index) => {
                const { dateStr, timeStr } = formatISTSplit(item.published_at);
                const isEven = index % 2 === 0;

                return (
                  <tr
                    key={item.count_id}
                    className={`transition-colors hover:bg-[#EAF6F0]/40 ${
                      isEven ? 'bg-white' : 'bg-[#F8FAF8]/60'
                    }`}
                  >
                    {/* COLUMN 1: COUNT */}
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                        <span className="text-base sm:text-lg font-bold text-[#202B28]">
                          {item.count_label}
                        </span>
                      </div>
                    </td>

                    {/* COLUMN 2: PRICE / KG */}
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="inline-flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-black text-[#176B5B] tracking-tight">
                          ₹{item.current_price_per_kg.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-semibold text-[#78837F]">/ kg</span>
                      </div>
                    </td>

                    {/* COLUMN 3: LAST UPDATED (IST Date & Time) */}
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-[#202B28] font-medium">
                        {dateStr}
                      </div>
                      <div className="text-[11px] text-[#78837F]">
                        {timeStr} IST
                      </div>
                    </td>

                    {/* COLUMN 4: SELL BUTTON */}
                    <td className="py-5 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleOpenSell(item)}
                        className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-sm shadow-[#176B5B]/30 group cursor-pointer"
                        aria-label={`Sell ${item.count_label} at ₹${item.current_price_per_kg} per kg`}
                      >
                        <span>SELL</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Bottom table info bar */}
        <div className="px-6 py-3.5 bg-[#F8FAF8] border-t border-[#E5EBE7] flex flex-wrap items-center justify-between text-xs text-[#78837F] gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#176B5B]" />
            <span>Net weight spot cash / RTGS payment at pond site</span>
          </div>
          <div>
            Showing {filteredPrices.length} active count rates
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: PREMIUM INDIVIDUAL PRICE CARDS (PRESERVING EXACT 4 FIELDS)
          1. Count
          2. Price per KG
          3. Last Updated
          4. Sell button
          ========================================================================= */}
      <div className="sm:hidden space-y-3.5">
        {filteredPrices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5EBE7] p-8 text-center text-sm text-[#78837F]">
            No prawn counts found matching &ldquo;{filterQuery}&rdquo;.
          </div>
        ) : (
          filteredPrices.map((item) => {
            const { dateStr, timeStr } = formatISTSplit(item.published_at);

            return (
              <div
                key={item.count_id}
                className="bg-white rounded-2xl border border-[#E5EBE7] p-4 shadow-xs relative overflow-hidden"
              >
                {/* Left accent accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#176B5B]" />

                <div className="flex items-center justify-between pl-1 mb-3">
                  {/* FIELD 1: COUNT */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-[#202B28]">
                      {item.count_label}
                    </span>
                  </div>

                  {/* FIELD 2: PRICE / KG */}
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#176B5B]">
                      ₹{item.current_price_per_kg}
                    </span>
                    <span className="text-xs text-[#78837F] font-semibold"> / kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pl-1 pt-3 border-t border-[#E5EBE7]">
                  {/* FIELD 3: LAST UPDATED */}
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-[#78837F] block">
                      Last Updated
                    </span>
                    <span className="text-xs font-semibold text-[#202B28]">
                      {dateStr}
                    </span>
                    <span className="text-[11px] text-[#78837F] block">
                      {timeStr} IST
                    </span>
                  </div>

                  {/* FIELD 4: SELL BUTTON */}
                  <button
                    onClick={() => handleOpenSell(item)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-md shadow-[#176B5B]/20"
                    aria-label={`Sell ${item.count_label} at ₹${item.current_price_per_kg}`}
                  >
                    <span>SELL</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SELL MODAL POPUP */}
      <SellModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPrice={selectedForSale}
        settings={settings}
      />
    </div>
  );
}

