'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('buyer@aquaprice.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModal, setForgotModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoBuyer = () => {
    setEmail('buyer@aquaprice.com');
    setPassword('admin123');
    setError(null);
  };

  const fillDemoSuperAdmin = () => {
    setEmail('superadmin@aquaprice.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B5B] hover:text-[#125346]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#176B5B] flex items-center justify-center text-white shadow-lg shadow-[#176B5B]/30 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B28] tracking-tight">
            Prawn Buyer Portal
          </h2>
          <p className="mt-1 text-xs text-[#78837F]">
            Secure administrative login for publishing daily market buying prices
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-[#EAF6F0] border border-[#69B9A6]/40 text-xs text-[#176B5B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#176B5B]" />
              Authorized Buyer Accounts:
            </span>
          </div>
          <p className="text-[11px] text-[#202B28]">
            Click below to auto-fill the designated buyer account:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={fillDemoBuyer}
              className="px-3 py-1.5 bg-white text-[#176B5B] rounded-lg font-semibold text-xs border border-[#69B9A6]/50 hover:bg-[#176B5B] hover:text-white transition-colors cursor-pointer"
            >
              Buyer: buyer@aquaprice.com
            </button>
            <button
              type="button"
              onClick={fillDemoSuperAdmin}
              className="px-3 py-1.5 bg-white text-[#176B5B] rounded-lg font-semibold text-xs border border-[#69B9A6]/50 hover:bg-[#176B5B] hover:text-white transition-colors cursor-pointer"
            >
              Super Admin
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-6 bg-white py-8 px-6 shadow-xl rounded-3xl border border-[#E5EBE7] sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-[#202B28] uppercase tracking-wider mb-1.5"
              >
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#78837F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-sm text-[#202B28] placeholder-[#78837F] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                  placeholder="buyer@aquaprice.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-[#202B28] uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-[#176B5B] hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78837F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAF8] border border-[#E5EBE7] rounded-xl text-sm text-[#202B28] placeholder-[#78837F] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-[#176B5B]/30 text-sm font-bold text-white bg-[#176B5B] hover:bg-[#125346] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure note */}
          <div className="mt-6 pt-4 border-t border-[#E5EBE7] text-center">
            <span className="text-[11px] text-[#78837F]">
              Direct access restricted to authorized procurement buyers.
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-bold text-[#202B28]">Reset Password</h3>
            <p className="text-xs text-[#78837F] leading-relaxed">
              For security reasons, buyer account credentials can be reset by the Super Admin or directly via the database seed script. Default credentials:
              <br />
              <strong>Email:</strong> buyer@aquaprice.com
              <br />
              <strong>Password:</strong> admin123
            </p>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 bg-[#176B5B] text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

