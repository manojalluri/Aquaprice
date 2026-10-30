'use client';

import React from 'react';
import {
  Layers,
  Banknote,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Megaphone,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { formatISTDateTime } from '@/lib/dateUtils';
import { AdminTab } from './AdminSidebar';

interface OverviewTabProps {
  stats: {
    totalCounts: number;
    activeCounts: number;
    publishedPrices: number;
    lastUpdated: string | null;
  };
  setActiveTab: (tab: AdminTab) => void;
  buyerName?: string;
  businessName?: string;
}

export default function OverviewTab({
  stats,
  setActiveTab,
  buyerName,
  businessName,
}: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#176B5B] to-[#125346] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#69B9A6]">
              Buyer Control Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {buyerName || 'Prawn Buyer'}
            </h1>
            <p className="text-xs sm:text-sm text-[#EAF6F0]">
              {businessName || 'Seafood & Prawn Procurement'} • East Godavari, West Godavari &amp; Krishna (AP)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('prices')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#69B9A6] text-[#202B28] hover:bg-[#58a895] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Banknote className="w-4 h-4" />
              <span>Update Today&apos;s Rates</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Premium Stat Cards (Exact requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* STAT 1: Total Active Counts */}
        <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78837F] uppercase tracking-wider">
              Active Counts
            </span>
            <div className="p-2 rounded-xl bg-[#EAF6F0] text-[#176B5B]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#202B28]">
              {stats.activeCounts}
            </div>
            <p className="text-xs text-[#78837F] mt-1">
              Out of {stats.totalCounts} configured prawn sizes
            </p>
          </div>
          <button
            onClick={() => setActiveTab('counts')}
            className="text-xs font-bold text-[#176B5B] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>Manage Counts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* STAT 2: Total Published Prices */}
        <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78837F] uppercase tracking-wider">
              Published Prices
            </span>
            <div className="p-2 rounded-xl bg-[#EAF6F0] text-[#176B5B]">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#176B5B]">
              {stats.publishedPrices}
            </div>
            <p className="text-xs text-[#78837F] mt-1">
              Active live rates on public table
            </p>
          </div>
          <button
            onClick={() => setActiveTab('prices')}
            className="text-xs font-bold text-[#176B5B] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>Edit Daily Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* STAT 3: Last Updated Date & Time */}
        <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78837F] uppercase tracking-wider">
              Last Published
            </span>
            <div className="p-2 rounded-xl bg-[#EAF6F0] text-[#176B5B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-[#202B28] leading-snug">
              {stats.lastUpdated ? formatISTDateTime(stats.lastUpdated, true) : 'No recent updates'}
            </div>
            <p className="text-[11px] text-[#78837F] mt-1">
              Asia/Kolkata (IST) Server Timestamp
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#176B5B] font-medium pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#176B5B]" />
            <span>Server Verified</span>
          </div>
        </div>

        {/* STAT 4: Website Publication Status */}
        <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78837F] uppercase tracking-wider">
              Website Status
            </span>
            <div className="p-2 rounded-xl bg-[#EAF6F0] text-[#25D366]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-2xl font-black text-[#202B28]">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-[#78837F] mt-1">
              Farmers can view & contact buyer
            </p>
          </div>
          <span className="text-xs font-bold text-[#25D366] block pt-1">
            WhatsApp & Call Active
          </span>
        </div>

      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Action 1 */}
        <div
          onClick={() => setActiveTab('prices')}
          className="bg-white rounded-2xl border border-[#E5EBE7] p-6 shadow-xs hover:border-[#176B5B] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EAF6F0] text-[#176B5B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202B28] mb-1">
            Update Today&apos;s Rates
          </h3>
          <p className="text-xs text-[#78837F] mb-4">
            Change prices for all counts or edit specific rates with one-click bulk publish.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#176B5B]">
            <span>Open Price Editor</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Action 2 */}
        <div
          onClick={() => setActiveTab('counts')}
          className="bg-white rounded-2xl border border-[#E5EBE7] p-6 shadow-xs hover:border-[#176B5B] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EAF6F0] text-[#176B5B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202B28] mb-1">
            Manage Prawn Counts
          </h3>
          <p className="text-xs text-[#78837F] mb-4">
            Add new sizes (e.g. 25 Count), reorder table rows, or activate/deactivate counts.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#176B5B]">
            <span>Open Counts Manager</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Action 3 */}
        <div
          onClick={() => setActiveTab('settings')}
          className="bg-white rounded-2xl border border-[#E5EBE7] p-6 shadow-xs hover:border-[#176B5B] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EAF6F0] text-[#176B5B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202B28] mb-1">
            Contact & Phone Settings
          </h3>
          <p className="text-xs text-[#78837F] mb-4">
            Configure primary buyer mobile, WhatsApp phone, business name & operating message.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#176B5B]">
            <span>Configure Contact Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

      </div>
    </div>
  );
}

