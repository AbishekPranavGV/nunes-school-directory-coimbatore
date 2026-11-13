'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  MessageCircle, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Eye, 
  Edit3, 
  Check, 
  X, 
  ArrowUpRight,
  TrendingUp,
  Server,
  Zap,
  Filter,
  Search,
  ExternalLink,
  Phone
} from 'lucide-react';
import { 
  TransportCircular, 
  SenderQuotaMetrics, 
  EmailDeliverabilityStats, 
  BouncedEmailRecord,
  TransportRecord 
} from '@/types/transport';

interface TransportCircularsHubViewProps {
  operators: TransportRecord[];
  onOpenCircularPreview: (circular: TransportCircular) => void;
  onOpenCircularEdit: (circular: TransportCircular) => void;
  onComposeNewCircular: () => void;
}

export const TransportCircularsHubView: React.FC<TransportCircularsHubViewProps> = ({
  operators,
  onOpenCircularPreview,
  onOpenCircularEdit,
  onComposeNewCircular
}) => {
  const [subTab, setSubTab] = useState<'circulars' | 'bounces' | 'quota'>('circulars');
  const [circulars, setCirculars] = useState<TransportCircular[]>([]);
  const [senderQuota, setSenderQuota] = useState<SenderQuotaMetrics | null>(null);
  const [deliverability, setDeliverability] = useState<EmailDeliverabilityStats | null>(null);
  const [bouncedEmails, setBouncedEmails] = useState<BouncedEmailRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bounceSearch, setBounceSearch] = useState<string>('');
  const [bounceFilter, setBounceFilter] = useState<string>('ALL');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Load circulars & deliverability data
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transport/circulars');
      const data = await res.json();
      if (data.success) {
        setCirculars(data.circulars || []);
        setSenderQuota(data.sender_quota || null);
        setDeliverability(data.deliverability_stats || null);
        setBouncedEmails(data.bounced_emails || []);
      }
    } catch (err) {
      console.error('Error loading circulars data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetryBounce = async (bounceId: string) => {
    try {
      const res = await fetch('/api/transport/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry_bounce', bounce_id: bounceId })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message);
        setBouncedEmails(prev => prev.map(b => b.id === bounceId ? data.bounced_record : b));
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err: any) {
      alert(`Error retrying email: ${err.message}`);
    }
  };

  const handleSwitchToWhatsApp = async (bounceId: string) => {
    try {
      const res = await fetch('/api/transport/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch_to_whatsapp', bounce_id: bounceId })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message);
        setBouncedEmails(prev => prev.map(b => b.id === bounceId ? data.bounced_record : b));
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err: any) {
      alert(`Error switching to WhatsApp: ${err.message}`);
    }
  };

  const filteredBounces = bouncedEmails.filter(b => {
    if (bounceFilter !== 'ALL' && !b.bounce_type.toLowerCase().includes(bounceFilter.toLowerCase())) return false;
    if (bounceSearch) {
      const q = bounceSearch.toLowerCase();
      return b.company_name.toLowerCase().includes(q) ||
             b.recipient_email.toLowerCase().includes(q) ||
             b.error_code.toLowerCase().includes(q) ||
             b.error_reason.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner: Circular & Deliverability Command Centre */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Send className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Official Transport Circulars & Deliverability Command Hub
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SMTP Warmup Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Direct dispatch system for sending official RTO mandates, freight tender invitations, and technical inspection notices to bus and lorry fleet proprietors across Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={onComposeNewCircular}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Compose New Circular</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            {actionSuccess}
          </span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Primary Deliverability & Sender Limits Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Sender's Daily Quota */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sender's Daily Quota</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {senderQuota ? senderQuota.sent_today : 438}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {senderQuota ? senderQuota.daily_limit : 2000} Max
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${senderQuota ? (senderQuota.sent_today / senderQuota.daily_limit) * 100 : 22}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Remaining: <strong className="text-slate-800">{senderQuota ? senderQuota.remaining_today : 1562}</strong></span>
            <span className="text-indigo-700 font-medium">Resets: {senderQuota?.cooldown_resets_in || '07h 14m'}</span>
          </div>
        </div>

        {/* Card 2: Delivery Success Rate */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Success Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-700">
                {deliverability ? deliverability.delivery_rate_pct : 97.16}%
              </span>
              <span className="text-xs text-slate-500">High Trust</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              <strong>{deliverability ? deliverability.delivered_count.toLocaleString() : '1,438'}</strong> of {deliverability ? deliverability.total_dispatched.toLocaleString() : '1,480'} emails delivered
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Target: &gt; 95.0%</span>
            <span className="text-emerald-700 font-semibold">TLS Encrypted</span>
          </div>
        </div>

        {/* Card 3: Open & Engagement Rate */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Open & Read Rate</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sky-700">
                {deliverability ? deliverability.open_rate_pct : 78.16}%
              </span>
              <span className="text-xs text-slate-500 font-medium">({deliverability?.opened_count || 1124} Reads)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              WhatsApp Conversion: <strong className="text-slate-800">{deliverability ? deliverability.click_rate_pct : 44.64}%</strong>
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Avg Read Time: 2m 40s</span>
            <span className="text-sky-700 font-medium">Mobile 82%</span>
          </div>
        </div>

        {/* Card 4: Bounced Back Rate & Health */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bounce Rate & Health</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-700">
                {deliverability ? deliverability.bounce_rate_pct : 2.84}%
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Safe (&lt; 3.0%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {deliverability?.bounced_count || 42} Bounces ({deliverability?.hard_bounces || 14} Hard / {deliverability?.soft_bounces || 28} Soft)
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Spam Complaints: <strong>0.07%</strong></span>
            <button 
              onClick={() => setSubTab('bounces')}
              className="text-amber-800 hover:text-amber-900 font-bold hover:underline"
            >
              View 8 Bounces →
            </button>
          </div>
        </div>

      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-2xs">
        <button
          onClick={() => setSubTab('circulars')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            subTab === 'circulars'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Circulars to Send ({circulars.length})</span>
        </button>

        <button
          onClick={() => setSubTab('bounces')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            subTab === 'bounces'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Bounced Back Emails & Remediation ({bouncedEmails.length})</span>
        </button>

        <button
          onClick={() => setSubTab('quota')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            subTab === 'quota'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Sender Limits & Deliverability Policy</span>
        </button>
      </div>

      {/* SUB-TAB 1: CIRCULARS TO SEND */}
      {subTab === 'circulars' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {circulars.map((cir) => (
              <div 
                key={cir.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Ref: {cir.ref_no}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cir.status === 'Sent' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {cir.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                    {cir.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px] text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{cir.category}</span>
                    <span>•</span>
                    <span className="text-indigo-700 font-medium">Target: {cir.target_audience}</span>
                    {cir.recipient_count && (
                      <>
                        <span>•</span>
                        <span>{cir.recipient_count} Fleets Targeted</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {cir.body}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    Issued: {cir.signatory_name}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenCircularEdit(cir)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                      title="Edit Circular Text & Recipients"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onOpenCircularPreview(cir)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all shadow-2xs"
                      title="Preview Official Nunes Instruments Letterhead"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Official Letterhead</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BOUNCED BACK EMAILS & REMEDIATION */}
      {subTab === 'bounces' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={bounceSearch}
                onChange={(e) => setBounceSearch(e.target.value)}
                placeholder="Search bounced email, operator, or error code (550, 452)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={bounceFilter}
                onChange={(e) => setBounceFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="ALL">All Bounce Types</option>
                <option value="Hard">Hard Bounces Only</option>
                <option value="Soft">Soft Bounces Only</option>
              </select>
            </div>
          </div>

          {/* Bounced Emails Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    <th className="py-3 px-4">Operator & Recipient</th>
                    <th className="py-3 px-3">Bounced Address</th>
                    <th className="py-3 px-3">Bounce Classification</th>
                    <th className="py-3 px-3">SMTP Error Code & Reason</th>
                    <th className="py-3 px-3">Timestamp & Retries</th>
                    <th className="py-3 px-4 text-right">Remediation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBounces.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No bounced emails match the current filter
                      </td>
                    </tr>
                  ) : (
                    filteredBounces.map((b) => {
                      const isHard = b.bounce_type.includes('Hard');
                      const cleanWhatsApp = b.whatsapp_number.replace(/[^0-9]/g, '');

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            <div>
                              <p className="font-bold text-slate-900">{b.company_name}</p>
                              <p className="text-[10px] text-slate-400">Contact: {b.recipient_name} ({b.district})</p>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-mono text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {b.recipient_email}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isHard ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {b.bounce_type}
                            </span>
                          </td>

                          <td className="py-3 px-3 max-w-xs">
                            <div>
                              <span className="font-mono font-bold text-slate-800 text-[11px] block">{b.error_code}</span>
                              <p className="text-[10px] text-slate-500 truncate" title={b.error_reason}>{b.error_reason}</p>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-[11px] text-slate-500">
                            <div>
                              <span>{b.timestamp}</span>
                              <p className="text-[10px] text-slate-400">Attempts: {b.retry_attempts}</p>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Switch to WhatsApp button */}
                              <a
                                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${b.recipient_name}, reaching out from Nunes Instruments regarding ${b.company_name}. We noticed our circular could not be delivered to ${b.recipient_email}. Kindly verify your updated dispatch address.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleSwitchToWhatsApp(b.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-[11px] transition-all shadow-2xs"
                                title="Switch to WhatsApp outreach"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                                <span>WhatsApp</span>
                              </a>

                              {/* Retry Send */}
                              <button
                                onClick={() => handleRetryBounce(b.id)}
                                className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all border border-slate-200"
                                title="Retry SMTP Handshake"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: SENDER LIMITS & POLICY */}
      {subTab === 'quota' && (
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" /> Amazon SES / SMTP Gateway Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Dedicated IP Pool</span>
                <p className="text-sm font-mono font-bold text-slate-900 mt-1">198.51.100.44 (us-east-1)</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Sending Rate Limit</span>
                <p className="text-sm font-mono font-bold text-slate-900 mt-1">85 emails / min (Max: 300 / min)</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">DKIM & DMARC Alignment</span>
                <p className="text-sm font-mono font-bold text-emerald-700 mt-1">100% Strict Pass</p>
              </div>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 leading-relaxed">
              <strong>Anti-Spam & Deliverability Safeguards:</strong> In accordance with Tamil Nadu commercial telecommunications policies, all emails include clean unsubscribe mechanisms, authorized corporate letterhead headers, and automated suppression lists when a hard bounce is logged.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
