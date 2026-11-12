'use client';

import React, { useState } from 'react';
import { 
  X, 
  Building, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  Globe, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Briefcase, 
  Clock, 
  Shield, 
  FileText, 
  PhoneForwarded, 
  Save, 
  UserCheck, 
  Ban, 
  ChevronDown, 
  ChevronUp,
  Layers,
  Check
} from 'lucide-react';
import { SchoolRecord, UserSession } from '@/types';

interface SchoolDetailDrawerProps {
  school: SchoolRecord | null;
  onClose: () => void;
  currentUser: UserSession | null;
  onUpdateSchool: (updated: Partial<SchoolRecord>) => Promise<void>;
  onLogCall: (logData: any) => Promise<void>;
}

export const SchoolDetailDrawer: React.FC<SchoolDetailDrawerProps> = ({
  school,
  onClose,
  currentUser,
  onUpdateSchool,
  onLogCall
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'waterfall' | 'call_log' | 'edit'>('overview');

  // Call log form state
  const [callOutcome, setCallOutcome] = useState('SPOKE_WITH_PRINCIPAL');
  const [callNotes, setCallNotes] = useState('');
  const [callPhone, setCallPhone] = useState('');
  const [callEmail, setCallEmail] = useState('');
  const [callPrincipal, setCallPrincipal] = useState('');
  const [consentObtained, setConsentObtained] = useState(true);
  const [requestOptOut, setRequestOptOut] = useState(false);
  const [isSubmittingCall, setIsSubmittingCall] = useState(false);
  const [callSuccessMessage, setCallSuccessMessage] = useState('');

  // Admin edit form state
  const [editPhone, setEditPhone] = useState(school?.official_landline || '');
  const [editMobile, setEditMobile] = useState(school?.official_mobile || '');
  const [editWhatsapp, setEditWhatsapp] = useState(school?.official_whatsapp || '');
  const [editEmail, setEditEmail] = useState(school?.official_email || '');
  const [editPrincipal, setEditPrincipal] = useState(school?.principal_name || '');
  const [editPrincipalOffice, setEditPrincipalOffice] = useState(school?.principal_office_phone || '');
  const [editWorkflowState, setEditWorkflowState] = useState(school?.workflow_state || 'NO_PUBLIC_CONTACT_FOUND');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  if (!school) return null;

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCall(true);
    setCallSuccessMessage('');
    try {
      await onLogCall({
        call_outcome: callOutcome,
        notes: callNotes,
        verified_phone: callPhone || undefined,
        verified_email: callEmail || undefined,
        verified_principal: callPrincipal || undefined,
        consent_obtained: consentObtained,
        request_opt_out: requestOptOut
      });
      setCallSuccessMessage('Call record & consent successfully logged!');
      setTimeout(() => setCallSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(`Error logging call: ${err.message}`);
    } finally {
      setIsSubmittingCall(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    setEditSuccessMsg('');
    try {
      await onUpdateSchool({
        official_landline: editPhone || null,
        official_mobile: editMobile || null,
        official_whatsapp: editWhatsapp || null,
        official_email: editEmail || null,
        principal_name: editPrincipal || null,
        principal_office_phone: editPrincipalOffice || null,
        workflow_state: editWorkflowState
      });
      setEditSuccessMsg('School contact information updated in database.');
      setTimeout(() => setEditSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose}></div>

      {/* Slide-over panel */}
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-6 bg-gradient-to-r from-sky-50/70 via-brand-50/40 to-white border-b border-sky-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                UDISE: {school.udise_code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {school.management}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {school.board}
              </span>
              {school.status === 'HISTORICAL' && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                  Historical / Inactive
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {school.school_name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>{school.address}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Contact Overview
          </button>
          <button
            onClick={() => setActiveTab('waterfall')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'waterfall'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Discovery Waterfall (7 Steps)</span>
          </button>
          <button
            onClick={() => setActiveTab('call_log')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'call_log'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PhoneForwarded className="w-3.5 h-3.5" />
            <span>Log Switchboard Call</span>
          </button>
          {currentUser && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'edit'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Admin Edit
            </button>
          )}
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Contact Completeness Banner */}
              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                school.is_contact_complete 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}>
                {school.is_contact_complete ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-bold flex items-center justify-between">
                    <span>
                      {school.is_contact_complete 
                        ? 'Contact Complete (Verified Institutional Method)' 
                        : 'High Priority Missing Contact Queue'}
                    </span>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white/80 border">
                      {school.workflow_state}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    {school.is_contact_complete 
                      ? 'At least one independently verified institutional contact method is on file.' 
                      : (school.missing_reasons || 'No public telephone or website published by institution; requires switchboard verification.')}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    Next Action: <span className="text-slate-800 font-semibold">{school.next_action || 'Outbound telephone discovery'}</span>
                  </p>
                </div>
              </div>

              {/* Verified Contact Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Approved Contact Channels
                </h3>

                {/* Landline / Reception */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Official Landline / Switchboard</p>
                      <p className="text-sm font-semibold text-slate-900 font-mono">
                        {school.official_landline || <span className="text-slate-400 italic font-sans font-normal">Not publicly available</span>}
                      </p>
                    </div>
                  </div>
                  {school.official_landline && (
                    <a
                      href={`tel:${school.official_landline.replace(/\s+/g, '')}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  )}
                </div>

                {/* Mobile */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Official Public Mobile</p>
                      <p className="text-sm font-semibold text-slate-900 font-mono">
                        {school.official_mobile || <span className="text-slate-400 italic font-sans font-normal">Not publicly available</span>}
                      </p>
                    </div>
                  </div>
                  {school.official_mobile && (
                    <a
                      href={`tel:${school.official_mobile.replace(/\s+/g, '')}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  )}
                </div>

                {/* WhatsApp Business */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Verified WhatsApp Business</p>
                      <p className="text-sm font-semibold text-slate-900 font-mono">
                        {school.official_whatsapp ? (
                          <span className="text-teal-700">{school.official_whatsapp}</span>
                        ) : (
                          <span className="text-slate-400 italic font-sans font-normal">No official WhatsApp published</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {school.official_whatsapp && (
                    <a
                      href={`https://wa.me/${school.official_whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* Official Email */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Official Institutional Email</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {school.official_email || <span className="text-slate-400 italic font-normal">Not publicly available</span>}
                      </p>
                    </div>
                  </div>
                  {school.official_email && (
                    <a
                      href={`mailto:${school.official_email}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                {/* Principal / Headmaster Name & Professional Office Phone */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Principal / Headmaster Name</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {school.principal_name || <span className="text-slate-400 italic font-normal">Not publicly listed</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                  {school.principal_office_phone && (
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-amber-800 font-medium uppercase tracking-wide">
                          Dedicated Principal Office Desk
                        </p>
                        <p className="text-xs font-mono font-semibold text-slate-800">
                          {school.principal_office_phone}
                        </p>
                      </div>
                      <a
                        href={`tel:${school.principal_office_phone.replace(/\s+/g, '')}`}
                        className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                      >
                        Call Office Desk
                      </a>
                    </div>
                  )}
                </div>

                {/* School Website & Provenance */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Institutional Website</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {school.website ? (
                          <a
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline flex items-center gap-1"
                          >
                            <span>{school.website}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic font-normal">No dedicated domain found</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Provenance & Audit Info */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 space-y-1.5">
                <div className="flex justify-between">
                  <span>Source Provenance:</span>
                  <span className="font-semibold text-slate-800">{school.source_provenance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Established:</span>
                  <span className="font-semibold text-slate-800">{school.established_year || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification Confidence:</span>
                  <span className="font-semibold text-slate-800">{school.verification_confidence}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Staff:</span>
                  <span className="font-semibold text-slate-800">{school.assigned_staff || 'Staff'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Checked:</span>
                  <span className="font-semibold text-slate-800">{school.last_checked || '2026-11-12'}</span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: WATERFALL DISCOVERY LOG (7 STEPS) */}
          {activeTab === 'waterfall' && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800">
                <p className="font-semibold">Exhaustive 7-Step Contact Discovery Waterfall</p>
                <p className="mt-0.5 text-sky-600">
                  Logs official school homepage, board affiliations (CBSE/TN DSE), public circulars, secondary directories, headmaster reception desk, outbound verification, and final audit record.
                </p>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {(school.waterfall || []).map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                      step.http_status === 200 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>{step.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          step.http_status === 200 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          HTTP {step.http_status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{step.result}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[260px] font-mono">{step.checked_url}</span>
                        <span>{step.timestamp.split('T')[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LOG SWITCHBOARD CALL */}
          {activeTab === 'call_log' && (
            <form onSubmit={handleCallSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Log Manual Switchboard / Reception Call</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record official phone call attempt to school reception desk. Never simulate calls or invent results.
                </p>
              </div>

              {callSuccessMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                  {callSuccessMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="SPOKE_WITH_PRINCIPAL">Spoke with Principal / Headmaster (Verified)</option>
                  <option value="SWITCHBOARD_VERIFIED">Switchboard Receptionist Confirmed Contacts</option>
                  <option value="NO_ANSWER">No Answer / Line Ringing</option>
                  <option value="BUSY">Line Busy</option>
                  <option value="WRONG_NUMBER">Wrong Number / Invalid Exchange</option>
                  <option value="OPT_OUT_REQUESTED">School Requested Opt-Out / Do Not Contact</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmed Official Phone</label>
                  <input
                    type="text"
                    value={callPhone}
                    onChange={(e) => setCallPhone(e.target.value)}
                    placeholder="+91 422 2xxxxxx"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmed Official Email</label>
                  <input
                    type="email"
                    value={callEmail}
                    onChange={(e) => setCallEmail(e.target.value)}
                    placeholder="office@school.edu.in"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmed Principal Name</label>
                <input
                  type="text"
                  value={callPrincipal}
                  onChange={(e) => setCallPrincipal(e.target.value)}
                  placeholder="e.g. Dr. K. Ramanathan"
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Notes & Verifier Evidence</label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={2}
                  placeholder="Spoke with administrative clerk Mr. Kumar; confirmed school working hours and official email..."
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Consent & Opt-out Controls */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentObtained}
                    onChange={(e) => setConsentObtained(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>Consent obtained to list verified institutional contacts in directory</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-rose-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestOptOut}
                    onChange={(e) => setRequestOptOut(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>School requested removal / opt-out from directory (Do Not Contact)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmittingCall}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmittingCall ? 'Recording Call...' : 'Save Call Verification Record'}</span>
              </button>
            </form>
          )}

          {/* TAB 4: ADMIN EDIT */}
          {activeTab === 'edit' && currentUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Admin Contact Editor</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update verified records with strict verification evidence. Logged to system audit trail.
                </p>
              </div>

              {editSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                  {editSuccessMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Landline</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 422 2xxxxxx"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Mobile</label>
                  <input
                    type="text"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    placeholder="+91 944xx xxxxx"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Business (wa.me)</label>
                  <input
                    type="text"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    placeholder="+91 944xx xxxxx"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="principal@school.org"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Name</label>
                  <input
                    type="text"
                    value={editPrincipal}
                    onChange={(e) => setEditPrincipal(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Office Desk Phone</label>
                  <input
                    type="text"
                    value={editPrincipalOffice}
                    onChange={(e) => setEditPrincipalOffice(e.target.value)}
                    placeholder="+91 422 2xxxxxx"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Workflow State</label>
                <select
                  value={editWorkflowState}
                  onChange={(e: any) => setEditWorkflowState(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="VERIFIED_INSTITUTION_CONTACT">VERIFIED_INSTITUTION_CONTACT</option>
                  <option value="PRINCIPAL_OFFICE_VERIFIED">PRINCIPAL_OFFICE_VERIFIED</option>
                  <option value="FOUND_UNVERIFIED">FOUND_UNVERIFIED</option>
                  <option value="NO_PUBLIC_CONTACT_FOUND">NO_PUBLIC_CONTACT_FOUND</option>
                  <option value="IN_RESEARCH">IN_RESEARCH</option>
                  <option value="RECHECK_REQUIRED">RECHECK_REQUIRED</option>
                  <option value="NOT_SEARCHED">NOT_SEARCHED</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSavingEdit}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSavingEdit ? 'Saving...' : 'Save Database Edits'}</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
