'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Search, 
  MapPin, 
  Building2, 
  UserCheck, 
  FileSpreadsheet, 
  RefreshCw, 
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';
import { SchoolRecord, UserSession } from '@/types';

interface StaffVerificationWorkspaceProps {
  currentUser: UserSession | null;
  onSelectSchoolForDrawer: (school: SchoolRecord) => void;
}

const COIMBATORE_BLOCKS = [
  'All Blocks',
  'Coimbatore City',
  'Perur',
  'S.S.Kulam',
  'Madukkarai',
  'Thondamuthur',
  'Pollachi North',
  'Pollachi South',
  'Anaimalai',
  'Valparai',
  'Sulur',
  'Sultanpet',
  'Annur',
  'Karamadai',
  'Periyanaickenpalayam',
  'Kinathukadavu'
];

export const StaffVerificationWorkspace: React.FC<StaffVerificationWorkspaceProps> = ({
  currentUser,
  onSelectSchoolForDrawer
}) => {
  const [selectedBlock, setSelectedBlock] = useState('All Blocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [activeSchool, setActiveSchool] = useState<any | null>(null);

  // Calling Form state
  const [calledPhone, setCalledPhone] = useState('');
  const [callOutcome, setCallOutcome] = useState('VERIFIED_OFFICIAL_OFFICE');
  const [headmasterName, setHeadmasterName] = useState('');
  const [principalDeskPhone, setPrincipalDeskPhone] = useState('');
  const [whatsappConfirmed, setWhatsappConfirmed] = useState('');
  const [emailConfirmed, setEmailConfirmed] = useState('');
  const [callerNotes, setCallerNotes] = useState('');
  const [optOutRequested, setOptOutRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    loadSchoolsAndStats();
  }, [selectedBlock]);

  const loadSchoolsAndStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBlock !== 'All Blocks') {
        params.set('block', selectedBlock);
      }
      if (searchQuery) {
        params.set('q', searchQuery);
      }
      params.set('pageSize', '50');

      const res = await fetch(`/api/staff-calling?${params.toString()}`);
      const data = await res.json();
      setSchools(data.schools || []);
      setStats(data.stats || {});
      if (data.schools?.length > 0 && !activeSchool) {
        selectSchoolForCalling(data.schools[0]);
      }
    } catch (err) {
      console.error('Error fetching staff calling queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectSchoolForCalling = (school: any) => {
    setActiveSchool(school);
    setCalledPhone(school.official_landline || school.official_mobile || '');
    setHeadmasterName(school.principal_name || '');
    setPrincipalDeskPhone(school.principal_office_phone || '');
    setWhatsappConfirmed(school.official_whatsapp || '');
    setEmailConfirmed(school.official_email || '');
    setCallerNotes('');
    setOptOutRequested(false);
    setCallOutcome('VERIFIED_OFFICIAL_OFFICE');
    setSubmitMessage('');
  };

  const handleLogCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSchool) return;

    setSubmitting(true);
    setSubmitMessage('');

    try {
      const res = await fetch('/api/staff-calling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: activeSchool.id,
          called_phone: calledPhone,
          call_outcome: callOutcome,
          headmaster_confirmed: headmasterName || undefined,
          principal_desk_phone: principalDeskPhone || undefined,
          whatsapp_confirmed: whatsappConfirmed || undefined,
          email_confirmed: emailConfirmed || undefined,
          notes: callerNotes || undefined,
          opt_out_requested: optOutRequested
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record call');

      setSubmitMessage(`Call logged: ${callOutcome} for ${activeSchool.school_name}`);
      await loadSchoolsAndStats();
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadWorksheet = (format: 'xlsx' | 'csv') => {
    const blockParam = selectedBlock !== 'All Blocks' ? `&block=${encodeURIComponent(selectedBlock)}` : '';
    window.open(`/api/staff-calling/worksheet?format=${format}${blockParam}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-sky-50 via-indigo-50 to-white rounded-2xl border border-sky-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-sky-600 text-white">
              <PhoneCall className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Staff Telephone Verification Workspace
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              High Priority Block Queue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
            Human-in-the-loop switchboard verification for Coimbatore educational institutions. Staff call public school office numbers, confirm official headmaster desk phones, verify official WhatsApp Business accounts, and record audit logs.
          </p>
        </div>

        {/* Worksheet Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadWorksheet('xlsx')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            title="Download formatted Excel calling sheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Calling Sheet (.xlsx)</span>
          </button>
          <button
            onClick={() => handleDownloadWorksheet('csv')}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            title="Download CSV worksheet"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Calls Logged</span>
          <span className="text-xl font-bold text-slate-900 mt-1">{stats.total_calls || 0}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-emerald-200 bg-emerald-50/20 flex flex-col justify-between">
          <span className="text-xs font-semibold text-emerald-700">Verified Official Office</span>
          <span className="text-xl font-bold text-emerald-900 mt-1">{stats.verified_calls || 0}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-amber-200 bg-amber-50/20 flex flex-col justify-between">
          <span className="text-xs font-semibold text-amber-700">Busy Calls</span>
          <span className="text-xl font-bold text-amber-900 mt-1">{stats.busy_calls || 0}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">No Answer</span>
          <span className="text-xl font-bold text-slate-800 mt-1">{stats.no_answer_calls || 0}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-rose-200 bg-rose-50/20 flex flex-col justify-between">
          <span className="text-xs font-semibold text-rose-700">Wrong Number</span>
          <span className="text-xl font-bold text-rose-900 mt-1">{stats.wrong_number_calls || 0}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-purple-200 bg-purple-50/20 flex flex-col justify-between">
          <span className="text-xs font-semibold text-purple-700">Flagged Incorrect</span>
          <span className="text-xl font-bold text-purple-900 mt-1">{stats.flagged_incorrect || 0}</span>
        </div>
      </div>

      {/* Block Selector & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Filter by Educational Block</label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {COIMBATORE_BLOCKS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:flex-1">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quick Search in Block</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadSchoolsAndStats()}
              placeholder="Search by school name, UDISE code, or village..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={loadSchoolsAndStats}
          disabled={loading}
          className="self-end px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Calling Queue List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              {schools.length} Schools in {selectedBlock}
            </span>
            <span className="text-[11px] text-slate-400">Click to load into calling switch</span>
          </div>

          {schools.map((s) => {
            const isSelected = activeSchool?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => selectSchoolForCalling(s)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-sky-50/70 border-sky-400 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{s.school_name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      UDISE: <span className="text-sky-800 font-semibold">{s.udise_code}</span> • {s.block} • {s.board}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    s.is_contact_complete 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {s.is_contact_complete ? 'Complete' : 'Needs Call'}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1 font-mono text-[11px]">
                    <PhoneCall className="w-3 h-3 text-slate-400" />
                    <span>{s.official_landline || s.official_mobile || 'No number published'}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSchoolForDrawer(s);
                    }}
                    className="text-[11px] text-sky-700 hover:underline flex items-center gap-0.5"
                  >
                    <span>Full Drawer</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Calling Switchboard & Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          {activeSchool ? (
            <form onSubmit={handleLogCall} className="space-y-4">
              
              {/* Active School Header */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeSchool.school_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Block: <strong className="text-slate-700">{activeSchool.block}</strong></span>
                    <span>•</span>
                    <span>Taluk: <strong className="text-slate-700">{activeSchool.taluk}</strong></span>
                    <span>•</span>
                    <span>Management: <strong className="text-slate-700">{activeSchool.management}</strong></span>
                  </p>
                </div>

                <a
                  href={`tel:${calledPhone.replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Dial Now</span>
                </a>
              </div>

              {submitMessage && (
                <div className={`p-3 rounded-xl text-xs font-semibold border ${
                  submitMessage.startsWith('Error') 
                    ? 'bg-rose-50 text-rose-800 border-rose-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              {/* Call Question Script */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Mandatory Staff Calling Script Checklist:</span>
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
                  <li>"Hello, is this the official office of <strong>{activeSchool.school_name}</strong>?"</li>
                  <li>"Could you please confirm the Headmaster/Principal official office desk extension?"</li>
                  <li>"Does the institution operate an official WhatsApp Business number or official domain email?"</li>
                </ol>
              </div>

              {/* Call Outcome Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Call Outcome</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'VERIFIED_OFFICIAL_OFFICE', label: 'Verified Office', color: 'emerald' },
                    { id: 'BUSY', label: 'Busy', color: 'amber' },
                    { id: 'NO_ANSWER', label: 'No Answer', color: 'slate' },
                    { id: 'WRONG_NUMBER', label: 'Wrong Number', color: 'rose' },
                    { id: 'DISCONNECTED', label: 'Disconnected', color: 'rose' },
                    { id: 'FLAGGED_INCORRECT', label: 'Flag Incorrect', color: 'purple' },
                    { id: 'REQUEST_ANOTHER_SOURCE', label: 'Needs Other Source', color: 'sky' }
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setCallOutcome(o.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        callOutcome === o.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Contact Fields Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone Number Called</label>
                  <input
                    type="text"
                    value={calledPhone}
                    onChange={(e) => setCalledPhone(e.target.value)}
                    required
                    placeholder="+91 422 2400000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Headmaster / Principal Name</label>
                  <input
                    type="text"
                    value={headmasterName}
                    onChange={(e) => setHeadmasterName(e.target.value)}
                    placeholder="Officially published name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Desk Office Phone</label>
                  <input
                    type="text"
                    value={principalDeskPhone}
                    onChange={(e) => setPrincipalDeskPhone(e.target.value)}
                    placeholder="+91 422 2400001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official WhatsApp Business</label>
                  <input
                    type="text"
                    value={whatsappConfirmed}
                    onChange={(e) => setWhatsappConfirmed(e.target.value)}
                    placeholder="+91 94444 00000 (only confirmed)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official School Email</label>
                  <input
                    type="email"
                    value={emailConfirmed}
                    onChange={(e) => setEmailConfirmed(e.target.value)}
                    placeholder="office@school.edu.in or @tn.gov.in"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Operator Notes / Verifier Proof</label>
                  <textarea
                    rows={2}
                    value={callerNotes}
                    onChange={(e) => setCallerNotes(e.target.value)}
                    placeholder="Confirmed with school administrative office clerk. Direct line verified."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Opt-out toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="optout_staff"
                  checked={optOutRequested}
                  onChange={(e) => setOptOutRequested(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="optout_staff" className="text-xs text-slate-600">
                  Institution explicitly requested to opt-out of prospective communications
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>Logging as: <strong>{currentUser?.username || 'Staff Operator'}</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Recording Call...' : 'Save Verified Record'}</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
              <PhoneCall className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">Select a school from the left queue to begin verification.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
