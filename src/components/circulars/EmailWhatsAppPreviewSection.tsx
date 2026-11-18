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
  NUNES_OFFICIAL_CONTACTS, 
  INTERACTIVE_TOUCH_REPLY_BUTTONS 
} from '@/lib/data/circularV2Constants';

interface EmailWhatsAppPreviewSectionProps {
  subject: string;
  bodyText: string;
  targetSchoolName?: string;
  targetPrincipal?: string;
  onOpenPdfModal: () => void;
  onLaunchGmailWeb: () => void;
}

export const EmailWhatsAppPreviewSection: React.FC<EmailWhatsAppPreviewSectionProps> = ({
  subject,
  bodyText,
  targetSchoolName = 'Stanes Anglo Indian Higher Secondary School',
  targetPrincipal = 'The Principal / Administrative Officer',
  onOpenPdfModal,
  onLaunchGmailWeb
}) => {
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const personalizedBody = bodyText
    .replace(/{{School_Name}}|\[School Name\]/g, targetSchoolName)
    .replace(/{{Principal_Name}}|\[Principal Name\]/g, targetPrincipal);

  const handleCopyFormattedText = () => {
    navigator.clipboard.writeText(`SUBJECT: ${subject}\n\n${personalizedBody}`);
    setCopiedNotice('Email text copied to clipboard!');
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(personalizedBody);
    setCopiedNotice('WhatsApp formatted message copied to clipboard!');
    setTimeout(() => setCopiedNotice(null), 2500);
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
              channel === 'email' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Executive Email Preview</span>
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
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setDevice('desktop')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                device === 'desktop' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (680px)</span>
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

          <button
            onClick={channel === 'email' ? handleCopyFormattedText : handleCopyWhatsApp}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedNotice ? 'Copied!' : 'Copy'}</span>
          </button>

          {channel === 'email' && (
            <button
              onClick={onLaunchGmailWeb}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-rose-600" />
              <span>Open in Gmail Web</span>
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
            /* EMAIL CANVAS WITH EXECUTIVE STYLING & TOUCH REPLY BUTTONS       */
            /* =============================================================== */
            <div className="text-slate-900 font-sans text-xs">
              
              {/* 1. Header Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 p-6 text-white text-center space-y-2 border-b border-sky-800/40">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/10 text-sky-300 border border-white/20 uppercase tracking-wider">
                  ★ NUNES INSTRUMENTATION • PRECISION SAFETY SOLUTIONS
                </span>
                <h1 className="text-base sm:text-lg font-black text-white leading-snug">
                  {subject}
                </h1>
                <p className="text-[11px] text-sky-200 max-w-md mx-auto">
                  Accredited 14-Model Alcohol Breath Analyser Range for Institutions, Workplaces & Transport Fleets
                </p>
                <div className="pt-2 border-t border-white/15 text-[10px] text-slate-300 flex items-center justify-center gap-3">
                  <span>From: <strong>{NUNES_OFFICIAL_CONTACTS.primaryEmail}</strong></span>
                  <span>•</span>
                  <span>Coimbatore, Tamil Nadu</span>
                </div>
              </div>

              {/* 2. Recipient Plaque */}
              <div className="p-4 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">TO RECIPIENT INSTITUTION:</span>
                  <div className="font-extrabold text-sm text-slate-900">{targetSchoolName}</div>
                  <div className="text-[11px] text-slate-500">Attention: {targetPrincipal}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Verified Contact
                </span>
              </div>

              {/* 3. Email Body Content */}
              <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                {personalizedBody}
              </div>

              {/* 4. INTERACTIVE TOUCH REPLY BUTTONS (User's Critical Requirement!) */}
              <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="text-center">
                  <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                    ⚡ 1-TOUCH INSTANT REPLY ACTIONS FOR RECEIVER:
                  </span>
                  <p className="text-[11px] text-slate-500">Click below to respond instantly via WhatsApp or Email</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/918940944000?text=${encodeURIComponent(`Hello NUNES Instrumentation, we (${targetSchoolName}) would like to request an official quotation for your 14-Model Breath Analyser series.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Request Official Quotation</span>
                  </a>

                  <a
                    href={`https://wa.me/918940944000?text=${encodeURIComponent(`Hello NUNES Instrumentation, we (${targetSchoolName}) would like to schedule a free on-campus demonstration of your breath analysers.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Free On-Campus Demo</span>
                  </a>

                  <button
                    type="button"
                    onClick={onOpenPdfModal}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open 16-Page Catalogue PDF</span>
                  </button>

                  <a
                    href={`https://wa.me/918940944000?text=${encodeURIComponent(`Hello NUNES Instrumentation, technical inquiry regarding ${subject}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Helpline (89409 44000)</span>
                  </a>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-slate-500">
                  <a href="tel:+918940944000" className="hover:text-sky-600 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Call 89409 44000</span>
                  </a>
                  <span>•</span>
                  <a href="mailto:info@nunesinstrumentation.com?subject=Unsubscribe" className="text-slate-400 hover:text-slate-700 underline">
                    Unsubscribe
                  </a>
                </div>
              </div>

              {/* 5. Attached Catalogue Box */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{EXACT_CATALOGUE_PDF.filename}</p>
                    <p className="text-[10px] text-slate-500">16 Pages • 5.16 MB • SHA256 Verified</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenPdfModal}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  Preview PDF
                </button>
              </div>

              {/* 6. Footer */}
              <div className="p-4 bg-slate-900 text-slate-400 text-center text-[10px] space-y-1">
                <div>NUNES INSTRUMENTATION • COIMBATORE, TAMIL NADU • SOUTH INDIA</div>
                <div>Phone: 8940944000 / 8940933000 • Email: info@nunesinstrumentation.com</div>
                <div>© 2026 NUNES Instrumentation. Reply "Unsubscribe" to opt out.</div>
              </div>

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
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">16p • 5.2MB</span>
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
