'use client';

import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Banknote,
  PhoneCall,
  Megaphone,
  UserCheck,
  History,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from 'lucide-react';
import { AdminSession } from '@/lib/auth';

export type AdminTab =
  | 'overview'
  | 'prices'
  | 'counts'
  | 'settings'
  | 'announcements'
  | 'account'
  | 'logs';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  currentUser: AdminSession | null;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'prices', label: "Update Today's Prices", icon: Banknote, badge: 'Main' },
    { id: 'counts', label: 'Manage Prawn Counts', icon: Layers },
    { id: 'settings', label: 'Contact Settings', icon: PhoneCall },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'account', label: 'Account Settings', icon: UserCheck },
    { id: 'logs', label: 'Activity Logs', icon: History },
  ];

  const handleSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E5EBE7] w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E5EBE7] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#176B5B] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#176B5B]/30">
            AQ
          </div>
          <div>
            <span className="text-base font-bold text-[#176B5B] block leading-tight">
              AquaPrice Admin
            </span>
            <span className="text-[10px] text-[#78837F] font-semibold uppercase tracking-wider">
              Buyer Control Desk
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 text-[#78837F] hover:bg-[#F8FAF8] rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info snippet */}
      <div className="px-5 py-3.5 bg-[#F8FAF8] border-b border-[#E5EBE7]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EAF6F0] border border-[#69B9A6]/40 flex items-center justify-center text-[#176B5B] font-bold text-xs">
            {currentUser?.name ? currentUser.name.charAt(0) : 'B'}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-[#202B28] block truncate">
              {currentUser?.name || 'Prawn Buyer'}
            </span>
            <span className="text-[10px] text-[#176B5B] font-semibold uppercase tracking-wider">
              {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Authorized Buyer'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#176B5B] text-white shadow-sm shadow-[#176B5B]/25'
                  : 'text-[#202B28] hover:bg-[#EAF6F0] hover:text-[#176B5B]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#78837F]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EAF6F0] text-[#176B5B] border border-[#69B9A6]/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#E5EBE7] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#78837F] hover:text-[#176B5B] hover:bg-[#F8FAF8] rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>View Public Website</span>
          </div>
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  );
}

