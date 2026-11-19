'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Edit3, 
  Send, 
  Mail,
  ShieldCheck, 
  CheckCircle2,
  Building2,
  FileText, 
  Code,
  MapPin,
  ExternalLink,
  Eye,
  Check,
  Copy,
  Smartphone,
  Monitor,
  Sparkles,
  HelpCircle,
  FileCheck,
  Paperclip
} from 'lucide-react';
import { TransportCircular, TransportAttachment } from '@/types/transport';
import { 
  GMAIL_SENDER, 
  NUNES_INTERNAL_BCC_EMAILS, 
  OFFICIAL_CIRCULAR_DRIVE_LINK 
} from '@/lib/data/circularConstants';
import { 
  generateExecutiveTransportHtml, 
  generateStructuredTransportText, 
  copyStyledHtmlToClipboard,
  OFFICIAL_CATALOGUE_FILENAME,
  OFFICIAL_CATALOGUE_FILE_PATH
} from '@/lib/transportEmailTemplates';
import { PdfViewerModal } from '@/components/circulars/PdfViewerModal';
import { TransportQuotationModal } from './TransportQuotationModal';

interface TransportCircularPreviewModalProps {
  circular: TransportCircular | null;
  onClose: () => void;
  onEdit: (circular: TransportCircular) => void;
  onSendNow: (circular: TransportCircular) => void;
  onOneClickBlast?: (circular: TransportCircular) => void;
}

const SAMPLE_RECIPIENTS = [
  {
    name: 'Stanes Anglo Indian Higher Secondary School',
    attention: 'The Principal / Transport & Safety Committee',
    district: 'Coimbatore',
    state: 'Tamil Nadu'
  },
  {
    name: 'PSG Public Schools',
    attention: 'Administrative Officer / School Transport Fleet',
    district: 'Coimbatore',
    state: 'Tamil Nadu'
  },
  {
    name: 'Pollachi Central Higher Secondary School',
    attention: 'The Principal / Fleet Safety Coordinator',
    district: 'Pollachi, Coimbatore',
    state: 'Tamil Nadu'
  },
  {
    name: 'Anaimalai Public Matriculation School',
    attention: 'Correspondent / Depot Controller',
    district: 'Anaimalai, Coimbatore',
    state: 'Tamil Nadu'
  },
  {
    name: 'Educational Institution / Transport Fleet Operator',
    attention: 'The Principal / Administrative Officer / Transport Department',
    district: 'Coimbatore',
    state: 'Tamil Nadu'
  }
];

export const TransportCircularPreviewModal: React.FC<TransportCircularPreviewModalProps> = ({
  circular,
  onClose,
  onEdit,
  onSendNow,
  onOneClickBlast
}) => {
  const [previewTab, setPreviewTab] = useState<'email_preview' | 'html_source' | 'letterhead'>('email_preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState<number>(0);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState<boolean>(false);
  const [isAdminApproved, setIsAdminApproved] = useState<boolean>(false);
  const [testEmailAddress, setTestEmailAddress] = useState<string>('nunesalcotest@gmail.com');
  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState<boolean>(false);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);

  if (!circular) return null;

  const currentRecipient = SAMPLE_RECIPIENTS[selectedRecipientIndex];

  // Generate current executive HTML
  const generatedHtml = generateExecutiveTransportHtml({
    circularTitle: circular.title,
    refNo: circular.ref_no,
    category: circular.category,
    targetAudience: circular.target_audience,
    companyName: currentRecipient.name,
    recipientName: currentRecipient.name,
    recipientDesignation: currentRecipient.attention,
    district: currentRecipient.district,
    state: currentRecipient.state,
    bodyText: circular.body,
    attachmentName: OFFICIAL_CATALOGUE_FILENAME,
    signatoryName: circular.signatory_name,
    signatoryTitle: circular.signatory_title,
    issuingAuthority: circular.issuing_authority
  });

  const structuredText = generateStructuredTransportText({
    circularTitle: circular.title,
    refNo: circular.ref_no,
    companyName: currentRecipient.name,
    recipientDesignation: currentRecipient.attention,
    district: currentRecipient.district,
    state: currentRecipient.state,
    bodyText: circular.body,
    attachmentName: OFFICIAL_CATALOGUE_FILENAME
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyStyledHtml = async () => {
    await copyStyledHtmlToClipboard(generatedHtml, structuredText);
    setCopiedNotice('💎 Executive Email Template copied! In your Gmail compose window, press Ctrl+V to paste the rich corporate design.');
    setTimeout(() => setCopiedNotice(null), 5000);
  };

  const handleCopyRawHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopiedNotice('Raw email-safe HTML copied to clipboard!');
    setTimeout(() => setCopiedNotice(null), 4000);
  };

  const handleOpenGmailWeb = async () => {
    await copyStyledHtmlToClipboard(generatedHtml, structuredText);
    setCopiedNotice('💎 Advanced Executive UI copied to clipboard! Paste (Ctrl+V) in Gmail.');

    const params = new URLSearchParams();
    params.set('view', 'cm');
    params.set('fs', '1');
    params.set('authuser', GMAIL_SENDER.email);
    params.set('to', '');
    params.set('cc', GMAIL_SENDER.cc);
    params.set('bcc', NUNES_INTERNAL_BCC_EMAILS.join(', '));
    params.set('su', circular.title);
    params.set('body', structuredText);

    window.open(`https://mail.google.com/mail/?${params.toString()}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendTestEmail = async () => {
    try {
      setTestEmailStatus('SENDING');
      const res = await fetch('/api/transport/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_test_email',
          test_email: testEmailAddress,
          circular_id: circular.id,
          circular_title: circular.title,
          recipient_name: currentRecipient.name,
          html_content: generatedHtml
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailStatus(`SENT: Test email dispatched with PDF attachment to ${testEmailAddress}`);
        setTimeout(() => {
          setIsTestEmailModalOpen(false);
          setTestEmailStatus(null);
        }, 3000);
      } else {
        setTestEmailStatus(`ERROR: ${data.error || 'Failed to dispatch test email'}`);
      }
    } catch (err: any) {
      setTestEmailStatus(`ERROR: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header & Navigation Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#087EC1]/10 text-[#087EC1]">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Breath Analyser Circular V3.0 Preview
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                  isAdminApproved 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isAdminApproved ? '✓ APPROVED FOR DISPATCH' : 'DRAFT • PENDING APPROVAL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ref: {circular.ref_no} • 16-Page Catalogue PDF Verified
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setPreviewTab('email_preview')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === 'email_preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#087EC1]" />
              <span>Email Preview</span>
            </button>
            <button
              onClick={() => setPreviewTab('html_source')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === 'html_source'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              <span>HTML Source</span>
            </button>
            <button
              onClick={() => setPreviewTab('letterhead')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === 'letterhead'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Print Letterhead</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* PDF Attachment Preview Action */}
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Preview exact 16-page catalogue PDF attachment"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF Attachment (16 Pages)</span>
            </button>

            {/* Test Email Button */}
            <button
              onClick={() => setIsTestEmailModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#092C55] border border-sky-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Send an internal test email with PDF attachment"
            >
              <Mail className="w-3.5 h-3.5 text-[#087EC1]" />
              <span>Send Test Email</span>
            </button>

            {/* Admin Approval Toggle */}
            <button
              onClick={() => setIsAdminApproved(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isAdminApproved 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
              title="Require admin approval before mass launch"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminApproved ? 'Admin Approved' : 'Approve for Launch'}</span>
            </button>

            {/* Copy Styled HTML for Gmail */}
            <button
              onClick={handleCopyStyledHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#087EC1] hover:bg-[#076ba6] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Copy rich styled email HTML to paste (Ctrl+V) directly into Gmail compose"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy for Gmail (Ctrl+V)</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Dynamic Personalisation Bar (Requirement 4 & 11) */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#087EC1]" />
              <span>Dynamic Personalisation Preview:</span>
            </span>
            <select
              value={selectedRecipientIndex}
              onChange={(e) => setSelectedRecipientIndex(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#087EC1]"
            >
              {SAMPLE_RECIPIENTS.map((rec, idx) => (
                <option key={idx} value={idx}>
                  {rec.name} ({rec.district})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>Attention: <strong>{currentRecipient.attention}</strong></span>
            <span>•</span>
            <span>Location: <strong>{currentRecipient.district}, {currentRecipient.state}</strong></span>
          </div>
        </div>

        {/* Copied Notice Banner */}
        {copiedNotice && (
          <div className="p-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-5 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{copiedNotice}</span>
            </div>
            <button onClick={() => setCopiedNotice(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MAIN MODAL CANVAS CONTENT                                         */}
        {/* ================================================================= */}
        {previewTab === 'email_preview' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/90 flex flex-col items-center">
            
            {/* Viewport Control Bar */}
            <div className="w-full max-w-3xl mb-3 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-slate-200">
                  Responsive Viewport:
                </span>
                <span className="text-slate-400 font-mono">
                  {previewDevice === 'desktop' ? '660px (Standard Desktop Table)' : '375px (Mobile Fluid 100%)'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Email Canvas Frame */}
            <div 
              className="transition-all duration-300 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-700"
              style={{ width: previewDevice === 'desktop' ? '680px' : '375px', minHeight: '640px' }}
            >
              <iframe
                title="V3.0 Email Template Preview"
                srcDoc={generatedHtml}
                className="w-full border-0"
                style={{ height: '740px' }}
              />
            </div>

            {/* Action Bar below Canvas */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setIsQuotationModalOpen(true)}
                className="px-4 py-2 bg-[#087EC1] hover:bg-[#076ba6] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Test "Request Quotation / Demo" Action</span>
              </button>
              <button
                onClick={handleOpenGmailWeb}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch Gmail Web Compose</span>
              </button>
            </div>

          </div>
        )}

        {previewTab === 'html_source' && (
          <div className="flex-1 overflow-hidden p-4 bg-slate-950 text-slate-200 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-slate-400">
                Email-Safe Table HTML Source (Gmail &amp; Outlook Ready) • 660px Width Standard
              </div>
              <button
                onClick={handleCopyRawHtml}
                className="px-3 py-1.5 bg-[#087EC1] hover:bg-[#076ba6] text-white rounded-lg font-sans text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HTML Source</span>
              </button>
            </div>
            <textarea
              readOnly
              value={generatedHtml}
              className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-4 mt-3 text-emerald-400 font-mono text-[11px] leading-relaxed resize-none focus:outline-none"
            />
          </div>
        )}

        {previewTab === 'letterhead' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
            <div className="w-full max-w-3xl bg-white p-8 sm:p-12 shadow-md border border-slate-200 rounded-xl space-y-6 text-slate-800 text-xs sm:text-sm font-sans leading-relaxed">
              
              {/* Formal Letterhead Top */}
              <div className="border-b-2 border-[#092C55] pb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#092C55] uppercase">
                    NUNES INSTRUMENTATION
                  </h1>
                  <p className="text-xs text-slate-600">
                    Industrial | Laboratory | Testing | Measuring | Process Instruments
                  </p>
                  <p className="text-xs text-slate-500">
                    Coimbatore, Tamil Nadu • Phone: +91 8940944000 / +91 8940933000
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <div>Ref: {circular.ref_no}</div>
                  <div>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-[#092C55]">To: {currentRecipient.name}</div>
                <div>Attention: {currentRecipient.attention}</div>
                <div>Location: {currentRecipient.district}, {currentRecipient.state}</div>
              </div>

              {/* Subject */}
              <div className="font-bold text-sm text-[#092C55]">
                SUBJECT: {circular.title}
              </div>

              {/* Salutation & Body */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p className="font-bold text-[#092C55]">Respected Sir/Madam,</p>
                <p>Greetings from NUNES Instrumentation, Coimbatore.</p>
                <p>
                  We are pleased to introduce our range of Alcohol Breath Analysers for preliminary alcohol screening and safety-monitoring applications across educational institutions, workplaces and transport operations.
                </p>
                <p className="font-bold text-[#092C55]">Our product portfolio includes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Portable and handheld breath analysers</li>
                  <li>Rapid screening and non-contact screening devices</li>
                  <li>Digital testers with LCD displays</li>
                  <li>Professional models with integrated or external printing</li>
                  <li>Advanced devices with data storage and reporting features</li>
                </ul>
                <p>
                  These solutions may assist with driver screening, institutional transport procedures and workplace safety initiatives, subject to applicable policies and requirements.
                </p>
                <p>
                  Please find attached our 16-page Breath Analyser Product Catalogue, featuring 14 product models, specifications and QR codes.
                </p>
                <p>
                  For product information, demonstrations, quotations or institutional requirements, our team would be pleased to assist.
                </p>
              </div>

              {/* Signature */}
              <div className="pt-6 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                <div>Warm regards,</div>
                <div className="font-bold text-[#092C55]">Sales &amp; Institutional Support Team</div>
                <div>NUNES Instrumentation</div>
                <div className="text-slate-500">Coimbatore, Tamil Nadu</div>
              </div>

              {/* Print action */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#087EC1] text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Footer Toolbar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2 text-slate-500">
            <Paperclip className="w-3.5 h-3.5 text-[#087EC1]" />
            <span>Attachment: <strong>{OFFICIAL_CATALOGUE_FILENAME}</strong> (5.16 MB • 16 Pages)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(circular)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#087EC1] inline mr-1" />
              <span>Edit Directive</span>
            </button>

            {onOneClickBlast && (
              <button
                onClick={() => {
                  if (!isAdminApproved) {
                    alert('Admin Approval Required: Please click "Approve for Launch" before mass dispatch.');
                    return;
                  }
                  onOneClickBlast(circular);
                  onClose();
                }}
                disabled={!isAdminApproved}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isAdminApproved 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                title={isAdminApproved ? 'Ready to dispatch to verified recipients' : 'Locked until Admin Approval'}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch Approved Blast</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={OFFICIAL_CATALOGUE_FILE_PATH}
        title={OFFICIAL_CATALOGUE_FILENAME}
      />

      {/* Quotation Request Modal */}
      <TransportQuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        defaultInstitutionName={currentRecipient.name}
        defaultContactPerson={currentRecipient.attention}
        defaultDistrict={currentRecipient.district}
        defaultState={currentRecipient.state}
      />

      {/* Test Email Dispatch Modal */}
      {isTestEmailModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#087EC1]" />
                <span>Send Internal Test Email</span>
              </h3>
              <button onClick={() => setIsTestEmailModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              Dispatches a single verified test email with the official 16-page catalogue PDF attachment before releasing the circular for production dispatch.
            </p>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Test Address</label>
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#087EC1]"
              />
            </div>

            {testEmailStatus && (
              <div className={`p-2.5 rounded-lg text-[11px] font-semibold ${
                testEmailStatus.startsWith('SENT') ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                testEmailStatus.startsWith('ERROR') ? 'bg-rose-50 text-rose-800 border border-rose-300' :
                'bg-sky-50 text-[#092C55]'
              }`}>
                {testEmailStatus}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsTestEmailModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testEmailStatus === 'SENDING'}
                className="px-4 py-1.5 bg-[#087EC1] hover:bg-[#076ba6] text-white rounded-lg font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testEmailStatus === 'SENDING' ? 'Sending...' : 'Send Test Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
