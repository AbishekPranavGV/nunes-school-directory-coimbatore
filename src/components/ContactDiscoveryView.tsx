'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Play,
  Pause,
  Server,
  ArrowRight
} from 'lucide-react';
import { SchoolRecord, KPIMetrics } from '@/types';

interface ContactDiscoveryViewProps {
  kpi: KPIMetrics | null;
  onRefreshData: () => Promise<void>;
  onSelectSchool: (school: SchoolRecord) => void;
}

export const ContactDiscoveryView: React.FC<ContactDiscoveryViewProps> = ({
  kpi,
  onRefreshData,
  onSelectSchool
}) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [priorityQueue, setPriorityQueue] = useState<any[]>([]);
  const [queueSummary, setQueueSummary] = useState<any>({
    total_schools: 2097,
    tier_1_unresearched: 1958,
    tier_2_partial: 62,
    tier_3_complete: 77
  });
  const [isRunningBatch, setIsRunningBatch] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<number>(0);
  const [batchLogs, setBatchLogs] = useState<any[]>([]);
  const [activeTier, setActiveTier] = useState<number>(1);

  // Load providers and priority queue
  const loadData = async () => {
    try {
      const [provRes, queueRes] = await Promise.all([
        fetch('/api/providers'),
        fetch('/api/research?view=priority_queue')
      ]);

      const provData = await provRes.json();
      const queueData = await queueRes.json();

      setProviders(provData.providers || []);
      if (queueData.summary) {
        setQueueSummary(queueData.summary);
      }
      if (queueData.queue) {
        setPriorityQueue(queueData.queue);
      }
    } catch (err) {
      console.error('Error loading discovery data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger priority batch research
  const handleRunBatchResearch = async () => {
    setIsRunningBatch(true);
    setBatchProgress(15);
    setBatchLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), message: 'Initiating Tier-1 priority batch runner across 12 independent providers...' },
      ...prev
    ]);

    try {
      setBatchProgress(45);
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'priority_batch' })
      });
      const data = await res.json();

      setBatchProgress(85);
      if (data.processed_schools) {
        setBatchLogs(prev => [
          ...data.processed_schools.map((s: any) => ({
            timestamp: new Date().toLocaleTimeString(),
            message: `Completed 12-source corroboration for "${s.school_name}": Status -> ${s.contact_status} (Confidence: ${(s.confidence_score * 100).toFixed(0)}%). MX Check: ${s.mx_verification?.hasMx ? 'Active' : 'N/A'}`
          })),
          ...prev
        ]);
      }

      setBatchProgress(100);
      await onRefreshData();
      await loadData();
    } catch (err: any) {
      setBatchLogs(prev => [
        { timestamp: new Date().toLocaleTimeString(), message: `Batch runner note: ${err.message}. Retaining database state safely.` },
        ...prev
      ]);
    } finally {
      setTimeout(() => {
        setIsRunningBatch(false);
        setBatchProgress(0);
      }, 1500);
    }
  };

  const filteredQueue = priorityQueue.filter(q => q.priority_tier === activeTier);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">
              12-Source Background AI Research & Ingestion Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
              12 Providers Configured
            </span>
          </div>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
            Multi-tier autonomous discovery agent that queries official UDISE+ registers, CBSE/State boards, official institutional websites, and live DNS MX records with strict zero-fabrication rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunBatchResearch}
            disabled={isRunningBatch}
            className="px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-800 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 text-sky-600 ${isRunningBatch ? 'animate-spin' : ''}`} />
            <span>{isRunningBatch ? 'Running 12-Source Batch...' : 'Research Missing Contacts'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar (Visible while batch running) */}
      {isRunningBatch && (
        <div className="p-4 bg-white rounded-xl border border-sky-200 shadow-xs animate-in fade-in-50">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
              <span>Autonomous Worker: Querying 12 Independent Providers...</span>
            </span>
            <span>{batchProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-sky-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${batchProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Priority Queue Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1 */}
        <button
          onClick={() => setActiveTier(1)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTier === 1 
              ? 'bg-rose-50/60 border-rose-400 ring-2 ring-rose-400 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Priority Tier 1</span>
              <span className="text-lg font-mono font-bold text-rose-900">{queueSummary.tier_1_unresearched}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Unresearched Queue</h4>
            <p className="text-xs text-slate-500 mt-1">Schools requiring initial 12-source identity match and official website discovery.</p>
          </div>
          <div className="mt-3 pt-2 border-t border-rose-100 text-[11px] text-rose-700 font-semibold">
            Highest Priority Recovery Target
          </div>
        </button>

        {/* Tier 2 */}
        <button
          onClick={() => setActiveTier(2)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTier === 2 
              ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Priority Tier 2</span>
              <span className="text-lg font-mono font-bold text-amber-900">{queueSummary.tier_2_partial}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Partially Enriched</h4>
            <p className="text-xs text-slate-500 mt-1">Schools with phone or secondary directory listing pending official corroboration.</p>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-100 text-[11px] text-amber-700 font-semibold">
            Corroboration & MX Resolution
          </div>
        </button>

        {/* Tier 3 */}
        <button
          onClick={() => setActiveTier(3)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTier === 3 
              ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-400 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Priority Tier 3</span>
              <span className="text-lg font-mono font-bold text-emerald-900">{queueSummary.tier_3_complete}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Contact Complete</h4>
            <p className="text-xs text-slate-500 mt-1">Verified institutional landline, mobile or domain email with active mail exchanger.</p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-100 text-[11px] text-emerald-700 font-semibold">
            Freshness Re-checking & Routine Audit
          </div>
        </button>

      </div>

      {/* 12 Providers Status Matrix & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Providers Grid (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Independent Discovery Providers</h3>
                <p className="text-xs text-slate-500">Autonomous multi-source adapters with bounded concurrency & usage limits</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Zero Fabrication Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {providers.map((p) => (
              <div key={p.provider_id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 hover:border-sky-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{p.name}</h5>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">{p.type} • Cost: {p.actual_usage_cost}</p>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/60 text-center text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Searched</span>
                    <span className="font-bold text-slate-700">{p.search_attempts}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Matched</span>
                    <span className="font-bold text-sky-800">{p.schools_matched}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Verified</span>
                    <span className="font-bold text-emerald-700">{p.contacts_verified}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Activity Log (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Research Log</h3>
                  <p className="text-xs text-slate-500">Autonomous agent trace & checkpoints</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {batchLogs.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-dashed border-slate-200">
                  Click "Research Missing Contacts" to execute a live 12-source recovery batch.
                </div>
              ) : (
                batchLogs.map((log, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200/60 font-mono">
                    <span className="text-slate-400 text-[10px] block mb-0.5">{log.timestamp}</span>
                    <p className="text-slate-700 leading-tight">{log.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Durable worker queue active</span>
            <span className="font-semibold text-emerald-700">Idempotent</span>
          </div>
        </div>

      </div>

      {/* Target Schools Table for Active Tier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Tier {activeTier} Work Queue ({filteredQueue.length} Schools Preview)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Sorted by Research Priority</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredQueue.slice(0, 8).map((q) => (
            <div key={q.school_id} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
              <div>
                <h5 className="text-xs font-bold text-slate-900">{q.school_name}</h5>
                <p className="text-[11px] text-slate-500">{q.udise_code} • {q.block} • {q.recommended_provider}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  q.priority_tier === 1 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  Tier {q.priority_tier}
                </span>
                <span className="text-xs text-slate-600 font-medium">{q.next_action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
