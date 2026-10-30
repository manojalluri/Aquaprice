'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMarketPrices } from '@/hooks/useMarketPrices';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Mail, Building, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useMarketPrices();

  const buyerPhone = settings?.buyer_phone || '9848022338';
  const whatsappNumber = settings?.whatsapp_number || '9848022338';
  const alternatePhone = settings?.alternate_phone || '9440188992';
  const buyerName = settings?.buyer_name || 'M. Srinivasa Rao';
  const businessName = settings?.business_name || 'Sri Venkateswara Aqua Feeds & Prawn Procurement';
  const contactMessage = settings?.contact_message || 'Direct pond-gate harvesting, immediate electronic weighing & spot bank settlement across AP & Telangana.';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
      <Header settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] bg-[#EAF6F0] px-3 py-1 rounded-full border border-[#69B9A6]/30">
            Buyer Procurement Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#202B28] tracking-tight">
            Contact Our Prawn Buyer
          </h1>
          <p className="text-sm text-[#78837F]">
            Reach out directly for daily price clarifications, pond spot inspections, sample count checks, or booking harvesting dates.
          </p>
        </div>

        {/* Primary Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: WhatsApp Direct */}
          <div className="bg-white rounded-3xl border border-[#E5EBE7] p-8 shadow-xs hover:border-[#25D366] transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-8 h-8 fill-[#25D366]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#202B28]">WhatsApp Buyer Desk</h3>
                <p className="text-xs text-[#78837F] mt-1">
                  Fastest way to get today&apos;s rates, share pond videos, count samples, and schedule harvesting.
                </p>
              </div>
              <div className="p-3.5 bg-[#F8FAF8] rounded-xl border border-[#E5EBE7] text-xs font-semibold text-[#202B28]">
                WhatsApp: +91 {whatsappNumber}
              </div>
            </div>

            <a
              href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(
                "Hello, I am contacting you from the Prawn Daily Market Price website. I would like to discuss selling my prawns."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>

          {/* Card 2: Phone Call Direct */}
          <div className="bg-white rounded-3xl border border-[#E5EBE7] p-8 shadow-xs hover:border-[#2185D0] transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#2185D0]/15 flex items-center justify-center text-[#2185D0]">
                <Phone className="w-8 h-8 fill-[#2185D0]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#202B28]">Direct Phone Call</h3>
                <p className="text-xs text-[#78837F] mt-1">
                  Speak directly with the procurement supervisor regarding rates, timing, and transport arrangements.
                </p>
              </div>
              <div className="p-3.5 bg-[#F8FAF8] rounded-xl border border-[#E5EBE7] text-xs font-semibold text-[#202B28]">
                Primary: +91 {buyerPhone} {alternatePhone && `• Alt: +91 ${alternatePhone}`}
              </div>
            </div>

            <a
              href={`tel:+91${buyerPhone}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#2185D0] hover:bg-[#1b73b5] active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-[#2185D0]/20"
            >
              <Phone className="w-5 h-5 fill-white" />
              <span>Call +91 {buyerPhone}</span>
            </a>
          </div>

        </div>

        {/* Business Office Details */}
        <div className="bg-white rounded-3xl border border-[#E5EBE7] p-8 sm:p-10 max-w-4xl mx-auto shadow-xs space-y-6">
          <div className="border-b border-[#E5EBE7] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#202B28]">Registered Procurement Office</h3>
              <p className="text-xs text-[#78837F]">{businessName}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#176B5B] bg-[#EAF6F0] px-3 py-1 rounded-full border border-[#69B9A6]/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#176B5B]" />
              Verified Buyer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#202B28]">
            <div className="space-y-1.5">
              <span className="font-bold text-[#176B5B] block flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                Procurement Desk
              </span>
              <p className="font-semibold text-sm">{buyerName}</p>
              <p className="text-[#78837F]">Senior Procurement Manager</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#176B5B] block flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Harvesting Hours
              </span>
              <p className="font-semibold">6:00 AM – 9:00 PM (Daily)</p>
              <p className="text-[#78837F]">Early morning & night netting schedules</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#176B5B] block flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Operating Hubs
              </span>
              <p className="font-semibold">Bhimavaram, Amalapuram &amp; Machilipatnam</p>
              <p className="text-[#78837F]">Field teams across East &amp; West Godavari and Krishna</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EAF6F0]/60 border border-[#69B9A6]/30 text-xs text-[#176B5B]">
            <strong>Buyer Note: </strong>
            <span>&ldquo;{contactMessage}&rdquo;</span>
          </div>
        </div>

      </main>

      <Footer settings={settings} />
    </div>
  );
}

