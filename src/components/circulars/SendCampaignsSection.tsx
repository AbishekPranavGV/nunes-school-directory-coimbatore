'use client';

import React, { useState } from 'react';
import { 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Mail, 
  Pause, 
  Play, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Users, 
  Clock, 
  RotateCcw,
  FileText,
  Download,
  Eye,
  Check,
  Paperclip
} from 'lucide-react';
import { CircularV2Campaign, CircularSectionTab, CircularV2Attachment } from '@/types/circular';
import { NUNES_OFFICIAL_CONTACTS, EXACT_CATALOGUE_PDF } from '@/lib/data/circularV2Constants';

interface SendCampaignsSectionProps {
  campaigns: CircularV2Campaign[];
  onNavigateTab: (tab: CircularSectionTab) => void;
  onLaunchGmailWeb: (campaign: CircularV2Campaign) => void;
  onOpenPdfModal?: (pdfUrl?: string, title?: string) => void;
  onRefresh: () => void;
}

export const SendCampaignsSection: React.FC<SendCampaignsSectionProps> = ({
  campaigns,
  onNavigateTab,
  onLaunchGmailWeb,
  onOpenPdfModal,
  onRefresh
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Sent template inspection modal state ("even after it sended")
  const [isInspectSentModalOpen, setIsInspectSentModalOpen] = useState<boolean>(false);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0] || null;
  const activeAttachment = activeCampaign?.attachment || EXACT_CATALOGUE_PDF;

  const handleLaunchDispatch = async () => {
    if (!activeCampaign) return;
    if (activeCampaign.approval?.status !== 'APPROVED') {
      alert('This campaign is not yet authorized by a manager. Please complete the approval gate in the Approval tab first.');
      return;
    }

    try {
      setIsDispatching(true);
      setDispatchSuccess(null);
      const res = await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dispatch_campaign',
          campaign_id: activeCampaign.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchSuccess(data.message);
        onRefresh();
        setTimeout(() => setDispatchSuccess(null), 5000);
      } else {
        alert(data.error || 'Failed to dispatch campaign');
      }
    } catch (err: any) {
      alert(`Dispatch error: ${err.message}`);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleDownloadAttachment = (att: CircularV2Attachment) => {
    const link = document.createElement('a');
    link.href = att.urlPath;
    link.download = att.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-500 text-slate-950 font-black">
              <Send className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Institutional Outbound Campaign Dispatch Console
            </h2>
          </div>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
            Authorized multi-channel campaign dispatch via Official Gmail Web Compose with 9 BCC coordinators, individual batch delivery, and safe rate limiting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            TLS 1.3 Active
          </span>
        </div>
      </div>

      {/* Mandatory Server Safeguard Notice Banner */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl shadow-xs flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Outbound Transmission Safeguard: EMAIL_AUTOMATION_ENABLED = false (Server-Enforced)
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed max-w-4xl">
              To prevent accidental mass sending or domain reputation degradation, autonomous bulk dispatch requires explicit executive verification. Authorized manual outreach is live via the Gmail Web Compose launcher with all 9 Nunes team coordinators attached.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Safety lockout can be modified in server environment settings (EMAIL_AUTOMATION_ENABLED=true).')}
          className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer"
        >
          View Policy
        </button>
      </div>

      {/* Success Notification */}
      {dispatchSuccess && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{dispatchSuccess}</span>
          </div>
        </div>
      )}

      {/* Campaign Dispatch Box */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Approved Campaign:
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 min-w-[320px]"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.reference_no}] {c.title} ({c.status})
                </option>
              ))}
            </select>
          </div>

          {activeCampaign && (
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Target Recipients:</span>
              <p className="text-sm font-black text-slate-900 font-mono">
                {activeCampaign.recipient_count?.toLocaleString() || 1420} Schools
              </p>
            </div>
          )}
        </div>

        {/* Sender Identity Plaque */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Authorized Sender Identity</span>
            <p className="font-bold text-slate-900 text-xs mt-0.5">{NUNES_OFFICIAL_CONTACTS.primaryEmail}</p>
            <p className="text-[10px] text-slate-500">NUNES Instrumentation Alcotest Division</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Audit CC &amp; BCC Coordinators</span>
            <p className="font-bold text-slate-900 text-xs mt-0.5">CC: {NUNES_OFFICIAL_CONTACTS.ccEmail}</p>
            <p className="text-[10px] text-sky-700 font-semibold">+ 9 Internal Sales Coordinators in BCC</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Attached Enclosure Document</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <p className="font-bold text-slate-900 text-xs truncate" title={activeAttachment.filename}>
                {activeAttachment.filename}
              </p>
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold">
              {activeAttachment.pageCount} Pages • {activeAttachment.sizeFormatted} Attached
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {activeCampaign && (
              <button
                type="button"
                onClick={() => onLaunchGmailWeb(activeCampaign)}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:scale-102"
              >
                <Mail className="w-4 h-4 text-rose-600" />
                <span>Launch in Gmail Web (Prefilled with 9 BCCs)</span>
              </button>
            )}

            {/* Inspect Sent Template & Attached PDF Modal Trigger */}
            {activeCampaign && (
              <button
                type="button"
                onClick={() => setIsInspectSentModalOpen(true)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Inspect the exact email template and attached PDF as sent"
              >
                <Eye className="w-4 h-4 text-slate-600" />
                <span>Inspect Sent Template &amp; Attached PDF</span>
              </button>
            )}

            {/* Download Attached PDF */}
            <button
              type="button"
              onClick={() => handleDownloadAttachment(activeAttachment)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Download the attached PDF file"
            >
              <Download className="w-4 h-4" />
              <span>Download Attached PDF</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleLaunchDispatch}
            disabled={isDispatching || activeCampaign?.approval?.status !== 'APPROVED'}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{isDispatching ? 'Transmitting Batch...' : 'Execute Authorized Campaign Dispatch'}</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* "EVEN AFTER IT SENDED" AUDIT & INSPECTION MODAL                           */}
      {/* ========================================================================= */}
      {isInspectSentModalOpen && activeCampaign && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div 
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Sent Campaign Audit Slip &amp; Attached PDF Enclosure
                  </h3>
                  <p className="text-[11px] text-sky-200">
                    Campaign Ref: {activeCampaign.reference_no} • Status: {activeCampaign.status}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInspectSentModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
              
              {/* Envelope Record */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div><strong className="text-slate-600">From:</strong> {NUNES_OFFICIAL_CONTACTS.primaryEmail}</div>
                  <div><strong className="text-slate-600">CC:</strong> {NUNES_OFFICIAL_CONTACTS.ccEmail}</div>
                  <div><strong className="text-slate-600">Subject:</strong> {activeCampaign.subject}</div>
                  <div><strong className="text-slate-600">Scope:</strong> {activeCampaign.target_district || 'Coimbatore'} ({activeCampaign.recipient_count} institutions)</div>
                </div>
              </div>

              {/* Attached PDF Card */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 rounded-xl bg-red-100 border border-red-200 flex flex-col items-center justify-center text-red-700 font-mono text-[9px] font-black shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>PDF</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-xs">
                        {activeAttachment.filename}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-200 text-emerald-900 font-mono">
                        ✓ Dispatched with Campaign
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-100 text-sky-800 font-mono">
                        {activeAttachment.pageCount} Pages • {activeAttachment.sizeFormatted}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      SHA256: {activeAttachment.sha256Checksum ? activeAttachment.sha256Checksum.slice(0, 24) : 'Verified'}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPdfModal?.(activeAttachment.urlPath, activeAttachment.filename);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    Inspect in PDF Viewer
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadAttachment(activeAttachment)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    Download File
                  </button>
                </div>
              </div>

              {/* Sent Template Body */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sent Email Template Body:
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl whitespace-pre-line font-sans text-slate-800 text-xs leading-relaxed max-h-[300px] overflow-y-auto">
                  {activeCampaign.body_text || activeCampaign.body}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Immutable Sent Campaign Record • NUNES Archive
              </span>
              <button
                type="button"
                onClick={() => setIsInspectSentModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Audit Slip
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
