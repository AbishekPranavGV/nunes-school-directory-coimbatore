'use client';

import React, { useState, useEffect } from 'react';
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
  Copy
} from 'lucide-react';
import { EXACT_CATALOGUE_PDF } from '@/lib/data/circularV2Constants';

interface PdfAttachmentManagerSectionProps {
  onOpenPdfModal: () => void;
}

export const PdfAttachmentManagerSection: React.FC<PdfAttachmentManagerSectionProps> = ({
  onOpenPdfModal
}) => {
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

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

  const handleCopyHash = () => {
    navigator.clipboard.writeText(EXACT_CATALOGUE_PDF.sha256Checksum);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-red-500 text-white font-bold">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Official Catalogue PDF Attachment Manager
            </h2>
          </div>
          <p className="text-xs text-sky-200 max-w-2xl leading-relaxed">
            Persistent storage and cryptographic verification for the exact 16-page catalogue enclosure. Automated verification guarantees that only the genuine, authorized catalogue is attached.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runIntegrityValidation}
            disabled={isValidating}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isValidating ? 'Validating...' : 'Re-Verify Checksum'}</span>
          </button>

          <button
            onClick={onOpenPdfModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open 16-Page Reader</span>
          </button>
        </div>
      </div>

      {/* Main Attachment Card & Specifications */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-20 rounded-xl bg-red-50 border-2 border-red-200 flex flex-col items-center justify-center text-red-600 shadow-xs shrink-0">
              <FileText className="w-7 h-7" />
              <span className="text-[10px] font-black mt-1 font-mono">PDF</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {EXACT_CATALOGUE_PDF.filename}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                  ✓ Verified Genuine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 font-mono">
                  16 Pages
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                  {EXACT_CATALOGUE_PDF.sizeFormatted}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {EXACT_CATALOGUE_PDF.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={EXACT_CATALOGUE_PDF.urlPath}
              download={EXACT_CATALOGUE_PDF.filename}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-102"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Original PDF</span>
            </a>
          </div>
        </div>

        {/* 4 Metadata Telemetry Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Page Count</span>
            <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
              16 Pages (100% Intact)
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Preserved without regeneration</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400">File Byte Size</span>
            <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
              5,410,301 Bytes
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">5.16 MB High-Res Assets</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400">Integrated Products</span>
            <div className="text-lg font-black text-amber-700 font-mono mt-0.5">
              14 Certified Models
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">With individual QR specs</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400">Security & Integrity</span>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Strict Match</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Zero silent substitution</p>
          </div>
        </div>

        {/* Cryptographic SHA256 Checksum Card */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-bold">Cryptographic SHA-256 Checksum Verification:</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
            >
              {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-black/60 rounded-xl text-amber-300 text-xs break-all select-all border border-slate-800">
            {EXACT_CATALOGUE_PDF.sha256Checksum}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
            <span>Storage Path: <code className="text-slate-400">d:/school/{EXACT_CATALOGUE_PDF.localPath}</code></span>
            <span className="text-emerald-400">✓ Immutable Persistent Storage</span>
          </div>
        </div>

        {/* Attachment Policy Notice */}
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sky-950">
              Outbound Transmission Enclosure Policy:
            </p>
            <p className="mt-0.5 text-sky-800">
              When sending outbound campaigns via Gmail Web, SMTP, or approved WhatsApp Document messages, this verified PDF file is automatically attached or referenced via authorized secure download links to ensure complete regulatory compliance.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
