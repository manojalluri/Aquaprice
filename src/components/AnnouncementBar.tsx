'use client';

import React, { useState } from 'react';
import { Announcement } from '@/types';
import { Megaphone, X } from 'lucide-react';

interface AnnouncementBarProps {
  announcements: Announcement[];
}

export default function AnnouncementBar({ announcements }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !announcements || announcements.length === 0) return null;

  const current = announcements[0];

  return (
    <aside aria-label="Announcement" className="w-full bg-[#EAF6F0] border-b border-[#69B9A6]/30 text-[#176B5B]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-2">
          
          {/* Announcement content */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-md bg-[#176B5B] text-white shrink-0">
              <Megaphone className="w-3.5 h-3.5" />
            </span>
            <div className="text-xs sm:text-sm truncate">
              <strong className="font-bold text-[#176B5B]">
                {current.title}
              </strong>
              {current.description && (
                <span className="text-[#202B28] ml-1.5 hidden sm:inline">
                  — {current.description}
                </span>
              )}
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-[#78837F] hover:text-[#202B28] hover:bg-[#69B9A6]/20 rounded-md transition-colors shrink-0 cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

        {/* Mobile sub-text only if needed and compact */}
        {current.description && (
          <p className="text-[11px] text-[#202B28] mt-1 pl-6 sm:hidden line-clamp-2">
            {current.description}
          </p>
        )}
      </div>
    </aside>
  );
}
