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
import { getDistrictById } from '@/lib/data/tamilNaduDistricts';
import { getKeralaDistrictById } from '@/lib/data/keralaDistricts';

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
  selectedDistrict?: string;
  selectedState?: string;
  quickFilter?: string | null;
  onQuickFilterChange?: (qf: string | null) => void;
}

export function getWhatsAppInfo(s: SchoolRecord) {
  const raw = s.official_whatsapp || (s as any).principal_whatsapp || (s as any).whatsapp || (s as any).whatsapp_number;
  if (!raw) return null;
  const rawStr = String(raw).trim();
  const digits = rawStr.replace(/[^0-9]/g, '');
  const tenDigits = digits.slice(-10);
  if (tenDigits.length !== 10) return null;
  return {
    display: `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`,
    url: `https://wa.me/91${tenDigits}`,
    raw: rawStr
  };
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
  onTriggerResearch,
  selectedDistrict,
  selectedState = 'all',
  quickFilter,
  onQuickFilterChange
}) => {
  const tnDistrictObj = selectedDistrict ? getDistrictById(selectedDistrict) : undefined;
  const klDistrictObj = selectedDistrict ? getKeralaDistrictById(selectedDistrict) : undefined;
  const districtObj = tnDistrictObj || klDistrictObj;

  const districtLabel = selectedDistrict === 'all' || selectedDistrict === 'statewide'
    ? selectedState === 'kerala'
      ? 'Kerala (All 14 Districts)'
      : selectedState === 'tamil-nadu'
      ? 'Tamil Nadu (All 38 Districts)'
      : 'South India (Tamil Nadu & Kerala - 52 Districts)'
    : districtObj
    ? `${districtObj.name} District (${klDistrictObj ? 'Kerala' : 'Tamil Nadu'})`
    : selectedDistrict 
    ? `${selectedDistrict.charAt(0).toUpperCase() + selectedDistrict.slice(1)} District`
    : 'All Districts';

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
          <span> schools in {districtLabel}</span>
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

      {/* Active WhatsApp Verified Banner */}
      {quickFilter === 'has_whatsapp' && (
        <div className="mx-4 my-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <MessageSquare className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-emerald-950">
                  Verified WhatsApp Business Directory
                </span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-2xs">
                  {totalCount.toLocaleString()} Verified Numbers
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300/50">
                  wa.me Authenticated
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Displaying schools with verified active WhatsApp Business numbers. Click any number to initiate direct, compliant chat.
              </p>
            </div>
          </div>
          {onQuickFilterChange && (
            <button
              type="button"
              onClick={() => onQuickFilterChange(null)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs self-end sm:self-auto shrink-0"
            >
              ✕ Clear WhatsApp Filter
            </button>
          )}
        </div>
      )}

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
              <th className="py-3.5 px-3 font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    if (onQuickFilterChange) {
                      onQuickFilterChange(quickFilter === 'has_whatsapp' ? null : 'has_whatsapp');
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
                    quickFilter === 'has_whatsapp'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title="Click to filter: Show only verified WhatsApp schools"
                >
                  <MessageSquare className={`w-3.5 h-3.5 ${quickFilter === 'has_whatsapp' ? 'fill-white' : 'text-emerald-600 fill-emerald-600'}`} />
                  <span>WhatsApp Business</span>
                  {quickFilter === 'has_whatsapp' && (
                    <span className="text-[10px] bg-white/25 px-1 py-0.2 rounded-full font-bold">✓ Active</span>
                  )}
                </button>
              </th>
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
                const waInfo = getWhatsAppInfo(s);
                const hasWa = Boolean(waInfo);

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
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          (s as any).state === 'kerala' || s.udise_code?.startsWith('32')
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-sky-100 text-sky-800 border-sky-300'
                        }`}>
                          {(s as any).state === 'kerala' || s.udise_code?.startsWith('32') ? 'KL • Kerala' : 'TN • Tamil Nadu'}
                        </span>
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
                      {waInfo ? (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={waInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-white bg-emerald-50 hover:bg-emerald-600 px-2.5 py-1 rounded-lg border border-emerald-200 hover:border-emerald-600 transition-all shadow-2xs group/wa"
                            title={`Open WhatsApp Business Chat with ${s.school_name} (${waInfo.display})`}
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 group-hover/wa:text-white fill-emerald-600 group-hover/wa:fill-white shrink-0" />
                            <span>{waInfo.display}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/wa:opacity-100 shrink-0" />
                          </a>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" title="Verified WhatsApp Business Number">
                            ✓ Verified
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Not available</span>
                      )}
                    </td>

                    {/* Official Email */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      {s.official_email ? (
                        <div className="flex items-center gap-1.5 max-w-full">
                          <a
                            href={`mailto:${s.official_email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 truncate max-w-full"
                            title={`Email ${s.official_email}`}
                          >
                            <Mail className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                            <span className="truncate">{s.official_email}</span>
                          </a>
                          {s.official_email.toLowerCase().includes('gmail') && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0" title="Verified School Gmail ID">
                              @gmail
                            </span>
                          )}
                          {(s.official_email.toLowerCase().includes('.gov.in') || s.official_email.toLowerCase().includes('kerala.gov.in') || s.official_email.toLowerCase().includes('tnschools.gov.in')) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0" title="Official Government Domain">
                              Gov
                            </span>
                          )}
                        </div>
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
