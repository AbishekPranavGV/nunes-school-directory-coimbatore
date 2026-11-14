'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Bus, 
  Download, 
  MapPin, 
  UserCheck, 
  Bell,
  Search, 
  Check, 
  Globe2, 
  Building2, 
  Package, 
  Landmark,
  ChevronDown,
  Menu,
  Zap,
  ExternalLink,
  ShieldCheck,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { TransportWorkspaceView } from '@/types/transport';

interface TransportHeaderProps {
  currentView: TransportWorkspaceView;
  onViewChange: (view: TransportWorkspaceView) => void;
  selectedState?: string;
  onSelectState?: (state: string) => void;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  totalFleets: number;
  onOpenWorker: () => void;
  onOpenExport: () => void;
  onOpenMap: () => void;
  onOpenBlastModal?: () => void;
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const TransportHeader: React.FC<TransportHeaderProps> = ({
  currentView,
  onViewChange,
  selectedState = 'all',
  onSelectState,
  selectedDistrict,
  onSelectDistrict,
  serviceFilter,
  onServiceFilterChange,
  totalFleets,
  onOpenWorker,
  onOpenExport,
  onOpenMap,
  onOpenBlastModal,
  onToggleSidebar,
  searchQuery = '',
  onSearchChange
}) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setIsAlertsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Fleet Overview';
      case 'circulars':
        return 'Circulars & Automation';
      case 'branches':
        return 'Routes & Regional Depots';
      case 'missing':
        return 'Data Quality & Verification';
      case 'reports':
        return 'Analytics & Reports';
      case 'dispatch':
        return 'Official Inquiries Dispatcher';
      default:
        return 'Fleet Directory';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 h-16 flex items-center px-4 sm:px-6 shadow-2xs">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Hamburger + Current Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {getViewTitle()}
              </h2>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {totalFleets} Fleets
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Compact Global Search (Matching reference image) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search vehicles, operators, routes..."
              className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right Section: State Switcher + Legacy UI Link + Notifications + Profile (Matching reference image) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Quick State Switcher Pills */}
          <div className="hidden xl:flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onSelectState && onSelectState('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedState === 'all' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (33)
            </button>
            <button
              onClick={() => onSelectState && onSelectState('Tamil Nadu')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedState === 'Tamil Nadu' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌿 TN (24)
            </button>
            <button
              onClick={() => onSelectState && onSelectState('Kerala')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedState === 'Kerala' ? 'bg-white text-amber-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌴 KL (9)
            </button>
          </div>

          {/* View Legacy UI / Switch to Schools Button (Matching reference mockup "View Legacy UI") */}
          <Link
            href="/"
            title="Switch to School Directory Portal"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs hover:border-slate-300"
          >
            <span>View Legacy UI</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={alertsRef}>
            <button
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Recent Alerts & Dispatch Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] font-mono text-blue-600 font-bold">4 Active</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-950 border border-rose-200/50">
                    <p className="font-bold text-[11px]">Monsoon Brake Retarder Check</p>
                    <p className="text-[10px] text-rose-700 mt-0.5">Walayar RTO Checkpost • 10m ago</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-950 border border-emerald-200/50">
                    <p className="font-bold text-[11px]">1-Click Email Delivered (250 OK)</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">KSRTC SWIFT (cmd@keralartc.com) • 1h ago</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onViewChange('circulars');
                    setIsAlertsOpen(false);
                  }}
                  className="w-full mt-2 pt-2 border-t border-slate-100 text-center text-xs font-bold text-blue-600 hover:underline block"
                >
                  View All Circular Receipts →
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar Widget (Matching reference mockup "John Smith / Administrator") */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 hover:bg-slate-50 rounded-xl transition-all border border-slate-200/60 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                US
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">Nunes Admin</p>
                <p className="text-[10px] text-slate-400 leading-none mt-1">Administrator</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 text-xs text-slate-700">
                <div className="p-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-900">Nunes Instruments</p>
                  <p className="text-[11px] text-slate-400">admin@nunesinstruments.com</p>
                </div>
                <button
                  onClick={() => { onOpenWorker(); setIsProfileOpen(false); }}
                  className="w-full text-left p-2 hover:bg-slate-50 rounded-lg font-medium"
                >
                  Harvester Telemetry
                </button>
                <button
                  onClick={() => { onOpenExport(); setIsProfileOpen(false); }}
                  className="w-full text-left p-2 hover:bg-slate-50 rounded-lg font-medium"
                >
                  Export Center
                </button>
                <Link
                  href="/"
                  className="w-full text-left p-2 hover:bg-slate-50 rounded-lg font-medium block text-blue-600"
                >
                  Switch to School Portal
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
