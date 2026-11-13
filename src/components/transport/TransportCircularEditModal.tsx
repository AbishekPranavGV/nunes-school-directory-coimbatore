'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Send, 
  FileText, 
  ShieldCheck, 
  Paperclip, 
  Users, 
  Tag, 
  Building2,
  Sparkles
} from 'lucide-react';
import { TransportCircular } from '@/types/transport';

interface TransportCircularEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  circular: TransportCircular | null;
  onSaveSuccess: (circular: TransportCircular) => void;
}

const CATEGORIES = [
  'Fleet Safety & RTO Mandate',
  'Speed Governor Compliance',
  'Freight Corridor & Toll Revision',
  'Pollution & Fitness Certification',
  'Bulk Petroleum Safety Protocol',
  'Driver Welfare & Highway Rest Stop Advisory',
  'General Technical Notice'
];

const TARGET_AUDIENCES = [
  'All Registered Transport Fleets (Statewide)',
  'Omni Bus Operators Only (TOBOA)',
  'Heavy Lorry & Container Fleet (SLOF)',
  'Bulk LPG & Chemical Petroleum Tankers',
  'Coimbatore, Salem & Namakkal Western Hubs',
  'Chennai Port Container Haulers'
];

export const TransportCircularEditModal: React.FC<TransportCircularEditModalProps> = ({
  isOpen,
  onClose,
  circular,
  onSaveSuccess
}) => {
  const [title, setTitle] = useState('');
  const [refNo, setRefNo] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [targetAudience, setTargetAudience] = useState(TARGET_AUDIENCES[0]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [signatoryName, setSignatoryName] = useState('Nunes Instruments Fleet Coordinator');
  const [signatoryTitle, setSignatoryTitle] = useState('Chief Logistics Liaison Officer');
  const [issuingAuthority, setIssuingAuthority] = useState('Nunes Instruments — Tamil Nadu Transport Directorate');
  const [recipientCount, setRecipientCount] = useState(340);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (circular) {
      setTitle(circular.title || '');
      setRefNo(circular.ref_no || '');
      setCategory(circular.category || CATEGORIES[0]);
      setTargetAudience(circular.target_audience || TARGET_AUDIENCES[0]);
      setSubject(circular.subject || '');
      setBody(circular.body || '');
      setAttachmentName(circular.attachment_name || '');
      setSignatoryName(circular.signatory_name || 'Nunes Instruments Fleet Coordinator');
      setSignatoryTitle(circular.signatory_title || 'Chief Logistics Liaison Officer');
      setIssuingAuthority(circular.issuing_authority || 'Nunes Instruments — Tamil Nadu Transport Directorate');
      setRecipientCount(circular.recipient_count || 340);
    } else {
      // New circular defaults
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100 + Math.random() * 900);
      setTitle('RTO Vehicle Tracking & Speed Limiter Calibration Notice');
      setRefNo(`NUNES/TR/${year}/${randomNum}`);
      setCategory(CATEGORIES[0]);
      setTargetAudience(TARGET_AUDIENCES[0]);
      setSubject('Mandatory Bi-Annual Calibration of AIS 140 GPS & Speed Limiters');
      setBody(`Dear Transport Fleet Proprietor & Operations Head,

In accordance with Tamil Nadu Transport Commissionerate guidelines and Ministry of Road Transport and Highways (MoRTH) circulars, all commercial stage carriages and heavy multi-axle freight carriers must complete bi-annual certification of AIS-140 GPS tracking devices and emergency panic buttons before the upcoming fitness certificate (FC) inspection cycle.

Nunes Instruments provides NABL-accredited diagnostic calibration, digital tachograph servicing, and speed limiter testing at all major Tamil Nadu transport hubs (Coimbatore, Namakkal, Sankagiri, Salem, Chennai Koyambedu, and Madurai).

Please ensure your depot managers schedule calibration for scheduled fleets prior to the regional RTO deadline.

For express depot-level calibration slots or certificate re-issuance, please contact our 24/7 Logistics Liaison Desk.`);
      setAttachmentName('AIS140_Calibration_Form_TN.pdf');
      setSignatoryName('Er. K. R. Senthil Kumar, B.E., M.I.E.');
      setSignatoryTitle('Director of Technical Services & Logistics Standards');
      setIssuingAuthority('Nunes Instruments — Precision Fleet Metrology Cell');
      setRecipientCount(480);
    }
  }, [circular, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (sendNow: boolean) => {
    if (!title.trim() || !subject.trim() || !body.trim()) {
      alert('Please fill in Title, Subject, and Body content.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title,
        ref_no: refNo,
        category,
        target_audience: targetAudience,
        subject,
        body,
        attachment_name: attachmentName.trim() || undefined,
        signatory_name: signatoryName,
        signatory_title: signatoryTitle,
        issuing_authority: issuingAuthority,
        recipient_count: Number(recipientCount) || 340,
        send_now: sendNow
      };

      if (circular && circular.id) {
        payload.action = 'update_circular';
        payload.id = circular.id;
        if (sendNow) payload.status = 'Sent';
      } else {
        payload.action = 'create_circular';
      }

      const res = await fetch('/api/transport/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.circular) {
        onSaveSuccess(data.circular);
        onClose();
      } else {
        alert(data.error || 'Failed to save circular');
      }
    } catch (err: any) {
      alert(`Error saving circular: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {circular ? 'Edit Official Circular & Notice' : 'Draft New Official Transport Circular'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Letterhead Dispatch • Email & WhatsApp Circular Workflow
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Row 1: Title & Reference No */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <span>Circular Title</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AIS 140 GPS & Speed Limiter Bi-Annual Verification"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <span>Reference Number</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                placeholder="NUNES/TR/2026/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Row 2: Category & Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Notice Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Target Operator Audience</span>
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {TARGET_AUDIENCES.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Subject */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1">
              <span>Subject (Appears in Official Letterhead & Email Header)</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Official Subject Line..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Row 4: Body */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Official Directive Text / Circular Body</label>
              <span className="text-[11px] text-slate-400">Will be formatted onto official letterhead</span>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter full text of circular..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Row 5: Attachment & Recipient Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>Attachment / Enclosure PDF</span>
              </label>
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="e.g. Schedule_Annexure_2026.pdf"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Recipients Count</label>
              <input
                type="number"
                value={recipientCount}
                onChange={(e) => setRecipientCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Row 6: Signatory & Issuing Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Signatory Name</label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Signatory Title</label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Issuing Department</label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-amber-600/20 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Circular to Fleets'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
