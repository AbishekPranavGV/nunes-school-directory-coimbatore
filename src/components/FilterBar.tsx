'use client';

import React from 'react';
import { Search, X, Filter, RotateCcw, MapPin, Building, Phone, Mail, MessageSquare, Globe2 } from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '@/lib/data/tamilNaduDistricts';
import { KERALA_DISTRICTS } from '@/lib/data/keralaDistricts';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedState?: string;
  setSelectedState?: (s: string) => void;
  selectedDistrict?: string;
  setSelectedDistrict?: (d: string) => void;
  management: string;
  setManagement: (m: string) => void;
  board: string;
  setBoard: (b: string) => void;
  category: string;
  setCategory: (c: string) => void;
  block: string;
  setBlock: (bl: string) => void;
  taluk: string;
  setTaluk: (t: string) => void;
  urbanRural: string;
  setUrbanRural: (ur: string) => void;
  status: string;
  setStatus: (s: string) => void;
  quickFilter: string | null;
  setQuickFilter: (qf: string | null) => void;
  onReset: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedState = 'all',
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  management,
  setManagement,
  board,
  setBoard,
  category,
  setCategory,
  block,
  setBlock,
  taluk,
  setTaluk,
  urbanRural,
  setUrbanRural,
  status,
  setStatus,
  quickFilter,
  setQuickFilter,
  onReset,
  totalFiltered
}) => {
  const blocksList = [
    'Anaimalai', 'Annur', 'Coimbatore City', 'Karamadai', 'Kinathukadavu',
    'Madukkarai', 'Periyanaickanpalayam', 'Perur', 'Pollachi North',
    'Pollachi South', 'S.S.Kulam', 'Sultanpet', 'Sulur', 'Thondamuthur', 'Valparai'
  ];

  const taluksList = [
    'Coimbatore South', 'Coimbatore North', 'Pollachi', 'Sulur',
    'Annur', 'Mettupalayam', 'Madukkarai', 'Perur', 'Kinathukadavu',
    'Valparai', 'Anaimalai'
  ];

  const quickFilters = [
    { id: null, label: 'All Schools' },
    { id: 'no_contact', label: 'Missing ANY Contact (Priority)' },
    { id: 'has_phone', label: 'Official Phone Available' },
    { id: 'has_principal_office', label: 'Principal Office Available' },
    { id: 'has_whatsapp', label: 'WhatsApp Business Verified' },
    { id: 'has_email', label: 'Official Email Available' },
    { id: 'complete', label: 'Contact Complete' },
    { id: 'needs_verification', label: 'Awaiting Research / Verification' },
  ];

  const hasActiveFilters = 
    Boolean(searchQuery) || 
    Boolean(management) || 
    Boolean(board) || 
    Boolean(category) || 
    Boolean(block) || 
    Boolean(taluk) ||
    Boolean(urbanRural) || 
    Boolean(status) || 
    quickFilter !== null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-6">
      
      {/* Search Input & Quick Count */}
      <div className="flex flex-col md:flex-row gap-3.5 mb-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by school name, UDISE code (3312...), taluk, educational block, locality, or PIN (e.g. 641001)..."
            className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="px-3.5 py-2 bg-sky-50 text-sky-800 rounded-xl text-xs sm:text-sm font-semibold border border-sky-100 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>{totalFiltered.toLocaleString()} Schools Matching</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200 hover:border-rose-200"
              title="Reset all search filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Views:
        </span>
        {quickFilters.map((qf) => {
          const active = quickFilter === qf.id;
          return (
            <button
              key={String(qf.id)}
              onClick={() => setQuickFilter(qf.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                active
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {qf.label}
            </button>
          );
        })}
      </div>

      {/* Multi-Dimensional Select Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        
        {/* State Filter */}
        {setSelectedState && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-indigo-600" />
              <span>State (South India)</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                if (setSelectedDistrict) setSelectedDistrict('all');
              }}
              className="w-full text-xs py-2 px-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-950 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="all">All South India (52)</option>
              <option value="tamil-nadu">🌿 Tamil Nadu (38)</option>
              <option value="kerala">🌴 Kerala (14)</option>
            </select>
          </div>
        )}

        {/* District Filter */}
        {setSelectedDistrict && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>District</span>
            </label>
            <select
              value={selectedDistrict || 'all'}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-emerald-950 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="all">
                {selectedState === 'kerala'
                  ? 'All Kerala (14 Districts)'
                  : selectedState === 'tamil-nadu'
                  ? 'All Tamil Nadu (38 Districts)'
                  : 'All South India (52 Districts)'}
              </option>

              {(selectedState === 'all' || selectedState === 'kerala') && (
                <optgroup label="🌴 Kerala (14 Districts)">
                  {KERALA_DISTRICTS.map(d => (
                    <option key={`kl_${d.id}`} value={d.id}>
                      {d.name} ({d.total_schools})
                    </option>
                  ))}
                </optgroup>
              )}

              {(selectedState === 'all' || selectedState === 'tamil-nadu') && (
                <optgroup label="🌿 Tamil Nadu (38 Districts)">
                  {TAMIL_NADU_DISTRICTS.map(d => (
                    <option key={`tn_${d.id}`} value={d.id}>
                      {d.name} ({d.total_schools})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        )}

        {/* Taluk Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-500" />
            <span>Revenue Taluk</span>
          </label>
          <select
            value={taluk}
            onChange={(e) => setTaluk(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
          >
            <option value="">All 11 Taluks</option>
            {taluksList.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Educational Block Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Educational Block</label>
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
          >
            <option value="">All 15 Blocks</option>
            {blocksList.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Management Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Management</label>
          <select
            value={management}
            onChange={(e) => setManagement(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
          >
            <option value="">All Managements</option>
            <option value="Government / Education Department">Government / Education</option>
            <option value="Corporation / Local Body">Corporation / Local Body</option>
            <option value="Government Aided">Government Aided</option>
            <option value="Private Unaided">Private Unaided</option>
            <option value="Kendriya Vidyalaya">Kendriya Vidyalaya / Central</option>
            <option value="Social/Tribal Welfare">Social / Tribal Welfare</option>
          </select>
        </div>

        {/* Board Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Board</label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
          >
            <option value="">All Boards</option>
            <option value="Tamil Nadu State Board">TN State Board</option>
            <option value="Matriculation">Matriculation</option>
            <option value="Anglo-Indian">Anglo-Indian</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="IB / International">IB / International</option>
          </select>
        </div>

        {/* Category / Level Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Class Level</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
          >
            <option value="">All Levels</option>
            <option value="Primary">Primary (1-5)</option>
            <option value="Middle">Middle (1-8)</option>
            <option value="Secondary">Secondary (High School)</option>
            <option value="Higher Secondary">Higher Secondary (11-12)</option>
            <option value="Nursery / Montessori / Kindergarten">Nursery / Primary</option>
            <option value="Residential">Residential</option>
            <option value="Special">Special Education</option>
          </select>
        </div>

        {/* Urban / Rural Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Area Type</label>
          <select
            value={urbanRural}
            onChange={(e) => setUrbanRural(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
          >
            <option value="">All Areas</option>
            <option value="Urban">Urban</option>
            <option value="Rural">Rural</option>
          </select>
        </div>

      </div>

    </div>
  );
};
