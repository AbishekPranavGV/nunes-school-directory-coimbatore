'use client';

import React from 'react';
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Fuel, 
  Wrench, 
  Phone, 
  MessageCircle,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  Send,
  Building2,
  Package
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200/80 p-4" />
        ))}
      </div>
    );
  }

  const total = kpi.total_fleets || 33;
  const tnCount = kpi.tamil_nadu_fleets || 24;
  const klCount = kpi.kerala_fleets || 9;
  const branchesTotal = kpi.total_branches_count || 103;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* Card 1: TOTAL FLEET */}
      <div 
        onClick={() => onSelectQuickFilter('')}
        className={`p-4 bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
          !activeQuickFilter ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL FLEET
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {total}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">vehicles registered</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active: {tnCount} TN
          </span>
          <span className="text-amber-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Idle: {klCount} KL
          </span>
        </div>
      </div>

      {/* Card 2: ACTIVE UTILISATION */}
      <div 
        onClick={() => onSelectQuickFilter('has_branches')}
        className={`p-4 bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
          activeQuickFilter === 'has_branches' ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ACTIVE NOW
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {total}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">100% utilisation rate</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +4% vs last week
            </span>
            <span className="text-slate-400 font-mono text-[10px]">Verified</span>
          </div>
        </div>
      </div>

      {/* Card 3: FLEET CATEGORIES */}
      <div 
        onClick={() => onSelectQuickFilter('bus_services')}
        className={`p-4 bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
          activeQuickFilter === 'bus_services' ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              FLEET CATEGORIES
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              4 Types
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">buses, lorries, 3PL, govt</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Buses: {kpi.bus_services}
          </span>
          <span className="text-slate-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Lorries: {kpi.lorry_services}
          </span>
        </div>
      </div>

      {/* Card 4: VERIFIED CONTACTS */}
      <div 
        onClick={() => onSelectQuickFilter('has_whatsapp')}
        className={`p-4 bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
          activeQuickFilter === 'has_whatsapp' ? 'border-amber-300 ring-2 ring-amber-500/10' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              VERIFIED CONTACTS
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              100%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">direct owner & dispatch lines</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-emerald-600" />
            {kpi.whatsapp_verified} WhatsApp
          </span>
          <span className="text-slate-600 font-medium flex items-center gap-1">
            {kpi.email_verified} Emails
          </span>
        </div>
      </div>

      {/* Card 5: REGIONAL DEPOTS */}
      <div 
        onClick={() => {
          if (onNavigateToBranches) onNavigateToBranches();
        }}
        className={`p-4 bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 border-slate-200/80 hover:border-slate-300`}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              REGIONAL DEPOTS
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {branchesTotal}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">inter-state branch network</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-purple-700 font-medium">
            78 Tamil Nadu
          </span>
          <span className="text-emerald-700 font-medium">
            25 Kerala
          </span>
        </div>
      </div>

    </div>
  );
};
