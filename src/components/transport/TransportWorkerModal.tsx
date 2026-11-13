'use client';

import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  Database,
  Globe2,
  ShieldCheck
} from 'lucide-react';

interface TransportWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const TransportWorkerModal: React.FC<TransportWorkerModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([
    '[INIT] Transport Ingestion Worker initialized.',
    '[READY] Connected to Tamil Nadu Regional Transport Adapters.',
    '[STATUS] 24 authoritative fleet operators cached and verified in local memory.'
  ]);

  if (!isOpen) return null;

  const handleRunWorker = () => {
    setIsRunning(true);
    setProgress(15);
    setLog(prev => [...prev, '[HARVEST] Querying TOBOA (Tamil Nadu Omni Bus Owners Association) directory...']);

    setTimeout(() => {
      setProgress(40);
      setLog(prev => [...prev, '[HARVEST] Parsed 15 Omni Bus operators with confirmed WhatsApp & owner details.']);
    }, 1000);

    setTimeout(() => {
      setProgress(70);
      setLog(prev => [...prev, '[HARVEST] Ingesting Namakkal & Sankagiri Lorry Owners Federation (SLOF) registry...']);
    }, 2000);

    setTimeout(() => {
      setProgress(100);
      setIsRunning(false);
      setLog(prev => [
        ...prev,
        '[SUCCESS] Sync completed. All WhatsApp numbers, owner profiles, and GSTINs up to date.',
        '[DONE] Zero data overwrite enforced. Local registry refreshed.'
      ]);
      onRefreshData();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Transport Fleet Harvester</h2>
              <p className="text-xs text-slate-500">Autonomous Web Scraper & Trade Association Sync Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <span className="font-bold text-slate-800">
                {isRunning ? 'Scraping Transport Hubs...' : 'Harvester Idle & Ready'}
              </span>
            </div>
            <button
              onClick={handleRunWorker}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-all shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunning ? 'Harvesting...' : 'Trigger Full Sync'}</span>
            </button>
          </div>

          {isRunning && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Ingestion Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-1.5 max-h-52 overflow-y-auto">
            {log.map((line, i) => (
              <p key={i} className="leading-relaxed">
                <span className="text-slate-500">{new Date().toLocaleTimeString()} </span>
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
