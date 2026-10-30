'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMarketPrices } from '@/hooks/useMarketPrices';
import { ShieldCheck, Award, MapPin, Users, CheckCircle, Scale, Phone, MessageCircle } from 'lucide-react';

export default function AboutPage() {
  const { settings } = useMarketPrices();
  const buyerPhone = settings?.buyer_phone || '9848022338';
  const whatsappNumber = settings?.whatsapp_number || '9848022338';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
      <Header settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] bg-[#EAF6F0] px-3 py-1 rounded-full border border-[#69B9A6]/30">
            About Our Buying Desk
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#202B28] tracking-tight">
            Empowering Godavari &amp; Krishna Prawn Farmers with Transparent Rates.
          </h1>
          <p className="text-base text-[#78837F] leading-relaxed">
            We are dedicated seafood procurement professionals exclusively serving aquaculture farmers across East Godavari, West Godavari, and Krishna districts in Andhra Pradesh.
          </p>
        </div>

        {/* Story & Commitment Card */}
        <div className="bg-white rounded-3xl border border-[#E5EBE7] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-[#202B28]">
                Direct Pond Procurement with Full Integrity
              </h2>
              <p className="text-sm text-[#78837F] leading-relaxed">
                Aquaculture farming is high-risk and labor-intensive. Farmers invest months of dedication into pond management, aeration, and feed quality. When harvest day arrives, farmers deserve 100% price certainty, uncompromised count evaluation, and immediate financial settlement.
              </p>
              <p className="text-sm text-[#78837F] leading-relaxed">
                Our platform was engineered to solve market opacity. Every morning, our designated buyer evaluates market trends, processing demand, and international exports, publishing transparent, count-wise rates directly to this website.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#202B28]">
                  <CheckCircle className="w-5 h-5 text-[#176B5B] shrink-0" />
                  <span>No commission agents or middlemen deductions</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#202B28]">
                  <CheckCircle className="w-5 h-5 text-[#176B5B] shrink-0" />
                  <span>Government-calibrated electronic weighing scales</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#202B28]">
                  <CheckCircle className="w-5 h-5 text-[#176B5B] shrink-0" />
                  <span>Same-day RTGS / NEFT / Cash spot settlement</span>
                </div>
              </div>
            </div>

            <div className="bg-[#EAF6F0]/50 rounded-2xl p-7 border border-[#69B9A6]/30 space-y-6">
              <h3 className="text-lg font-bold text-[#176B5B] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#176B5B]" />
                <span>Our Procurement Guarantee</span>
              </h3>

              <div className="space-y-4 text-xs text-[#202B28]">
                <div className="p-4 bg-white rounded-xl border border-[#E5EBE7]">
                  <strong className="block text-sm text-[#176B5B] mb-1">True Count Assessment</strong>
                  Sample weighing is performed jointly with the farmer at the pond dyke before bulk netting begins.
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E5EBE7]">
                  <strong className="block text-sm text-[#176B5B] mb-1">Insulated Cold Chain</strong>
                  Harvested prawns are immediately iced in food-grade crate containers to preserve premium freshness.
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E5EBE7]">
                  <strong className="block text-sm text-[#176B5B] mb-1">Speedy Harvesting Team</strong>
                  Trained netting labor and transport crates arranged on schedule to prevent stress on remaining pond stock.
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(
                    "Hello, I would like to learn more about your prawn procurement and harvesting schedule."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white rounded-xl font-bold text-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={`tel:+91${buyerPhone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#2185D0] text-white rounded-xl font-bold text-xs"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Call Buyer Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Network */}
        <div className="bg-white rounded-3xl border border-[#E5EBE7] p-8 sm:p-10 shadow-xs text-center space-y-6">
          <h2 className="text-2xl font-bold text-[#202B28]">Procurement Network Across Godavari &amp; Krishna (AP)</h2>
          <p className="text-sm text-[#78837F] max-w-2xl mx-auto">
            Our buyers and pond netting supervisors operate exclusively in the prime coastal aquaculture belt of Andhra Pradesh: East Godavari, West Godavari, and Krishna.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E5EBE7]">
              <span className="text-xs font-bold text-[#176B5B] block mb-1">West Godavari Aqua Belt</span>
              <p className="text-xs text-[#78837F]">Bhimavaram, Akividu, Mogalthur, Narasapuram, Palakollu, Undi, Kalla</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E5EBE7]">
              <span className="text-xs font-bold text-[#176B5B] block mb-1">East Godavari &amp; Konaseema</span>
              <p className="text-xs text-[#78837F]">Amalapuram, Kakinada, Mummidivaram, Razole, Katrenikona, Allavaram</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E5EBE7]">
              <span className="text-xs font-bold text-[#176B5B] block mb-1">Krishna Aqua Belt</span>
              <p className="text-xs text-[#78837F]">Machilipatnam, Gudivada, Kaikaluru, Avanigadda, Nagayalanka, Kruthivennu</p>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}

