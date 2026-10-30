'use client';

import React, { useState } from 'react';
import { AdminSession } from '@/lib/auth';
import { UserCheck, Lock, Shield, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

interface AccountSettingsTabProps {
  currentUser: AdminSession | null;
}

export default function AccountSettingsTab({ currentUser }: AccountSettingsTabProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password');
      }

      setMessage({ type: 'success', text: 'Your admin password was updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 sm:p-6 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] flex items-center gap-1.5">
          <UserCheck className="w-4 h-4" />
          Admin Security & Profile
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#202B28] mt-1">
          Account Credentials & Role
        </h2>
        <p className="text-xs text-[#78837F] mt-1">
          Manage your buyer authentication credentials and security settings.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#202B28] mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#176B5B]" />
          <span>Active Session Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E5EBE7]">
            <span className="text-[#78837F] block mb-1">Email / Login ID</span>
            <span className="text-sm font-bold text-[#202B28]">{currentUser?.email || 'buyer@aquaprice.com'}</span>
          </div>

          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E5EBE7]">
            <span className="text-[#78837F] block mb-1">Assigned Role</span>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF6F0] text-[#176B5B] border border-[#69B9A6]/40 uppercase">
              {currentUser?.role === 'super_admin' ? 'Super Administrator' : 'Designated Buyer'}
            </span>
          </div>

          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E5EBE7]">
            <span className="text-[#78837F] block mb-1">Buyer Desk Name</span>
            <span className="text-sm font-bold text-[#202B28]">{currentUser?.name || 'M. Srinivasa Rao'}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold text-[#202B28] mb-1 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#176B5B]" />
          <span>Update Account Password</span>
        </h3>
        <p className="text-xs text-[#78837F] mb-6">
          Set a new password for logging into the buyer price control dashboard.
        </p>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between mb-5 border ${
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
              className="text-[11px] underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-1.5">
              New Password (minimum 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#78837F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#78837F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-[#202B28] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all shadow-md shadow-[#176B5B]/30 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
}

