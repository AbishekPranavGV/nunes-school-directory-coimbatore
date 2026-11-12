'use client';

import React, { useState, useEffect } from 'react';
import { X, Database, RefreshCw, CheckCircle2, Shield, ExternalLink, AlertCircle } from 'lucide-react';
import { SourceRegistryItem } from '@/types';

interface SourceMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceMonitoringModal: React.FC<SourceMonitoringModalProps> = ({ isOpen, onClose }) => {
  const [sources, setSources] = useState<SourceRegistryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSources();
    }
  }, [isOpen]);

  const loadSources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data.sources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSource = async (sourceId: string) => {
    setSyncingId(sourceId);
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id: sourceId })
      });
      if (res.ok) {
        await loadSources();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-50 via-slate-50 to-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ingestion Adapters & Source Registry</h3>
              <p className="text-xs text-slate-500">Public source provenance, rate limits, and compliance status</p>
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
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-start gap-2">
            <Shield className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Ethical Data Ingestion Policy: </span>
              <span>
                Zero aggressive scraping; adheres strictly to robots.txt, respects government CAPTCHAs via assisted import adapters, and corroborates secondary web directories as leads only.
              </span>
            </div>
          </div>

          <div className="space-y-3">
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

                  <button
                    onClick={() => handleSyncSource(src.id)}
                    disabled={syncingId === src.id}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-all shadow-xs"
                  >
                    <RefreshCw className={`w-3 h-3 ${syncingId === src.id ? 'animate-spin text-sky-600' : ''}`} />
                    <span>Sync</span>
                  </button>
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

                {src.permissions_policy && (
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    Policy: {src.permissions_policy}
                  </p>
                )}
              </div>
            ))}
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
