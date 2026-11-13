'use client';

import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Bus, 
  User, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Calendar, 
  ExternalLink,
  Copy,
  Check,
  Building,
  Route,
  FileText,
  Clock,
  Sparkles,
  Edit3,
  Building2
} from 'lucide-react';
import { TransportRecord } from '@/types/transport';

interface TransportDetailDrawerProps {
  operator: TransportRecord | null;
  onClose: () => void;
  onOpenDispatchModal?: (operator: TransportRecord) => void;
  onOpenEditModal?: (operator: TransportRecord) => void;
}

export const TransportDetailDrawer: React.FC<TransportDetailDrawerProps> = ({
  operator,
  onClose,
  onOpenDispatchModal,
  onOpenEditModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'routes' | 'branches' | 'compliance'>('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!operator) return null;

  const isBus = operator.service_type === 'bus';
  const cleanPhone = operator.contact_number.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = operator.whatsapp_number.replace(/[^0-9]/g, '');

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isBus ? 'bg-sky-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {isBus ? <Bus className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {operator.company_name}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{operator.verification_status}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{operator.category}</span>
                <span>•</span>
                <span>Est. {operator.established_year}</span>
                <span>•</span>
                <span className="text-amber-700 font-semibold">{operator.fleet_size}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenEditModal && (
              <button
                onClick={() => onOpenEditModal(operator)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Edit Company Details & Branches"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Edit Fleet</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 text-xs font-semibold bg-white overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Contact
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'branches'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Regional Branches</span>
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-900 text-[10px] font-bold">
              {operator.branches?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'fleet'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fleet & Technical Specs
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'routes'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Routes & Operating Hubs
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Permit & Compliance
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
          
          {/* TAB 1: OVERVIEW & CONTACT */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Owner / Managing Director Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-slate-50 border border-amber-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Key Management & Ownership
                </span>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {operator.owner_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{operator.owner_name}</p>
                      <p className="text-xs text-slate-600 font-medium">{operator.owner_designation}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold">
                    Decision Maker
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Callout Card */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Direct WhatsApp Connected</p>
                    <p className="text-xs text-emerald-800 font-mono mt-0.5">+{operator.whatsapp_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopy(operator.whatsapp_number, 'wa')}
                    className="p-2 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg transition-all"
                    title="Copy WhatsApp Number"
                  >
                    {copiedField === 'wa' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${operator.owner_name}, reaching out from Nunes Instruments regarding transport fleet operations for ${operator.company_name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-all hover:scale-102"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              {/* Contact Grid: Phone, Email, Secondary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Phone */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Phone className="w-3 h-3 text-sky-600" /> Primary Phone
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <a href={`tel:${cleanPhone}`} className="text-sm font-bold text-sky-700 hover:underline">
                      {operator.contact_number}
                    </a>
                    <button
                      onClick={() => handleCopy(operator.contact_number, 'phone')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Email / Gmail */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3 text-sky-600" /> Email / Gmail ID
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <a href={`mailto:${operator.email}`} className="text-xs font-bold text-sky-700 hover:underline truncate max-w-[190px]">
                      {operator.email}
                    </a>
                    <button
                      onClick={() => handleCopy(operator.email, 'email')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Physical Depot / Office Address */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" /> Headquarters / Main Depot Address
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {operator.address}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Hub: {operator.city_hub}</span>
                  <span>•</span>
                  <span>District: {operator.district}</span>
                  <span>•</span>
                  <span>PIN: {operator.pincode}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Operator Capabilities & Specialties
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {operator.specialties.map((spec, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium text-[11px]">
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: BRANCHES ACROSS TAMIL NADU */}
          {activeTab === 'branches' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" /> Regional Branch Offices & Depots
                  </h3>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {operator.branches?.length || 0} Depots in TN
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Regional booking counters, container drayage depots, and parcel transshipment terminals affiliated with {operator.company_name}.
                </p>

                {(!operator.branches || operator.branches.length === 0) ? (
                  <div className="p-6 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                    No branch offices registered yet. Use "Edit Fleet" above to register regional branches.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {operator.branches.map((b) => {
                      const cleanWhatsApp = b.whatsapp.replace(/[^0-9]/g, '');
                      const cleanPhone = b.phone.replace(/[^0-9+]/g, '');

                      return (
                        <div key={b.id} className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-xs">{b.branch_name}</h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                  {b.city}
                                </span>
                                {b.is_headquarters && (
                                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[9px] font-bold">
                                    HQ
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                                {b.facility_type}
                              </span>
                            </div>

                            <a
                              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${b.manager_name}, contacting ${b.branch_name} of ${operator.company_name}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </div>

                          <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1">
                            <p><strong className="text-slate-900">Manager:</strong> {b.manager_name}</p>
                            <p><strong className="text-slate-900">Address:</strong> {b.address}</p>
                            <p><strong className="text-slate-900">Direct Line:</strong> <a href={`tel:${cleanPhone}`} className="text-sky-700 hover:underline">{b.phone}</a></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FLEET & SPECS */}
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Vehicle Fleet Details</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Fleet Size</span>
                    <p className="text-base font-bold text-slate-900 mt-1">{operator.fleet_size}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Permit Class</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{operator.permit_type}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-700 block mb-2">Registered Vehicle Models & Chassis:</span>
                <div className="space-y-2">
                  {operator.vehicle_types.map((v, i) => (
                    <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="font-semibold text-slate-800 text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: BRANCHES ACROSS TAMIL NADU */}
          {activeTab === 'branches' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" /> Regional Branch Offices & Depots
                  </h3>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {operator.branches?.length || 0} Depots in TN
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Regional booking counters, container drayage depots, and parcel transshipment terminals affiliated with {operator.company_name}.
                </p>

                {(!operator.branches || operator.branches.length === 0) ? (
                  <div className="p-6 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                    No branch offices registered yet. Use "Edit Fleet" above to register regional branches.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {operator.branches.map((b) => {
                      const cleanWhatsApp = b.whatsapp.replace(/[^0-9]/g, '');
                      const cleanPhone = b.phone.replace(/[^0-9+]/g, '');

                      return (
                        <div key={b.id} className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-xs">{b.branch_name}</h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                  {b.city}
                                </span>
                                {b.is_headquarters && (
                                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[9px] font-bold">
                                    HQ
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                                {b.facility_type}
                              </span>
                            </div>

                            <a
                              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${b.manager_name}, contacting ${b.branch_name} of ${operator.company_name}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </div>

                          <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1">
                            <p><strong className="text-slate-900">Manager:</strong> {b.manager_name}</p>
                            <p><strong className="text-slate-900">Address:</strong> {b.address}</p>
                            <p><strong className="text-slate-900">Direct Line:</strong> <a href={`tel:${cleanPhone}`} className="text-sky-700 hover:underline">{b.phone}</a></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ROUTES */}
          {activeTab === 'routes' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Route className="w-4 h-4 text-amber-600" /> Active Operating Corridors
                </h3>
                <div className="space-y-2.5">
                  {operator.routes.map((route, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-medium text-slate-900 text-xs">{route}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: BRANCHES ACROSS TAMIL NADU */}
          {activeTab === 'branches' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" /> Regional Branch Offices & Depots
                  </h3>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {operator.branches?.length || 0} Depots in TN
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Regional booking counters, container drayage depots, and parcel transshipment terminals affiliated with {operator.company_name}.
                </p>

                {(!operator.branches || operator.branches.length === 0) ? (
                  <div className="p-6 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                    No branch offices registered yet. Use "Edit Fleet" above to register regional branches.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {operator.branches.map((b) => {
                      const cleanWhatsApp = b.whatsapp.replace(/[^0-9]/g, '');
                      const cleanPhone = b.phone.replace(/[^0-9+]/g, '');

                      return (
                        <div key={b.id} className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-xs">{b.branch_name}</h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                  {b.city}
                                </span>
                                {b.is_headquarters && (
                                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[9px] font-bold">
                                    HQ
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                                {b.facility_type}
                              </span>
                            </div>

                            <a
                              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${b.manager_name}, contacting ${b.branch_name} of ${operator.company_name}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </div>

                          <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1">
                            <p><strong className="text-slate-900">Manager:</strong> {b.manager_name}</p>
                            <p><strong className="text-slate-900">Address:</strong> {b.address}</p>
                            <p><strong className="text-slate-900">Direct Line:</strong> <a href={`tel:${cleanPhone}`} className="text-sky-700 hover:underline">{b.phone}</a></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COMPLIANCE */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Statutory & Association Register
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">GSTIN Registration</span>
                    <p className="text-xs font-mono font-bold text-slate-900 mt-1">{operator.gstin || 'State Exempt / In Process'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">UDYAM MSME Registration</span>
                    <p className="text-xs font-mono font-bold text-slate-900 mt-1">{operator.udyam_reg || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Authoritative Association Provenance</span>
                  <p className="text-xs font-medium text-slate-800 mt-1">{operator.source}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BRANCHES ACROSS TAMIL NADU */}
          {activeTab === 'branches' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" /> Regional Branch Offices & Depots
                  </h3>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {operator.branches?.length || 0} Depots in TN
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Regional booking counters, container drayage depots, and parcel transshipment terminals affiliated with {operator.company_name}.
                </p>

                {(!operator.branches || operator.branches.length === 0) ? (
                  <div className="p-6 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                    No branch offices registered yet. Use "Edit Fleet" above to register regional branches.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {operator.branches.map((b) => {
                      const cleanWhatsApp = b.whatsapp.replace(/[^0-9]/g, '');
                      const cleanPhone = b.phone.replace(/[^0-9+]/g, '');

                      return (
                        <div key={b.id} className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-xs">{b.branch_name}</h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                  {b.city}
                                </span>
                                {b.is_headquarters && (
                                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[9px] font-bold">
                                    HQ
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                                {b.facility_type}
                              </span>
                            </div>

                            <a
                              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${b.manager_name}, contacting ${b.branch_name} of ${operator.company_name}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </div>

                          <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1">
                            <p><strong className="text-slate-900">Manager:</strong> {b.manager_name}</p>
                            <p><strong className="text-slate-900">Address:</strong> {b.address}</p>
                            <p><strong className="text-slate-900">Direct Line:</strong> <a href={`tel:${cleanPhone}`} className="text-sky-700 hover:underline">{b.phone}</a></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            ID: <span className="font-mono font-semibold text-slate-700">{operator.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold text-xs transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Call Operator</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${operator.owner_name}, regarding ${operator.company_name} fleet booking/inquiry.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-all shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
