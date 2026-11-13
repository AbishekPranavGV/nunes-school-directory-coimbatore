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
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  GraduationCap,
  Calendar,
  Share2
} from 'lucide-react';
import { SchoolRecord, UserSession } from '@/types';

interface SchoolDetailDrawerProps {
  school: SchoolRecord | null;
  onClose: () => void;
  currentUser: UserSession | null;
  onUpdateSchool: (updated: Partial<SchoolRecord>) => Promise<void>;
  onLogCall: (logData: any) => Promise<void>;
  onTriggerResearch?: (schoolId: string) => Promise<void>;
}

export const SchoolDetailDrawer: React.FC<SchoolDetailDrawerProps> = ({
  school,
  onClose,
  currentUser,
  onUpdateSchool,
  onLogCall,
  onTriggerResearch
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'waterfall' | 'call_log' | 'edit'>('profile');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState(false);

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleRunAiResearch = async () => {
    if (!onTriggerResearch) return;
    setIsResearching(true);
    try {
      await onTriggerResearch(school.id);
    } finally {
      setIsResearching(false);
    }
  };

  const handleExportProfile = () => {
    const profileJson = JSON.stringify(school, null, 2);
    const blob = new Blob([profileJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nunes_school_${school.udise_code}_profile.json`;
    a.click();
  };

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
        <div className="p-6 bg-gradient-to-r from-sky-50 via-brand-50/40 to-white border-b border-sky-100 flex items-start justify-between gap-4">
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Taluk: {school.taluk || school.block}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {school.school_name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>{school.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRunAiResearch}
              disabled={isResearching}
              className="p-2 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all border border-sky-200 flex items-center gap-1 text-xs font-semibold"
              title="Run automated web research on this school"
            >
              <Sparkles className={`w-4 h-4 text-sky-600 ${isResearching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">AI Research</span>
            </button>

            <button
              onClick={handleExportProfile}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              title="Export School Profile (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            10-Section Profile
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

          {/* TAB 1: 10-SECTION PROFILE */}
          {activeTab === 'profile' && (
            <>
              {/* Status Banner */}
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
                        ? 'CONTACT COMPLETE (Independently Verified)' 
                        : 'HIGH PRIORITY MISSING CONTACT QUEUE'}
                    </span>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white/80 border">
                      {school.contact_status || school.workflow_state}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    {school.is_contact_complete 
                      ? 'Official institution-published telephone, WhatsApp Business, or domain email verified on record.' 
                      : (school.missing_reasons || 'No public telephone or website published by institution; requires manual switchboard verification.')}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    Confidence: <span className="text-slate-800 font-semibold">{school.confidence_score ? `${(school.confidence_score * 100).toFixed(0)}%` : '0%'}</span> • Next Action: <span className="text-slate-800 font-semibold">{school.next_action || 'Switchboard inquiry'}</span>
                  </p>
                </div>
              </div>

              {/* 1. School Overview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-600" />
                  <span>1. School Overview</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">School Name: </span>
                    <span className="font-bold text-slate-900">{school.school_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">UDISE Code: </span>
                    <span className="font-mono font-bold text-slate-900">{school.udise_code}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Management: </span>
                    <span className="font-semibold text-slate-800">{school.management}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status: </span>
                    <span className="font-semibold text-slate-800">{school.status}</span>
                  </div>
                </div>
              </div>

              {/* 2. Academic Information */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                  <span>2. Academic Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Educational Board: </span>
                    <span className="font-bold text-slate-900">{school.board}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">School Level: </span>
                    <span className="font-semibold text-slate-800">{school.category}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Classes Offered: </span>
                    <span className="font-semibold text-slate-900">{school.classes_offered || 'Classes 1 to 10'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Address and Location */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>3. Address & Location</span>
                  </h3>
                  {school.google_maps_link && (
                    <a
                      href={school.google_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <span>Open Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-800 font-medium">{school.address}</p>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400">Taluk: </span>
                    <span className="font-semibold text-slate-800">{school.taluk || school.block}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Block: </span>
                    <span className="font-semibold text-slate-800">{school.block}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">PIN Code: </span>
                    <span className="font-mono font-bold text-slate-800">{school.pincode}</span>
                  </div>
                </div>
              </div>

              {/* 4. Principal / Headmaster Information */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>4. Principal / Headmaster Contact</span>
                  </h3>
                  {school.principal_name && (
                    <button
                      onClick={() => handleCopy(school.principal_name!, 'Principal Name')}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedText === 'Principal Name' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'Principal Name' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Name: </span>
                    <span className="font-bold text-slate-900">{school.principal_name || <span className="text-slate-400 font-normal italic">Not publicly listed</span>}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Designation: </span>
                    <span className="font-semibold text-slate-800">{school.principal_designation || 'Headmaster / Principal'}</span>
                  </div>
                  {school.principal_office_phone && (
                    <div className="col-span-2 p-2 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-amber-800 font-semibold">Principal Office Desk: </span>
                        <span className="font-mono font-bold text-slate-900">{school.principal_office_phone}</span>
                      </div>
                      <a
                        href={`tel:${school.principal_office_phone.replace(/\s+/g, '')}`}
                        className="px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Desk</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. School Office Contact Information */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>5. School Office Contacts</span>
                  </h3>
                  {school.official_landline && (
                    <button
                      onClick={() => handleCopy(school.official_landline!, 'Phone')}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedText === 'Phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'Phone' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                    <div>
                      <span className="text-slate-400">Official Landline: </span>
                      <span className="font-mono font-bold text-slate-900">{school.official_landline || <span className="text-slate-400 font-normal italic">Not publicly available</span>}</span>
                    </div>
                    {school.official_landline && (
                      <a
                        href={`tel:${school.official_landline.replace(/\s+/g, '')}`}
                        className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                    <div>
                      <span className="text-slate-400">Administration Mobile: </span>
                      <span className="font-mono font-bold text-slate-900">{school.official_mobile || <span className="text-slate-400 font-normal italic">Not publicly available</span>}</span>
                    </div>
                    {school.official_mobile && (
                      <a
                        href={`tel:${school.official_mobile.replace(/\s+/g, '')}`}
                        className="px-2.5 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* 6. WhatsApp Business Contact */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>6. WhatsApp Business Contact</span>
                  </h3>
                  {school.official_whatsapp && (
                    <button
                      onClick={() => handleCopy(school.official_whatsapp!, 'WhatsApp')}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedText === 'WhatsApp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'WhatsApp' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border text-xs">
                  <div>
                    <span className="text-slate-400">Official Business Number: </span>
                    <span className="font-mono font-bold text-teal-700">{school.official_whatsapp || <span className="text-slate-400 font-normal italic">No official WhatsApp published</span>}</span>
                  </div>
                  {school.official_whatsapp && (
                    <a
                      href={`https://wa.me/${school.official_whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

              {/* 7. Official Emails */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>7. Official Emails</span>
                  </h3>
                  {school.official_email && (
                    <button
                      onClick={() => handleCopy(school.official_email!, 'Email')}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedText === 'Email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'Email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border text-xs">
                  <div>
                    <span className="text-slate-400">Institutional Email: </span>
                    <span className="font-semibold text-slate-900">{school.official_email || <span className="text-slate-400 font-normal italic">Not publicly available</span>}</span>
                  </div>
                  {school.official_email && (
                    <a
                      href={`mailto:${school.official_email}`}
                      className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Compose Email</span>
                    </a>
                  )}
                </div>
              </div>

              {/* 8. Website and Source Links */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                  <span>8. Website & Source Links</span>
                </h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Official Website: </span>
                    {school.website ? (
                      <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1">
                        <span>{school.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No domain published</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source Provenance: </span>
                    <span className="font-semibold text-slate-800">{school.source_provenance}</span>
                  </div>
                </div>
              </div>

              {/* 9. Contact Verification History */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>9. Verification History & Evidence</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Verification Status: </span>
                    <span className="font-bold text-slate-800">{school.verification_confidence}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Confidence Score: </span>
                    <span className="font-bold text-slate-800">{school.confidence_score ? `${(school.confidence_score * 100).toFixed(0)}%` : '0%'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Verified Date: </span>
                    <span className="font-mono text-slate-800">{school.last_verified_date || 'Awaiting initial check'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned Staff: </span>
                    <span className="font-semibold text-slate-800">{school.assigned_staff || 'Staff'}</span>
                  </div>
                </div>
              </div>

              {/* 10. Internal Staff Notes */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>10. Internal Staff Notes & Recovery Status</span>
                </h3>
                <p className="text-xs text-slate-600">
                  {school.missing_reasons || 'School record verified against official Coimbatore district education register.'}
                </p>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                  Next Step: <span className="font-semibold text-slate-700">{school.next_action || 'Routine annual roster refresh'}</span>
                </p>
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
