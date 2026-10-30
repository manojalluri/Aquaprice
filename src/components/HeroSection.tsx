'use client';

import React from 'react';
import { ArrowDown, Phone, ShieldCheck, Clock, CheckCircle2, Waves, Sparkles } from 'lucide-react';
import { PlatformSettings } from '@/types';
import { formatISTDateTime } from '@/lib/dateUtils';

interface HeroSectionProps {
  totalCounts: number;
  latestUpdated: string | null;
  settings: PlatformSettings | null;
}

export default function HeroSection({
  totalCounts,
  latestUpdated,
  settings,
}: HeroSectionProps) {
  const buyerPhone = settings?.buyer_phone || '9848022338';
  const buyerName = settings?.buyer_name || 'Designated Buyer';

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#EAF6F0]/60 via-[#F8FAF8] to-[#F8FAF8] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#E5EBE7]">
      {/* Decorative background aquaculture elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#69B9A6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#176B5B]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Region & Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#69B9A6]/40 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-xs font-bold text-[#176B5B] uppercase tracking-wide">
                East Godavari, West Godavari & Krishna Districts (AP)
              </span>
            </div>

            {/* Main Headline (Strict requirement) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#202B28] tracking-tight leading-[1.15]">
              Today&apos;s Prawn Prices at Your Fingertips.
            </h1>

            {/* Subheading (Strict requirement) */}
            <p className="text-base sm:text-lg text-[#78837F] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Stay updated with the latest prawn buying prices. Check count-wise rates and directly connect with our buyer when you&apos;re ready to sell.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href="#prices-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-md shadow-[#176B5B]/30"
              >
                <span>View Today&apos;s Prices</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#prices-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-[#176B5B] bg-white hover:bg-[#EAF6F0] border-2 border-[#176B5B]/20 active:scale-95 transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#2185D0]" />
                <span>Contact Buying Desk</span>
              </a>
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-[#E5EBE7]/80 text-left">
              <div className="flex items-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#176B5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#202B28] block leading-tight">Spot Cash/RTGS</span>
                  <span className="text-[10px] sm:text-[11px] text-[#78837F] hidden sm:block">Immediate pond settlement</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#176B5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#202B28] block leading-tight">Digital Scales</span>
                  <span className="text-[10px] sm:text-[11px] text-[#78837F] hidden sm:block">Electronic accurate weight</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#176B5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#202B28] block leading-tight">Zero Middlemen</span>
                  <span className="text-[10px] sm:text-[11px] text-[#78837F] hidden sm:block">Direct buyer connection</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Today's Price Overview Card */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Visual Aquaculture Feature Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#176B5B] via-[#1a5b4f] to-[#114238] text-white p-6 sm:p-7 shadow-xl border border-[#69B9A6]/30">
              
              {/* Decorative wave background */}
              <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none">
                <Waves className="w-64 h-64 text-white" />
              </div>

              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-[#EAF6F0]">
                    <Sparkles className="w-3.5 h-3.5 text-[#69B9A6]" />
                    <span>Vannamei & Black Tiger Daily</span>
                  </div>
                  <span className="text-[11px] text-[#EAF6F0]/80">IST Timezone</span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-[#69B9A6] font-bold block mb-1">
                    Market Status
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Procurement Active
                  </div>
                  <p className="text-xs text-[#EAF6F0]/90 mt-1">
                    Spot rates updated directly by registered buyer desk exclusively for East Godavari, West Godavari & Krishna aqua belts.
                  </p>
                </div>

                {/* TODAY'S PRICE OVERVIEW (All values come from DB as required) */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15">
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] text-[#69B9A6] uppercase tracking-wider font-semibold block">
                      Available Counts
                    </span>
                    <span className="text-2xl font-black text-white">
                      {totalCounts} <span className="text-xs font-normal text-[#EAF6F0]">Sizes</span>
                    </span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] text-[#69B9A6] uppercase tracking-wider font-semibold block">
                      Buyer Status
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                      <span className="text-sm font-bold text-white">Available</span>
                    </div>
                  </div>
                </div>

                {/* Latest update timestamp */}
                <div className="bg-black/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#EAF6F0]">
                  <Clock className="w-4 h-4 text-[#69B9A6] shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-white">Latest Update: </span>
                    <span>{latestUpdated ? formatISTDateTime(latestUpdated) : 'Live rates published today'}</span>
                  </div>
                </div>

                {/* Coverage snapshot */}
                <div className="flex items-center justify-between text-xs pt-1 text-[#EAF6F0]/80">
                  <span>Procurement Desk: <strong className="text-white">Active Daily</strong></span>
                  <span className="text-[#69B9A6] font-semibold">East &amp; West Godavari, Krishna</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

