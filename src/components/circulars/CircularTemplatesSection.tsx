'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  ShieldCheck, 
  Eye, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { CircularV2Template, CircularSectionTab } from '@/types/circular';
import { PREBUILT_CIRCULAR_TEMPLATES } from '@/lib/data/circularV2Constants';

interface CircularTemplatesSectionProps {
  onSelectTemplate: (template: CircularV2Template) => void;
  onNavigateTab: (tab: CircularSectionTab) => void;
  onOpenPdfModal: () => void;
}

export const CircularTemplatesSection: React.FC<CircularTemplatesSectionProps> = ({
  onSelectTemplate,
  onNavigateTab,
  onOpenPdfModal
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl_breath_analyser_intro');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTemplate = PREBUILT_CIRCULAR_TEMPLATES.find(t => t.id === selectedTemplateId) || PREBUILT_CIRCULAR_TEMPLATES[0];

  const handleCopyBody = (tpl: CircularV2Template) => {
    navigator.clipboard.writeText(tpl.body);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUseTemplate = (tpl: CircularV2Template) => {
    onSelectTemplate(tpl);
    onNavigateTab('create');
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black">
              ★
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Institutional Circular Template Library (6 Verified Campaigns)
            </h2>
          </div>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
            Prebuilt, legally vetted institutional outreach circulars configured with exact NUNES Instrumentation branding, 14-model specifications, and statutory compliance mandates.
          </p>
        </div>

        <button
          onClick={onOpenPdfModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Inspect 16-Page Catalogue PDF</span>
        </button>
      </div>

      {/* Grid of 6 Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PREBUILT_CIRCULAR_TEMPLATES.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          const isDefault = Boolean(tpl.isDefault);

          return (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplateId(tpl.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'bg-sky-50/60 border-sky-400 shadow-md ring-2 ring-sky-400/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isDefault 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tpl.badge}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Ref: {tpl.referenceNumber}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {tpl.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5">
                  Audience: <strong className="text-slate-700">{tpl.targetAudience}</strong>
                </p>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-sans">
                  {tpl.body}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyBody(tpl);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedId === tpl.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedId === tpl.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(tpl);
                  }}
                  className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer hover:scale-102"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Active Template Preview Panel */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                {activeTemplate.name}
              </h3>
              {activeTemplate.isDefault && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
                  Default Official Campaign
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject: <strong className="text-slate-800">{activeTemplate.subject}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUseTemplate(activeTemplate)}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-102"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Load Into Circular Composer</span>
            </button>
          </div>
        </div>

        {/* Full Text Display */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans max-h-96 overflow-y-auto">
          {activeTemplate.body}
        </div>

        {/* Attachment Card */}
        <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{activeTemplate.attachmentName}</p>
              <p className="text-[11px] text-slate-500">16 Pages • 5.16 MB • 14 Models & QR Codes</p>
            </div>
          </div>

          <button
            onClick={onOpenPdfModal}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-sky-800 border border-sky-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Preview Document
          </button>
        </div>
      </div>

    </div>
  );
};
