'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import OverviewTab from '@/components/admin/OverviewTab';
import UpdatePricesTab from '@/components/admin/UpdatePricesTab';
import ManageCountsTab from '@/components/admin/ManageCountsTab';
import ContactSettingsTab from '@/components/admin/ContactSettingsTab';
import AnnouncementsTab from '@/components/admin/AnnouncementsTab';
import AccountSettingsTab from '@/components/admin/AccountSettingsTab';
import ActivityLogsTab from '@/components/admin/ActivityLogsTab';
import { AdminSession } from '@/lib/auth';
import { Menu, ExternalLink, LogOut, CheckCircle2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminSession | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('prices'); // Default to most important feature
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Dashboard Overview Stats
  const [stats, setStats] = useState({
    totalCounts: 8,
    activeCounts: 8,
    publishedPrices: 8,
    lastUpdated: null as string | null,
  });

  const [settings, setSettings] = useState<{ buyer_name?: string; business_name?: string } | null>(null);

  // Authenticate session
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setIsAuthenticating(false);
    }
  }, [router]);

  // Load overview stats
  const fetchOverviewStats = useCallback(async () => {
    try {
      const res = await fetch('/api/market', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setStats({
          totalCounts: json.data.totalActiveCounts || 0,
          activeCounts: json.data.prices ? json.data.prices.length : 0,
          publishedPrices: json.data.prices ? json.data.prices.length : 0,
          lastUpdated: json.data.lastUpdatedOverall || null,
        });
        if (json.data.settings) {
          setSettings({
            buyer_name: json.data.settings.buyer_name,
            business_name: json.data.settings.business_name,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchOverviewStats();
  }, [checkAuth, fetchOverviewStats]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      router.push('/admin/login');
    }
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#202B28]">Authenticating buyer portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar on Mobile & Desktop */}
        <header className="bg-white border-b border-[#E5EBE7] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#202B28] hover:bg-[#F8FAF8]"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-xs font-bold text-[#176B5B] uppercase tracking-wider hidden sm:inline">
                Live Procurement Desk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#176B5B] bg-[#EAF6F0] hover:bg-[#d8efe4] border border-[#69B9A6]/30 transition-colors"
            >
              <span>View Public Table</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              setActiveTab={setActiveTab}
              buyerName={settings?.buyer_name || currentUser?.name}
              businessName={settings?.business_name}
            />
          )}

          {activeTab === 'prices' && (
            <UpdatePricesTab onPricesUpdated={fetchOverviewStats} />
          )}

          {activeTab === 'counts' && (
            <ManageCountsTab onCountsChanged={fetchOverviewStats} />
          )}

          {activeTab === 'settings' && (
            <ContactSettingsTab onSettingsSaved={fetchOverviewStats} />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsTab onAnnouncementsChanged={fetchOverviewStats} />
          )}

          {activeTab === 'account' && (
            <AccountSettingsTab currentUser={currentUser} />
          )}

          {activeTab === 'logs' && <ActivityLogsTab />}
        </main>
      </div>
    </div>
  );
}

