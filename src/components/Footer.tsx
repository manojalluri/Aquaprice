'use client';

import React from 'react';
import { PlatformSettings } from '@/types';
import { MessageCircle, Phone, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  settings?: PlatformSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const buyerPhone = settings?.buyer_phone || '9848022338';
  const whatsappNumber = settings?.whatsapp_number || '9848022338';
  const buyerName = settings?.buyer_name || 'M. Srinivasa Rao';
  const businessName = settings?.business_name || 'Sri Venkateswara Seafoods & Prawn Procurement';

  return (
    <footer className="mt-auto bg-[#FFFFFF] border-t border-[#E5EBE7] text-[#78837F]">
      {/* Upper Footer: Buyer Connectivity Banner */}
      <div className="bg-[#F8FAF8] border-b border-[#E5EBE7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#E5EBE7] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#176B5B]">
                Direct Pond Procurement Desk
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#202B28]">
                Ready to Harvest Your Prawn Pond?
              </h3>
              <p className="text-sm text-[#78837F] max-w-xl">
                Get confirmed count pricing, digital weight verification, and same-day electronic bank transfer or cash settlement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(
                  "Hello, I am interested in selling my prawn harvest. Please let me know your current rates and harvesting schedule."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all shadow-sm shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Desk</span>
              </a>

              <a
                href={`tel:+91${buyerPhone}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#2185D0] hover:bg-[#1b73b5] transition-all shadow-sm shadow-[#2185D0]/20"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Call +91 {buyerPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Regional Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#176B5B] flex items-center justify-center text-white font-bold text-lg">
                AQ
              </div>
              <span className="text-xl font-bold text-[#176B5B]">
                AquaPrice<span className="text-[#69B9A6] font-normal">AP</span>
              </span>
            </div>
            <p className="text-xs text-[#78837F] leading-relaxed">
              Dedicated daily prawn market price platform designed exclusively for aquaculture farmers across East Godavari, West Godavari, and Krishna districts in Andhra Pradesh.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#176B5B] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#176B5B]" />
              <span>Transparent Daily Spot Rates</span>
            </div>
          </div>

          {/* Col 2: Procurement Regions */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#202B28]">
              Exclusive Procurement Hubs
            </h4>
            <ul className="text-xs space-y-2 text-[#78837F]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#176B5B]" />
                <span>West Godavari (Bhimavaram, Akividu, Palakollu, Narasapuram)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#176B5B]" />
                <span>East Godavari (Amalapuram, Kakinada, Mummidivaram, Razole)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#176B5B]" />
                <span>Krishna District (Machilipatnam, Gudivada, Kaikaluru, Avanigadda)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#176B5B]" />
                <span>Direct Pond-Side Netting & Weighing</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#202B28]">
              Platform Navigation
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <a href="/" className="hover:text-[#176B5B] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#prices-section" className="hover:text-[#176B5B] transition-colors">
                  Today&apos;s Prawn Prices
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#176B5B] transition-colors">
                  About Our Buying Desk
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#176B5B] transition-colors">
                  Contact Buyer
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Buyer Office & Discreet Admin Link */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#202B28]">
              Buyer Contact Details
            </h4>
            <p className="text-xs font-semibold text-[#202B28]">{buyerName}</p>
            <p className="text-xs text-[#78837F]">{businessName}</p>
            <p className="text-xs text-[#78837F]">
              Phone: +91 {buyerPhone}
              {settings?.alternate_phone && ` / +91 ${settings.alternate_phone}`}
            </p>
            <div className="pt-2">
              <a
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#78837F] hover:text-[#176B5B] border border-[#E5EBE7] px-3 py-1.5 rounded-lg bg-[#F8FAF8] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#176B5B]" />
                <span>Buyer Admin Login</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#E5EBE7] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78837F] gap-3">
          <p>
            &copy; 2026 AquaPrice India. All rights reserved. Daily prawn rates published for farmer information.
          </p>
          <p className="text-right">
            Rates subject to pond health, count uniformity, and shell firmness at spot inspection.
          </p>
        </div>
      </div>
    </footer>
  );
}

