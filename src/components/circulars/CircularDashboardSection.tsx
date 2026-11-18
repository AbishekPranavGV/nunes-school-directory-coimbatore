'use client';

import React from 'react';
import { 
  Building2, 
  Mail, 
  MessageCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Send, 
  XCircle, 
  Inbox, 
  Sparkles, 
  ListTodo,
  TrendingUp,
  MapPin,
  ArrowRight,
  Filter
} from 'lucide-react';
import { CircularV2DashboardMetrics, CircularSectionTab } from '@/types/circular';

interface CircularDashboardSectionProps {
  metrics: CircularV2DashboardMetrics | null;
  onNavigateTab: (tab: CircularSectionTab) => void;
  selectedState: string;
  selectedDistrict: string;
  onSelectState: (state: string) => void;
  onSelectDistrict: (district: string) => void;
}

export const CircularDashboardSection: React.FC<CircularDashboardSectionProps> = ({
  metrics,
  onNavigateTab,
  selectedState,
  selectedDistrict,
  onSelectState,
  onSelectDistrict
}) => {
  if (!metrics) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Loading real-time institutional outreach telemetry...</p>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Schools in Scope',
      value: metrics.total_schools_in_scope.toLocaleString(),
      sub: `${selectedState === 'all' ? 'Tamil Nadu & Kerala' : selectedState === 'kerala' ? 'Kerala (14 Dists)' : 'Tamil Nadu (38 Dists)'}`,
      icon: Building2,
      color: 'text-slate-900',
      bgColor: 'bg-slate-100',
      tab: 'recipients' as CircularSectionTab
    },
    {
      label: 'Verified Official Emails',
      value: metrics.verified_emails.toLocaleString(),
      sub: `${Math.round((metrics.verified_emails / (metrics.total_schools_in_scope || 1)) * 100)}% Verified Reach`,
      icon: Mail,
      color: 'text-sky-700',
      bgColor: 'bg-sky-50',
      tab: 'recipients' as CircularSectionTab
    },
    {
      label: 'Eligible WhatsApp Contacts',
      value: metrics.eligible_whatsapp_contacts.toLocaleString(),
      sub: 'Verified switchboards/phones',
      icon: MessageCircle,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      tab: 'recipients' as CircularSectionTab
    },
    {
      label: 'Missing Contact Details',
      value: metrics.missing_contact_details.toLocaleString(),
      sub: 'Awaiting phone or email discovery',
      icon: AlertTriangle,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      tab: 'recipients' as CircularSectionTab
    },
    {
      label: 'Draft Circulars',
      value: metrics.draft_circulars.toString(),
      sub: 'Work in progress',
      icon: FileText,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      tab: 'create' as CircularSectionTab
    },
    {
      label: 'Pending Approval',
      value: metrics.pending_approval.toString(),
      sub: 'Awaiting manager authorization',
      icon: Clock,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      tab: 'approval' as CircularSectionTab
    },
    {
      label: 'Approved Campaigns',
      value: metrics.approved_campaigns.toString(),
      sub: 'Ready for outbound broadcast',
      icon: CheckCircle2,
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      tab: 'campaigns' as CircularSectionTab
    },
    {
      label: 'Queued Messages',
      value: metrics.queued_messages.toString(),
      sub: 'Staged in outbound pipeline',
      icon: Send,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      tab: 'tracking' as CircularSectionTab
    },
    {
      label: 'Sent Messages',
      value: metrics.sent_messages.toLocaleString(),
      sub: 'Delivered to school inboxes',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      tab: 'tracking' as CircularSectionTab
    },
    {
      label: 'Delivery Failures',
      value: metrics.delivery_failures.toString(),
      sub: 'Bounced / Rejected addresses',
      icon: XCircle,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      tab: 'tracking' as CircularSectionTab
    },
    {
      label: 'Replies Received',
      value: metrics.replies_received.toString(),
      sub: 'Direct school feedback in inbox',
      icon: Inbox,
      color: 'text-sky-700',
      bgColor: 'bg-sky-50',
      tab: 'replies' as CircularSectionTab
    },
    {
      label: 'Interested Institutions',
      value: metrics.interested_institutions.toString(),
      sub: 'Quotes & demo requests',
      icon: Sparkles,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      tab: 'replies' as CircularSectionTab
    },
    {
      label: 'Follow-ups Pending',
      value: metrics.followups_pending.toString(),
      sub: 'Allocated to sales coordinators',
      icon: ListTodo,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      tab: 'replies' as CircularSectionTab
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Scope Selector Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800">Geographical Scope Filter:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={selectedState}
            onChange={(e) => {
              onSelectState(e.target.value);
              onSelectDistrict('all');
            }}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">🌐 All South India (TN + Kerala)</option>
            <option value="tamil-nadu">🌿 Tamil Nadu (38 Districts)</option>
            <option value="kerala">🌴 Kerala (14 Districts)</option>
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Districts in Scope</option>
            <option value="coimbatore">Coimbatore (Primary Hub)</option>
            <option value="chennai">Chennai</option>
            <option value="madurai">Madurai</option>
            <option value="tiruchirappalli">Tiruchirappalli</option>
            <option value="salem">Salem</option>
            <option value="ernakulam">Ernakulam (Kochi)</option>
            <option value="thiruvananthapuram">Thiruvananthapuram</option>
            <option value="kozhikode">Kozhikode</option>
          </select>
        </div>
      </div>

      {/* 13 Key Real-time Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              onClick={() => onNavigateTab(kpi.tab)}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className={`p-2 rounded-xl ${kpi.bgColor} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="mt-2.5">
                <div className={`text-xl sm:text-2xl font-black ${kpi.color} font-mono tracking-tight`}>
                  {kpi.value}
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {kpi.label}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {kpi.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* District-level Breakdown Table */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>District-Level Institutional Campaign Coverage</span>
            </h3>
            <p className="text-xs text-slate-500">
              Real database counts of institutional schools, verified emails, and WhatsApp points of contact
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('recipients')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View Full Recipient Selector</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3 font-bold">District Name</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Institutions</th>
                <th className="py-2.5 px-3 font-bold text-right">Verified Emails</th>
                <th className="py-2.5 px-3 font-bold text-right">WhatsApp Contacts</th>
                <th className="py-2.5 px-3 font-bold text-right">Contact Completeness</th>
                <th className="py-2.5 px-3 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.district_breakdowns.slice(0, 8).map((d) => {
                const completeness = d.total > 0 ? Math.round((d.verified / d.total) * 100) : 0;
                return (
                  <tr key={d.district} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span>{d.district}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                      {d.total.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-sky-700 font-semibold">
                      {d.with_email.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                      {d.with_whatsapp.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${completeness}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          {completeness}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          onSelectDistrict(d.district.toLowerCase());
                          onNavigateTab('recipients');
                        }}
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Select Recipient Target
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
