'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  Phone, 
  MapPin, 
  Download, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Search, 
  ChevronRight,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { SchoolRecord } from '@/types';

interface MissingContactsDashboardProps {
  schools: SchoolRecord[];
  onSelectSchool: (school: SchoolRecord) => void;
  onTriggerResearch: (schoolId: string) => Promise<void>;
  onExportMissing: () => void;
}

export const MissingContactsDashboard: React.FC<MissingContactsDashboardProps> = ({
  schools,
  onSelectSchool,
  onTriggerResearch,
  onExportMissing
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [visibleLimit, setVisibleLimit] = useState<number>(40);

  // Filter missing schools
  const missingSchools = schools.filter(s => !s.is_contact_complete);

  // Group by queue category
  const categories = [
    { id: 'ALL', label: 'All Missing Schools', count: missingSchools.length },
    { 
      id: 'AWAITING_FIRST_RESEARCH', 
      label: 'Awaiting First Research', 
      count: missingSchools.filter(s => s.missing_queue_category === 'AWAITING_FIRST_RESEARCH').length 
    },
    { 
      id: 'REQUIRING_ANOTHER_SOURCE', 
      label: 'Requiring Another Source', 
      count: missingSchools.filter(s => s.missing_queue_category === 'REQUIRING_ANOTHER_SOURCE').length 
    },
    { 
      id: 'NEEDS_MANUAL_VERIFICATION', 
      label: 'Needs Manual Switchboard Call', 
      count: missingSchools.filter(s => s.missing_queue_category === 'NEEDS_MANUAL_VERIFICATION').length 
    },
    { 
      id: 'NO_DISCOVERABLE_CONTACT', 
      label: 'No Discoverable Public Contact', 
      count: missingSchools.filter(s => s.missing_queue_category === 'NO_DISCOVERABLE_CONTACT').length 
    }
  ];

  const filtered = missingSchools.filter(s => {
    if (activeCategory !== 'ALL' && s.missing_queue_category !== activeCategory) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const match = s.school_name.toLowerCase().includes(q) ||
                    s.udise_code.toLowerCase().includes(q) ||
                    s.block.toLowerCase().includes(q) ||
                    (s.taluk || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleResearch = async (schoolId: string) => {
    setResearchingId(schoolId);
    try {
      await onTriggerResearch(schoolId);
    } finally {
      setResearchingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-rose-50 via-amber-50 to-white rounded-2xl border border-rose-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-rose-600 text-white">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Missing-Contact Recovery System
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              {missingSchools.length} Priority Schools
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Schools in Coimbatore district without verified institutional telephone or email. Records are retained in this actionable work queue; **never deleted, never fabricated**. Run automated AI research or dispatch staff manual switchboard inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportMissing}
            className="px-4 py-2.5 bg-white border border-rose-200 hover:border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download Work Sheet (CSV/XLSX)</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter missing queue by school name, UDISE, taluk, or block..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {filtered.length} queued
        </span>
      </div>

      {/* Recovery Queue List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.slice(0, visibleLimit).map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectSchool(s)}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{s.school_name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="font-mono text-sky-800 bg-sky-50 px-1 rounded text-[11px]">
                      {s.udise_code}
                    </span>
                    <span>•</span>
                    <span>{s.taluk || s.block}</span>
                    <span>•</span>
                    <span>{s.board}</span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                  {s.missing_queue_category?.replace(/_/g, ' ') || 'Needs Research'}
                </span>
              </div>

              <div className="mt-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Missing Reason: </span>
                <span>{s.missing_reasons || 'Elementary school with no official internet domain published; switchboard verification required.'}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Action: <span className="font-semibold text-slate-700">{s.next_action || 'Outbound calling queue'}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResearch(s.id);
                  }}
                  disabled={researchingId === s.id}
                  className="px-2.5 py-1 text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg flex items-center gap-1 transition-all"
                  title="Run automated web research on this school"
                >
                  <Sparkles className={`w-3 h-3 ${researchingId === s.id ? 'animate-spin text-sky-600' : ''}`} />
                  <span>{researchingId === s.id ? 'Researching...' : 'AI Research'}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSchool(s);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                  title="Inspect Profile"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination / Load More Controls */}
      {filtered.length > visibleLimit && (
        <div className="flex items-center justify-center pt-2 pb-4">
          <button
            onClick={() => setVisibleLimit(prev => Math.min(prev + 40, filtered.length))}
            className="px-6 py-2.5 bg-white border border-slate-300 hover:border-rose-400 text-slate-700 hover:text-rose-700 font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>Showing {visibleLimit} of {filtered.length.toLocaleString()} schools</span>
            <span className="text-slate-400">•</span>
            <span className="text-rose-600 font-bold">Load 40 More</span>
          </button>
        </div>
      )}

    </div>
  );
};
