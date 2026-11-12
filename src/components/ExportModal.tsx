'use client';

import React from 'react';
import { X, Download, FileSpreadsheet, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredCount: number;
  totalMasterCount: number;
  currentFilterParams: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  filteredCount,
  totalMasterCount,
  currentFilterParams
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-sky-50 via-slate-50 to-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export Coimbatore Directory</h3>
              <p className="text-xs text-slate-500">Download formatted CSV reports with audit provenance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Option 1: Export Current Filtered Rows */}
          <a
            href={`/api/export?type=filtered&format=csv&${currentFilterParams}`}
            download
            onClick={onClose}
            className="p-4 bg-sky-50/50 hover:bg-sky-50 border border-sky-200/80 hover:border-sky-300 rounded-xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-sky-700">
                  Export Active Filtered View
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Downloads currently matched <span className="font-semibold text-slate-700">{filteredCount.toLocaleString()} schools</span>
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-sky-600 group-hover:translate-y-0.5 transition-transform" />
          </a>

          {/* Option 2: High Priority Missing Contacts Queue */}
          <a
            href="/api/export?type=missing&format=csv"
            download
            onClick={onClose}
            className="p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-200/80 hover:border-rose-300 rounded-xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-900">
                  Download Missing Contacts Sheet
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actionable work-sheet of unverified schools requiring manual switchboard calling
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-rose-600 group-hover:translate-y-0.5 transition-transform" />
          </a>

          {/* Option 3: Export All 2,097 Master Register Schools */}
          <a
            href="/api/export?type=all&format=csv"
            download
            onClick={onClose}
            className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-slate-800">
                  Export Complete Master District Register
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  All <span className="font-semibold text-slate-700">{totalMasterCount.toLocaleString()} schools</span> across 15 blocks with full metadata
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-700 group-hover:translate-y-0.5 transition-transform" />
          </a>

          {/* Option 4: Verification Audit Report (JSON) */}
          <a
            href="/api/export?type=all&format=json"
            download
            onClick={onClose}
            className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-700 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Export Verification Audit Report (JSON)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete relational object with 7-step discovery waterfall and timestamps
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-brand-700 group-hover:translate-y-0.5 transition-transform" />
          </a>

        </div>

        {/* Modal Footer */}
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
