'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Paperclip, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Sparkles,
  ArrowRight,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { CircularV2Attachment } from '@/types/circular';

interface GmailAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: CircularV2Attachment;
  subject: string;
  bodyText: string;
  onReopenGmail: () => void;
}

export const GmailAttachmentModal: React.FC<GmailAttachmentModalProps> = ({
  isOpen,
  onClose,
  attachment,
  subject,
  bodyText,
  onReopenGmail
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.urlPath;
    link.download = attachment.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(`SUBJECT: ${subject}\n\n${bodyText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-md shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Gmail Attachment &amp; Outreach Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Ready to Send
                </span>
              </div>
              <p className="text-[11px] text-sky-200 mt-0.5">
                Physical PDF attachment &amp; template synchronization protocol
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Status Alert Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <div className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <h4 className="font-extrabold text-emerald-950">
                PDF File Downloaded &amp; Gmail Compose Launched!
              </h4>
              <p className="text-emerald-800 mt-1 leading-relaxed">
                The attached PDF has been sent to your device&apos;s Downloads folder. Your Gmail compose window is opened with the full template, subject line, and 9 internal BCC coordinators pre-filled.
              </p>
            </div>
          </div>

          {/* Active Attached PDF Spec Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 rounded-xl bg-red-100 border border-red-200 flex flex-col items-center justify-center text-red-700 font-mono text-[10px] font-black shrink-0">
                <FileText className="w-5 h-5 text-red-600" />
                <span>PDF</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate max-w-xs sm:max-w-md">
                    {attachment.filename}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-100 text-sky-800 font-mono">
                    {attachment.pageCount} Pages
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                    {attachment.sizeFormatted}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  SHA256: {attachment.sha256Checksum ? attachment.sha256Checksum.slice(0, 20) : 'Verified'}...
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer hover:scale-102 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Re-Download File</span>
            </button>
          </div>

          {/* 3 Step Instructions with Visual Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-sky-600" />
              <span>How to Attach the File in Gmail (2-Second Step):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Step 1 */}
              <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-sky-900">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px]">1</span>
                  <span>Find in Downloads</span>
                </div>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  The file <strong className="font-mono text-slate-900">{attachment.filename}</strong> is now at the bottom of your browser or in your <code className="bg-sky-200/50 px-1 rounded">Downloads</code> folder.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-indigo-900">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">2</span>
                  <span>Click Paperclip 📎</span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  In Gmail, click the <strong>Paperclip (Attach files)</strong> icon at the bottom and select the file, or simply <strong>drag and drop</strong> it directly into the compose window.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-emerald-900">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">3</span>
                  <span>Press Send 🚀</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  The email will be delivered to the recipient with both the <strong>physical PDF attachment</strong> and the <strong>interactive template</strong>!
                </p>
              </div>

            </div>
          </div>

          {/* Quick Clipboard Backup */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">Need to copy the email template again?</span>
              <span className="text-[11px] text-slate-500">Includes subject line, 14 models, direct cloud links, and touch-reply buttons.</span>
            </div>
            <button
              type="button"
              onClick={handleCopyBody}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Template Copied!' : 'Copy Template Body'}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReopenGmail}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer hover:scale-102 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Re-Open Gmail Window</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
