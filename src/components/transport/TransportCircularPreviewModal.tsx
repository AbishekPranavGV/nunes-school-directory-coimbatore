'use client';

import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Edit3, 
  Send, 
  ShieldCheck, 
  CheckCircle2,
  Building2,
  FileText
} from 'lucide-react';
import { TransportCircular } from '@/types/transport';

interface TransportCircularPreviewModalProps {
  circular: TransportCircular | null;
  onClose: () => void;
  onEdit: (circular: TransportCircular) => void;
  onSendNow: (circular: TransportCircular) => void;
}

export const TransportCircularPreviewModal: React.FC<TransportCircularPreviewModalProps> = ({
  circular,
  onClose,
  onEdit,
  onSendNow
}) => {
  if (!circular) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Official Letterhead Preview</h3>
              <p className="text-[11px] text-slate-500">Reference: {circular.ref_no}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(circular);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Text</span>
            </button>

            <button
              onClick={() => {
                onSendNow(circular);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Outbound</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100/60 flex justify-center">
          
          <div className="w-full max-w-3xl bg-white p-8 sm:p-12 shadow-md border border-slate-200 rounded-xl space-y-6 text-slate-800 text-xs sm:text-sm font-serif leading-relaxed">
            
            {/* Letterhead Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase font-sans">
                Nunes Instruments
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-600 font-sans tracking-wide">
                Precision Measurement Technologies & Industrial Logistics Directorate
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                180, Race Course Road, Coimbatore - 641018, Tamil Nadu, India • Tel: 0422-4333666 • www.nunes.in
              </p>
            </div>

            {/* Reference & Date Line */}
            <div className="flex items-center justify-between font-sans text-xs pt-1">
              <div>
                <span className="text-slate-500">Ref. No: </span>
                <strong className="text-slate-900 font-mono">{circular.ref_no}</strong>
              </div>
              <div>
                <span className="text-slate-500">Date: </span>
                <strong className="text-slate-900">{new Date(circular.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
              </div>
            </div>

            {/* Recipient Line */}
            <div className="space-y-1 font-sans text-xs">
              <p className="text-slate-500">To,</p>
              <p className="font-bold text-slate-900">The Managing Director / Proprietor,</p>
              <p className="text-slate-700">All Registered Member Operators,</p>
              <p className="text-slate-600">Tamil Nadu Omni Bus Owners Association & State Lorry Owners Federation.</p>
            </div>

            {/* Subject Line */}
            <div className="p-3 bg-slate-50 border-l-4 border-amber-600 font-sans">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                Subject: {circular.subject}
              </p>
            </div>

            {/* Body Text */}
            <div className="whitespace-pre-line text-slate-800 leading-relaxed text-xs sm:text-sm font-sans">
              {circular.body}
            </div>

            {circular.attachment_name && (
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs font-sans text-amber-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Enclosure / Annexure: <strong>{circular.attachment_name}</strong></span>
              </div>
            )}

            {/* Signature & Seal Block */}
            <div className="pt-8 flex items-end justify-between font-sans text-xs border-t border-slate-100">
              
              {/* Official Seal Graphic */}
              <div className="w-24 h-24 rounded-full border-2 border-indigo-900/40 flex flex-col items-center justify-center text-center p-2 text-indigo-900/60 rotate-[-8deg]">
                <ShieldCheck className="w-5 h-5 text-indigo-700/60" />
                <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Nunes Instruments</span>
                <span className="text-[7px]">Logistics Bureau</span>
                <span className="text-[7px]">Verified Seal</span>
              </div>

              {/* Signatory Details */}
              <div className="text-right space-y-1">
                <p className="font-bold text-slate-900 text-sm">{circular.signatory_name}</p>
                <p className="text-xs text-slate-600">{circular.signatory_title}</p>
                <p className="text-[10px] text-slate-400">{circular.issuing_authority}</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
