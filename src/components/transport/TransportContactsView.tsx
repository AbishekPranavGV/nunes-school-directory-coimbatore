'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  ShieldCheck, 
  Search, 
  Zap, 
  UserCheck, 
  MapPin, 
  Building2, 
  ExternalLink,
  CheckCircle2,
  PhoneCall,
  User
} from 'lucide-react';
import { TransportRecord } from '@/types/transport';

interface TransportContactsViewProps {
  operators: TransportRecord[];
  onSelectOperator: (op: TransportRecord) => void;
  onOneClickEmail: (op: TransportRecord) => void;
}

export const TransportContactsView: React.FC<TransportContactsViewProps> = ({
  operators,
  onSelectOperator,
  onOneClickEmail
}) => {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | 'Tamil Nadu' | 'Kerala'>('all');

  const filtered = operators.filter(op => {
    if (stateFilter !== 'all' && op.state !== stateFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        op.company_name.toLowerCase().includes(q) ||
        op.owner_name.toLowerCase().includes(q) ||
        op.district.toLowerCase().includes(q) ||
        op.contact_number.includes(q) ||
        op.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Banner / Switchboard Overview */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-900">
              Verified Switchboard & Contact Directory
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              100% Verified
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Direct telephone lines, official WhatsApp dispatch, and verified corporate email addresses for managing directors across Tamil Nadu and Kerala.
          </p>
        </div>

        {/* State Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setStateFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              stateFilter === 'all' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All South India ({operators.length})
          </button>
          <button
            onClick={() => setStateFilter('Tamil Nadu')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              stateFilter === 'Tamil Nadu' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌿 Tamil Nadu ({operators.filter(o => o.state === 'Tamil Nadu').length})
          </button>
          <button
            onClick={() => setStateFilter('Kerala')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              stateFilter === 'Kerala' ? 'bg-white text-amber-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌴 Kerala ({operators.filter(o => o.state === 'Kerala').length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by owner, company, phone, or email..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 shadow-2xs"
        />
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((op) => (
          <div
            key={op.id}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      op.state === 'Kerala' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {op.state === 'Kerala' ? '🌴 Kerala' : '🏛️ Tamil Nadu'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {op.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {op.company_name}
                  </h3>
                </div>

                <button
                  onClick={() => onSelectOperator(op)}
                  className="text-xs text-blue-600 hover:underline font-semibold shrink-0 cursor-pointer"
                >
                  Details →
                </button>
              </div>

              {/* Owner / MD Info */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{op.owner_name}</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-5 truncate">
                  {op.owner_designation}
                </p>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pl-5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{op.district}, {op.state}</span>
                </div>
              </div>

              {/* Direct Contact Numbers & Email */}
              <div className="space-y-2 text-xs">
                {/* Telephone */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 border border-blue-100/70">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-mono text-slate-800 font-semibold">{op.contact_number}</span>
                  </span>
                  <a
                    href={`tel:${op.contact_number}`}
                    className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-bold hover:bg-blue-700 transition-colors"
                  >
                    Call
                  </a>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/70">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono text-slate-800 font-semibold">+{op.whatsapp_number}</span>
                  </span>
                  <a
                    href={`https://wa.me/${op.whatsapp_number}?text=Hello%20${encodeURIComponent(op.company_name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>

                {/* Corporate Email & 1-Click Send */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 border border-amber-100/70">
                  <span className="text-slate-500 flex items-center gap-1.5 truncate max-w-[170px]">
                    <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-mono text-slate-800 font-medium truncate text-[11px]">{op.email}</span>
                  </span>
                  <button
                    onClick={() => onOneClickEmail(op)}
                    title="Send Circular in 1-Click (TLS 1.3 Verified)"
                    className="px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold hover:bg-amber-700 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>1-Click</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{op.branches.length} Regional Depots</span>
              <span className="text-emerald-700 font-semibold">Verified</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
