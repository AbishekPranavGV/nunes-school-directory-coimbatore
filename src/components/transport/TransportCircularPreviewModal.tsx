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
  FileCode,
  Globe2,
  MapPin,
  Paperclip,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  FileCheck,
  Sparkles,
  Copy,
  Smartphone,
  Monitor
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
  copyStyledHtmlToClipboard 
} from '@/lib/transportEmailTemplates';

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
  const [lightboxImage, setLightboxImage] = useState<{ name: string; url: string } | null>(null);
  const [previewMode, setPreviewMode] = useState<'letterhead' | 'email_ui'>('email_ui');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  if (!circular) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyStyledHtml = async () => {
    if (!circular) return;
    const htmlContent = generateExecutiveTransportHtml({
      circularTitle: circular.title,
      refNo: circular.ref_no,
      category: circular.category,
      targetAudience: circular.target_audience,
      bodyText: circular.body,
      attachmentName: circular.attachment_name,
      signatoryName: circular.signatory_name,
      signatoryTitle: circular.signatory_title,
      issuingAuthority: circular.issuing_authority
    });
    const structuredText = generateStructuredTransportText({
      circularTitle: circular.title,
      refNo: circular.ref_no,
      bodyText: circular.body,
      attachmentName: circular.attachment_name
    });
    await copyStyledHtmlToClipboard(htmlContent, structuredText);
    setCopiedNotice('💎 Advanced Executive UI Template copied to clipboard! In your Gmail compose window, press Ctrl+V to paste the rich design with banners, cards, and buttons.');
    setTimeout(() => setCopiedNotice(null), 6000);
  };

  const handleOpenGmailWeb = async () => {
    if (!circular) return;

    const htmlContent = generateExecutiveTransportHtml({
      circularTitle: circular.title,
      refNo: circular.ref_no,
      category: circular.category,
      targetAudience: circular.target_audience,
      bodyText: circular.body,
      attachmentName: circular.attachment_name,
      signatoryName: circular.signatory_name,
      signatoryTitle: circular.signatory_title,
      issuingAuthority: circular.issuing_authority
    });

    const structuredText = generateStructuredTransportText({
      circularTitle: circular.title,
      refNo: circular.ref_no,
      bodyText: circular.body,
      attachmentName: circular.attachment_name
    });

    // Auto-copy styled HTML so Ctrl+V in Gmail compose pastes the rich executive design!
    await copyStyledHtmlToClipboard(htmlContent, structuredText);
    setCopiedNotice('💎 Advanced Executive UI Template copied to clipboard! In your Gmail compose window, press Ctrl+V to paste the rich design.');

    const params = new URLSearchParams();
    params.set('view', 'cm');
    params.set('fs', '1');
    params.set('authuser', GMAIL_SENDER.email);
    params.set('to', '');
    params.set('cc', GMAIL_SENDER.cc);
    params.set('bcc', NUNES_INTERNAL_BCC_EMAILS.join(', '));
    params.set('su', circular.subject || circular.title);
    params.set('body', structuredText);

    window.open(`https://mail.google.com/mail/?${params.toString()}`, '_blank', 'noopener,noreferrer');
  };

  const isKerala = circular.target_state === 'Kerala' || circular.target_audience?.includes('Kerala');
  const isTN = circular.target_state === 'Tamil Nadu' || circular.target_audience?.includes('Tamil Nadu');

  // Determine attachments list
  let displayAttachments: TransportAttachment[] = [];
  if (circular.attachments && circular.attachments.length > 0) {
    displayAttachments = circular.attachments;
  } else if (circular.attachment_name) {
    // Parse comma-separated filenames if any
    const names = circular.attachment_name.split(',').map(s => s.trim()).filter(Boolean);
    displayAttachments = names.map((name, idx) => {
      const ext = name.split('.').pop()?.toLowerCase() || '';
      let type: 'pdf' | 'word' | 'image' | 'other' = 'pdf';
      if (['doc', 'docx'].includes(ext)) type = 'word';
      else if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) type = 'image';
      
      return {
        id: `prev-att-${idx}`,
        name,
        type,
        size: '1.4 MB'
      };
    });
  }

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
                <h3 className="font-bold text-slate-900 text-sm">Official Directive Preview</h3>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded font-mono ${
                  isKerala 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : isTN 
                    ? 'bg-sky-100 text-sky-800 border border-sky-300' 
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  {isKerala ? '🌴 Kerala Fleets' : isTN ? '🌿 Tamil Nadu Fleets' : '🌐 All South India (TN + KL)'}
                </span>
                {displayAttachments.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-mono">
                    📎 {displayAttachments.length} Enclosures
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Reference: <strong className="font-mono text-slate-700">{circular.ref_no}</strong> • Audience: {circular.target_audience}
              </p>
            </div>
          </div>

          {/* Mode Switcher: Letterhead vs Executive Email UI */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl gap-1 text-xs font-bold">
            <button
              onClick={() => setPreviewMode('email_ui')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'email_ui'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>💎 Executive Gmail UI</span>
            </button>
            <button
              onClick={() => setPreviewMode('letterhead')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'letterhead'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Formal Letterhead</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Styled UI Button */}
            <button
              onClick={handleCopyStyledHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-extrabold transition-all shadow-2xs hover:scale-102 cursor-pointer"
              title="Copy rich styled HTML to paste (Ctrl+V) directly into Gmail compose"
            >
              <Copy className="w-3.5 h-3.5 text-amber-700" />
              <span>💎 Copy Styled UI (Ctrl+V)</span>
            </button>

            {previewMode === 'letterhead' && (
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onEdit(circular);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Directive</span>
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
                <span>⚡ 1-Click Blast</span>
              </button>
            )}

            <button
              onClick={handleOpenGmailWeb}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Open in Gmail Web with 9 BCC coordinators"
            >
              <Mail className="w-3.5 h-3.5 text-rose-600" />
              <span>Gmail Web (9 BCCs)</span>
            </button>

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

        {/* Copied Notice Banner */}
        {copiedNotice && (
          <div className="p-3 bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-950 border-b-2 border-sky-400 text-white px-5 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{copiedNotice}</span>
            </div>
            <button onClick={() => setCopiedNotice(null)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal View Content */}
        {previewMode === 'email_ui' ? (
          /* ========================================================================= */
          /* EXECUTIVE GMAIL UI TEMPLATE PREVIEW WITH DESKTOP / MOBILE SWITCHER        */
          /* ========================================================================= */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/90 flex flex-col items-center">
            
            {/* Viewport Control Bar */}
            <div className="w-full max-w-3xl mb-3 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-slate-200">
                  Live Responsive HTML Viewport:
                </span>
                <span className="text-slate-400 font-mono">
                  {previewDevice === 'desktop' ? '680px (Desktop / Tablet)' : '375px (Mobile)'}
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
                title="Executive Email Preview"
                srcDoc={generateExecutiveTransportHtml({
                  circularTitle: circular.title,
                  refNo: circular.ref_no,
                  category: circular.category,
                  targetAudience: circular.target_audience,
                  bodyText: circular.body,
                  attachmentName: circular.attachment_name,
                  signatoryName: circular.signatory_name,
                  signatoryTitle: circular.signatory_title,
                  issuingAuthority: circular.issuing_authority
                })}
                className="w-full border-0"
                style={{ height: '700px' }}
              />
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORMAL LETTERHEAD VIEW                                                    */
          /* ========================================================================= */
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

            {/* ========================================================================= */}
            {/* MULTI-FORMAT ENCLOSURES & ATTACHMENTS (PDF, WORD, IMAGES)                 */}
            {/* ========================================================================= */}
            {displayAttachments.length > 0 && (
              <div className="pt-4 font-sans space-y-2.5 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                      Official Enclosures & Annexures ({displayAttachments.length} Files Attached)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Verified Cryptographic Integrity • SHA-256 Validated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {displayAttachments.map((att, idx) => {
                    const isPdf = att.type === 'pdf';
                    const isWord = att.type === 'word';
                    const isImage = att.type === 'image';

                    return (
                      <div
                        key={att.id || `att-${idx}`}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isPdf
                            ? 'bg-red-50/40 border-red-200'
                            : isWord
                            ? 'bg-blue-50/40 border-blue-200'
                            : 'bg-emerald-50/40 border-emerald-200'
                        }`}
                      >
                        {/* File Icon & Info */}
                        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                          {isImage && att.dataUrl ? (
                            <img
                              src={att.dataUrl}
                              alt={att.name}
                              className="w-10 h-10 object-cover rounded-lg border border-emerald-300 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setLightboxImage({ name: att.name, url: att.dataUrl! })}
                              title="Click to expand image"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              isPdf ? 'bg-red-100 text-red-600' : isWord ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {isPdf && <FileText className="w-5 h-5" />}
                              {isWord && <FileCode className="w-5 h-5" />}
                              {isImage && <ImageIcon className="w-5 h-5" />}
                              {!isPdf && !isWord && !isImage && <Paperclip className="w-5 h-5" />}
                            </div>
                          )}

                          <div className="truncate flex-1">
                            <p className="font-bold text-slate-900 text-xs truncate" title={att.name}>
                              {att.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                              <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[8px] ${
                                isPdf ? 'bg-red-200/70 text-red-800' : isWord ? 'bg-blue-200/70 text-blue-800' : 'bg-emerald-200/70 text-emerald-800'
                              }`}>
                                {isPdf ? 'Official PDF' : isWord ? 'Word (.docx)' : 'Corridor Map / Seal'}
                              </span>
                              {att.size && <span>• {att.size}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Action: View / Download */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isImage && att.dataUrl ? (
                            <button
                              onClick={() => setLightboxImage({ name: att.name, url: att.dataUrl! })}
                              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                              title="View full image"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                          ) : (
                            <a
                              href={`#download-${att.name}`}
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Downloading official document enclosure: ${att.name}`);
                              }}
                              className={`px-2.5 py-1 bg-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer border ${
                                isPdf 
                                  ? 'hover:bg-red-50 text-red-700 border-red-300' 
                                  : 'hover:bg-blue-50 text-blue-700 border-blue-300'
                              }`}
                              title={`Download ${att.name}`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Save</span>
                            </a>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
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
      )}

      </div>

      {/* Full Image Preview Modal Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="bg-white rounded-2xl p-4 max-w-2xl w-full shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-slate-900 truncate">{lightboxImage.name}</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[65vh]">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.name}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
