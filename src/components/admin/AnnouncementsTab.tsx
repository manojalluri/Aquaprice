'use client';

import React, { useState, useEffect } from 'react';
import { Announcement } from '@/types';
import { formatISTDateTime } from '@/lib/dateUtils';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

interface AnnouncementsTabProps {
  onAnnouncementsChanged?: () => void;
}

export default function AnnouncementsTab({ onAnnouncementsChanged }: AnnouncementsTabProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAnnouncements(data.data);
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load announcements' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          is_published: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create announcement');
      }

      setTitle('');
      setDescription('');
      setMessage({ type: 'success', text: 'New announcement published!' });
      await fetchAnnouncements();
      if (onAnnouncementsChanged) onAnnouncementsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error creating announcement' });
    }
  };

  const handleTogglePublish = async (item: Announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !item.is_published }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to toggle status');
      }

      setMessage({
        type: 'success',
        text: `Announcement ${!item.is_published ? 'published live' : 'unpublished'}!`,
      });
      await fetchAnnouncements();
      if (onAnnouncementsChanged) onAnnouncementsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error toggling announcement' });
    }
  };

  const startEdit = (item: Announcement) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save changes');
      }

      setEditingId(null);
      setMessage({ type: 'success', text: 'Announcement updated successfully' });
      await fetchAnnouncements();
      if (onAnnouncementsChanged) onAnnouncementsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving announcement' });
    }
  };

  const handleDelete = async (item: Announcement) => {
    if (!confirm(`Delete announcement "${item.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete announcement');
      }

      setMessage({ type: 'success', text: 'Announcement deleted' });
      await fetchAnnouncements();
      if (onAnnouncementsChanged) onAnnouncementsChanged();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error deleting announcement' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 sm:p-6 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] flex items-center gap-1.5">
          <Megaphone className="w-4 h-4" />
          Market Announcements
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#202B28] mt-1">
          Market Status & Farmer Notices
        </h2>
        <p className="text-xs text-[#78837F] mt-1">
          Broadcast daily market alerts, holiday schedules, or procurement updates to farmers visiting the homepage.
        </p>

        {/* Quick Suggestion Presets */}
        <div className="flex flex-wrap gap-2 pt-3">
          <button
            type="button"
            onClick={() => {
              setTitle("Today's Prawn Market Rates Published");
              setDescription("Daily spot rates are active. Direct pond harvesting available across Godavari & Krishna.");
            }}
            className="px-2.5 py-1 bg-[#F8FAF8] border border-[#E5EBE7] rounded-lg text-[11px] text-[#202B28] hover:border-[#176B5B] transition-colors cursor-pointer"
          >
            + Rates Updated Preset
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("Market Holiday Notice");
              setDescription("No pond harvesting scheduled today due to festival/weather. Procurement resumes tomorrow.");
            }}
            className="px-2.5 py-1 bg-[#F8FAF8] border border-[#E5EBE7] rounded-lg text-[11px] text-[#202B28] hover:border-[#176B5B] transition-colors cursor-pointer"
          >
            + Market Closed Preset
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("High Demand for 30 & 40 Count");
              setDescription("Premium spot rates available for large counts. Immediate cash settlement.");
            }}
            className="px-2.5 py-1 bg-[#F8FAF8] border border-[#E5EBE7] rounded-lg text-[11px] text-[#202B28] hover:border-[#176B5B] transition-colors cursor-pointer"
          >
            + Large Count Demand Preset
          </button>
        </div>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="space-y-3 pt-4 border-t border-[#E5EBE7] mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Announcement Headline (e.g. Rates Published Today)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] placeholder-[#78837F] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
            />
            <input
              type="text"
              placeholder="Details / Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] placeholder-[#78837F] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-sm shadow-[#176B5B]/30 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement</span>
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

      {/* Announcements List */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#202B28]">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78837F]">
            No announcements yet. Use the form above to post one.
          </div>
        ) : (
          <div className="divide-y divide-[#E5EBE7]">
            {announcements.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 transition-colors ${
                    !item.is_published ? 'bg-gray-50/70 opacity-60' : 'hover:bg-[#F8FAF8]'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-bold bg-[#F8FAF8] border border-[#176B5B] rounded-xl text-[#202B28]"
                      />
                      <textarea
                        rows={2}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1.5 bg-[#176B5B] text-white rounded-lg text-xs font-bold"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 bg-gray-200 text-[#202B28] rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.is_published ? 'bg-[#25D366]' : 'bg-gray-400'
                            }`}
                          />
                          <h4 className="text-sm font-bold text-[#202B28]">{item.title}</h4>
                        </div>
                        {item.description && (
                          <p className="text-xs text-[#78837F] pl-4">{item.description}</p>
                        )}
                        <span className="text-[10px] text-[#78837F] pl-4 block">
                          Posted: {formatISTDateTime(item.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            item.is_published
                              ? 'bg-[#EAF6F0] text-[#176B5B] border border-[#69B9A6]/40 hover:bg-[#d8efe4]'
                              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {item.is_published ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-[#176B5B]" />
                              <span>Live on Home</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Unpublished</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 rounded-lg text-[#78837F] hover:text-[#176B5B] hover:bg-[#F8FAF8]"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

