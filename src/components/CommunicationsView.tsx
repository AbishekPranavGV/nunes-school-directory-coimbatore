'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Search, 
  ShieldCheck, 
  User, 
  ArrowUpRight,
  Filter,
  Check,
  RefreshCw,
  Eye
} from 'lucide-react';
import { OutboundCommunication, InboundReply } from '@/types';

interface CommunicationsViewProps {
  onNavigateToCirculars: () => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({
  onNavigateToCirculars
}) => {
  const [activeTab, setActiveTab] = useState<'communications' | 'replies'>('replies');
  const [comms, setComms] = useState<OutboundCommunication[]>([]);
  const [replies, setReplies] = useState<InboundReply[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [classificationFilter, setClassificationFilter] = useState<string>('ALL');
  const [selectedReply, setSelectedReply] = useState<InboundReply | null>(null);

  // Load communications and replies
  const loadData = async () => {
    try {
      setLoading(true);
      const [commsRes, repliesRes] = await Promise.all([
        fetch('/api/communications'),
        fetch('/api/communications?view=replies')
      ]);

      const commsData = await commsRes.json();
      const repliesData = await repliesRes.json();

      setComms(commsData.communications || []);
      setSummary(commsData.summary || null);
      setReplies(repliesData.replies || []);
    } catch (err) {
      console.error('Error loading communications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update reply status / notes
  const handleUpdateReplyStatus = async (replyId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_reply',
          reply_id: replyId,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setReplies(prev => prev.map(r => r.id === replyId ? data.reply : r));
        if (selectedReply && selectedReply.id === replyId) {
          setSelectedReply(data.reply);
        }
      }
    } catch (err: any) {
      alert(`Error updating reply: ${err.message}`);
    }
  };

  const filteredReplies = replies.filter(r => {
    if (classificationFilter !== 'ALL' && r.classification !== classificationFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.school_name.toLowerCase().includes(q) ||
             r.subject.toLowerCase().includes(q) ||
             r.sender_email.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredComms = comms.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      return c.school_name.toLowerCase().includes(q) ||
             c.recipient_email.toLowerCase().includes(q) ||
             c.circular_title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
              <Mail className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">
              Sent Communications & Institutional Reply Hub
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-slate-950">
              Audit Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-sky-200 max-w-2xl leading-relaxed">
            Track per-school circular delivery states, delivery receipts, and classify incoming responses with automated AI sentiment analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToCirculars}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Manage Circulars</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Safety Switch:</strong> Real mass outbound sending is disabled. Only simulated internal allowlist tests are executed. AI never sends automatic responses to schools.
          </span>
        </div>
        <span className="font-mono text-[11px] text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200 font-bold shrink-0">
          Manual Staff Reply Only
        </span>
      </div>

      {/* Top Navigation Tabs (Replies Inbox vs Outbound Logs) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('replies')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'replies'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inbound Replies Inbox</span>
            <span className={`px-2 py-0.2 rounded-full text-xs font-mono ${
              activeTab === 'replies' ? 'bg-sky-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {replies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('communications')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'communications'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Outbound Message Logs</span>
            <span className={`px-2 py-0.2 rounded-full text-xs font-mono ${
              activeTab === 'communications' ? 'bg-sky-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {comms.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>

      {activeTab === 'replies' ? (
        /* INBOUND REPLIES INBOX */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Replies List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Classification Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['ALL', 'Acknowledged', 'Information Requested', 'Document Requested', 'Needs Follow-Up'].map((clf) => (
                <button
                  key={clf}
                  onClick={() => setClassificationFilter(clf)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-all ${
                    classificationFilter === clf 
                      ? 'bg-sky-600 text-white shadow-xs' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {clf}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredReplies.map((r) => {
                const isSelected = selectedReply?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReply(r)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-300 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{r.school_name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                            r.classification === 'Acknowledged' ? 'bg-emerald-100 text-emerald-800' :
                            r.classification === 'Information Requested' ? 'bg-sky-100 text-sky-800' :
                            r.classification === 'Document Requested' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {r.classification}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{r.sender_name || r.sender_email}</p>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {new Date(r.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 font-sans">
                      {r.body_text}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Assigned: <strong className="text-slate-700">{r.assigned_staff || 'Staff'}</strong></span>
                      <span className={`font-semibold ${r.status === 'REVIEWED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Reply Detail Thread & Action (5 cols) */}
          <div className="lg:col-span-5">
            {selectedReply ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-28">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 mb-1 inline-block">
                      {selectedReply.classification}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{selectedReply.school_name}</h3>
                    <p className="text-xs text-slate-500">{selectedReply.sender_email}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {selectedReply.status === 'UNREAD' ? (
                      <button
                        onClick={() => handleUpdateReplyStatus(selectedReply.id, 'REVIEWED')}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                      >
                        Mark Reviewed
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Reviewed</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Subject</h5>
                  <p className="text-xs font-semibold text-slate-800">{selectedReply.subject}</p>
                </div>

                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Received Message Body</h5>
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 whitespace-pre-line leading-relaxed border border-slate-200/60 font-sans">
                    {selectedReply.body_text}
                  </div>
                </div>

                {selectedReply.internal_notes && (
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Staff Notes</h5>
                    <p className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                      {selectedReply.internal_notes}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => alert(`Draft response created for ${selectedReply.sender_email}. Review before manual transmission.`)}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Prepare Manual Staff Response Draft</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Select an inbound reply from the left panel to review message content and prepare responses.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* OUTBOUND COMMUNICATIONS TABLE */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Outbound Message Audit Log</h3>
            <span className="text-xs font-mono text-slate-500">{filteredComms.length} Recorded Transmissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">School Name</th>
                  <th className="py-2.5 px-4">Recipient Email</th>
                  <th className="py-2.5 px-4">Circular Title</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Message ID</th>
                  <th className="py-2.5 px-4">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComms.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.school_name}</td>
                    <td className="py-3 px-4 font-mono text-sky-800">{c.recipient_email}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700">{c.circular_title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'DELIVERED' || c.status === 'REPLIED' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'SENT' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{c.message_id || 'sim_local'}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {c.sent_at ? new Date(c.sent_at).toLocaleDateString() : 'Draft'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
