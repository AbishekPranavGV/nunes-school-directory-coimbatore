'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  Truck,
  ShieldCheck
} from 'lucide-react';

interface TransportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
  selectedDistrict: string;
}

export const TransportExportModal: React.FC<TransportExportModalProps> = ({
  isOpen,
  onClose,
  totalCount,
  selectedDistrict
}) => {
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    const url = `/api/transport/export?format=${format}&district=${selectedDistrict}`;
    window.location.href = url;
    setTimeout(() => {
      setDownloading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Export Transport Intelligence</h2>
              <p className="text-xs text-slate-500">Download Bus & Lorry Owner Contact Register</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
            Ready to export <strong>{totalCount}</strong> verified transport operators with owner names, WhatsApp numbers, email IDs, routes, and fleet details.
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-2">Select Export Format:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  format === 'xlsx'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                <span className="text-xs">Excel Workbook (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  format === 'csv'
                    ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-500 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-6 h-6 text-sky-600" />
                <span className="text-xs">Standard CSV (.csv)</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-500">
            <p className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Includes Owner / MD Full Names and Designations</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Includes WhatsApp Direct Numbers & Email/Gmail IDs</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Includes Full Depot Addresses & Pincodes</span>
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing Download...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
