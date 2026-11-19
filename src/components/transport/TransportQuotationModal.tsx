'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Send, MessageCircle, Mail, Building2, User, Phone, MapPin, FileText } from 'lucide-react';
import { GMAIL_SENDER } from '@/lib/data/circularConstants';

interface TransportQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInstitutionName?: string;
  defaultContactPerson?: string;
  defaultDistrict?: string;
  defaultState?: string;
}

export const TransportQuotationModal: React.FC<TransportQuotationModalProps> = ({
  isOpen,
  onClose,
  defaultInstitutionName = 'Stanes Anglo Indian Higher Secondary School',
  defaultContactPerson = 'The Principal / Transport Department',
  defaultDistrict = 'Coimbatore',
  defaultState = 'Tamil Nadu'
}) => {
  const [institutionName, setInstitutionName] = useState(defaultInstitutionName);
  const [contactPerson, setContactPerson] = useState(defaultContactPerson);
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [district, setDistrict] = useState(defaultDistrict);
  const [selectedModels, setSelectedModels] = useState<string[]>([
    'Rapid Screening Non-Contact Baton',
    'Handheld Fuel-Cell Analyser (AT-9000)'
  ]);
  const [requestType, setRequestType] = useState<'quotation' | 'demo' | 'both'>('both');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const modelOptions = [
    'Rapid Screening Non-Contact Baton',
    'Handheld Fuel-Cell Digital Analyser (AT-9000 / A50)',
    'Evidential Analyser with Thermal Printer & Built-in Camera',
    'Multi-Gate Campus Entry System with Slip Records'
  ];

  const handleToggleModel = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const handleSendViaEmail = () => {
    const subject = encodeURIComponent(`Quotation & Demonstration Request: Breath Analysers - ${institutionName}`);
    const body = encodeURIComponent(
`Respected NUNES Instrumentation Sales Team,

We would like to request an official commercial quotation and schedule a product demonstration for the following requirements:

Request Type: ${requestType === 'both' ? 'Quotation + On-Campus Demonstration' : requestType === 'demo' ? 'On-Campus Demonstration' : 'Official Commercial Quotation'}
Institution: ${institutionName}
Attention: ${contactPerson}
Phone: ${contactNumber || 'As provided in directory'}
Email: ${emailAddress || 'As provided in directory'}
Location: ${district}, ${defaultState}

Selected Models of Interest:
${selectedModels.map(m => `• ${m}`).join('\n')}

Additional Requirements / Notes:
${message || 'Please provide pricing schedule, calibration certification terms, and delivery timeline.'}

Looking forward to your official quotation.

Warm regards,
${contactPerson}
${institutionName}`
    );

    window.open(`mailto:info@nunesinstrumentation.com?cc=${GMAIL_SENDER.email}&subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  const handleSendViaWhatsApp = () => {
    const text = encodeURIComponent(
`*NUNES INSTRUMENTATION — QUOTATION / DEMO REQUEST*
Institution: ${institutionName}
Attention: ${contactPerson}
Phone: ${contactNumber}
Location: ${district}, ${defaultState}
Type: ${requestType.toUpperCase()}

Models Required:
${selectedModels.map(m => `• ${m}`).join('\n')}

Notes: ${message || 'Please share product specifications & quotation.'}`
    );

    window.open(`https://wa.me/918940944000?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-900 to-[#092C55] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Request Quotation / Demonstration</h2>
              <p className="text-xs text-sky-200">Official NUNES Instrumentation Institutional Procurement Desk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Enquiry Initiated Successfully</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your request details have been formatted for our sales desk at <strong>info@nunesinstrumentation.com</strong> and WhatsApp hotline.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-[#087EC1] text-white rounded-xl text-xs font-bold hover:bg-[#076ba6] cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Institution Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#087EC1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Attention / Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#087EC1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">District / Hub</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#087EC1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 Mobile or Landline"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#087EC1]"
                  />
                </div>
              </div>

              {/* Request Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Enquiry Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'both', label: 'Quotation + Demo' },
                    { id: 'quotation', label: 'Commercial Quotation' },
                    { id: 'demo', label: 'On-Campus Demo' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRequestType(t.id as any)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                        requestType === t.id 
                          ? 'bg-sky-50 border-[#087EC1] text-[#092C55]' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Select Breath Analyser Models</label>
                <div className="space-y-1.5">
                  {modelOptions.map(model => {
                    const isChecked = selectedModels.includes(model);
                    return (
                      <label
                        key={model}
                        onClick={() => handleToggleModel(model)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                          isChecked ? 'bg-sky-50/70 border-[#087EC1]/50 text-slate-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#087EC1] focus:ring-[#087EC1]"
                        />
                        <span>{model}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Specific Requirements / Message</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify campus size, number of buses/drivers, or desired demonstration dates..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#087EC1]"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSendViaEmail}
                  className="flex-1 py-2.5 px-4 bg-[#087EC1] hover:bg-[#076ba6] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Request via Email</span>
                </button>
                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp (+91 8940944000)</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
