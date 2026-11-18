'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  RotateCcw, 
  Check, 
  FileCheck, 
  Copy,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { CircularV2Attachment } from '@/types/circular';
import { EXACT_CATALOGUE_PDF } from '@/lib/data/circularV2Constants';

interface PdfAttachmentManagerSectionProps {
  onOpenPdfModal: (pdfUrl?: string, title?: string) => void;
  activeAttachment?: CircularV2Attachment;
  onSelectAttachment?: (att: CircularV2Attachment) => void;
  attachmentsList?: CircularV2Attachment[];
  onRefreshAttachments?: () => void;
}

export const PdfAttachmentManagerSection: React.FC<PdfAttachmentManagerSectionProps> = ({
  onOpenPdfModal,
  activeAttachment = EXACT_CATALOGUE_PDF,
  onSelectAttachment,
  attachmentsList = [EXACT_CATALOGUE_PDF],
  onRefreshAttachments
}) => {
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runIntegrityValidation = async () => {
    try {
      setIsValidating(true);
      const res = await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate_attachment' })
      });
      const data = await res.json();
      setValidationResult(data);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    runIntegrityValidation();
  }, []);

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  // Handle Manual File Upload
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please upload a valid PDF document (.pdf format only).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadToast(`Uploading and validating ${file.name}...`);

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
              description: `Uploaded manually into PDF Attachment Manager on ${new Date().toLocaleDateString()}`
            })
          });

          const data = await res.json();
          if (data.success && data.attachment) {
            onRefreshAttachments?.();
            onSelectAttachment?.(data.attachment);
            setUploadToast(`✓ Custom PDF "${file.name}" uploaded, verified, and set as active attachment!`);
            setTimeout(() => setUploadToast(null), 4000);
          } else {
            alert(data.error || 'Failed to upload PDF file');
          }
        } catch (err: any) {
          alert(`Upload error: ${err.message}`);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(`Error reading file: ${err.message}`);
      setIsUploading(false);
    }
  };

  // Handle Deleting Custom PDF
  const handleDeletePdf = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the attachment repository?`)) {
      return;
    }

    try {
      const res = await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_pdf',
          id
        })
      });
      const data = await res.json();
      if (data.success) {
        onRefreshAttachments?.();
        if (activeAttachment.id === id) {
          onSelectAttachment?.(EXACT_CATALOGUE_PDF);
        }
        setUploadToast(`Removed "${name}" from repository.`);
        setTimeout(() => setUploadToast(null), 3000);
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleUploadFile}
      />

      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-red-500 text-white font-bold">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Official Catalogue &amp; PDF Attachment Manager
            </h2>
          </div>
          <p className="text-xs text-sky-200 max-w-2xl leading-relaxed">
            Upload, verify, and manage institutional PDF enclosures. Supports the default 16-page catalogue and any manually added brochures, directives, or rate cards.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102 disabled:opacity-50"
          >
            <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
            <span>{isUploading ? 'Uploading...' : '+ Upload Custom PDF'}</span>
          </button>

          <button
            type="button"
            onClick={runIntegrityValidation}
            disabled={isValidating}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isValidating ? 'Validating...' : 'Re-Verify Checksums'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
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

      {/* Manual Drag & Drop Quick Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="p-6 bg-sky-50/60 hover:bg-sky-50 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-3xl transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group shadow-2xs"
      >
        <div className="w-12 h-12 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
            Click or Drag &amp; Drop to Add Any PDF Manually
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional Brochures • Transport Directives • Price Contracts • Laboratory Manuals (PDF format up to 50 MB)
          </p>
        </div>
      </div>

      {/* Available Attachments Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Enclosure Repository ({attachmentsList.length} Document{attachmentsList.length === 1 ? '' : 's'})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Active for Circular Outreach: <strong className="text-emerald-700">{activeAttachment.filename}</strong>
          </span>
        </div>

        <div className="space-y-4">
          {attachmentsList.map((att) => {
            const isActive = activeAttachment.id === att.id;
            const isDefault = att.id === EXACT_CATALOGUE_PDF.id;

            return (
              <div 
                key={att.id}
                className={`p-5 bg-white rounded-3xl border transition-all shadow-xs space-y-4 ${
                  isActive 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-16 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-col items-center justify-center text-red-600 shadow-xs shrink-0 font-mono text-[9px] font-black">
                      <FileText className="w-6 h-6" />
                      <span>PDF</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {att.filename}
                        </h4>
                        
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                            ✓ Currently Active
                          </span>
                        )}

                        {isDefault ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 font-mono">
                            Original 14-Model Catalogue
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 font-mono">
                            Custom Upload
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 font-mono">
                          {att.pageCount} Pages
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                          {att.sizeFormatted}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        {att.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions for this attachment */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectAttachment?.(att);
                          setUploadToast(`Active attachment set to: "${att.filename}"`);
                          setTimeout(() => setUploadToast(null), 3000);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer hover:scale-102"
                      >
                        Set as Active
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenPdfModal(att.urlPath, att.filename)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Inspect PDF</span>
                    </button>

                    <a
                      href={att.urlPath}
                      download={att.filename}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>

                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => handleDeletePdf(att.id, att.filename)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Delete this custom PDF"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cryptographic Hash Bar */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="font-bold">SHA-256 Checksum:</span>
                    </div>
                    <button
                      onClick={() => handleCopyHash(att.sha256Checksum, att.id)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedHashId === att.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHashId === att.id ? 'Copied' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black/60 rounded-xl text-amber-300 text-[11px] break-all select-all border border-slate-800">
                    {att.sha256Checksum || 'Calculating...'}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Outbound Transmission Enclosure Policy */}
      <div className="p-5 bg-sky-50 border border-sky-200 rounded-3xl text-xs text-sky-900 leading-relaxed flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-sky-950">
            Outbound Attachment &amp; Gmail Synchronization Protocol:
          </p>
          <p className="mt-1 text-sky-800 leading-relaxed">
            When launching outreach campaigns in Gmail Web or SMTP dispatch, the active PDF is physically downloaded to your machine with pre-formatted 1-click attachment guidance. The email body automatically embeds the verified cloud download link and Google Drive mirror for recipient redundancy.
          </p>
        </div>
      </div>

    </div>
  );
};
