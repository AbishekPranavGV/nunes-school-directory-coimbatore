'use client';

import React from 'react';
import { 
  Building, 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  ShieldAlert,
  Briefcase
} from 'lucide-react';
import { KPIMetrics } from '@/types';

interface KPICardsProps {
  kpi: KPIMetrics | null;
  onSelectQuickFilter: (filter: string) => void;
  activeQuickFilter: string | null;
}

export const KPICards: React.FC<KPICardsProps> = ({
  kpi,
  onSelectQuickFilter,
  activeQuickFilter
}) => {
  if (!kpi) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-white/70 border border-slate-200/60 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'all',
      title: 'Imported Schools',
      value: kpi.total_imported_schools.toLocaleString(),
      subtext: `Target: ${kpi.target_source_records} source records`,
      icon: Building,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
      borderColor: activeQuickFilter === null ? 'ring-2 ring-sky-500 border-sky-400' : 'border-slate-200',
      filterValue: ''
    },
    {
      id: 'complete',
      title: 'Any Contact Verified',
      value: kpi.verified_any_contact.toLocaleString(),
      subtext: `${kpi.coverage_percentage}% district coverage`,
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      borderColor: activeQuickFilter === 'complete' ? 'ring-2 ring-emerald-500 border-emerald-400' : 'border-slate-200',
      filterValue: 'complete'
    },
    {
      id: 'missing',
      title: 'Missing Contacts',
      value: kpi.high_priority_missing_contacts.toLocaleString(),
      subtext: 'High Priority Missing Queue',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      borderColor: activeQuickFilter === 'no_contact' ? 'ring-2 ring-rose-500 border-rose-400' : 'border-slate-200',
      filterValue: 'no_contact',
      badge: 'Needs Call'
    },
    {
      id: 'phone',
      title: 'Institutional Phone',
      value: kpi.verified_phone.toLocaleString(),
      subtext: 'Official Landline / Mobile',
      icon: PhoneCall,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      borderColor: 'border-slate-200',
      filterValue: ''
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Verified',
      value: kpi.verified_whatsapp.toLocaleString(),
      subtext: 'Official wa.me Verified Only',
      icon: MessageSquare,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
      borderColor: activeQuickFilter === 'no_whatsapp' ? 'ring-2 ring-teal-500 border-teal-400' : 'border-slate-200',
      filterValue: 'no_whatsapp'
    },
    {
      id: 'email',
      title: 'Official Email',
      value: kpi.verified_email.toLocaleString(),
      subtext: 'Institutional / Domain',
      icon: Mail,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      borderColor: activeQuickFilter === 'no_email' ? 'ring-2 ring-blue-500 border-blue-400' : 'border-slate-200',
      filterValue: 'no_email'
    },
    {
      id: 'principal_office',
      title: 'Principal Office Desk',
      value: kpi.verified_principal_office.toLocaleString(),
      subtext: `${kpi.verified_principal_name} headmaster names`,
      icon: Briefcase,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      borderColor: activeQuickFilter === 'no_principal_office' ? 'ring-2 ring-amber-500 border-amber-400' : 'border-slate-200',
      filterValue: 'no_principal_office'
    },
    {
      id: 'review',
      title: 'Pending Staff Review',
      value: kpi.pending_staff_review.toLocaleString(),
      subtext: `${kpi.duplicates_reconciled} duplicates reconciled`,
      icon: Clock,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      borderColor: activeQuickFilter === 'needs_verification' ? 'ring-2 ring-purple-500 border-purple-400' : 'border-slate-200',
      filterValue: 'needs_verification'
    }
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const isSelected = activeQuickFilter === c.filterValue && c.filterValue !== '';

          return (
            <button
              key={c.id}
              onClick={() => onSelectQuickFilter(c.filterValue)}
              className={`text-left p-3.5 bg-white rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between ${c.borderColor} ${
                isSelected ? 'bg-sky-50/40 shadow-sm' : 'hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center ${c.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {c.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 uppercase tracking-wide">
                      {c.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500 tracking-tight">{c.title}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{c.value}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate">{c.subtext}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
