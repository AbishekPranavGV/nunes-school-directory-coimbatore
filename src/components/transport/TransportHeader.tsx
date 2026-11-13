'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Bus, 
  Download, 
  Upload, 
  ShieldCheck, 
  Database, 
  MapPin, 
  UserCheck, 
  LogOut, 
  CheckCircle2, 
  Cpu, 
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
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { TransportWorkspaceView } from '@/types/transport';

interface TransportHeaderProps {
  currentView: TransportWorkspaceView;
  onViewChange: (view: TransportWorkspaceView) => void;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  totalFleets: number;
  onOpenWorker: () => void;
  onOpenExport: () => void;
  onOpenMap: () => void;
}

const DISTRICT_HUBS = [
  { id: 'all', name: 'All Tamil Nadu (Hubs & Corridors)', count: '4,200+ Fleets', zone: 'Statewide' },
  { id: 'coimbatore', name: 'Coimbatore District', count: 'Industrial & Pumps Hub', zone: 'Western' },
  { id: 'namakkal', name: 'Namakkal District', count: 'Truck City of India & Tankers', zone: 'Western' },
  { id: 'salem', name: 'Salem District', count: 'Sankagiri Bulker & Steel Hub', zone: 'Western' },
  { id: 'chennai', name: 'Chennai District', count: 'Port Containers & Koyambedu Omni', zone: 'Northern' },
  { id: 'tiruppur', name: 'Tiruppur District', count: 'Textile Export FTL Corridor', zone: 'Western' },
  { id: 'madurai', name: 'Madurai District', count: 'South Transit & Ring Road Hub', zone: 'Southern' },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli District', count: 'Central BHEL Heavy ODC', zone: 'Central' },
  { id: 'erode', name: 'Erode District', count: 'Agricultural & Turmeric Freight', zone: 'Western' },
  { id: 'karur', name: 'Karur District', count: 'Coach Building & Home Textiles', zone: 'Central' },
  { id: 'thoothukudi', name: 'Thoothukudi District', count: 'VOC Port Sea Container Hub', zone: 'Southern' },
  { id: 'tirunelveli', name: 'Tirunelveli District', count: 'South Goods Express Corridor', zone: 'Southern' },
  { id: 'krishnagiri', name: 'Krishnagiri / Hosur', count: 'SIPCOT Auto Cluster Freight', zone: 'Northern' },
  { id: 'vellore', name: 'Vellore District', count: 'Leather Goods Air Feeder', zone: 'Northern' }
];

export const TransportHeader: React.FC<TransportHeaderProps> = ({
  currentView,
  onViewChange,
  selectedDistrict,
  onSelectDistrict,
  serviceFilter,
  onServiceFilterChange,
  totalFleets,
  onOpenWorker,
  onOpenExport,
  onOpenMap
}) => {
  const [isDistrictMenuOpen, setIsDistrictMenuOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const currentDistrictObj = DISTRICT_HUBS.find(d => d.id === selectedDistrict);
  const isStatewide = selectedDistrict === 'all' || selectedDistrict === 'statewide';

  const filteredDistricts = DISTRICT_HUBS.filter(d => 
    d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.count.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const workspaces: { id: TransportWorkspaceView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Fleet Register & Table', icon: LayoutDashboard },
    { id: 'map', label: 'Interactive Hubs & Routes Map', icon: MapPin },
    { id: 'dispatch', label: 'WhatsApp & Email Dispatcher', icon: Send, badge: 'Live Wa.me', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'missing', label: 'Owner Contact Queue', icon: PhoneCall, badge: '100% Verified', badgeColor: 'bg-sky-100 text-sky-800' },
    { id: 'reports', label: 'Fleet & Route Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner: Instant Switcher to School Intelligence */}
        <div className="py-1.5 px-3 bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border-b border-sky-100/60 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-900">Nunes Multi-Enterprise Intelligence Hub:</span>
            <span className="text-slate-600 hidden sm:inline">Active Transport & Logistics Fleet Master Registry (Omni Bus, Heavy Lorry, LPG Bulkers)</span>
          </div>

          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-800 font-semibold rounded-full border border-sky-200 text-xs shadow-2xs transition-all hover:scale-102"
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
            <span>Switch to School Intelligence</span>
            <ArrowRight className="w-3 h-3 text-sky-500" />
          </Link>
        </div>

        {/* Tier 1: Main Title, District Selector, and Actions */}
        <div className="py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-600/20 shrink-0">
              <Truck className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  Nunes Instruments <span className="text-amber-600 font-semibold">Tamil Nadu Transport Fleet Intelligence</span>
                </h1>

                {/* District Selector Dropdown Button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDistrictMenuOpen(!isDistrictMenuOpen)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all shadow-2xs cursor-pointer group"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="max-w-[150px] sm:max-w-none truncate">
                      {isStatewide ? 'All Tamil Nadu Hubs' : (currentDistrictObj?.name || 'Selected Hub')}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-amber-700 transition-transform ${isDistrictMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDistrictMenuOpen && (
                    <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="pb-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Globe2 className="w-4 h-4 text-amber-600" />
                          <span>Tamil Nadu Transport & Fleet Hubs</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          14 Key Hubs
                        </span>
                      </div>

                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={districtSearch}
                          onChange={(e) => setDistrictSearch(e.target.value)}
                          placeholder="Search transport hub (Namakkal, Sankagiri, Coimbatore...)"
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-1 pr-1 text-xs">
                        {filteredDistricts.map((d) => {
                          const isSelected = selectedDistrict.toLowerCase() === d.id.toLowerCase();
                          return (
                            <button
                              key={d.id}
                              onClick={() => {
                                onSelectDistrict(d.id);
                                setIsDistrictMenuOpen(false);
                              }}
                              className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-amber-50 border border-amber-300 text-amber-900 font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div>
                                <p className="font-semibold text-slate-900 text-xs">{d.name}</p>
                                <p className="text-[10px] text-slate-500">{d.count} • {d.zone}</p>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <p className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 mt-0.5">
                <span>Tamil Nadu, India</span>
                <span className="text-slate-300">•</span>
                <span>Bus & Lorry Transport Owners Association Master Directory</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">Verified WhatsApp & Direct Calls</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            
            {/* Quick Filter: All / Bus / Lorry */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => onServiceFilterChange('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${serviceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Fleets
              </button>
              <button
                onClick={() => onServiceFilterChange('bus')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${serviceFilter === 'bus' ? 'bg-sky-600 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Bus className="w-3 h-3" />
                <span>Buses</span>
              </button>
              <button
                onClick={() => onServiceFilterChange('lorry')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${serviceFilter === 'lorry' ? 'bg-amber-600 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Truck className="w-3 h-3" />
                <span>Lorries</span>
              </button>
            </div>

            <button
              onClick={onOpenWorker}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 hover:border-amber-200 rounded-lg transition-all"
              title="Automated Web Harvester & Background Crawler"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Harvester</span>
            </button>

            <button
              onClick={onOpenMap}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 hover:border-amber-200 rounded-lg transition-all"
              title="Geocoded Transport Depots Map"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Hubs Map</span>
            </button>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs shadow-amber-600/20 transition-all"
              title="Export Full Transport Register as CSV / Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV/XLSX</span>
            </button>

          </div>
        </div>

        {/* Tier 2: The Primary Workspaces Navigation Bar */}
        <div className="py-2 overflow-x-auto scrollbar-none border-t border-slate-100">
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
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{ws.label}</span>
                  {ws.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-amber-800 text-white' : (ws.badgeColor || 'bg-slate-200 text-slate-700')
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
