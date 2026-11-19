'use client';

import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Mail, 
  MessageCircle, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck,
  Send,
  Calendar,
  Phone,
  FileText
} from 'lucide-react';
import { 
  EXACT_CATALOGUE_PDF, 
  NUNES_OFFICIAL_CONTACTS 
} from '@/lib/data/circularV2Constants';
import { CircularV2Attachment } from '@/types/circular';
import { 
  generateExecutiveTransportHtml, 
  generateStructuredTransportText, 
  copyStyledHtmlToClipboard,
  OFFICIAL_CATALOGUE_FILENAME
} from '@/lib/transportEmailTemplates';

interface EmailWhatsAppPreviewSectionProps {
  subject: string;
  bodyText: string;
  targetSchoolName?: string;
  targetPrincipal?: string;
  onOpenPdfModal: () => void;
  onLaunchGmailWeb: () => void;
  activeAttachment?: CircularV2Attachment;
}

export const EmailWhatsAppPreviewSection: React.FC<EmailWhatsAppPreviewSectionProps> = ({
  subject,
  bodyText,
  targetSchoolName = 'Stanes Anglo Indian Higher Secondary School',
  targetPrincipal = 'The Principal / Administrative Officer / Transport Department',
  onOpenPdfModal,
  onLaunchGmailWeb,
  activeAttachment = EXACT_CATALOGUE_PDF
}) => {
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const personalizedBody = bodyText
    .replace(/{{School_Name}}|\[School Name\]/g, targetSchoolName)
    .replace(/{{Principal_Name}}|\[Principal Name\]/g, targetPrincipal);

  // Generate V3.0 table-based HTML
  const emailHtml = generateExecutiveTransportHtml({
    circularTitle: subject,
    companyName: targetSchoolName,
    recipientName: targetSchoolName,
    recipientDesignation: targetPrincipal,
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    bodyText: personalizedBody,
    attachmentName: activeAttachment?.filename || OFFICIAL_CATALOGUE_FILENAME
  });

  const structuredText = generateStructuredTransportText({
    circularTitle: subject,
    companyName: targetSchoolName,
    recipientDesignation: targetPrincipal,
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    bodyText: personalizedBody,
    attachmentName: activeAttachment?.filename || OFFICIAL_CATALOGUE_FILENAME
  });

  const handleCopyFormattedText = async () => {
    await copyStyledHtmlToClipboard(emailHtml, structuredText);
    setCopiedNotice('💎 Executive Email Template copied! Paste (Ctrl+V) directly into Gmail compose.');
    setTimeout(() => setCopiedNotice(null), 4000);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(personalizedBody);
    setCopiedNotice('WhatsApp formatted message copied to clipboard!');
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Control Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
        
        {/* Channel Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setChannel('email')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              channel === 'email' ? 'bg-[#087EC1] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Premium Email V3.0</span>
          </button>

          <button
            onClick={() => setChannel('whatsapp')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Business Preview</span>
          </button>
        </div>

        {/* Viewport Device Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setDevice('desktop')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                device === 'desktop' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (660px)</span>
            </button>

            <button
              onClick={() => setDevice('mobile')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                device === 'mobile' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>

          {/* PDF Viewer Action */}
          <button
            onClick={onOpenPdfModal}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Inspect the exact 16-page catalogue PDF attachment"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>16-Page PDF</span>
          </button>

          <button
            onClick={channel === 'email' ? handleCopyFormattedText : handleCopyWhatsApp}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedNotice ? 'Copied!' : 'Copy UI (Ctrl+V)'}</span>
          </button>

          {channel === 'email' && (
            <button
              onClick={onLaunchGmailWeb}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open in Gmail</span>
            </button>
          )}
        </div>
      </div>

      {copiedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Preview Canvas Container */}
      <div className="p-4 sm:p-8 bg-slate-900/90 rounded-3xl flex justify-center items-start overflow-y-auto">
        <div
          className="transition-all duration-300 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-700"
          style={{ width: device === 'desktop' ? '680px' : '375px' }}
        >
          {channel === 'email' ? (
            /* =============================================================== */
            /* PREMIUM EMAIL V3.0 IFRAME PREVIEW                               */
            /* =============================================================== */
            <div className="w-full">
              <iframe
                title="Premium Email V3.0 Preview"
                srcDoc={emailHtml}
                className="w-full border-0"
                style={{ height: '740px' }}
              />
            </div>
          ) : (
            /* =============================================================== */
            /* WHATSAPP BUSINESS BUBBLE PREVIEW                                */
            /* =============================================================== */
            <div className="bg-[#e5ddd5] p-4 text-xs font-sans min-h-[500px]">
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3 max-w-[92%] ml-auto border border-emerald-100">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NUNES INSTRUMENTATION (VERIFIED BUSINESS)</span>
                </div>

                {/* PDF Header Attachment in WhatsApp */}
                <div 
                  onClick={onOpenPdfModal}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-bold text-slate-800 text-[11px] truncate">
                      {EXACT_CATALOGUE_PDF.filename}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">16p • 5.16 MB</span>
                </div>

                <div className="text-slate-800 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {personalizedBody}
                </div>

                {/* WhatsApp Quick Reply Buttons */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Quick Interactive Replies:</div>
                  <div className="grid grid-cols-1 gap-1">
                    <button className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg text-center border border-emerald-200">
                      📄 Request Formal Quotation
                    </button>
                    <button className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-[11px] rounded-lg text-center border border-sky-200">
                      🏫 Schedule On-Campus Demonstration
                    </button>
                    <button className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg text-center border border-slate-200">
                      🚫 Reply "Unsubscribe"
                    </button>
                  </div>
                </div>

                <div className="text-right text-[9px] text-slate-400 font-mono">
                  11:42 AM • Delivered
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
