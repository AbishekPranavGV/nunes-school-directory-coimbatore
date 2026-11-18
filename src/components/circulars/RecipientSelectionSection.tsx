'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Mail, 
  MessageCircle, 
  Check, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Download,
  ArrowRight
} from 'lucide-react';
import { RecipientHierarchyFilters, VerifiedSchoolRecipient } from '@/types/circular';
import { TAMIL_NADU_DISTRICTS } from '@/lib/data/tamilNaduDistricts';
import { KERALA_DISTRICTS } from '@/lib/data/keralaDistricts';

interface RecipientSelectionSectionProps {
  onConfirmRecipients?: (recipients: VerifiedSchoolRecipient[], filters: RecipientHierarchyFilters) => void;
  selectedState: string;
  selectedDistrict: string;
  onSelectState: (state: string) => void;
  onSelectDistrict: (district: string) => void;
}

export const RecipientSelectionSection: React.FC<RecipientSelectionSectionProps> = ({
  onConfirmRecipients,
  selectedState,
  selectedDistrict,
  onSelectState,
  onSelectDistrict
}) => {
  const [recipients, setRecipients] = useState<VerifiedSchoolRecipient[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hierarchical Filter State
  const [filters, setFilters] = useState<RecipientHierarchyFilters>({
    state: (selectedState as any) || 'tamil-nadu',
    district: selectedDistrict || 'coimbatore',
    block: 'all',
    management: 'all',
    category: 'all',
    board: 'all',
    hasValidEmail: true,
    hasValidWhatsApp: false,
    isVerifiedOnly: true,
    contactedStatus: 'all',
    replyStatus: 'all',
    excludeOptedOut: true,
    quickSelection: 'coimbatore',
    selectedDistrictIds: []
  });

  // Selected school checkboxes for manual curation
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<Set<string>>(new Set());

  // Load verified recipient records from API
  const loadRecipients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('action', 'recipients');
      params.set('state', filters.state);
      params.set('district', filters.district);
      params.set('block', filters.block);
      params.set('management', filters.management);
      params.set('category', filters.category);
      params.set('board', filters.board);
      params.set('has_email', filters.hasValidEmail ? 'true' : 'false');
      params.set('has_whatsapp', filters.hasValidWhatsApp ? 'true' : 'false');
      params.set('verified_only', filters.isVerifiedOnly ? 'true' : 'false');

      const res = await fetch(`/api/circulars/v2?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecipients(data.recipients || []);
        setTotalCount(data.total_count || 0);
      }
    } catch (err) {
      console.error('Error fetching recipients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, [filters]);

  // Quick preset buttons
  const applyQuickPreset = (preset: RecipientHierarchyFilters['quickSelection']) => {
    if (preset === 'coimbatore') {
      onSelectState('tamil-nadu');
      onSelectDistrict('coimbatore');
      setFilters(prev => ({
        ...prev,
        state: 'tamil-nadu',
        district: 'coimbatore',
        quickSelection: 'coimbatore'
      }));
    } else if (preset === 'tn_38') {
      onSelectState('tamil-nadu');
      onSelectDistrict('all');
      setFilters(prev => ({
        ...prev,
        state: 'tamil-nadu',
        district: 'all',
        quickSelection: 'tn_38'
      }));
    }
  };

  // Client search filter
  const displayedRecipients = useMemo(() => {
    if (!searchQuery.trim()) return recipients;
    const q = searchQuery.toLowerCase();
    return recipients.filter(r => 
      r.school_name.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q) ||
      r.block.toLowerCase().includes(q) ||
      r.contact_person.toLowerCase().includes(q) ||
      r.official_email.toLowerCase().includes(q)
    );
  }, [recipients, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedSchoolIds.size === displayedRecipients.length) {
      setSelectedSchoolIds(new Set());
    } else {
      setSelectedSchoolIds(new Set(displayedRecipients.map(r => r.id)));
    }
  };

  const toggleSelectSchool = (id: string) => {
    setSelectedSchoolIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Presets & Quick Select Bar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Hierarchical School Recipient Selector</span>
            </h3>
            <p className="text-xs text-slate-500">
              State → District → Block → Management → Contact Verification. Live database validated.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Filtered: <strong className="text-sky-800">{totalCount.toLocaleString()}</strong> Schools
            </span>
          </div>
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Select:</span>
          
          <button
            type="button"
            onClick={() => applyQuickPreset('coimbatore')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filters.quickSelection === 'coimbatore' && filters.district === 'coimbatore'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            📍 Coimbatore District (2,097 Schools)
          </button>

          <button
            type="button"
            onClick={() => applyQuickPreset('tn_38')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filters.quickSelection === 'tn_38' && filters.district === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🌿 All 38 Tamil Nadu Districts (16,300 Schools)
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectState('kerala');
              onSelectDistrict('all');
              setFilters(prev => ({
                ...prev,
                state: 'kerala',
                district: 'all',
                quickSelection: 'selected_districts'
              }));
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filters.state === 'kerala'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🌴 Kerala (14 Districts • 4,820 Schools)
          </button>
        </div>

        {/* Hierarchical Filter Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          
          {/* Level 1: State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">1. State Scope:</label>
            <select
              value={filters.state}
              onChange={(e) => {
                const nextState = e.target.value as any;
                onSelectState(nextState);
                setFilters(prev => ({ ...prev, state: nextState, district: 'all' }));
              }}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="tamil-nadu">Tamil Nadu Only</option>
              <option value="kerala">Kerala Only</option>
              <option value="all">Both States (TN + KL)</option>
            </select>
          </div>

          {/* Level 2: District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">2. District:</label>
            <select
              value={filters.district}
              onChange={(e) => {
                onSelectDistrict(e.target.value);
                setFilters(prev => ({ ...prev, district: e.target.value }));
              }}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Districts in Selected State</option>
              {filters.state === 'kerala' ? (
                KERALA_DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))
              ) : (
                TAMIL_NADU_DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))
              )}
            </select>
          </div>

          {/* Level 3: Management */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">3. Management Type:</label>
            <select
              value={filters.management}
              onChange={(e) => setFilters(prev => ({ ...prev, management: e.target.value }))}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Management Types</option>
              <option value="Private">Private / Self-Financing</option>
              <option value="Government">Government / Corporation</option>
              <option value="Aided">Government Aided</option>
            </select>
          </div>

          {/* Level 4: Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">4. School Category:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="Higher Secondary">Higher Secondary (XI-XII)</option>
              <option value="Secondary">High School (IX-X)</option>
              <option value="Middle">Middle (VI-VIII)</option>
              <option value="Primary">Primary (I-V)</option>
            </select>
          </div>

          {/* Level 5: Board */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">5. Educational Board:</label>
            <select
              value={filters.board}
              onChange={(e) => setFilters(prev => ({ ...prev, board: e.target.value }))}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Affiliations</option>
              <option value="CBSE">CBSE Board</option>
              <option value="Matric">Matriculation</option>
              <option value="State">State Board</option>
              <option value="ICSE">ICSE / ISC</option>
            </select>
          </div>

        </div>

        {/* Verification Checkboxes Strip */}
        <div className="flex items-center gap-4 flex-wrap pt-3 border-t border-slate-100 text-xs text-slate-700">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasValidEmail}
              onChange={(e) => setFilters(prev => ({ ...prev, hasValidEmail: e.target.checked }))}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
            />
            <span className="font-semibold">Valid Official Email Required</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasValidWhatsApp}
              onChange={(e) => setFilters(prev => ({ ...prev, hasValidWhatsApp: e.target.checked }))}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="font-semibold">WhatsApp Verified Number Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isVerifiedOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, isVerifiedOnly: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span className="font-semibold">Exclude Incomplete / Missing Contacts</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.excludeOptedOut}
              onChange={(e) => setFilters(prev => ({ ...prev, excludeOptedOut: e.target.checked }))}
              className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span className="font-semibold text-amber-900">Suppress Opted-Out Contacts (Safe Outreach)</span>
          </label>
        </div>
      </div>

      {/* Recipient Data Table */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school name, contact person, block, or email address..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/api/circulars/v2/export?type=selected_schools&state=${filters.state}&district=${filters.district}`}
              download
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={displayedRecipients.length > 0 && selectedSchoolIds.size === displayedRecipients.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="py-2.5 px-3">School Name & Location</th>
                <th className="py-2.5 px-3">Management / Type</th>
                <th className="py-2.5 px-3">Official Email</th>
                <th className="py-2.5 px-3">Phone / WhatsApp</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Filtering verified database records...
                  </td>
                </tr>
              ) : displayedRecipients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No matching school recipients found for the selected criteria.
                  </td>
                </tr>
              ) : (
                displayedRecipients.slice(0, 50).map((r) => {
                  const isChecked = selectedSchoolIds.has(r.id);
                  return (
                    <tr key={r.id} className={`hover:bg-slate-50/80 transition-colors ${isChecked ? 'bg-sky-50/40' : ''}`}>
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectSchool(r.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </td>

                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-bold text-slate-900 truncate" title={r.school_name}>
                          {r.school_name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <span>{r.district}</span>
                          {r.block && <span>• {r.block}</span>}
                          {r.udise_code && <span>• UDISE: {r.udise_code}</span>}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {r.management}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono">
                        {r.official_email ? (
                          <span className="text-sky-700 font-semibold truncate max-w-[180px] block">
                            {r.official_email}
                          </span>
                        ) : (
                          <span className="text-amber-600 italic text-[11px]">Missing</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 font-mono">
                        {r.contact_phone ? (
                          <span className="text-slate-800 font-semibold">
                            {r.contact_phone}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                          r.verification_status === 'OPTED_OUT' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {r.verification_status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
          <span>Showing first {Math.min(displayedRecipients.length, 50)} of {totalCount.toLocaleString()} matching institutions</span>
          <span className="text-sky-700 font-bold">{selectedSchoolIds.size} individually selected</span>
        </div>
      </div>

    </div>
  );
};
