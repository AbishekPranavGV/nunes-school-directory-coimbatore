'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Download, 
  RotateCcw,
  Terminal,
  Filter
} from 'lucide-react';
import { DeliveryEventRecord } from '@/types/circular';

interface DeliveryTrackingSectionProps {
  events: DeliveryEventRecord[];
  onRefresh: () => void;
}

export const DeliveryTrackingSection: React.FC<DeliveryTrackingSectionProps> = ({
  events,
  onRefresh
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredEvents = events.filter(e => {
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.school_name.toLowerCase().includes(q) ||
             e.recipient_email.toLowerCase().includes(q) ||
             e.district.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-sky-500 text-white font-bold">
              <Send className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Transmission Telemetry & Delivery Audit Log
            </h2>
          </div>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
            Real-time delivery verification across school inboxes. Differentiates provider acceptance, inbox delivery, and bounce events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/circulars/v2/export?type=delivery_events"
            download
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Delivery CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school name, recipient email, or district..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="DELIVERED">Delivered (250 OK)</option>
            <option value="QUEUED">Queued / Staged</option>
            <option value="FAILED">Failed / Bounced</option>
          </select>

          <button
            onClick={onRefresh}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-all cursor-pointer"
            title="Refresh delivery logs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Event Records Table */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-2.5 px-3">Institution & Location</th>
                <th className="py-2.5 px-3">Recipient Address</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Status Code</th>
                <th className="py-2.5 px-3 text-right">Latency</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No matching transmission telemetry records available.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900 max-w-xs truncate">
                      <div>{e.school_name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{e.district}</span>
                    </td>

                    <td className="py-2.5 px-3 text-sky-700">
                      {e.recipient_email}
                    </td>

                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        e.channel === 'EMAIL' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {e.channel}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                        e.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        e.status === 'QUEUED' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {e.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {e.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {e.latency_ms}ms
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-400 text-[10px]">
                      {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
