'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Shield, 
  ExternalLink, 
  AlertCircle, 
  Cpu, 
  Zap, 
  Search, 
  Globe, 
  FileText, 
  PhoneCall, 
  Mail, 
  MessageSquare,
  Building2,
  DollarSign
} from 'lucide-react';
import { SourceRegistryItem } from '@/types';
import { ProviderReport } from '@/lib/discovery/types';

interface SourceMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceMonitoringModal: React.FC<SourceMonitoringModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'sources'>('providers');
  const [sources, setSources] = useState<SourceRegistryItem[]>([]);
  const [providers, setProviders] = useState<ProviderReport[]>([]);
  const [providerSummary, setProviderSummary] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [srcRes, provRes] = await Promise.all([
        fetch('/api/sources').then(r => r.json()),
        fetch('/api/providers').then(r => r.json())
      ]);

      setSources(srcRes.sources || []);
      setProviders(provRes.providers || []);
      setProviderSummary(provRes.summary || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteProvider = async (providerId: string) => {
    setExecutingId(providerId);
    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider_id: providerId })
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-50 via-slate-50 to-white border-b border-sky-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">12-Source Discovery & Provenance Registry</h3>
              <p className="text-xs text-slate-500">Live monitoring of independent provider adapters, usage costs, and public registers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Summary Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('providers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'providers'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>12 Discovery Providers</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'providers' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {providers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'sources'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Ingestion Registers</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'sources' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {sources.length}
              </span>
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg flex items-center gap-1 shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {activeTab === 'providers' ? (
            <div className="space-y-4">
              
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Active Providers</span>
                  <p className="text-lg font-bold text-slate-900">{providerSummary.available_providers || 12} / 12</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Total Search Attempts</span>
                  <p className="text-lg font-bold text-slate-900">{providerSummary.total_search_attempts || 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Contacts Discovered</span>
                  <p className="text-lg font-bold text-emerald-800">{providerSummary.total_contacts_discovered || 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Actual API Usage Cost</span>
                  <p className="text-lg font-bold text-indigo-700">₹{providerSummary.total_cost_inr || '0.00'}</p>
                </div>
              </div>

              {/* 12 Providers List */}
              <div className="space-y-3">
                {providers.map((p, idx) => (
                  <div key={p.id} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-sky-300 transition-all space-y-2 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{p.provider_name}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            p.config_status === 'CONFIGURED' || p.config_status === 'READY'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.config_status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{p.notes}</p>
                      </div>

                      <button
                        onClick={() => handleExecuteProvider(p.id)}
                        disabled={executingId === p.id}
                        className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap"
                      >
                        <Zap className={`w-3 h-3 ${executingId === p.id ? 'animate-spin' : ''}`} />
                        <span>{executingId === p.id ? 'Testing...' : 'Test Adapter'}</span>
                      </button>
                    </div>

                    {/* Provider Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Attempts</span>
                        <span className="font-bold text-slate-800">{p.search_attempts}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Schools Matched</span>
                        <span className="font-bold text-slate-800">{p.schools_matched}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Discovered</span>
                        <span className="font-bold text-emerald-700">{p.contacts_discovered}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Verified</span>
                        <span className="font-bold text-emerald-800">{p.contacts_verified}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Usage Cost</span>
                        <span className="font-bold text-indigo-700">{p.actual_usage_cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-start gap-2">
                <Shield className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Ethical Data Ingestion Policy: </span>
                  <span>
                    Zero aggressive scraping; adheres strictly to robots.txt, respects government CAPTCHAs via assisted import adapters, and corroborates secondary web directories as leads only.
                  </span>
                </div>
              </div>

              {sources.map((src) => (
                <div key={src.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{src.source_name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {src.sync_status}
                        </span>
                      </div>
                      <a
                        href={src.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-600 hover:underline flex items-center gap-1 mt-0.5 font-mono"
                      >
                        <span className="truncate max-w-sm">{src.source_url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-200/70">
                    <div>
                      <span>Target: </span>
                      <span className="font-bold text-slate-800">{src.target_records}</span>
                    </div>
                    <div>
                      <span>Imported: </span>
                      <span className="font-bold text-slate-800">{src.imported_records}</span>
                    </div>
                    <div>
                      <span>Last Sync: </span>
                      <span className="font-mono text-slate-700">
                        {src.last_sync_at ? src.last_sync_at.split('T')[0] : 'Realtime'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
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
