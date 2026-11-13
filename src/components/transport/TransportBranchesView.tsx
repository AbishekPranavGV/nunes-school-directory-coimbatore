'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Search, 
  Filter, 
  Truck, 
  Bus, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Warehouse,
  Wrench,
  Package
} from 'lucide-react';
import { TransportRecord, BranchOffice } from '@/types/transport';

interface TransportBranchesViewProps {
  operators: TransportRecord[];
  onSelectOperator: (operator: TransportRecord) => void;
}

export const TransportBranchesView: React.FC<TransportBranchesViewProps> = ({
  operators,
  onSelectOperator
}) => {
  const [searchCity, setSearchCity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Collect all branches flattened with parent operator
  const allBranches: { branch: BranchOffice; parent: TransportRecord }[] = [];
  operators.forEach(op => {
    if (op.branches && op.branches.length > 0) {
      op.branches.forEach(b => {
        allBranches.push({ branch: b, parent: op });
      });
    }
  });

  // Unique cities list
  const cities = ['ALL', ...Array.from(new Set(allBranches.map(b => b.branch.city)))];

  const filtered = allBranches.filter(({ branch, parent }) => {
    if (searchCity !== 'ALL' && branch.city.toLowerCase() !== searchCity.toLowerCase()) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        branch.branch_name.toLowerCase().includes(q) ||
        branch.city.toLowerCase().includes(q) ||
        branch.manager_name.toLowerCase().includes(q) ||
        branch.address.toLowerCase().includes(q) ||
        parent.company_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Tamil Nadu Transport Regional Branch Network
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-amber-900 shadow-2xs">
              {allBranches.length} Active Regional Depots
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
            Direct depot contacts, regional booking lounges, container freight yards, and parcel transshipment hubs across all 38 districts of Tamil Nadu.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-white">{cities.length - 1}</span>
          <p className="text-xs text-amber-200 font-semibold">Hub Cities Connected</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search branch name, manager, parent company, or address..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
        </div>

        {/* City Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-md scrollbar-none">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSearchCity(city)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                searchCity.toLowerCase() === city.toLowerCase()
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ branch, parent }) => {
          const isBus = parent.service_type === 'bus';
          const cleanPhone = branch.phone.replace(/[^0-9+]/g, '');
          const cleanWhatsApp = branch.whatsapp.replace(/[^0-9]/g, '');

          return (
            <div 
              key={branch.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isBus ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {isBus ? <Bus className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                        {branch.branch_name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Parent: <strong className="text-slate-800">{parent.company_name}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 shrink-0">
                    {branch.city}
                  </span>
                </div>

                {/* Facility & Manager Card */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {branch.facility_type}
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    Manager: {branch.manager_name}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {branch.address}
                  </p>
                </div>

                {/* Direct Contacts */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Direct WhatsApp:</span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${branch.manager_name}, contacting ${branch.branch_name} (${parent.company_name}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>+{branch.whatsapp}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Depot Phone:</span>
                    <a href={`tel:${cleanPhone}`} className="font-semibold text-slate-800 hover:underline">
                      {branch.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${branch.manager_name}, contacting ${branch.branch_name} (${parent.company_name}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Depot</span>
                </a>

                <button
                  onClick={() => onSelectOperator(parent)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all"
                >
                  Fleet Dossier
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
