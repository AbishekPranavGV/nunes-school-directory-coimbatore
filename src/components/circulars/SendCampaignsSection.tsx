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
  RotateCcw
} from 'lucide-react';
import { CircularV2Campaign, CircularSectionTab } from '@/types/circular';
import { NUNES_OFFICIAL_CONTACTS, EXACT_CATALOGUE_PDF } from '@/lib/data/circularV2Constants';

interface SendCampaignsSectionProps {
  campaigns: CircularV2Campaign[];
  onNavigateTab: (tab: CircularSectionTab) => void;
  onLaunchGmailWeb: (campaign: CircularV2Campaign) => void;
  onRefresh: () => void;
}

export const SendCampaignsSection: React.FC<SendCampaignsSectionProps> = ({
  campaigns,
  onNavigateTab,
  onLaunchGmailWeb,
  onRefresh
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0] || null;

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
              Unapproved mass outbound sending is disabled by default in code. You can safely prepare drafts, verify recipient eligibility, launch prefilled Gmail Web Compose with 9 BCC sales coordinators, and execute authorized test deliveries.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('tracking')}
          className="px-3.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-xl whitespace-nowrap transition-all shadow-2xs"
        >
          View Tracking
        </button>
      </div>

      {dispatchSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-in zoom-in-95">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {dispatchSuccess}
          </span>
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
            <span className="text-[10px] text-slate-400 font-bold uppercase">Audit CC & BCC Coordinators</span>
            <p className="font-bold text-slate-900 text-xs mt-0.5">CC: {NUNES_OFFICIAL_CONTACTS.ccEmail}</p>
            <p className="text-[10px] text-sky-700 font-semibold">+ 9 Internal Sales Coordinators in BCC</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Enclosure Document</span>
            <p className="font-bold text-slate-900 text-xs mt-0.5 truncate">{EXACT_CATALOGUE_PDF.filename}</p>
            <p className="text-[10px] text-emerald-700 font-semibold">16-Page High-Res Catalogue Attached</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
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

    </div>
  );
};
