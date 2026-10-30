'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface HeaderProps {
  settings?: PlatformSettings | null;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const buyerWhatsApp = settings?.whatsapp_number || '9848022338';
  const buyerPhone = settings?.buyer_phone || '9848022338';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: "Today's Prices", href: '/#prices-section' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5EBE7] shadow-xs">
      {/* Top micro announcement / phone banner - DESKTOP ONLY to prevent double-banner clutter on mobile */}
      <div className="hidden sm:block bg-[#176B5B] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#69B9A6] animate-pulse"></span>
            <span>Official Daily Procurement Rates • East Godavari, West Godavari &amp; Krishna (AP)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#EAF6F0]">
            <span>Buyer Desk: {settings?.buyer_name || 'M. Srinivasa Rao'}</span>
            <a
              href={`tel:+91${buyerPhone}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#69B9A6]" />
              <span>+91 {buyerPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <a href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#176B5B] to-[#125346] flex items-center justify-center text-white shadow-md shadow-[#176B5B]/20 shrink-0 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 3.84 2.16 7.18 5.34 8.87.52.28 1.16-.1 1.16-.7v-1.92c0-.36-.2-.68-.52-.84-2.02-.99-3.48-3.08-3.48-5.41 0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.25-.42 2.4-1.12 3.32-.23.3-.23.72 0 1.02l1.41 1.41c.29.29.77.29 1.06 0A9.97 9.97 0 0 0 22 12c0-5.52-4.48-10-10-10z" stroke="#69B9A6" />
                <path d="M12 6c-3.31 0-6 2.69-6 6 0 1.95 1.05 3.65 2.62 4.59.39.23.88-.05.88-.5v-1.25c0-.28-.15-.53-.4-.66-1.11-.59-1.85-1.77-1.85-3.18 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 .76-.24 1.46-.66 2.03-.18.25-.18.58 0 .83l.71.71c.23.23.62.23.85 0A5.47 5.47 0 0 0 17.5 12c0-3.04-2.46-5.5-5.5-5.5z" fill="#EAF6F0" fillOpacity="0.4" />
                <circle cx="12" cy="12" r="2" fill="#69B9A6" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-[#176B5B] leading-none">
                AquaPrice<span className="text-[#69B9A6] font-normal">AP</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#78837F] tracking-wide uppercase truncate mt-0.5">
                Godavari &amp; Krishna (AP)
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'text-[#176B5B] border-b-2 border-[#176B5B] pb-1'
                      : 'text-[#202B28] hover:text-[#176B5B]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/91${buyerWhatsApp}?text=${encodeURIComponent(
                "Hello, I visited your prawn market price website. I am interested in checking current rates and selling my harvest."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#176B5B] bg-[#EAF6F0] hover:bg-[#d8efe4] border border-[#69B9A6]/30 rounded-lg transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
              <span>WhatsApp Buyer</span>
            </a>

            <a
              href="/#prices-section"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 rounded-lg transition-all shadow-sm shadow-[#176B5B]/30"
            >
              <span>Check Today&apos;s Prices</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <a
              href="/admin/login"
              className="p-2 text-[#78837F] hover:text-[#176B5B] hover:bg-[#F8FAF8] rounded-lg transition-colors"
              title="Buyer Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Actions: WhatsApp Call Button + Clean Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:+91${buyerPhone}`}
              className="flex items-center gap-1 py-1.5 px-2.5 bg-[#2185D0]/10 text-[#2185D0] border border-[#2185D0]/30 rounded-lg text-xs font-bold active:scale-95"
              aria-label="Call Buyer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <a
              href={`https://wa.me/91${buyerWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#25D366] text-white rounded-lg shadow-xs active:scale-95"
              aria-label="WhatsApp Buyer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#202B28] hover:bg-[#EAF6F0] rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5EBE7] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-bold text-[#202B28] hover:bg-[#EAF6F0] hover:text-[#176B5B] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#E5EBE7] space-y-2.5">
            <a
              href="/#prices-section"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-black text-white bg-[#176B5B] rounded-xl shadow-sm"
            >
              <span>View Today&apos;s Rates</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`https://wa.me/91${buyerWhatsApp}?text=${encodeURIComponent(
                  "Hello, I am interested in selling my prawns. Please send current details."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white bg-[#25D366] rounded-xl active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:+91${buyerPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white bg-[#2185D0] rounded-xl active:scale-95"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Call Buyer</span>
              </a>
            </div>

            <div className="pt-2 text-center">
              <a
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#78837F] hover:text-[#176B5B]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Buyer Admin Login</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
