'use client';

import React from 'react';
import { 
  Truck, 
  Bus, 
  MessageCircle, 
  Mail, 
  UserCheck, 
  Building2,
  AlertTriangle,
  Send,
  Package,
  Landmark
} from 'lucide-react';
import { TransportKPI } from '@/types/transport';

interface TransportKPICardsProps {
  kpi: TransportKPI | null;
  onSelectQuickFilter: (filter: string) => void;
  activeQuickFilter: string | null;
  onNavigateToCirculars?: () => void;
  onNavigateToBranches?: () => void;
}

export const TransportKPICards: React.FC<TransportKPICardsProps> = ({
  kpi,
  onSelectQuickFilter,
  activeQuickFilter,
  onNavigateToCirculars,
  onNavigateToBranches
}) => {
  if (!kpi) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-5 animate-pulse">
        {[...Array(8)].map((_, i) => (
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
      subtext: `${kpi.districts_covered} South India Hubs (TN & KL)`,
      icon: Building2,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      filterValue: ''
    },
    {
      id: 'bus_services',
      title: 'Bus Fleets',
      value: kpi.bus_services.toLocaleString(),
      subtext: 'Omni, Sleeper & Tourist',
      icon: Bus,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
      filterValue: 'bus_services'
    },
    {
      id: 'lorry_services',
      title: 'Lorry & Haulers',
      value: kpi.lorry_services.toLocaleString(),
      subtext: 'Multi-Axle & Bulkers',
      icon: Truck,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      filterValue: 'lorry_services'
    },
    {
      id: 'logistics_services',
      title: '3PL & Logistics',
      value: (kpi.logistics_services || 8).toLocaleString(),
      subtext: 'Multimodal & Linehaul',
      icon: Package,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      filterValue: 'logistics_services'
    },
    {
      id: 'govt_services',
      title: 'Govt & STU Fleets',
      value: (kpi.govt_services || 6).toLocaleString(),
      subtext: 'SETC, KSRTC SWIFT & MVD',
      icon: Landmark,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      filterValue: 'govt_services'
    },
    {
      id: 'branches',
      title: 'Regional Branches',
      value: (kpi.total_branches_count || 56).toLocaleString(),
      subtext: 'Depots in TN & Kerala',
      icon: Building2,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
      filterValue: 'has_branches',
      customAction: onNavigateToBranches
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
      id: 'deliverability',
      title: 'Email Deliverability',
      value: '97.2%',
      subtext: '2.84% Bounce (Safe < 3%)',
      icon: Send,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      filterValue: 'deliverability',
      customAction: onNavigateToCirculars
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeQuickFilter === card.filterValue;

        return (
          <div
            key={card.id}
            onClick={() => {
              if (card.customAction) {
                card.customAction();
              } else {
                onSelectQuickFilter(card.filterValue);
              }
            }}
            className={`p-3 bg-white rounded-xl border transition-all cursor-pointer hover:shadow-md ${
              isSelected
                ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-50/20 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 truncate">{card.title}</span>
              <div className={`w-6 h-6 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                {card.value}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
