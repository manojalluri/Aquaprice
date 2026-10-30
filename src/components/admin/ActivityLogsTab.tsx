'use client';

import React, { useState, useEffect } from 'react';
import { AdminActivityLog } from '@/types';
import { formatISTDateTime } from '@/lib/dateUtils';
import { History, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ActivityLogsTab() {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLogs(data.data);
      }
    } catch {
      console.error('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#E5EBE7] p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] flex items-center gap-1.5">
            <History className="w-4 h-4" />
            Security & Audit Trail
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#202B28] mt-1">
            Admin Activity Logs
          </h2>
          <p className="text-xs text-[#78837F] mt-1">
            Verifiable timestamped history of rate publishing, count additions, and contact updates.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="p-2 rounded-xl border border-[#E5EBE7] text-[#78837F] hover:text-[#176B5B] hover:bg-[#F8FAF8] transition-colors cursor-pointer"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EBE7] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#202B28]">Loading activity logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78837F]">
            No activity logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF8] border-b border-[#E5EBE7] text-[11px] uppercase tracking-wider font-bold text-[#78837F]">
                  <th className="py-3.5 px-6">TIMESTAMP (IST)</th>
                  <th className="py-3.5 px-6">OPERATOR ID</th>
                  <th className="py-3.5 px-6">ACTION PERFORMED</th>
                  <th className="py-3.5 px-6">TARGET ENTITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBE7]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAF8]/80 text-xs">
                    <td className="py-4 px-6 font-medium text-[#202B28] whitespace-nowrap">
                      {formatISTDateTime(log.created_at)}
                    </td>
                    <td className="py-4 px-6 text-[#78837F] whitespace-nowrap">
                      {log.admin_id}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#EAF6F0] text-[#176B5B] font-bold text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#78837F] whitespace-nowrap">
                      {log.entity_type} {log.entity_id && `(${log.entity_id})`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

