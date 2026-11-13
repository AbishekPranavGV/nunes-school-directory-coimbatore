'use client';

import React from 'react';
import { 
  Search, 
  X, 
  MessageCircle, 
  Mail, 
  Truck, 
  Bus, 
  MapPin, 
  Award,
  Filter
} from 'lucide-react';

interface TransportFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  district: string;
  onDistrictChange: (district: string) => void;
  permitType: string;
  onPermitTypeChange: (permit: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  quickFilter: string | null;
  onQuickFilterChange: (qf: string | null) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

const CATEGORIES = [
  'Omni Bus (Intercity Sleeper / AC)',
  'Tourist Coach & Contract Carriage',
  'Staff & Educational Bus',
  'Heavy Commercial Lorry (Multi-Axle)',
  'Bulk LPG & Petroleum Tanker',
  'Container & Port Logistics',
  'ODC & Heavy Trailer Haulage',
  'Parcel, Express Cargo & FTL',
  'Mini Truck & Light Commercial'
];

const PERMIT_TYPES = [
  'National Permit (All India)',
  'South Zone Permit',
  'State Goods Carriage',
  'All India Tourist Permit (AITP)',
  'Stage Carriage'
];

const DISTRICT_HUBS = [
  { id: 'all', name: 'All Districts' },
  { id: 'coimbatore', name: 'Coimbatore' },
  { id: 'namakkal', name: 'Namakkal' },
  { id: 'salem', name: 'Salem' },
  { id: 'chennai', name: 'Chennai' },
  { id: 'tiruppur', name: 'Tiruppur' },
  { id: 'madurai', name: 'Madurai' },
  { id: 'tiruchirappalli', name: 'Trichy' },
  { id: 'erode', name: 'Erode' },
  { id: 'karur', name: 'Karur' },
  { id: 'thoothukudi', name: 'Tuticorin' },
  { id: 'tirunelveli', name: 'Tirunelveli' },
  { id: 'krishnagiri', name: 'Krishnagiri / Hosur' },
  { id: 'vellore', name: 'Vellore' }
];

export const TransportFilterBar: React.FC<TransportFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  district,
  onDistrictChange,
  permitType,
  onPermitTypeChange,
  status,
  onStatusChange,
  quickFilter,
  onQuickFilterChange,
  onResetFilters,
  totalFiltered
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
    (category && category !== 'all') ||
    (district && district !== 'all') ||
    (permitType && permitType !== 'all') ||
    (status && status !== 'all') ||
    quickFilter
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 mb-5 shadow-xs space-y-3">
      
      {/* Search Bar + Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search operator, owner name, phone, WhatsApp, email, hub, route..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Select */}
        <div>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
          >
            <option value="all">All Fleet Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* District / Hub Select */}
        <div>
          <select
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
          >
            <option value="all">All Hubs & Districts</option>
            {DISTRICT_HUBS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Permit Type Select */}
        <div>
          <select
            value={permitType}
            onChange={(e) => onPermitTypeChange(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
          >
            <option value="all">All Permit Types</option>
            {PERMIT_TYPES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Quick Filter Chips & Reset */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
        
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Quick:
          </span>

          <button
            onClick={() => onQuickFilterChange(quickFilter === 'has_whatsapp' ? null : 'has_whatsapp')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              quickFilter === 'has_whatsapp'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <MessageCircle className="w-3 h-3" />
            <span>Has WhatsApp</span>
          </button>

          <button
            onClick={() => onQuickFilterChange(quickFilter === 'has_email' ? null : 'has_email')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              quickFilter === 'has_email'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <Mail className="w-3 h-3" />
            <span>Has Email</span>
          </button>

          <button
            onClick={() => onQuickFilterChange(quickFilter === 'bus_services' ? null : 'bus_services')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              quickFilter === 'bus_services'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Bus className="w-3 h-3" />
            <span>Bus Fleets</span>
          </button>

          <button
            onClick={() => onQuickFilterChange(quickFilter === 'lorry_services' ? null : 'lorry_services')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              quickFilter === 'lorry_services'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Lorry & Bulkers</span>
          </button>

          <button
            onClick={() => onQuickFilterChange(quickFilter === 'namakkal_hub' ? null : 'namakkal_hub')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              quickFilter === 'namakkal_hub'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Namakkal Truck Hub</span>
          </button>

          <button
            onClick={() => onQuickFilterChange(quickFilter === 'coimbatore_hub' ? null : 'coimbatore_hub')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              quickFilter === 'coimbatore_hub'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Coimbatore Hub</span>
          </button>

          <button
            onClick={() => onQuickFilterChange(quickFilter === 'national_permit' ? null : 'national_permit')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              quickFilter === 'national_permit'
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>National Permit</span>
          </button>
        </div>

        {/* Counter and Clear Filters */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalFiltered}</strong> operators
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-rose-600 hover:text-rose-700 font-medium hover:underline inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
