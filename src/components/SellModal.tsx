'use client';

import React, { useEffect } from 'react';
import { MessageCircle, Phone, X, CheckCircle2, Shield, Clock } from 'lucide-react';
import { PrawnPriceDisplay, PlatformSettings } from '@/types';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrice: PrawnPriceDisplay | null;
  settings: PlatformSettings | null;
}

export default function SellModal({
  isOpen,
  onClose,
  selectedPrice,
  settings,
}: SellModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !selectedPrice) return null;

  const countLabel = selectedPrice.count_label;
  const priceFormatted = `₹${selectedPrice.current_price_per_kg}`;

  // Clean buyer phone numbers
  const buyerPhone = (settings?.buyer_phone || '9848022338').replace(/\D/g, '').slice(-10);
  const whatsappNumber = (settings?.whatsapp_number || '9848022338').replace(/\D/g, '').slice(-10);

  // Exact requested pre-filled message mentioning specific count
  const prefilledMessage = `Hello, I visited your prawn market price website. I am interested in selling my ${countLabel} prawns. I checked your current listed rate and would like to discuss the selling process. Please contact me.`;
  const encodedMessage = encodeURIComponent(prefilledMessage);

  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodedMessage}`;
  const callUrl = `tel:+91${buyerPhone}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B28]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5EBE7] p-6 sm:p-7 text-center overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#176B5B] via-[#69B9A6] to-[#25D366]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#78837F] hover:text-[#202B28] hover:bg-[#F8FAF8] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Selected Count & Price Highlight Card */}
        <div className="mt-2 mb-4 p-3.5 bg-[#EAF6F0] rounded-xl border border-[#69B9A6]/30 inline-flex items-center gap-3">
          <div className="text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#176B5B]">
              Selected Harvest Size
            </span>
            <div className="text-lg font-bold text-[#176B5B] flex items-center gap-2">
              <span>{countLabel}</span>
              <span className="text-xs font-normal text-[#78837F]">•</span>
              <span className="text-[#176B5B]">{priceFormatted} / KG</span>
            </div>
          </div>
        </div>

        {/* Main Heading & Description (Strict requirements) */}
        <h3 id="modal-heading" className="text-xl sm:text-2xl font-bold text-[#202B28] mb-2">
          Interested in Selling Your Prawns?
        </h3>
        <p className="text-sm text-[#78837F] mb-6">
          Choose your preferred way to contact our buyer.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {/* BUTTON 1: WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] transition-all shadow-md shadow-[#25D366]/25 group text-base"
          >
            <MessageCircle className="w-6 h-6 fill-white text-transparent group-hover:scale-110 transition-transform" />
            <span>Continue with WhatsApp</span>
          </a>

          {/* BUTTON 2: CALL */}
          <a
            href={callUrl}
            className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-bold text-white bg-[#2185D0] hover:bg-[#1b73b5] active:scale-[0.98] transition-all shadow-md shadow-[#2185D0]/25 group text-base"
          >
            <Phone className="w-6 h-6 fill-white text-transparent group-hover:scale-110 transition-transform" />
            <span>Call Buyer</span>
          </a>
        </div>

        {/* Procurement Desk Guarantee Information */}
        <div className="pt-4 border-t border-[#E5EBE7] text-xs text-[#78837F] space-y-1.5 text-left bg-[#F8FAF8] -mx-6 -mb-6 p-4 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#202B28]">Direct Pond Procurement Desk</span>
            <span className="inline-flex items-center gap-1 text-[#176B5B] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#176B5B]" />
              Spot Settlement
            </span>
          </div>
          <p className="text-[11px] text-[#78837F]">
            East Godavari, West Godavari &amp; Krishna (AP)
          </p>
          <p className="text-[11px] text-[#202B28] pt-0.5">
            Electronic weighing scales &amp; instant bank transfer/cash on pond harvest.
          </p>
        </div>
      </div>
    </div>
  );
}

