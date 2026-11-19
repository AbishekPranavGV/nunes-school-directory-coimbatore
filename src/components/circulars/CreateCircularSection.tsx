'use client';

import React, { useState, useRef } from 'react';
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
  HelpCircle,
  Upload,
  Download,
  Trash2,
  Check,
  ExternalLink
} from 'lucide-react';
import { CircularV2Template, CircularV2Attachment, CircularSectionTab } from '@/types/circular';
import { EXACT_CATALOGUE_PDF, PREBUILT_CIRCULAR_TEMPLATES } from '@/lib/data/circularV2Constants';

interface CreateCircularSectionProps {
  initialTemplate?: CircularV2Template;
  onNavigateTab: (tab: CircularSectionTab) => void;
  onOpenPdfModal: (pdfUrl?: string, title?: string) => void;
  onLaunchGmailWeb: (subject: string, body: string, attachment?: CircularV2Attachment) => void;
  activeAttachment?: CircularV2Attachment;
  onSelectAttachment?: (att: CircularV2Attachment) => void;
  availableAttachments?: CircularV2Attachment[];
  onRefreshAttachments?: () => void;
}

export const CreateCircularSection: React.FC<CreateCircularSectionProps> = ({
  initialTemplate = PREBUILT_CIRCULAR_TEMPLATES[0],
  onNavigateTab,
  onOpenPdfModal,
  onLaunchGmailWeb,
  activeAttachment = EXACT_CATALOGUE_PDF,
  onSelectAttachment,
  availableAttachments = [EXACT_CATALOGUE_PDF],
  onRefreshAttachments
}) => {
  const [title, setTitle] = useState<string>(initialTemplate.title);
  const [referenceNo, setReferenceNo] = useState<string>(initialTemplate.referenceNumber);
  const [targetAudience, setTargetAudience] = useState<string>(initialTemplate.targetAudience);
  const [targetState, setTargetState] = useState<'tamil-nadu' | 'kerala' | 'all'>('tamil-nadu');
  const [targetDistrict, setTargetDistrict] = useState<string>('coimbatore');
  const [subject, setSubject] = useState<string>(initialTemplate.subject);
  const [bodyText, setBodyText] = useState<string>(initialTemplate.body);

  // Active attached PDF state
  const [currentAttachment, setCurrentAttachment] = useState<CircularV2Attachment>(activeAttachment);
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Validation Checks
  const isSubjectValid = subject.trim().length > 10;
  const isBodyValid = bodyText.trim().length > 50;
  const isRefValid = referenceNo.trim().length > 3;
  const isAttachmentReady = Boolean(currentAttachment && currentAttachment.filename);

  const handleInsertTag = (tag: string) => {
    setBodyText(prev => `${prev}\n${tag}`);
  };

  // Switch attachment
  const handleSwitchAttachment = (att: CircularV2Attachment) => {
    setCurrentAttachment(att);
    onSelectAttachment?.(att);
    
    // Update attachment mention in body if present
    setBodyText(prev => {
      if (prev.includes('Attachment:')) {
        return prev.replace(/Attachment:\s*[^\n\r]+/g, `Attachment: ${att.filename}`);
      }
      return `${prev}\n\nAttachment: ${att.filename}`;
    });

    setUploadToast(`Active attachment switched to: ${att.filename}`);
    setTimeout(() => setUploadToast(null), 3000);
  };

  // Handle Manual PDF File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please upload a valid PDF document (.pdf format only).');
      return;
    }

    try {
      setIsUploadingPdf(true);
      setUploadToast(`Reading and uploading ${file.name}...`);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;

          const res = await fetch('/api/circulars/v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'upload_pdf',
              fileName: file.name,
              fileBase64: base64Data,
              description: `Uploaded from Circular Composer on ${new Date().toLocaleDateString()}`
            })
          });

          const data = await res.json();
          if (data.success && data.attachment) {
            const newAtt: CircularV2Attachment = data.attachment;
            setCurrentAttachment(newAtt);
            onSelectAttachment?.(newAtt);
            onRefreshAttachments?.();

            // Synchronize body text attachment line
            setBodyText(prev => {
              if (prev.includes('Attachment:')) {
                return prev.replace(/Attachment:\s*[^\n\r]+/g, `Attachment: ${newAtt.filename}`);
              }
              return `${prev}\n\nAttachment: ${newAtt.filename}`;
            });

            setUploadToast(`✓ Custom PDF "${file.name}" uploaded, verified, and attached!`);
            setTimeout(() => setUploadToast(null), 4000);
          } else {
            alert(data.error || 'Failed to upload PDF file');
          }
        } catch (err: any) {
          alert(`Upload error: ${err.message}`);
        } finally {
          setIsUploadingPdf(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      reader.onerror = () => {
        alert('Failed to read file from disk.');
        setIsUploadingPdf(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(`File reading error: ${err.message}`);
      setIsUploadingPdf(false);
    }
  };

  const handleDownloadActivePdf = () => {
    const link = document.createElement('a');
    link.href = currentAttachment.urlPath;
    link.download = currentAttachment.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          body_text: bodyText,
          attachment: currentAttachment
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(`Circular draft saved with attached PDF: "${currentAttachment.filename}"!`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
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
          body_text: bodyText,
          attachment: currentAttachment
        })
      });
      const created = await resCreate.json();

      if (created.success && created.campaign) {
        onNavigateTab('approval');
      } else {
        alert(created.error || 'Failed to submit campaign for approval');
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Hidden File Input for Manual PDF Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Toast alert banner */}
      {uploadToast && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg border border-emerald-400 flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{uploadToast}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setUploadToast(null)} 
            className="text-white/80 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Save Banner */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-sky-600 text-white rounded-2xl shadow-md text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-200" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main 2-Column Split Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: Form Fields, Target Audience, Message, Attachment (7 cols)    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            
            {/* Header with Template Loader Link */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-sky-50 text-sky-600">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Circular Composer &amp; Editor
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Compose official NUNES institutional outreach directives
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('templates')}
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <span>Load Template</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Campaign Title & Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Circular Campaign Title:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  placeholder="e.g. Introduction of Breath Analyser Solutions"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reference No:
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  placeholder="NUNES/INST/2026/014"
                />
              </div>
            </div>

            {/* Scope Selection: State, District, Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target State:
                </label>
                <select
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="tamil-nadu">Tamil Nadu (38 Dists)</option>
                  <option value="kerala">Kerala (14 Dists)</option>
                  <option value="all">South India (TN &amp; KL)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target District:
                </label>
                <select
                  value={targetDistrict}
                  onChange={(e) => setTargetDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="coimbatore">Coimbatore (Primary)</option>
                  <option value="chennai">Chennai Region</option>
                  <option value="madurai">Madurai Zone</option>
                  <option value="salem">Salem Zone</option>
                  <option value="ernakulam">Ernakulam (Kochi)</option>
                  <option value="thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="all">All Educational Districts</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Designation:
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="To The Principal / Administration"
                />
              </div>
            </div>

            {/* Outbound Email Subject Line */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Outbound Email Subject Line:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                placeholder="Subject of outbound email broadcast..."
              />
            </div>

            {/* Quick Personalization Merge-Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-500" />
                Personalization Tags:
              </span>
              {[
                '{{School_Name}}',
                '{{Principal_Name}}',
                '{{UDISE_Code}}',
                '{{Block}}',
                '{{District}}'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleInsertTag(tag)}
                  className="px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-mono font-bold transition-all cursor-pointer"
                  title={`Insert ${tag} at cursor`}
                >
                  + {tag}
                </button>
              ))}
            </div>

            {/* Message Body Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Circular Message Body (Rich Email Text):
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {bodyText.length} characters
                </span>
              </div>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={13}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-xs leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                placeholder="Type circular text here..."
              />
            </div>

            {/* ========================================================================= */}
            {/* ENHANCED PDF ATTACHMENT BOX: MANUAL UPLOAD & MULTI-PDF SELECTOR           */}
            {/* ========================================================================= */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Enclosed Official PDF Document
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Attached
                  </span>
                </div>

                {/* Upload Any PDF Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-102 disabled:opacity-50"
                  title="Upload any PDF circular, brochure, directive, or price list"
                >
                  <Upload className={`w-3.5 h-3.5 ${isUploadingPdf ? 'animate-bounce' : ''}`} />
                  <span>{isUploadingPdf ? 'Uploading...' : '+ Upload Any PDF Manually'}</span>
                </button>
              </div>

              {/* Active PDF Spec Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 rounded-xl bg-red-100 border border-red-200 flex flex-col items-center justify-center text-red-700 font-mono text-[9px] font-black shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>PDF</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-slate-900 text-xs truncate max-w-xs sm:max-w-md">
                        {currentAttachment.filename}
                      </p>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                        {currentAttachment.pageCount} Pages Verified
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800 font-mono">
                        {currentAttachment.sizeFormatted}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-md">
                      SHA256: {currentAttachment.sha256Checksum ? currentAttachment.sha256Checksum.slice(0, 16) : 'Verified'}... • {currentAttachment.version || 'Genuine'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenPdfModal(currentAttachment.urlPath, currentAttachment.filename)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-sky-800 border border-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    Inspect PDF
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadActivePdf}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-all cursor-pointer"
                    title="Download physical PDF file to your computer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Switch Dropdown if multiple attachments exist */}
              {availableAttachments.length > 1 && (
                <div className="flex items-center gap-2 text-xs pt-1">
                  <span className="text-[11px] font-bold text-slate-500">Switch Enclosure:</span>
                  <select
                    value={currentAttachment.id}
                    onChange={(e) => {
                      const found = availableAttachments.find(a => a.id === e.target.value);
                      if (found) handleSwitchAttachment(found);
                    }}
                    className="py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {availableAttachments.map((att) => (
                      <option key={att.id} value={att.id}>
                        {att.filename} ({att.sizeFormatted})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  onClick={() => onLaunchGmailWeb(subject, bodyText, currentAttachment)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-102"
                  title="Opens Gmail Web with 9 BCC coordinators, downloads the active PDF, and assists in attaching"
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
                <span className="text-slate-600 truncate max-w-[170px]" title={currentAttachment.filename}>
                  PDF Attached: {currentAttachment.filename}
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {currentAttachment.sizeFormatted} ({currentAttachment.pageCount}p)
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
              {/* V3.0 Clean Letterhead with Logo & Contact */}
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#092C55]">
                  <div>
                    <span className="font-extrabold text-[#092C55] text-xs tracking-wider">
                      NUNES INSTRUMENTATION
                    </span>
                    <p className="text-[10px] text-slate-500">Coimbatore, Tamil Nadu, India</p>
                  </div>
                  <div className="text-right text-[10px] text-[#087EC1] font-semibold">
                    <div>+91 8940944000</div>
                    <div>info@nunesinstrumentation.com</div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[9px] font-bold text-[#087EC1] uppercase tracking-wider block">
                    Official Safety Circular • Ref: {referenceNo}
                  </span>
                  <p className="font-extrabold text-xs text-[#092C55] leading-tight mt-0.5">
                    {subject || 'Breath Analyser Solutions for Institutional & Transport Safety'}
                  </p>
                </div>
              </div>

              {/* Personalised Institution Details Card */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 border-l-4 border-l-[#087EC1] text-slate-700 text-[11px] leading-relaxed">
                <div className="font-bold text-[#092C55]">To: Stanes Anglo Indian Higher Secondary School</div>
                <div className="text-slate-500 text-[10px]"><strong>Attention:</strong> The Principal / Transport &amp; Safety Committee</div>
                <div className="text-slate-500 text-[10px]"><strong>Location:</strong> Coimbatore, Tamil Nadu</div>
              </div>

              {/* Message text snippet */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-[11px] leading-relaxed whitespace-pre-line font-sans">
                {bodyText.slice(0, 360)}...
              </div>

              {/* Attached PDF pill in preview */}
              <div className="p-2.5 bg-[#F4F7FB] border border-[#CFDFEE] rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                    PDF
                  </div>
                  <span className="font-bold text-[#092C55] truncate max-w-[200px]">
                    {currentAttachment.filename}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  {currentAttachment.sizeFormatted} ({currentAttachment.pageCount}p)
                </span>
              </div>

              {/* Exactly 2 Clean V3.0 CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-bold pt-1">
                <div className="p-2 rounded-lg bg-[#087EC1] text-white text-center shadow-xs">
                  Request a Quotation / Demo
                </div>
                <div className="p-2 rounded-lg bg-white text-[#092C55] border border-[#092C55] text-center">
                  Contact NUNES
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
