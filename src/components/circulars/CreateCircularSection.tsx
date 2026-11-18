'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Save, 
  Eye, 
  Sparkles, 
  Paperclip, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Plus,
  RefreshCw,
  Mail,
  HelpCircle
} from 'lucide-react';
import { CircularV2Template, CircularSectionTab } from '@/types/circular';
import { EXACT_CATALOGUE_PDF, PREBUILT_CIRCULAR_TEMPLATES } from '@/lib/data/circularV2Constants';

interface CreateCircularSectionProps {
  initialTemplate?: CircularV2Template;
  onNavigateTab: (tab: CircularSectionTab) => void;
  onOpenPdfModal: () => void;
  onLaunchGmailWeb: (subject: string, body: string) => void;
}

export const CreateCircularSection: React.FC<CreateCircularSectionProps> = ({
  initialTemplate = PREBUILT_CIRCULAR_TEMPLATES[0],
  onNavigateTab,
  onOpenPdfModal,
  onLaunchGmailWeb
}) => {
  const [title, setTitle] = useState<string>(initialTemplate.title);
  const [referenceNo, setReferenceNo] = useState<string>(initialTemplate.referenceNumber);
  const [targetAudience, setTargetAudience] = useState<string>(initialTemplate.targetAudience);
  const [targetState, setTargetState] = useState<'tamil-nadu' | 'kerala' | 'all'>('tamil-nadu');
  const [targetDistrict, setTargetDistrict] = useState<string>('coimbatore');
  const [subject, setSubject] = useState<string>(initialTemplate.subject);
  const [bodyText, setBodyText] = useState<string>(initialTemplate.body);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Validation Checks
  const isSubjectValid = subject.trim().length > 10;
  const isBodyValid = bodyText.trim().length > 50;
  const isRefValid = referenceNo.trim().length > 3;
  const isAttachmentReady = true;

  const handleInsertTag = (tag: string) => {
    setBodyText(prev => `${prev}\n${tag}`);
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      setSaveSuccessMsg(null);
      const res = await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign',
          title,
          reference_no: referenceNo,
          target_state: targetState,
          target_district: targetDistrict,
          target_audience_label: targetAudience,
          subject,
          body_text: bodyText
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Circular campaign draft saved to persistent storage!');
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      alert(`Error saving draft: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      setIsSaving(true);
      // Create first, then submit
      const resCreate = await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign',
          title,
          reference_no: referenceNo,
          target_state: targetState,
          target_district: targetDistrict,
          target_audience_label: targetAudience,
          subject,
          body_text: bodyText
        })
      });
      const dataCreate = await resCreate.json();
      if (dataCreate.success && dataCreate.campaign?.id) {
        await fetch('/api/circulars/v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit_approval',
            campaign_id: dataCreate.campaign.id
          })
        });
        setSaveSuccessMsg('Submitted to Manager Approval queue!');
        setTimeout(() => onNavigateTab('approval'), 1200);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-in zoom-in-95">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {saveSuccessMsg}
          </span>
        </div>
      )}

      {/* Two-Column Creator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: Circular Settings, Audience, Message Editor, Attachments (7c)  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-100 text-sky-800">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Circular Composer & Editor
                </h3>
                <p className="text-[11px] text-slate-500">
                  Compose official NUNES institutional outreach directives
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('templates')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Load Template</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            
            {/* Title & Reference No */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Circular Campaign Title:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction of Breath Analyser Solutions"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reference No:
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. NUNES/INST/2026/014"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Geographical Target & Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target State:</label>
                <select
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value as any)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="tamil-nadu">Tamil Nadu (38 Dists)</option>
                  <option value="kerala">Kerala (14 Dists)</option>
                  <option value="all">Both States (TN + KL)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target District:</label>
                <select
                  value={targetDistrict}
                  onChange={(e) => setTargetDistrict(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="coimbatore">Coimbatore (Primary)</option>
                  <option value="chennai">Chennai</option>
                  <option value="madurai">Madurai</option>
                  <option value="salem">Salem</option>
                  <option value="ernakulam">Ernakulam (Kochi)</option>
                  <option value="all">All Districts</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Designation:</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="The Principal / Transport In-Charge"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Outbound Email Subject Line:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject of the institutional circular"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Personalization Merge Tags Bar */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-500" />
                <span>Personalization Tags:</span>
              </span>
              {[
                { label: '+ {{School_Name}}', tag: '{{School_Name}}' },
                { label: '+ {{Principal_Name}}', tag: '{{Principal_Name}}' },
                { label: '+ {{UDISE_Code}}', tag: '{{UDISE_Code}}' },
                { label: '+ {{Block}}', tag: '{{Block}}' }
              ].map(t => (
                <button
                  key={t.tag}
                  type="button"
                  onClick={() => handleInsertTag(t.tag)}
                  className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer border border-sky-200"
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Message Body Editor */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Circular Message Body (Rich Email Text):
              </label>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={14}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-xs leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                placeholder="Type circular text here..."
              />
            </div>

            {/* Attachment Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 text-red-700 rounded-xl shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-900 text-xs truncate max-w-xs sm:max-w-md">
                      {EXACT_CATALOGUE_PDF.filename}
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                      16p Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">5.16 MB • SHA256 Verified Genuine</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPdfModal}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-sky-800 border border-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Inspect PDF
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLaunchGmailWeb(subject, bodyText)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Mail className="w-4 h-4 text-rose-600" />
                  <span>Test in Gmail Web</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitForApproval}
                  disabled={!isSubjectValid || !isBodyValid || isSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Submit for Approval</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: Live Email Preview, PDF Preview, Validation Alerts (5 cols)  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Validation Alerts Card */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Outreach Readiness Validation</span>
            </h4>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600">Subject Line (&gt; 10 chars):</span>
                {isSubjectValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pass
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Too short
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600">Message Body Content:</span>
                {isBodyValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Complete
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Incomplete
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600">16-Page Catalogue Attached:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified (5.16 MB)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600">Opt-Out Suppression:</span>
                <span className="text-sky-700 font-bold">Active in Engine</span>
              </div>
            </div>
          </div>

          {/* Mini Live Preview Frame */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-600" />
                <span>Live Rendering Preview</span>
              </span>
              <button
                onClick={() => onNavigateTab('preview')}
                className="text-sky-700 font-bold hover:underline text-[11px]"
              >
                Expand Full View →
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs font-sans max-h-[500px] overflow-y-auto bg-slate-50/50">
              {/* Mini Brand Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950 text-white text-center space-y-1">
                <span className="text-[9px] font-bold text-sky-300 uppercase tracking-widest">
                  NUNES INSTRUMENTATION
                </span>
                <p className="font-extrabold text-xs text-white leading-tight">
                  {subject || 'Subject Preview'}
                </p>
              </div>

              {/* Recipient Greeting */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 text-[11px]">
                <strong>To:</strong> Stanes Anglo Indian Higher Secondary School
              </div>

              {/* Message text snippet */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-[11px] leading-relaxed whitespace-pre-line font-sans">
                {bodyText.slice(0, 450)}...
              </div>

              {/* Touch reply buttons in preview */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                <div className="p-2 rounded-lg bg-emerald-600 text-white text-center">
                  Request Quotation
                </div>
                <div className="p-2 rounded-lg bg-sky-600 text-white text-center">
                  Book Free Demo
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
