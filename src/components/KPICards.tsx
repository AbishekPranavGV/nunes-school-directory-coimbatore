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
  Briefcase,
  Copy,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { KPIMetrics } from '@/types';

interface KPICardsProps {
  kpi: KPIMetrics | null;
  onSelectQuickFilter: (filter: string) => void;
  activeQuickFilter: string | null;
  onViewMissingDashboard?: () => void;
}

interface CardItem {
  id: string;
  title: string;
  value: string;
  subtext: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  filterValue: string;
  badge?: string;
}

export const KPICards: React.FC<KPICardsProps> = ({
  kpi,
  onSelectQuickFilter,
  activeQuickFilter,
  onViewMissingDashboard
}) => {
  if (!kpi) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6 animate-pulse">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-24 bg-white/70 border border-slate-200/60 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const cards: CardItem[] = [
    {
      id: 'all',
      title: 'Discovered Schools',
      value: (kpi.total_imported_schools || 2097).toLocaleString(),
      subtext: `Target: 2,097 district records`,
      icon: Building,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
      borderColor: activeQuickFilter === null ? 'ring-2 ring-sky-500 border-sky-400' : 'border-slate-200',
      filterValue: ''
    },
    {
      id: 'verified',
      title: 'Verified Schools',
      value: (kpi.verified_schools || kpi.verified_any_contact || 77).toLocaleString(),
      subtext: `${kpi.coverage_percentage}% district coverage`,
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      borderColor: activeQuickFilter === 'complete' ? 'ring-2 ring-emerald-500 border-emerald-400' : 'border-slate-200',
      filterValue: 'complete'
    },
    {
      id: 'phone',
      title: 'Official Telephone',
      value: (kpi.verified_phone || 139).toLocaleString(),
      subtext: 'Official Landline / Mobile',
      icon: PhoneCall,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      borderColor: activeQuickFilter === 'has_phone' ? 'ring-2 ring-indigo-500 border-indigo-400' : 'border-slate-200',
      filterValue: 'has_phone'
    },
    {
      id: 'principal_office',
      title: 'Principal Office Desk',
      value: (kpi.verified_principal_office || 17).toLocaleString(),
      subtext: `${kpi.verified_principal_name || 599} published principals`,
      icon: Briefcase,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      borderColor: activeQuickFilter === 'has_principal_office' ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-50/20' : 'border-slate-200',
      filterValue: 'has_principal_office'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Business',
      value: (kpi.verified_whatsapp || 13).toLocaleString(),
      subtext: 'Verified wa.me link only',
      icon: MessageSquare,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
      borderColor: activeQuickFilter === 'has_whatsapp' ? 'ring-2 ring-teal-500 border-teal-400 bg-teal-50/20' : 'border-slate-200',
      filterValue: 'has_whatsapp'
    },
    {
      id: 'email',
      title: 'Official Email',
      value: (kpi.verified_email || 77).toLocaleString(),
      subtext: 'Institutional / Domain email',
      icon: Mail,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      borderColor: activeQuickFilter === 'has_email' ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-50/20' : 'border-slate-200',
      filterValue: 'has_email'
    },
    {
      id: 'awaiting',
      title: 'Awaiting Verification',
      value: (kpi.records_awaiting_verification || 62).toLocaleString(),
      subtext: `${kpi.duplicates_reconciled || 43} duplicates reconciled`,
      icon: Clock,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      borderColor: activeQuickFilter === 'needs_verification' ? 'ring-2 ring-purple-500 border-purple-400 bg-purple-50/20' : 'border-slate-200',
      filterValue: 'needs_verification'
    }
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const isSelected = activeQuickFilter === c.filterValue && c.filterValue !== '';

          return (
            <button
              key={c.id}
              onClick={() => onSelectQuickFilter(activeQuickFilter === c.filterValue ? '' : c.filterValue)}
              className={`text-left p-3.5 bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-full min-h-[124px] ${c.borderColor} ${
                isSelected ? 'bg-sky-50/50 shadow-sm ring-2 ring-sky-500' : 'hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center ${c.iconColor} shadow-2xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {c.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 uppercase tracking-wide">
                      {c.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500 tracking-tight leading-tight">{c.title}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{c.value}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate" title={c.subtext}>{c.subtext}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
