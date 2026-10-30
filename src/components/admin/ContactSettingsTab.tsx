'use client';

import React, { useState, useEffect } from 'react';
import { PlatformSettings } from '@/types';
import {
  PhoneCall,
  Save,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Building,
  User,
  Info,
} from 'lucide-react';

interface ContactSettingsTabProps {
  onSettingsSaved?: () => void;
}

export default function ContactSettingsTab({ onSettingsSaved }: ContactSettingsTabProps) {
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_phone: '',
    whatsapp_number: '',
    alternate_phone: '',
    business_name: '',
    contact_message: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.data) {
          setFormData({
            buyer_name: data.data.buyer_name || '',
            buyer_phone: data.data.buyer_phone || '',
            whatsapp_number: data.data.whatsapp_number || '',
            alternate_phone: data.data.alternate_phone || '',
            business_name: data.data.business_name || '',
            contact_message: data.data.contact_message || '',
          });
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to load contact settings' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setMessage({
        type: 'success',
        text: 'Website contact settings successfully saved and applied to all public SELL actions!',
      });

      if (onSettingsSaved) onSettingsSaved();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating settings' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 sm:p-6 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4" />
          Buyer Connectivity Center
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#202B28] mt-1">
          Website Contact & Phone Settings
        </h2>
        <p className="text-xs text-[#78837F] mt-1">
          These numbers power all Call and WhatsApp actions triggered when farmers click the SELL button across the entire platform.
        </p>
      </div>

      {/* Feedback Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-[#EAF6F0] border-[#69B9A6]/50 text-[#176B5B]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#176B5B]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-6 sm:p-8 shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#202B28]">Loading current contact settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Buyer Name */}
              <div>
                <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-2">
                  Designated Buyer Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#78837F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.buyer_name}
                    onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                    placeholder="e.g. M. Srinivasa Rao"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                  />
                </div>
                <span className="text-[11px] text-[#78837F] mt-1 block">
                  Displayed on the SELL modal and buyer desk info.
                </span>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-2">
                  Business / Agency Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#78837F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="e.g. Sri Venkateswara Aqua Feeds & Prawn Procurement"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                  />
                </div>
              </div>

              {/* Primary Mobile Number (Call Action) */}
              <div>
                <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-2">
                  Primary Mobile Number (for Call Button) *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#78837F] font-semibold text-xs">
                    <Phone className="w-3.5 h-3.5 text-[#2185D0]" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.buyer_phone}
                    onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })}
                    placeholder="9848022338"
                    className="w-full pl-16 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                  />
                </div>
                <span className="text-[11px] text-[#78837F] mt-1 block">
                  Indian 10-digit mobile number dialed when farmers click &ldquo;Call Buyer&rdquo;.
                </span>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-2">
                  WhatsApp Number (for SELL Modal) *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#78837F] font-semibold text-xs">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="9848022338"
                    className="w-full pl-16 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                  />
                </div>
                <span className="text-[11px] text-[#78837F] mt-1 block">
                  Pre-filled count message will open WhatsApp targeting this phone number.
                </span>
              </div>

              {/* Alternate Contact Number */}
              <div>
                <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-2">
                  Alternate Phone (Optional)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#78837F] font-semibold text-xs">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.alternate_phone}
                    onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
                    placeholder="9440188992"
                    className="w-full pl-16 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                  />
                </div>
              </div>

              {/* Contact Availability Message */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-2">
                  Contact Availability / Field Harvesting Message
                </label>
                <textarea
                  rows={3}
                  value={formData.contact_message}
                  onChange={(e) => setFormData({ ...formData, contact_message: e.target.value })}
                  placeholder="e.g. Direct pond-gate harvesting, immediate electronic weighing & spot bank settlement across AP & Telangana."
                  className="w-full p-3 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                />
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-[#E5EBE7] flex items-center justify-between">
              <span className="text-xs text-[#78837F] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Validated for Indian country code (+91)
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-md shadow-[#176B5B]/30 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Contact Settings</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

