'use client';

import React from 'react';
import { 
  Download, 
  FileText, 
  Building2, 
  Users, 
  Send, 
  AlertTriangle, 
  Inbox, 
  Calendar, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface ReportsAndExportsSectionProps {
  selectedState: string;
  selectedDistrict: string;
}

export const ReportsAndExportsSection: React.FC<ReportsAndExportsSectionProps> = ({
  selectedState,
  selectedDistrict
}) => {
  const reports = [
    {
      id: 'selected_schools',
      title: '1. Selected Schools Directory Roster',
      desc: 'All educational institutions matching current geographical scope, complete with UDISE, category, and address.',
      icon: Building2,
      color: 'bg-sky-50 text-sky-700',
      type: 'selected_schools'
    },
    {
      id: 'eligible_contacts',
      title: '2. Contact-Ready Institutional Recipients',
      desc: 'Validated schools with confirmed official email addresses ready for circular outreach.',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700',
      type: 'eligible_contacts'
    },
    {
      id: 'missing_contacts',
      title: '3. Data Enrichment & Missing Contacts Queue',
      desc: 'Institutions requiring telephone switchboard or principal office email verification.',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-700',
      type: 'selected_schools'
    },
    {
      id: 'sent_campaigns',
      title: '4. Sent Campaigns & Outreach Registry',
      desc: 'Historical broadcast archive with reference numbers, target regions, and recipient statistics.',
      icon: Send,
      color: 'bg-indigo-50 text-indigo-700',
      type: 'sent_campaigns'
    },
    {
      id: 'delivery_events',
      title: '5. Transmission Telemetry & Delivery Log',
      desc: 'Per-recipient delivery audit logs, provider response codes (250 OK), and transmission latencies.',
      icon: CheckCircle2,
      color: 'bg-teal-50 text-teal-700',
      type: 'delivery_events'
    },
    {
      id: 'delivery_failures',
      title: '6. Delivery Bounces & Failure Diagnostics',
      desc: 'Comprehensive suppression list of bounced or rejected addresses with error reasons.',
      icon: AlertTriangle,
      color: 'bg-rose-50 text-rose-700',
      type: 'delivery_failures'
    },
    {
      id: 'replies',
      title: '7. Inbound Replies & Intent Classifications',
      desc: 'Classified inquiries (Demonstration, Quotation, Specifications) received from schools.',
      icon: Inbox,
      color: 'bg-purple-50 text-purple-700',
      type: 'replies'
    },
    {
      id: 'followup_tasks',
      title: '8. Sales Coordinator Follow-Up Task Register',
      desc: 'Action items assigned to sales and technical support teams with priorities and due dates.',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-700',
      type: 'followup_tasks'
    },
    {
      id: 'district_performance',
      title: '9. District-Wise Institutional Outreach Metrics',
      desc: 'Aggregated analytics across Tamil Nadu (38 districts) and Kerala (14 districts).',
      icon: BarChart3,
      color: 'bg-slate-100 text-slate-800',
      type: 'district_performance'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-950 text-white rounded-3xl shadow-xl border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-500 text-slate-950 font-black">
              <Download className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Institutional Reports & CSV / Excel Export Center
            </h2>
          </div>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
            Download production-ready spreadsheets covering verified recipient lists, delivery logs, inbound replies, and coordinator follow-up tasks.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono text-emerald-300">
          Format: <strong>RFC 4180 CSV / Excel Compatible</strong>
        </div>
      </div>

      {/* Grid of 9 Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((rpt) => {
          const Icon = rpt.icon;
          return (
            <div
              key={rpt.id}
              className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`p-2.5 rounded-2xl ${rpt.color}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    LIVE DATA
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  {rpt.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {rpt.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
                <a
                  href={`/api/circulars/v2/export?type=${rpt.type}&state=${selectedState}&district=${selectedDistrict}`}
                  download
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-102"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report (CSV)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
