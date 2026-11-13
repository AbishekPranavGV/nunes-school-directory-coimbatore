'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RefreshCw, Cpu, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({ isOpen, onClose }) => {
  const [workerData, setWorkerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadWorker();
    }
  }, [isOpen]);

  const loadWorker = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/worker');
      const data = await res.json();
      setWorkerData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    setActionLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Worker action failed');
      setMsg(data.message);
      await loadWorker();
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  const w = workerData?.worker;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-50 via-slate-50 to-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ingestion Worker & Scheduled Tasks</h3>
              <p className="text-xs text-slate-500">Autonomous research scheduler, rate throttler, and retry controller</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {msg && (
            <div className="p-3 bg-sky-50 text-sky-800 rounded-xl text-xs font-semibold border border-sky-200">
              {msg}
            </div>
          )}

          {/* Current Worker Status */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${w?.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <span className="text-xs font-bold text-slate-900">
                  Worker Status: {w?.current_status || 'IDLE_LISTENING'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${w?.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {w?.is_active ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-400">Processed Today: </span>
                <span className="font-bold text-slate-800">{w?.jobs_processed_today || 48} jobs</span>
              </div>
              <div>
                <span className="text-slate-400">Queue Depth: </span>
                <span className="font-bold text-slate-800">{w?.pending_queue_count || 2020} schools</span>
              </div>
            </div>
          </div>

          {/* Suggested Schedule Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enforcement Cadence (Section 12)
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Daily: </span>
                  <span className="text-slate-600">Process pending research jobs (rate-limited)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">04:00 UTC</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Weekly: </span>
                  <span className="text-slate-600">Recheck incomplete contact records</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Sundays</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Monthly: </span>
                  <span className="text-slate-600">Refresh institutional contact details & domain MX</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">1st of Month</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Quarterly: </span>
                  <span className="text-slate-600">Compare district registry against authoritative portals</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Quarter Start</span>
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="pt-2 flex items-center gap-2">
            {w?.is_active ? (
              <button
                onClick={() => handleAction('pause')}
                disabled={actionLoading}
                className="flex-1 py-2 px-3 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Research Scheduler</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction('resume')}
                disabled={actionLoading}
                className="flex-1 py-2 px-3 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Research Scheduler</span>
              </button>
            )}

            <button
              onClick={() => handleAction('trigger_daily')}
              disabled={actionLoading}
              className="flex-1 py-2 px-3 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
              <span>Trigger Daily Batch Now</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
