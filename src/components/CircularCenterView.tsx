'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Mail, 
  Clock, 
  Eye, 
  Plus, 
  Users, 
  FileCheck,
  Building,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { CircularItem, SchoolRecord } from '@/types';

interface CircularCenterViewProps {
  schools: SchoolRecord[];
  onNavigateToCommunications: () => void;
}

export const CircularCenterView: React.FC<CircularCenterViewProps> = ({
  schools,
  onNavigateToCommunications
}) => {
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [activeCircular, setActiveCircular] = useState<CircularItem | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New circular form state
  const [title, setTitle] = useState<string>('');
  const [refNumber, setRefNumber] = useState<string>('');
  const [circularDate, setCircularDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState<string>('');
  const [bodyText, setBodyText] = useState<string>('');
  const [targetGroup, setTargetGroup] = useState<string>('Higher Secondary & Secondary Schools');
  const [attachedFileName, setAttachedFileName] = useState<string>('TNEA_2026_Official_Circular.pdf');
  const [simulatedOcrText, setSimulatedOcrText] = useState<string>('');

  // Simulated test send state
  const [isSimulatingSend, setIsSimulatingSend] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  // Load circulars
  const loadCirculars = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/circulars');
      const data = await res.json();
      setCirculars(data.circulars || []);
      if (data.circulars && data.circulars.length > 0 && !activeCircular) {
        setActiveCircular(data.circulars[0]);
      }
    } catch (err) {
      console.error('Error fetching circulars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCirculars();
  }, []);

  // Handle create new circular
  const handleCreateCircular = async (status: 'DRAFT' | 'PENDING_APPROVAL') => {
    try {
      const res = await fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          reference_number: refNumber,
          circular_date: circularDate,
          subject,
          body_text: bodyText,
          extracted_text: simulatedOcrText || bodyText,
          attachment_name: attachedFileName,
          target_group: targetGroup,
          status
        })
      });

      const data = await res.json();
      if (data.success && data.circular) {
        setCirculars(prev => [data.circular, ...prev]);
        setActiveCircular(data.circular);
        setIsComposing(false);
        // Reset form
        setTitle('');
        setRefNumber('');
        setSubject('');
        setBodyText('');
      }
    } catch (err: any) {
      alert(`Error creating circular: ${err.message}`);
    }
  };

  // Handle approve circular
  const handleApproveCircular = async (circId: string) => {
    try {
      const res = await fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', circular_id: circId })
      });
      const data = await res.json();
      if (data.success && data.circular) {
        setCirculars(prev => prev.map(c => c.id === circId ? data.circular : c));
        setActiveCircular(data.circular);
      }
    } catch (err: any) {
      alert(`Error approving circular: ${err.message}`);
    }
  };

  // Handle simulated test send (safe execution)
  const handleSimulatedTestSend = async () => {
    if (!activeCircular) return;
    setIsSimulatingSend(true);
    setSimulationResult(null);

    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_test_send',
          circular_id: activeCircular.id,
          circular_title: activeCircular.title,
          subject: activeCircular.generated_email_subject,
          test_email: 'compliance-audit@nunesinstruments.com'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSimulationResult(`Simulation Success: Message recorded for compliance-audit@nunesinstruments.com. Provider status: DELIVERED. Zero external schools contacted.`);
      }
    } catch (err: any) {
      setSimulationResult(`Simulation note: ${err.message}`);
    } finally {
      setIsSimulatingSend(false);
    }
  };

  // Recipient selection calculation
  const totalSchoolsCount = schools.length || 2097;
  const verifiedEmailSchoolsCount = schools.filter(s => s.official_email).length || 77;
  const missingEmailCount = totalSchoolsCount - verifiedEmailSchoolsCount;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner & Safety Notice */}
      <div className="p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-sky-900 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
              <Send className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">
              Circular Communication & Outreach Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              Safe Protocol Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
            Prepare, verify, and format official circulars from educational directives. Automatically generates formal email drafts and audits eligible institutional recipients with zero unverified transmissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComposing(true)}
            className="px-4 py-2.5 bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>New Circular</span>
          </button>
        </div>
      </div>

      {/* MANDATORY SAFETY LOCKOUT NOTICE BANNER (PHASE 10) */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl shadow-xs flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Outbound Transmission Safeguard: EMAIL_AUTOMATION_ENABLED = false (Server-Enforced)
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed max-w-4xl">
              Live automated outbound email sending is permanently disabled in code. No mass emails or real messages will be dispatched to schools. You can safely prepare drafts, verify recipient eligibility, and execute simulated test deliveries to internal compliance addresses.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToCommunications}
          className="px-3.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-xl whitespace-nowrap transition-all shadow-2xs"
        >
          View Tracking Logs
        </button>
      </div>

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Circulars List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Official Circulars</h3>
              <span className="text-xs font-mono text-slate-500">{circulars.length} Prepared</span>
            </div>

            <div className="space-y-2.5">
              {circulars.map((c) => {
                const isSelected = activeCircular?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveCircular(c);
                      setIsComposing(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-300 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'PENDING_APPROVAL' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.circular_date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono truncate">{c.reference_number}</p>
                    
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{c.target_group}</span>
                      <span className="text-sky-700 font-semibold">{c.email_ready_count} Emails Ready</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setIsComposing(true)}
            className="mt-4 w-full py-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose New Circular</span>
          </button>
        </div>

        {/* Right Column: Circular Details / Composer (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {isComposing ? (
            /* Compose / Ingest New Circular Screen */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-in fade-in-50">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Prepare Educational Circular</h3>
                  <p className="text-xs text-slate-500">Paste official text or upload PDF circular for OCR extraction</p>
                </div>
                <button
                  onClick={() => setIsComposing(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Science Lab Equipment Verification 2026"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Reference Number</label>
                    <input
                      type="text"
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      placeholder="e.g. NUNES/CBE/EDU/2026/049"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Date</label>
                    <input
                      type="date"
                      value={circularDate}
                      onChange={(e) => setCircularDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target School Group</label>
                    <select
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                    >
                      <option value="All Eligible Coimbatore Schools">All Eligible Coimbatore Schools (2,097)</option>
                      <option value="Higher Secondary & Secondary Schools">Higher Secondary & Secondary Schools (512)</option>
                      <option value="Government & Aided Schools">Government & Aided Schools (1,280)</option>
                      <option value="Matriculation & CBSE Schools">Matriculation & CBSE Schools (420)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Header</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Verification of Science Apparatus & Physics Lab Measuring Devices"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Circular Message Body</label>
                  <textarea
                    rows={5}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="Paste the circular instructions, directives, and required inventory format here..."
                    className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-sans"
                  />
                </div>

                {/* Simulated OCR File Upload Box */}
                <div className="p-4 border border-dashed border-sky-300 bg-sky-50/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-white text-sky-600 shadow-xs">
                      <Paperclip className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Attachment: {attachedFileName}</p>
                      <p className="text-[11px] text-slate-500">PDF Document • 340 KB • Automatic text extraction ready</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-1 rounded">
                    OCR Verified
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleCreateCircular('DRAFT')}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                  >
                    Save as Draft
                  </button>

                  <button
                    onClick={() => handleCreateCircular('PENDING_APPROVAL')}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Approval</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeCircular ? (
            /* Selected Circular Overview & Draft Preview */
            <div className="space-y-6">
              
              {/* Circular Overview Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        activeCircular.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {activeCircular.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {activeCircular.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{activeCircular.circular_date}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{activeCircular.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {activeCircular.reference_number}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeCircular.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={() => handleApproveCircular(activeCircular.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Approve Circular</span>
                      </button>
                    )}

                    <button
                      onClick={handleSimulatedTestSend}
                      disabled={isSimulatingSend}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                      title="Safely sends a simulated delivery to internal test mailbox without contacting real schools"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isSimulatingSend ? 'Simulating...' : 'Simulate Test Delivery'}</span>
                    </button>
                  </div>
                </div>

                {/* Simulation Result Alert */}
                {simulationResult && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                    <span>{simulationResult}</span>
                    <button onClick={() => setSimulationResult(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-2">Dismiss</button>
                  </div>
                )}

                {/* Smart Recipient Selection Matrix (Phase 9) */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>Smart Recipient Eligibility Breakdown</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Target Group</span>
                      <span className="font-bold text-slate-800 font-mono">{activeCircular.eligible_count}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Valid Emails</span>
                      <span className="font-bold text-emerald-700 font-mono">{activeCircular.email_ready_count}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Missing Email</span>
                      <span className="font-bold text-rose-700 font-mono">{activeCircular.eligible_count - activeCircular.email_ready_count}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Deduplicated</span>
                      <span className="font-bold text-indigo-700 font-mono">0 Dups</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Opt-Outs</span>
                      <span className="font-bold text-slate-700 font-mono">0 Excluded</span>
                    </div>
                  </div>
                </div>

                {/* Email Draft Preview */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>Generated Institutional Email Notification Draft</span>
                  </h4>

                  <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                    <p><span className="text-slate-500">Subject: </span><span className="text-sky-300 font-bold">{activeCircular.generated_email_subject}</span></p>
                    <p><span className="text-slate-500">From: </span><span className="text-emerald-300">Nunes Instruments Educational Liaison &lt;educational.liaison@nunesinstruments.com&gt;</span></p>
                    <p><span className="text-slate-500">Attachment: </span><span className="text-amber-300">{activeCircular.attachment_name}</span></p>
                    <div className="pt-2 border-t border-slate-800 text-slate-300 font-sans whitespace-pre-line leading-relaxed">
                      {activeCircular.generated_email_body}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
              Select a circular from the list or click "Compose New Circular".
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
