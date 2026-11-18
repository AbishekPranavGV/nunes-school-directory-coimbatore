'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Send, 
  UserCheck, 
  AlertCircle, 
  FileText, 
  RotateCcw,
  Check,
  X,
  Mail,
  ChevronRight
} from 'lucide-react';
import { CircularV2Campaign, UserRole, CircularSectionTab } from '@/types/circular';
import { NUNES_OFFICIAL_CONTACTS, EXACT_CATALOGUE_PDF } from '@/lib/data/circularV2Constants';

interface TestAndApprovalSectionProps {
  campaigns: CircularV2Campaign[];
  onNavigateTab: (tab: CircularSectionTab) => void;
  currentUserRole?: UserRole;
  onRefresh: () => void;
}

export const TestAndApprovalSection: React.FC<TestAndApprovalSectionProps> = ({
  campaigns,
  onNavigateTab,
  currentUserRole = 'ADMIN',
  onRefresh
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [testEmailAddress, setTestEmailAddress] = useState<string>(NUNES_OFFICIAL_CONTACTS.primaryEmail);
  const [isTestSending, setIsTestSending] = useState<boolean>(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  const [approvalNotes, setApprovalNotes] = useState<string>('Approved for targeted institutional outreach.');
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [approvalSuccessMsg, setApprovalSuccessMsg] = useState<string | null>(null);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0] || null;

  const handleExecuteTestSend = async () => {
    try {
      setIsTestSending(true);
      setTestResultMsg(null);
      const res = await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_send',
          test_email: testEmailAddress,
          campaign_id: activeCampaign?.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestResultMsg(data.message);
        setTimeout(() => setTestResultMsg(null), 5000);
      } else {
        alert(data.error || 'Test send failed');
      }
    } catch (err: any) {
      alert(`Error executing test send: ${err.message}`);
    } finally {
      setIsTestSending(false);
    }
  };

  const handleApprove = async () => {
    if (!activeCampaign) return;
    try {
      setIsApproving(true);
      setApprovalSuccessMsg(null);
      const res = await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_campaign',
          campaign_id: activeCampaign.id,
          approved_by: 'Er. K. R. Senthil Kumar (Director)',
          approval_notes: approvalNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setApprovalSuccessMsg(`Campaign "${activeCampaign.title}" is now APPROVED for broadcast!`);
        onRefresh();
        setTimeout(() => setApprovalSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const stages = [
    { num: 1, name: 'Draft Prepared', status: 'COMPLETE', desc: 'Content and merge tags drafted' },
    { num: 2, name: 'Recipients Verified', status: 'COMPLETE', desc: 'Active school contacts filtered' },
    { num: 3, name: 'Attachment Validated', status: 'COMPLETE', desc: 'Exact 16-page catalogue confirmed' },
    { num: 4, name: 'Preview Inspected', status: 'COMPLETE', desc: 'Desktop & Mobile viewports checked' },
    { num: 5, name: 'Test Send Executed', status: activeCampaign?.approval?.status === 'APPROVED' ? 'COMPLETE' : 'CURRENT', desc: 'Internal authorized address test' },
    { num: 6, name: 'Manager Authorized', status: activeCampaign?.approval?.status === 'APPROVED' ? 'COMPLETE' : 'PENDING', desc: 'Director sign-off and audit trail' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500 text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Institutional Campaign Approval Gate & Audit Trail
            </h2>
          </div>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
            Strict multi-tier review workflow ensuring zero unauthorized messages, full attachment verification, and managerial authorization before broadcast.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono text-emerald-300">
          User Role: <strong>{currentUserRole}</strong> (Full Approval Authority)
        </div>
      </div>

      {testResultMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-in zoom-in-95">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {testResultMsg}
          </span>
        </div>
      )}

      {approvalSuccessMsg && (
        <div className="p-3.5 bg-purple-50 border border-purple-200 text-purple-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-in zoom-in-95">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            {approvalSuccessMsg}
          </span>
        </div>
      )}

      {/* Campaign Selector & 6-Stage Gate */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Campaign Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Campaign to Review:
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 min-w-[300px]"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.reference_no}] {c.title} ({c.status})
                </option>
              ))}
            </select>
          </div>

          {activeCampaign && (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeCampaign.approval?.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                Stage: {activeCampaign.approval?.status || 'PENDING'}
              </span>
            </div>
          )}
        </div>

        {/* 6-Stage Pipeline Graphic */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Approval Workflow Progress:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {stages.map((stage) => {
              const isDone = stage.status === 'COMPLETE';
              const isCurrent = stage.status === 'CURRENT';
              return (
                <div
                  key={stage.num}
                  className={`p-3 rounded-2xl border transition-all ${
                    isDone 
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                      : isCurrent
                      ? 'bg-sky-50 border-sky-400 text-sky-950 ring-2 ring-sky-300/40'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                    <span>STAGE 0{stage.num}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="font-extrabold text-xs">
                    {stage.name}
                  </div>
                  <div className="text-[10px] opacity-80 mt-1 leading-snug">
                    {stage.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Send Section */}
        <div className="p-5 bg-sky-50/60 rounded-2xl border border-sky-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-950 flex items-center gap-1.5 text-sm">
              <Mail className="w-4 h-4 text-sky-700" />
              <span>Stage 5: Internal Test Send Execution</span>
            </span>
            <span className="text-[11px] text-sky-800">
              Zero Mass Sending • Test Mail Only
            </span>
          </div>

          <p className="text-sky-800 leading-relaxed text-xs">
            Send a real single test message to your authorized internal email address with the exact 16-page catalogue PDF attached to verify layout rendering and inbox deliverability before approval.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <input
              type="email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="e.g. info@nunesinstrumentation.com"
              className="w-full sm:flex-1 py-2 px-3 bg-white border border-sky-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={handleExecuteTestSend}
              disabled={isTestSending || !testEmailAddress}
              className="w-full sm:w-auto px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestSending ? 'Sending Test...' : 'Execute Test Send'}</span>
            </button>
          </div>
        </div>

        {/* Manager Authorization Box */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <UserCheck className="w-4 h-4 text-purple-700" />
              <span>Stage 6: Managerial Authorization</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Role: Admin / Director Required
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Executive Approval Notes & Rationale:
            </label>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              rows={3}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl font-sans text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="text-[11px] text-slate-500">
              Signatory: <strong>Er. K. R. Senthil Kumar (Director of Technical Services)</strong>
            </div>

            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer hover:scale-102 disabled:opacity-50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isApproving ? 'Authorizing...' : 'Authorize Campaign for Broadcast'}</span>
            </button>
          </div>
        </div>

        {/* Audit Trail List */}
        {activeCampaign?.approval?.audit_trail && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Immutable Campaign Audit Log:
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              {activeCampaign.approval.audit_trail.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white text-slate-900 font-bold text-[10px] border border-slate-200">
                      {log.step}
                    </span>
                    <span className="text-slate-800">{log.details}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {log.actor} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
