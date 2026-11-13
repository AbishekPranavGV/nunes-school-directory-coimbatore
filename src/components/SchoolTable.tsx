'use client';

import React from 'react';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  Eye,
  Briefcase,
  MapPin,
  Sparkles
} from 'lucide-react';
import { SchoolRecord } from '@/types';

interface SchoolTableProps {
  schools: SchoolRecord[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  onSelectSchool: (school: SchoolRecord) => void;
  onTriggerResearch?: (schoolId: string) => void;
}

export const SchoolTable: React.FC<SchoolTableProps> = ({
  schools,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSort,
  onSelectSchool,
  onTriggerResearch
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Table Top Toolbar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
        <div>
          <span>Showing </span>
          <span className="font-bold text-slate-900">
            {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>
          <span> to </span>
          <span className="font-bold text-slate-900">
            {Math.min(currentPage * pageSize, totalCount)}
          </span>
          <span> of </span>
          <span className="font-bold text-slate-900">{totalCount.toLocaleString()}</span>
          <span> schools in Coimbatore District</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-500">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Container */}
      <div className="overflow-x-auto min-h-[420px]">
        <table className="w-full text-left text-xs sm:text-sm text-slate-700">
          
          {/* Table Header Columns matching Section 7 */}
          <thead className="bg-sky-50/60 text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-sky-100 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="py-3.5 px-4 font-semibold">
                <button
                  onClick={() => onSort('school_name')}
                  className="flex items-center gap-1.5 hover:text-sky-700 transition-colors"
                >
                  <span>School & UDISE</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </th>
              <th className="py-3.5 px-3 font-semibold">Type / Board</th>
              <th className="py-3.5 px-3 font-semibold">
                <button
                  onClick={() => onSort('taluk')}
                  className="flex items-center gap-1.5 hover:text-sky-700 transition-colors"
                >
                  <span>Area / Taluk</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </th>
              <th className="py-3.5 px-3 font-semibold">Principal / Headmaster</th>
              <th className="py-3.5 px-3 font-semibold">Official Phone</th>
              <th className="py-3.5 px-3 font-semibold">WhatsApp Business</th>
              <th className="py-3.5 px-3 font-semibold">Official Email</th>
              <th className="py-3.5 px-3 font-semibold text-center">Status</th>
              <th className="py-3.5 px-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {schools.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-14 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-base font-medium text-slate-600">No schools match current search or filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting filters or adjusting search keywords.</p>
                  </div>
                </td>
              </tr>
            ) : (
              schools.map((s) => {
                const isComplete = s.is_contact_complete || s.contact_status === 'CONTACT_COMPLETE';
                const hasWa = Boolean(s.official_whatsapp);

                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectSchool(s)}
                    className="hover:bg-sky-50/40 transition-colors duration-150 cursor-pointer group"
                  >
                    {/* School Name & UDISE */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                        {s.school_name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-mono text-[11px] text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200/60">
                          {s.udise_code}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium truncate">
                          {s.classes_offered ? s.classes_offered.split('(')[0] : s.category}
                        </span>
                      </div>
                    </td>

                    {/* School Type & Board */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                        {s.board}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                        {s.management.replace(' / Education Department', '')}
                      </div>
                    </td>

                    {/* Area / Taluk & Block */}
                    <td className="py-3.5 px-3 max-w-[160px]">
                      <div className="font-semibold text-slate-800 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-500 flex-shrink-0" />
                        <span>{s.district && s.district !== 'Coimbatore' ? `${s.district} • ` : ''}{s.taluk || s.block}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {s.district ? `${s.district} • ` : ''}{s.block} • {s.pincode}
                      </div>
                    </td>

                    {/* Principal / Headmaster Name */}
                    <td className="py-3.5 px-3 max-w-[160px]">
                      {s.principal_name ? (
                        <div>
                          <div className="font-medium text-slate-800 truncate" title={s.principal_name}>
                            {s.principal_name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {s.principal_designation || 'Principal'}
                            {s.principal_office_phone && <span className="text-amber-700 ml-1">• Office Desk</span>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Not publicly listed</span>
                      )}
                    </td>

                    {/* Official Phone */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {s.official_landline || s.official_mobile ? (
                        <a
                          href={`tel:${(s.official_landline || s.official_mobile || '').replace(/\s+/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-800 hover:text-sky-600 transition-colors"
                          title="Call official phone"
                        >
                          <Phone className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{s.official_landline || s.official_mobile}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Not available</span>
                      )}
                    </td>

                    {/* Official WhatsApp Business */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {hasWa ? (
                        <a
                          href={`https://wa.me/${(s.official_whatsapp || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-mono font-medium text-teal-700 hover:text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 transition-all"
                          title="Open WhatsApp Business"
                        >
                          <MessageSquare className="w-3 h-3 text-teal-600 fill-teal-600" />
                          <span>{s.official_whatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Not available</span>
                      )}
                    </td>

                    {/* Official Email */}
                    <td className="py-3.5 px-3 max-w-[170px]">
                      {s.official_email ? (
                        <a
                          href={`mailto:${s.official_email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 truncate max-w-full"
                          title={`Email ${s.official_email}`}
                        >
                          <Mail className="w-3 h-3 text-sky-500 flex-shrink-0" />
                          <span className="truncate">{s.official_email}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Not available</span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      ) : s.contact_status === 'PARTIALLY_ENRICHED' || s.workflow_state === 'FOUND_UNVERIFIED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Verify
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Missing Contact
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSchool(s);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalPages || 1}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">
            {currentPage}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
