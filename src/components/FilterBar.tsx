'use client';

import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  management: string;
  setManagement: (m: string) => void;
  board: string;
  setBoard: (b: string) => void;
  category: string;
  setCategory: (c: string) => void;
  block: string;
  setBlock: (bl: string) => void;
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
  management,
  setManagement,
  board,
  setBoard,
  category,
  setCategory,
  block,
  setBlock,
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

  const quickFilters = [
    { id: null, label: 'All Schools' },
    { id: 'no_contact', label: 'Missing ANY Contact' },
    { id: 'no_principal_office', label: 'Without Principal Office' },
    { id: 'no_whatsapp', label: 'Without WhatsApp' },
    { id: 'no_email', label: 'Without Email' },
    { id: 'complete', label: 'Contact Complete' },
    { id: 'needs_verification', label: 'Needs Staff Verification' },
  ];

  const hasActiveFilters = 
    Boolean(searchQuery) || 
    Boolean(management) || 
    Boolean(board) || 
    Boolean(category) || 
    Boolean(block) || 
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
            placeholder="Search by school name, UDISE code (3312...), block, village locality, or PIN (e.g. 641001)..."
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
            <span>{totalFiltered.toLocaleString()} Schools Displayed</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        
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
            <option value="Kendriya Vidyalaya">Kendriya Vidyalaya</option>
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

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Level / Category</label>
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
            <option value="Residential">Residential / Tribal</option>
            <option value="Special">Special School</option>
          </select>
        </div>

        {/* District Block Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">District Block</label>
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

        {/* Urban / Rural Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Urban / Rural</label>
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

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Schools</option>
            <option value="HISTORICAL">Historical / Closed</option>
          </select>
        </div>

      </div>

    </div>
  );
};
