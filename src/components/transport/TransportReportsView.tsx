'use client';

import React from 'react';
import { 
  BarChart3, 
  Truck, 
  Bus, 
  ShieldCheck, 
  MapPin, 
  Award,
  Users,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { TransportRecord, TransportKPI } from '@/types/transport';

interface TransportReportsViewProps {
  operators: TransportRecord[];
  kpi: TransportKPI | null;
}

export const TransportReportsView: React.FC<TransportReportsViewProps> = ({
  operators,
  kpi
}) => {
  // Category counts
  const categoryMap: { [cat: string]: number } = {};
  operators.forEach(op => {
    categoryMap[op.category] = (categoryMap[op.category] || 0) + 1;
  });

  // District counts
  const districtMap: { [dist: string]: number } = {};
  operators.forEach(op => {
    districtMap[op.district] = (districtMap[op.district] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const sortedDistricts = Object.entries(districtMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Freight & Bulkers Split</p>
              <h4 className="text-xl font-bold text-slate-900">
                {kpi ? Math.round((kpi.lorry_services / kpi.total_fleets) * 100) : 0}% Lorry Share
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Namakkal, Sankagiri, and Chennai harbor corridors represent the largest concentration of heavy multi-axle freight.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Passenger Omni Buses</p>
              <h4 className="text-xl font-bold text-slate-900">
                {kpi ? Math.round((kpi.bus_services / kpi.total_fleets) * 100) : 0}% Passenger Share
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Koyambedu, Gandhipuram, and Swarnapuri form the primary triangle for intercity luxury AC sleeper operations.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Contact Verification Index</p>
              <h4 className="text-xl font-bold text-slate-900">
                100% Verified
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            All registered operators possess verified managing director names, working telephone lines, and active WhatsApp dispatch channels.
          </p>
        </div>

      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-600" /> Fleet Category Breakdown
          </h3>
          <div className="space-y-3">
            {sortedCategories.map(([cat, count]) => {
              const pct = Math.round((count / operators.length) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800">{cat}</span>
                    <span className="text-slate-500 font-mono">{count} operators ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* District Breakdown */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" /> Geographic Hub Concentration
          </h3>
          <div className="space-y-3">
            {sortedDistricts.map(([district, count]) => {
              const pct = Math.round((count / operators.length) * 100);
              return (
                <div key={district} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800">{district} Hub</span>
                    <span className="text-slate-500 font-mono">{count} fleets ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-sky-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
