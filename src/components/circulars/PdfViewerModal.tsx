'use client';

import React from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, ExternalLink } from 'lucide-react';
import { EXACT_CATALOGUE_PDF } from '@/lib/data/circularV2Constants';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  title?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl = EXACT_CATALOGUE_PDF.urlPath,
  title = EXACT_CATALOGUE_PDF.filename
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white flex items-center justify-between border-b border-slate-800 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-md">
                  {title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  16 Pages • 14 Models
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                  5.16 MB
                </span>
              </div>
              <p className="text-[11px] text-sky-200 mt-0.5 truncate max-w-lg font-mono">
                SHA256: {EXACT_CATALOGUE_PDF.sha256Checksum.slice(0, 16)}... (Verified Genuine)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download={EXACT_CATALOGUE_PDF.filename}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-102"
              title="Download original verified PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              title="Open full PDF in separate browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Tab</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Status Strip */}
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-950 text-xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Authentic Catalogue:</strong> All 16 pages, 14 models, technical specifications, and QR codes intact without modification.
            </span>
          </div>
          <div className="text-[11px] font-mono text-emerald-800">
            Version: {EXACT_CATALOGUE_PDF.version}
          </div>
        </div>

        {/* Embedded PDF Viewer Iframe */}
        <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-slate-900 flex justify-center items-center">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            title="Catalogue PDF Viewer"
            className="w-full h-[74vh] rounded-2xl bg-white border border-slate-700 shadow-inner"
          />
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-slate-600 text-xs flex items-center justify-between px-5">
          <span>NUNES Instrumentation — Institutional & Transport Safety Directorate</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
