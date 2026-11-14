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
  FileText,
  Globe2,
  MapPin
} from 'lucide-react';
import { TransportCircular } from '@/types/transport';

interface TransportCircularPreviewModalProps {
  circular: TransportCircular | null;
  onClose: () => void;
  onEdit: (circular: TransportCircular) => void;
  onSendNow: (circular: TransportCircular) => void;
  onOneClickBlast?: (circular: TransportCircular) => void;
}

export const TransportCircularPreviewModal: React.FC<TransportCircularPreviewModalProps> = ({
  circular,
  onClose,
  onEdit,
  onSendNow,
  onOneClickBlast
}) => {
  if (!circular) return null;

  const handlePrint = () => {
    window.print();
  };

  const isKerala = circular.target_state === 'Kerala' || circular.target_audience?.includes('Kerala');
  const isTN = circular.target_state === 'Tamil Nadu' || circular.target_audience?.includes('Tamil Nadu');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Official Letterhead Preview</h3>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded font-mono ${
                  isKerala 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : isTN 
                    ? 'bg-sky-100 text-sky-800 border border-sky-300' 
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  {isKerala ? '🌴 Kerala Fleets' : isTN ? '🌿 Tamil Nadu Fleets' : '🌐 All South India (TN + KL)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Reference: <strong className="font-mono text-slate-700">{circular.ref_no}</strong> • Audience: {circular.target_audience}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(circular);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Text</span>
            </button>

            {onOneClickBlast && (
              <button
                onClick={() => {
                  onOneClickBlast(circular);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="1-Click Dispatch to all registered fleet emails"
              >
                <Send className="w-3.5 h-3.5" />
                <span>⚡ 1-Click Automated Blast</span>
              </button>
            )}

            <button
              onClick={() => {
                onSendNow(circular);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Outbound</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
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
                Precision Measurement Technologies & South India Commercial Transport Directorate
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                180, Race Course Road, Coimbatore, Tamil Nadu • Regional Transshipment Hub: Ernakulam North, Kochi, Kerala • Tel: 0422-4333666
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

            {/* Recipient Line (Dynamically adapted to target state) */}
            <div className="space-y-1 font-sans text-xs">
              <p className="text-slate-500">To,</p>
              <p className="font-bold text-slate-900">The Managing Director / Chief Logistics Controller,</p>
              {isKerala ? (
                <>
                  <p className="text-slate-800 font-semibold">Kerala State Road Transport Corporation (KSRTC SWIFT),</p>
                  <p className="text-slate-600">Kerala State Lorry Owners Federation (KSLOF) & Registered Private Bus Fleets.</p>
                </>
              ) : isTN ? (
                <>
                  <p className="text-slate-800 font-semibold">Tamil Nadu Omni Bus Owners Association (TOBOA),</p>
                  <p className="text-slate-600">State Lorry Owners Federation (SLOF) & Member Transporters.</p>
                </>
              ) : (
                <>
                  <p className="text-slate-800 font-semibold">South India Inter-State Transport Operators (Tamil Nadu & Kerala Corridors),</p>
                  <p className="text-slate-600">TOBOA, SLOF, KSLOF & KSRTC SWIFT Member Fleets.</p>
                </>
              )}
            </div>

            {/* Subject Line */}
            <div className="p-3 bg-slate-50 border-l-4 border-blue-600 font-sans">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                Subject: {circular.subject}
              </p>
            </div>

            {/* Body Text */}
            <div className="whitespace-pre-line text-slate-800 leading-relaxed text-xs sm:text-sm font-sans">
              {circular.body}
            </div>

            {circular.attachment_name && (
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs font-sans text-blue-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Enclosure / Official Annexure: <strong className="font-mono">{circular.attachment_name}</strong></span>
              </div>
            )}

            {/* Signature & Seal Block */}
            <div className="pt-8 flex items-end justify-between font-sans text-xs border-t border-slate-100">
              
              {/* Official Seal Graphic */}
              <div className="w-24 h-24 rounded-full border-2 border-indigo-900/40 flex flex-col items-center justify-center text-center p-2 text-indigo-900/60 rotate-[-8deg]">
                <ShieldCheck className="w-5 h-5 text-indigo-700/60" />
                <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Nunes Instruments</span>
                <span className="text-[7px]">South India Desk</span>
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
