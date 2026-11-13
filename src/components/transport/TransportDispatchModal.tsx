'use client';

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageCircle, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink,
  Truck,
  Bus,
  Sparkles
} from 'lucide-react';
import { TransportRecord } from '@/types/transport';

interface TransportDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: TransportRecord | null;
}

const TEMPLATES = [
  {
    id: 'freight_quote',
    title: 'Freight Rate & Availability Inquiry',
    service: 'lorry',
    body: (op: TransportRecord) => 
      `Dear ${op.owner_name},\n\nGreetings from Nunes Instruments.\n\nWe require freight capacity details and trip tariff quotation for transport operations connecting your hub at ${op.city_hub}.\n\nCould you please share your vehicle availability and current rates for our upcoming consignments?\n\nCompany: ${op.company_name}\nManaging Director: ${op.owner_name}\n\nLooking forward to your prompt response.`
  },
  {
    id: 'bus_charter',
    title: 'Omni Bus / Staff Shuttle Charter',
    service: 'bus',
    body: (op: TransportRecord) => 
      `Respected ${op.owner_name},\n\nGreetings from Nunes Instruments.\n\nWe are looking to charter private bus transport for our corporate & institutional personnel connecting Coimbatore and regional hubs.\n\nKindly share your fleet availability, seating capacities, and contract carriage tariff for ${op.company_name}.\n\nBest regards,\nNunes Instruments Fleet Coordinator`
  },
  {
    id: 'vendor_partner',
    title: 'Vendor Onboarding & Regular Logistics Contract',
    service: 'both',
    body: (op: TransportRecord) => 
      `Hello ${op.owner_name},\n\nWe are updating our authoritative vendor directory at Nunes Instruments for industrial goods transport and passenger charter in Tamil Nadu.\n\nWe would like to register ${op.company_name} (GSTIN: ${op.gstin || 'Active'}) as our preferred logistics partner for upcoming tender allocations.\n\nPlease confirm your primary dispatch contact number and representative email.`
  }
];

export const TransportDispatchModal: React.FC<TransportDispatchModalProps> = ({
  isOpen,
  onClose,
  operator
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('freight_quote');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !operator) return null;

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const messageText = customMessage || currentTemplate.body(operator);

  const cleanPhone = operator.contact_number.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = operator.whatsapp_number.replace(/[^0-9]/g, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Direct WhatsApp & Email Dispatcher
              </h2>
              <p className="text-xs text-slate-500">
                Instantly dispatch verified inquiry templates to {operator.owner_name} ({operator.company_name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          
          {/* Operator Banner */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 text-sm">{operator.company_name}</p>
              <p className="text-slate-500 text-xs">Owner: <strong className="text-slate-800">{operator.owner_name}</strong> ({operator.owner_designation})</p>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 font-bold font-mono text-xs">+{operator.whatsapp_number}</span>
              <p className="text-slate-400 text-[10px]">{operator.email}</p>
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Select Communication Template:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplateId(tpl.id);
                    setCustomMessage('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="truncate font-semibold">{tpl.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800">Inquiry Message Content:</label>
              <button
                onClick={handleCopy}
                className="text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              value={messageText}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            
            {/* Email Launcher */}
            {operator.email && (
              <a
                href={`mailto:${operator.email}?subject=Fleet Inquiry - ${operator.company_name}&body=${encodeURIComponent(messageText)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Send via Email</span>
              </a>
            )}

            {/* WhatsApp Launcher */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(messageText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all hover:scale-102"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Launch WhatsApp Chat</span>
            </a>

          </div>
        </div>

      </div>
    </div>
  );
};
