'use client';

import React, { useState, useEffect } from 'react';
import { PrawnCount } from '@/types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ManageCountsTabProps {
  onCountsChanged?: () => void;
}

export default function ManageCountsTab({ onCountsChanged }: ManageCountsTabProps) {
  const [counts, setCounts] = useState<PrawnCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCountLabel, setNewCountLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/counts');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCounts(data.data);
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load prawn counts' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  // Add new count
  const handleAddCount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountLabel.trim()) return;

    try {
      const res = await fetch('/api/admin/counts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count_label: newCountLabel.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create count');
      }

      setNewCountLabel('');
      setMessage({ type: 'success', text: `Added new count: "${data.data.count_label}"` });
      await fetchCounts();
      if (onCountsChanged) onCountsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error adding count' });
    }
  };

  // Toggle active/inactive
  const handleToggleActive = async (count: PrawnCount) => {
    try {
      const res = await fetch(`/api/admin/counts/${count.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !count.is_active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status');
      }

      setMessage({
        type: 'success',
        text: `${count.count_label} is now ${!count.is_active ? 'Active (visible)' : 'Deactivated (hidden)'}`,
      });
      await fetchCounts();
      if (onCountsChanged) onCountsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating status' });
    }
  };

  // Start editing label
  const startEdit = (count: PrawnCount) => {
    setEditingId(count.id);
    setEditingLabel(count.count_label);
  };

  // Save edit label
  const handleSaveEdit = async (id: string) => {
    if (!editingLabel.trim()) return;
    try {
      const res = await fetch(`/api/admin/counts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count_label: editingLabel.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update label');
      }

      setEditingId(null);
      setMessage({ type: 'success', text: 'Count label updated successfully' });
      await fetchCounts();
      if (onCountsChanged) onCountsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving count' });
    }
  };

  // Delete count
  const handleDelete = async (count: PrawnCount) => {
    if (!confirm(`Are you sure you want to delete ${count.count_label}?`)) return;

    try {
      const res = await fetch(`/api/admin/counts/${count.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete count');
      }

      setMessage({ type: 'success', text: `Deleted ${count.count_label}` });
      await fetchCounts();
      if (onCountsChanged) onCountsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error deleting count' });
    }
  };

  // Move display order
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === counts.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...counts];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const orderedIds = reordered.map((c) => c.id);

    try {
      const res = await fetch('/api/admin/counts/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reorder counts');
      }

      setCounts(reordered);
      if (onCountsChanged) onCountsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error reordering counts' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add form */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Prawn Count Configuration
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#202B28] mt-1">
            Manage Prawn Counts & Display Order
          </h2>
          <p className="text-xs text-[#78837F] mt-1">
            Add custom counts, reorder table rows, or deactivate unused counts. Deactivated counts disappear from the public website immediately.
          </p>
        </div>

        {/* Add Count Form */}
        <form onSubmit={handleAddCount} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. 25 Count, 35 Count, 120 Count"
              value={newCountLabel}
              onChange={(e) => setNewCountLabel(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] placeholder-[#78837F] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
            />
          </div>
          <button
            type="submit"
            disabled={!newCountLabel.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-sm shadow-[#176B5B]/30 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Count</span>
          </button>
        </form>
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

      {/* Counts List Table */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#202B28]">Loading prawn counts...</p>
          </div>
        ) : counts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78837F]">
            No prawn counts configured. Use the form above to add your first count.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF8] border-b border-[#E5EBE7] text-[11px] uppercase tracking-wider font-bold text-[#78837F]">
                  <th className="py-3.5 px-6">ORDER</th>
                  <th className="py-3.5 px-6">COUNT LABEL</th>
                  <th className="py-3.5 px-6">PUBLIC VISIBILITY</th>
                  <th className="py-3.5 px-6 text-right">REORDER</th>
                  <th className="py-3.5 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBE7]">
                {counts.map((count, index) => {
                  const isEditing = editingId === count.id;

                  return (
                    <tr
                      key={count.id}
                      className={`hover:bg-[#F8FAF8]/80 transition-colors ${
                        !count.is_active ? 'bg-gray-50/70 text-gray-400' : ''
                      }`}
                    >
                      {/* Order Index */}
                      <td className="py-4 px-6 whitespace-nowrap text-xs font-bold text-[#78837F]">
                        #{index + 1}
                      </td>

                      {/* Count Label (Editable) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingLabel}
                              onChange={(e) => setEditingLabel(e.target.value)}
                              className="px-3 py-1.5 text-xs font-bold bg-[#F8FAF8] border border-[#176B5B] rounded-lg text-[#202B28] focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveEdit(count.id)}
                              className="p-1.5 bg-[#176B5B] text-white rounded-lg hover:bg-[#125346]"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-gray-200 text-[#202B28] rounded-lg hover:bg-gray-300"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                count.is_active ? 'bg-[#176B5B]' : 'bg-gray-300'
                              }`}
                            />
                            <span
                              className={`text-sm font-bold ${
                                count.is_active ? 'text-[#202B28]' : 'text-gray-400 line-through'
                              }`}
                            >
                              {count.count_label}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Public Status Toggle */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(count)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            count.is_active
                              ? 'bg-[#EAF6F0] text-[#176B5B] border border-[#69B9A6]/40 hover:bg-[#d8efe4]'
                              : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {count.is_active ? (
                            <>
                              <Eye className="w-3 h-3 text-[#176B5B]" />
                              <span>Active (Visible)</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-gray-400" />
                              <span>Hidden (Deactivated)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Reorder Buttons */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg border border-[#E5EBE7] text-[#78837F] hover:text-[#176B5B] hover:bg-[#F8FAF8] disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(index, 'down')}
                            disabled={index === counts.length - 1}
                            className="p-1.5 rounded-lg border border-[#E5EBE7] text-[#78837F] hover:text-[#176B5B] hover:bg-[#F8FAF8] disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => startEdit(count)}
                            className="p-1.5 rounded-lg text-[#78837F] hover:text-[#176B5B] hover:bg-[#F8FAF8] transition-colors"
                            title="Edit Label"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(count)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Count"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

