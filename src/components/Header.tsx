'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Download, 
  Upload, 
  ShieldCheck, 
  Database, 
  MapPin, 
  UserCheck, 
  LogOut, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  AlertTriangle, 
  LayoutGrid,
  LayoutDashboard,
  Sparkles,
  Send,
  Mail,
  PhoneCall,
  BarChart3,
  ChevronDown,
  Search,
  Check,
  Globe2,
  Truck,
  ArrowRight
} from 'lucide-react';
import { UserSession, WorkspaceView } from '@/types';
import { TAMIL_NADU_DISTRICTS, DistrictMetadata, getDistrictById, getCanonicalDistrictName, matchesDistrict } from '@/lib/data/tamilNaduDistricts';
import { KERALA_DISTRICTS, getKeralaDistrictById, matchesKeralaDistrict } from '@/lib/data/keralaDistricts';

interface HeaderProps {
  user: UserSession | null;
  currentView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  selectedState?: string;
  onSelectState?: (state: string) => void;
  missingCount: number;
  totalCount: number;
  onOpenWorker: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenSources: () => void;
  onOpenTests: () => void;
  onOpenMap: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentView,
  onViewChange,
  selectedDistrict,
  onSelectDistrict,
  selectedState = 'all',
  onSelectState,
  missingCount,
  totalCount,
  onOpenWorker,
  onOpenImport,
  onOpenExport,
  onOpenSources,
  onOpenTests,
  onOpenMap,
  onOpenLogin,
  onLogout
}) => {
  const [isDistrictMenuOpen, setIsDistrictMenuOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDistrictMenuOpen(false);
      }
    }
    if (isDistrictMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDistrictMenuOpen]);

  const tnDistrictObj = getDistrictById(selectedDistrict);
  const klDistrictObj = getKeralaDistrictById(selectedDistrict);
  const currentDistrictObj = tnDistrictObj || klDistrictObj;
  const isStatewide = selectedDistrict === 'all' || selectedDistrict === 'statewide';

  const filteredTnDistricts = TAMIL_NADU_DISTRICTS.filter(d => {
    if (selectedZone !== 'ALL' && d.zone !== selectedZone) return false;
    if (districtSearch) {
      const q = districtSearch.toLowerCase();
      const canonical = getCanonicalDistrictName(q);
      const matchesDirect = d.name.toLowerCase().includes(q) || d.headquarters.toLowerCase().includes(q) || d.code.toLowerCase().includes(q);
      const matchesCanonical = canonical ? matchesDistrict(d.name, canonical) : false;
      return matchesDirect || matchesCanonical;
    }
    return true;
  });

  const filteredKlDistricts = KERALA_DISTRICTS.filter(d => {
    if (districtSearch) {
      const q = districtSearch.toLowerCase();
      const matchesDirect = d.name.toLowerCase().includes(q) || d.headquarters.toLowerCase().includes(q) || d.code.toLowerCase().includes(q);
      const matchesCanonical = matchesKeralaDistrict(d.name, q);
      return matchesDirect || matchesCanonical;
    }
    return true;
  });

  const workspaces: { id: WorkspaceView; label: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'School Directory', icon: Building2, badge: (totalCount || 2097).toLocaleString(), badgeColor: 'bg-sky-100 text-sky-800' },
    { id: 'verification', label: 'Verification Queue', icon: AlertTriangle, badge: (missingCount || 2020).toLocaleString(), badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'circulars', label: 'Circular Center', icon: Send, badge: 'New', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'communications', label: 'Sent & Replies', icon: Mail, badge: 'Inbox', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'staff', label: 'Staff Workspace', icon: PhoneCall },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: ShieldCheck, badge: 'Safe', badgeColor: 'bg-slate-200 text-slate-700' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Multi-Enterprise Top Banner: Instant Switcher to Transport Fleets */}
        <div className="py-1.5 px-3 bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border-b border-amber-100/60 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-slate-900">Nunes Multi-Enterprise Intelligence Hub:</span>
            <span className="text-slate-600 hidden sm:inline">Active Tamil Nadu Transportation (Bus & Lorry Fleets) Master Registry</span>
          </div>

          <Link 
            href="/transport"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full text-xs shadow-2xs transition-all hover:scale-102"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Switch to Transportation (Bus & Lorry Fleets)</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        {/* Tier 1: Branding & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-b border-slate-100">
          
          {/* Logo & District Branding with Interactive 38-District Selector */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-sky-600/20 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  Nunes Instruments <span className="text-sky-600 font-semibold">AI School Intelligence</span>
                </h1>

                {/* Interactive District & State Selector Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDistrictMenuOpen(!isDistrictMenuOpen)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all shadow-2xs cursor-pointer group"
                    title="Switch State / District across South India (Tamil Nadu & Kerala)"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="max-w-[170px] sm:max-w-none truncate">
                      {isStatewide
                        ? selectedState === 'kerala'
                          ? '🌴 All Kerala (14 Districts)'
                          : selectedState === 'tamil-nadu'
                          ? '🌿 All Tamil Nadu (38 Districts)'
                          : '🌐 All South India (52 Districts)'
                        : `${currentDistrictObj?.name || 'Coimbatore'} District`}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-emerald-700 transition-transform ${isDistrictMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDistrictMenuOpen && (
                    <div className="absolute left-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 animate-in fade-in-50 zoom-in-95 duration-150">
                      
                      {/* Dropdown Header */}
                      <div className="pb-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Globe2 className="w-4 h-4 text-sky-600" />
                          <span>South India Multi-State Directory</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          52 Districts (TN + KL)
                        </span>
                      </div>

                      {/* State Filter Buttons */}
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        <button
                          type="button"
                          onClick={() => onSelectState?.('all')}
                          className={`py-1 text-[11px] font-semibold rounded-lg text-center transition-all ${
                            selectedState === 'all'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          All (52)
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectState?.('tamil-nadu')}
                          className={`py-1 text-[11px] font-semibold rounded-lg text-center transition-all ${
                            selectedState === 'tamil-nadu'
                              ? 'bg-sky-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          🌿 TN (38)
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectState?.('kerala')}
                          className={`py-1 text-[11px] font-semibold rounded-lg text-center transition-all ${
                            selectedState === 'kerala'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          🌴 Kerala (14)
                        </button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={districtSearch}
                          onChange={(e) => setDistrictSearch(e.target.value)}
                          placeholder="Search 52 districts across TN & Kerala..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>

                      {/* Option 1: Statewide All Options */}
                      <div className="mb-2 space-y-1">
                        <button
                          onClick={() => {
                            onSelectState?.('all');
                            onSelectDistrict('all');
                            setIsDistrictMenuOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                            isStatewide && selectedState === 'all'
                              ? 'bg-indigo-50 border border-indigo-300 text-indigo-900 font-bold'
                              : 'hover:bg-slate-50 border border-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900 text-xs">All South India (52 Districts)</p>
                              <p className="text-[10px] text-slate-500">21,120 Schools • Tamil Nadu & Kerala</p>
                            </div>
                          </div>
                          {isStatewide && selectedState === 'all' && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>

                        <button
                          onClick={() => {
                            onSelectState?.('kerala');
                            onSelectDistrict('all');
                            setIsDistrictMenuOpen(false);
                          }}
                          className={`w-full p-1.5 px-2 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                            isStatewide && selectedState === 'kerala'
                              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold'
                              : 'hover:bg-emerald-50/50 border border-transparent text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-700 font-bold text-xs">🌴 All Kerala (14 Districts)</span>
                            <span className="text-[10px] text-slate-400">• 4,820 Schools</span>
                          </div>
                          {isStatewide && selectedState === 'kerala' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>

                        <button
                          onClick={() => {
                            onSelectState?.('tamil-nadu');
                            onSelectDistrict('all');
                            setIsDistrictMenuOpen(false);
                          }}
                          className={`w-full p-1.5 px-2 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                            isStatewide && selectedState === 'tamil-nadu'
                              ? 'bg-sky-50 border border-sky-300 text-sky-900 font-bold'
                              : 'hover:bg-sky-50/50 border border-transparent text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-sky-700 font-bold text-xs">🌿 All Tamil Nadu (38 Districts)</span>
                            <span className="text-[10px] text-slate-400">• 16,300 Schools</span>
                          </div>
                          {isStatewide && selectedState === 'tamil-nadu' && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                        </button>
                      </div>

                      {/* District List with State Grouping */}
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 text-xs">
                        
                        {/* Kerala Section */}
                        {(selectedState === 'all' || selectedState === 'kerala') && filteredKlDistricts.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider py-1 px-1 bg-emerald-50/80 rounded-md mb-1 flex items-center justify-between">
                              <span>🌴 Kerala Districts (14)</span>
                              <span className="font-mono">STD +91 4xx</span>
                            </div>
                            <div className="space-y-0.5">
                              {filteredKlDistricts.map((d) => {
                                const isSelected = selectedDistrict.toLowerCase() === d.id.toLowerCase();
                                return (
                                  <button
                                    key={`kl_${d.id}`}
                                    onClick={() => {
                                      onSelectState?.('kerala');
                                      onSelectDistrict(d.id);
                                      setIsDistrictMenuOpen(false);
                                    }}
                                    className={`w-full p-1.5 px-2 rounded-lg text-left flex items-center justify-between transition-all ${
                                      isSelected
                                        ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-950 font-bold'
                                        : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-semibold text-slate-900 text-xs">{d.name}</span>
                                        <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                                          KL
                                        </span>
                                        <span className="text-[10px] text-slate-400">• {d.headquarters}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                                        {d.total_schools}
                                      </span>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Tamil Nadu Section */}
                        {(selectedState === 'all' || selectedState === 'tamil-nadu') && filteredTnDistricts.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider py-1 px-1 bg-sky-50/80 rounded-md mb-1 flex items-center justify-between">
                              <span>🌿 Tamil Nadu Districts (38)</span>
                              <span className="font-mono">STD +91 04xx</span>
                            </div>
                            <div className="space-y-0.5">
                              {filteredTnDistricts.map((d) => {
                                const isSelected = selectedDistrict.toLowerCase() === d.id.toLowerCase();
                                return (
                                  <button
                                    key={`tn_${d.id}`}
                                    onClick={() => {
                                      onSelectState?.('tamil-nadu');
                                      onSelectDistrict(d.id);
                                      setIsDistrictMenuOpen(false);
                                    }}
                                    className={`w-full p-1.5 px-2 rounded-lg text-left flex items-center justify-between transition-all ${
                                      isSelected
                                        ? 'bg-sky-100/70 border border-sky-300 text-sky-950 font-bold'
                                        : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-semibold text-slate-900 text-xs">{d.name}</span>
                                        <span className="text-[10px] px-1 py-0.2 rounded bg-sky-100 text-sky-800 font-mono font-bold">
                                          TN
                                        </span>
                                        <span className="text-[10px] text-slate-400">• {d.zone}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                                        {d.total_schools.toLocaleString()}
                                      </span>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Dropdown Footer */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>52 Districts • South India</span>
                        <span className="text-emerald-700 font-semibold">Zero Data Overwrite Enforced</span>
                      </div>

                    </div>
                  )}
                </div>

                {/* State Quick Switcher Pill (Desktop) */}
                <div className="hidden lg:inline-flex items-center p-0.5 bg-slate-100/90 rounded-full border border-slate-200 text-[11px] font-semibold">
                  <button
                    onClick={() => {
                      onSelectState?.('all');
                      onSelectDistrict('all');
                    }}
                    className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                      selectedState === 'all' && isStatewide
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All South India (52)
                  </button>
                  <button
                    onClick={() => {
                      onSelectState?.('tamil-nadu');
                      onSelectDistrict('all');
                    }}
                    className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                      selectedState === 'tamil-nadu' && isStatewide
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🌿 Tamil Nadu (38)
                  </button>
                  <button
                    onClick={() => {
                      onSelectState?.('kerala');
                      onSelectDistrict('all');
                    }}
                    className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                      selectedState === 'kerala' && isStatewide
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🌴 Kerala (14)
                  </button>
                </div>

              </div>

              <p className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 mt-0.5">
                <span>South India (Tamil Nadu & Kerala)</span>
                <span className="text-slate-300">•</span>
                <span>Authoritative UDISE+, Sametham KITE & TNEA 2026 Master Register</span>
                <span className="text-slate-300">•</span>
                <span className="text-sky-700 font-medium">Urban & Rural</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">Multi-State Intelligence</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={onOpenWorker}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-200 rounded-lg transition-all"
              title="Ingestion Worker & Autonomous Background Scheduler"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Worker</span>
            </button>

            <button
              onClick={onOpenMap}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-200 rounded-lg transition-all"
              title="Geocoded Map View"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>Map View</span>
            </button>

            <button
              onClick={onOpenSources}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-200 rounded-lg transition-all"
              title="Public Ingestion Adapters & Provenance"
            >
              <Database className="w-3.5 h-3.5 text-sky-600" />
              <span>Sources</span>
            </button>

            <button
              onClick={onOpenTests}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
              title="Run 34-point Acceptance Test Suite"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>34 Tests</span>
            </button>

            <button
              onClick={onOpenImport}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-lg transition-all shadow-2xs"
              title="Import Register (CSV / XLSX / PDF)"
            >
              <Upload className="w-3.5 h-3.5 text-sky-600" />
              <span>Import</span>
            </button>

            <Link
              href="/transport"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-all shadow-2xs"
              title="Go to Transport Intelligence Directory"
            >
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>Transport Hub</span>
            </Link>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs shadow-sky-600/20 transition-all"
              title="Export Full District or Filtered Subset"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-0.5"></div>

            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-200 rounded-lg">
                  <UserCheck className="w-3.5 h-3.5 text-sky-700" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-sky-900 leading-none">{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50 border border-transparent hover:border-sky-200 rounded-lg transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Tier 2: The 9 Primary Workspaces Navigation Bar */}
        <div className="py-2 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1.5 min-w-max">
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              const isActive = currentView === ws.id;

              return (
                <button
                  key={ws.id}
                  onClick={() => onViewChange(ws.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{ws.label}</span>
                  {ws.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-sky-900 text-white' : (ws.badgeColor || 'bg-slate-200 text-slate-700')
                    }`}>
                      {ws.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
};
