'use client';

import React from 'react';
import { 
  Truck, 
  Bus, 
  MessageCircle, 
  Mail, 
  UserCheck, 
  Award,
  Globe2,
  Building2
} from 'lucide-react';
import { TransportKPI } from '@/types/transport';

interface TransportKPICardsProps {
  kpi: TransportKPI | null;
  onSelectQuickFilter: (filter: string) => void;
  activeQuickFilter: string | null;
}

export const TransportKPICards: React.FC<TransportKPICardsProps> = ({
  kpi,
  onSelectQuickFilter,
  activeQuickFilter
}) => {
  if (!kpi) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-white/70 border border-slate-200/60 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'all_fleets',
      title: 'Transport Operators',
      value: kpi.total_fleets.toLocaleString(),
      subtext: `${kpi.districts_covered} Key TN Hubs`,
      icon: Building2,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      filterValue: ''
    },
    {
      id: 'bus_services',
      title: 'Bus Fleets',
      value: kpi.bus_services.toLocaleString(),
      subtext: 'Omni, AC Sleeper & Tourist',
      icon: Bus,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
      filterValue: 'bus_services'
    },
    {
      id: 'lorry_services',
      title: 'Lorry & Haulers',
      value: kpi.lorry_services.toLocaleString(),
      subtext: 'Multi-Axle, Bulkers & FTL',
      icon: Truck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      filterValue: 'lorry_services'
    },
    {
      id: 'verified_owners',
      title: 'Verified Owners',
      value: kpi.verified_owners.toLocaleString(),
      subtext: '100% Named MD / Proprietors',
      icon: UserCheck,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      filterValue: 'verified_owners'
    },
    {
      id: 'has_whatsapp',
      title: 'WhatsApp Ready',
      value: kpi.whatsapp_verified.toLocaleString(),
      subtext: '1-Click Direct Chat Links',
      icon: MessageCircle,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      filterValue: 'has_whatsapp'
    },
    {
      id: 'has_email',
      title: 'Official Email / Gmail',
      value: kpi.email_verified.toLocaleString(),
      subtext: 'Verified Dispatch Inboxes',
      icon: Mail,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      filterValue: 'has_email'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeQuickFilter === card.filterValue;

        return (
          <div
            key={card.id}
            onClick={() => onSelectQuickFilter(card.filterValue)}
            className={`p-3.5 bg-white rounded-xl border transition-all cursor-pointer hover:shadow-md ${
              isSelected
                ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-50/20 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 truncate">{card.title}</span>
              <div className={`w-7 h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
