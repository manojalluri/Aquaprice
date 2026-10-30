'use client';

import React, { useState, useEffect } from 'react';
import { AdminCountPriceRow } from '@/lib/db';
import { formatISTDateTime } from '@/lib/dateUtils';
import {
  Banknote,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface UpdatePricesTabProps {
  onPricesUpdated?: () => void;
}

export default function UpdatePricesTab({ onPricesUpdated }: UpdatePricesTabProps) {
  const [rows, setRows] = useState<AdminCountPriceRow[]>([]);
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch prices
  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/prices');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRows(data.data);
        // Pre-fill input fields with current price
        const initialMap: Record<string, string> = {};
        data.data.forEach((r: AdminCountPriceRow) => {
          if (r.current_price_per_kg !== null) {
            initialMap[r.count_id] = String(r.current_price_per_kg);
          } else {
            initialMap[r.count_id] = '';
          }
        });
        setEditedPrices(initialMap);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to load price table' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handlePriceChange = (countId: string, value: string) => {
    setEditedPrices((prev) => ({
      ...prev,
      [countId]: value,
    }));
  };

  // Bulk publish all prices
  const handlePublishAll = async (status: 'published' | 'draft' = 'published') => {
    setMessage(null);

    // Validate inputs
    const updates: Array<{ count_id: string; new_price_per_kg: number }> = [];

    for (const row of rows) {
      const rawVal = editedPrices[row.count_id];
      if (rawVal === undefined || rawVal === '') {
        setMessage({
          type: 'error',
          text: `Price cannot be empty for ${row.count_label}. Please enter a positive number.`,
        });
        return;
      }

      const numVal = Number(rawVal);
      if (isNaN(numVal) || numVal <= 0) {
        setMessage({
          type: 'error',
          text: `Invalid rate for ${row.count_label}. Price must be a positive number greater than 0.`,
        });
        return;
      }

      updates.push({
        count_id: row.count_id,
        new_price_per_kg: numVal,
      });
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk',
          publication_status: status,
          updates,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update prices');
      }

      setMessage({
        type: 'success',
        text: status === 'published'
          ? "Today's prawn prices have been successfully updated!"
          : 'All price drafts have been saved successfully.',
      });

      await fetchPrices();
      if (onPricesUpdated) onPricesUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error publishing prices' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Publish single count price
  const handlePublishSingle = async (row: AdminCountPriceRow, status: 'published' | 'draft' = 'published') => {
    setMessage(null);
    const rawVal = editedPrices[row.count_id];

    if (!rawVal || rawVal === '') {
      setMessage({
        type: 'error',
        text: `Please enter a valid price for ${row.count_label}.`,
      });
      return;
    }

    const numVal = Number(rawVal);
    if (isNaN(numVal) || numVal <= 0) {
      setMessage({
        type: 'error',
        text: `Price for ${row.count_label} must be a positive number greater than 0.`,
      });
      return;
    }

    setSavingRowId(row.count_id);
    try {
      const res = await fetch('/api/admin/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'single',
          count_id: row.count_id,
          price: numVal,
          publication_status: status,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update price');
      }

      setMessage({
        type: 'success',
        text: `${row.count_label} rate successfully ${status === 'published' ? 'published' : 'saved as draft'}!`,
      });

      await fetchPrices();
      if (onPricesUpdated) onPricesUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating price' });
    } finally {
      setSavingRowId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#176B5B] text-white">
              <Banknote className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold text-[#176B5B] tracking-wider">
              Primary Buying Operations
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#202B28]">
            Update Today&apos;s Buying Rates
          </h2>
          <p className="text-xs text-[#78837F] mt-1 max-w-2xl">
            Update buying prices for all counts from this single screen. Changes publish directly to the public website with verified IST timestamps.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handlePublishAll('draft')}
            disabled={isSubmitting || isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#202B28] bg-[#F8FAF8] border border-[#E5EBE7] hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#78837F]" />
            <span>Save as Draft</span>
          </button>

          {/* PROMINENT BULK PUBLISH BUTTON (Strict Requirement) */}
          <button
            onClick={() => handlePublishAll('published')}
            disabled={isSubmitting || isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-md shadow-[#176B5B]/30 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-[#69B9A6]" />
            )}
            <span>PUBLISH ALL PRICES</span>
          </button>
        </div>
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

      {/* Price Update Table */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#202B28]">Loading counts and prices...</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78837F]">
            No prawn counts configured. Please go to &ldquo;Manage Prawn Counts&rdquo; to add counts first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF8] border-b border-[#E5EBE7] text-[11px] uppercase tracking-wider font-bold text-[#78837F]">
                  <th className="py-3.5 px-6">COUNT</th>
                  <th className="py-3.5 px-6 text-right">CURRENT PRICE (₹/KG)</th>
                  <th className="py-3.5 px-6">NEW PRICE (₹/KG)</th>
                  <th className="py-3.5 px-6">LAST SERVER PUBLISHED</th>
                  <th className="py-3.5 px-6 text-right">INDIVIDUAL ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBE7]">
                {rows.map((row) => {
                  const isRowSaving = savingRowId === row.count_id;
                  const currentPriceVal = row.current_price_per_kg;
                  const newPriceVal = editedPrices[row.count_id] ?? '';
                  const hasPriceChanged =
                    currentPriceVal !== null &&
                    newPriceVal !== '' &&
                    Number(newPriceVal) !== currentPriceVal;

                  return (
                    <tr
                      key={row.count_id}
                      className={`hover:bg-[#F8FAF8]/80 transition-colors ${
                        !row.is_active ? 'opacity-50 bg-gray-50' : ''
                      }`}
                    >
                      {/* Column 1: Count */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#176B5B]" />
                          <span className="text-sm font-bold text-[#202B28]">
                            {row.count_label}
                          </span>
                        </div>
                        {!row.is_active && (
                          <span className="text-[10px] text-red-500 font-semibold block mt-0.5">
                            (Inactive — hidden on public site)
                          </span>
                        )}
                      </td>

                      {/* Column 2: Current Price (Read-only for reference) */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        {currentPriceVal !== null ? (
                          <span className="text-base font-bold text-[#78837F]">
                            ₹{currentPriceVal.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-xs text-[#78837F] italic">Not set</span>
                        )}
                      </td>

                      {/* Column 3: New Price (Editable Input) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="relative w-36 sm:w-44">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#78837F]">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={newPriceVal}
                            onChange={(e) => handlePriceChange(row.count_id, e.target.value)}
                            placeholder="e.g. 350"
                            className={`w-full pl-7 pr-3 py-2 text-sm font-bold rounded-xl border focus:outline-none transition-all ${
                              hasPriceChanged
                                ? 'border-[#176B5B] bg-[#EAF6F0]/40 text-[#176B5B] ring-1 ring-[#176B5B]'
                                : 'border-[#E5EBE7] bg-white text-[#202B28] focus:border-[#176B5B]'
                            }`}
                          />
                        </div>
                        {hasPriceChanged && (
                          <span className="text-[10px] text-[#176B5B] font-semibold block mt-1">
                            • Rate modified
                          </span>
                        )}
                      </td>

                      {/* Column 4: Last Server Published */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {row.published_at ? (
                          <div className="text-xs text-[#202B28]">
                            <div className="font-semibold">{formatISTDateTime(row.published_at)}</div>
                            <span className="text-[10px] text-[#78837F]">IST Server Time</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#78837F] italic">Never published</span>
                        )}
                      </td>

                      {/* Column 5: Individual Action */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <button
                          onClick={() => handlePublishSingle(row, 'published')}
                          disabled={isRowSaving || isSubmitting}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#176B5B] bg-[#EAF6F0] hover:bg-[#d5eee2] active:scale-95 transition-all border border-[#69B9A6]/40 disabled:opacity-50 cursor-pointer"
                          title="Publish only this count rate"
                        >
                          {isRowSaving ? (
                            <div className="w-3.5 h-3.5 border-2 border-[#176B5B] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#176B5B]" />
                          )}
                          <span>Publish Single</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info banner */}
        <div className="p-4 bg-[#F8FAF8] border-t border-[#E5EBE7] flex flex-wrap items-center justify-between text-xs text-[#78837F] gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#176B5B]" />
            <span>
              Timestamp rule: Unchanged count prices preserve their existing timestamp. Only modified rates get fresh server timestamps.
            </span>
          </div>
          <div>
            Total Counts: {rows.length}
          </div>
        </div>
      </div>
    </div>
  );
}

