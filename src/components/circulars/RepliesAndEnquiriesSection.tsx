'use client';

import React, { useState } from 'react';
import { 
  Inbox, 
  Sparkles, 
  FileText, 
  Calendar, 
  HelpCircle, 
  Slash, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  Plus, 
  Download,
  Search,
  MessageCircle,
  Phone
} from 'lucide-react';
import { InboundReplyV2, FollowUpTaskV2, ReplyClassification } from '@/types/circular';

interface RepliesAndEnquiriesSectionProps {
  replies: InboundReplyV2[];
  followUpTasks: FollowUpTaskV2[];
  onRefresh: () => void;
}

export const RepliesAndEnquiriesSection: React.FC<RepliesAndEnquiriesSectionProps> = ({
  replies,
  followUpTasks,
  onRefresh
}) => {
  const [selectedReplyId, setSelectedReplyId] = useState<string>(replies[0]?.id || '');
  const [search, setSearch] = useState<string>('');
  const [classificationFilter, setClassificationFilter] = useState<string>('ALL');

  const activeReply = replies.find(r => r.id === selectedReplyId) || replies[0] || null;

  const handleUpdateTaskStatus = async (taskId: string, nextStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      await fetch('/api/circulars/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_task_status',
          task_id: taskId,
          status: nextStatus
        })
      });
      onRefresh();
    } catch (err: any) {
      alert(`Error updating task: ${err.message}`);
    }
  };

  const filteredReplies = replies.filter(r => {
    if (classificationFilter !== 'ALL' && r.classification !== classificationFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.school_name.toLowerCase().includes(q) ||
             r.sender_name.toLowerCase().includes(q) ||
             r.body.toLowerCase().includes(q);
    }
    return true;
  });

  const getClassificationBadge = (c: ReplyClassification) => {
    switch (c) {
      case 'REQUESTING_DEMONSTRATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">Requesting Demo</span>;
      case 'REQUESTING_QUOTATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Requesting Quote</span>;
      case 'INTERESTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Interested</span>;
      case 'UNSUBSCRIBE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Unsubscribe</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">General Review</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-sky-500 text-white font-bold">
              <Inbox className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Institutional Replies & Sales Follow-up Pipeline
            </h2>
          </div>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
            Inbound school inquiries classified by intent (Demonstration, Quotation, Specifications) with automatic sales task allocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/circulars/v2/export?type=replies"
            download
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Inquiries CSV</span>
          </a>
        </div>
      </div>

      {/* Main Two-Column Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Replies List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Inbound Inquiries ({filteredReplies.length})
            </h3>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Intents</option>
              <option value="REQUESTING_DEMONSTRATION">Demo Requests</option>
              <option value="REQUESTING_QUOTATION">Quote Requests</option>
              <option value="INTERESTED">Interested</option>
              <option value="UNSUBSCRIBE">Unsubscribes</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search school or sender..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto">
            {filteredReplies.map((r) => {
              const isSelected = r.id === selectedReplyId;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReplyId(r.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-sky-50/80 border-sky-400 shadow-sm ring-1 ring-sky-300' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-extrabold text-slate-900 text-xs truncate max-w-[200px]">
                      {r.school_name}
                    </span>
                    {getClassificationBadge(r.classification)}
                  </div>

                  <p className="text-[11px] font-medium text-slate-700 truncate">
                    {r.sender_name} ({r.district})
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {r.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Reply Details & Sales Tasks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {activeReply ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {activeReply.school_name}
                    </h3>
                    {getClassificationBadge(activeReply.classification)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sender: <strong className="text-slate-800">{activeReply.sender_name}</strong> • Email: <a href={`mailto:${activeReply.sender_email}`} className="text-sky-700 underline">{activeReply.sender_email}</a>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeReply.sender_phone && (
                    <a
                      href={`https://wa.me/${activeReply.sender_phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp School</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                {activeReply.body}
              </div>

              {/* Linked Follow-up Tasks */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>Allocated Sales Coordinator Tasks:</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {followUpTasks.filter(t => t.school_name === activeReply.school_name || t.reply_id === activeReply.id).map(task => (
                    <div key={task.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{task.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{task.description}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-500">
                          Assigned to: <strong className="text-slate-800">{task.assigned_to}</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {task.status !== 'COMPLETED' ? (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              ✓ Mark Complete
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 text-xs">
              Select an inbound message to view details and allocate follow-up tasks.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
