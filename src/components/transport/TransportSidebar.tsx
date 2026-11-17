'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Send, 
  BarChart3, 
  ShieldCheck, 
  Download, 
  ChevronRight,
  X,
  ExternalLink,
  Sparkles,
  MapPin,
  Building2,
  PhoneCall,
  BookOpen
} from 'lucide-react';
import { TransportWorkspaceView } from '@/types/transport';

interface TransportSidebarProps {
  currentView: TransportWorkspaceView;
  onViewChange: (view: TransportWorkspaceView) => void;
  isOpen: boolean;
  onClose: () => void;
  totalOperatorsCount: number;
  totalBranchesCount: number;
  onOpenExport?: () => void;
}

export const TransportSidebar: React.FC<TransportSidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onClose,
  totalOperatorsCount = 33,
  totalBranchesCount = 103,
  onOpenExport
}) => {
  const navItems = [
    {
      id: 'dashboard' as TransportWorkspaceView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
      description: 'Fleet Overview & Command'
    },
    {
      id: 'directory' as any,
      targetView: 'directory' as any,
      label: 'Fleet Directory',
      icon: Truck,
      badge: totalOperatorsCount.toString(),
      description: '33 TN & Kerala Operators'
    },
    {
      id: 'contacts' as any,
      targetView: 'contacts' as any,
      label: 'Contacts',
      icon: Users,
      badge: totalOperatorsCount.toString(),
      description: 'Verified Switchboard'
    },
    {
      id: 'branches' as TransportWorkspaceView,
      label: 'Routes & Hubs',
      icon: Route,
      badge: totalBranchesCount.toString(),
      description: '103 Regional Depots'
    },
    {
      id: 'circulars' as TransportWorkspaceView,
      label: 'Circulars & Blast',
      icon: Send,
      badge: '1-Click',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
      description: 'Automated Email Dispatch'
    },
    {
      id: 'dtp' as TransportWorkspaceView,
      label: 'DTP & Catalogs',
      icon: BookOpen,
      badge: 'Pre-Press',
      badgeColor: 'bg-indigo-100 text-indigo-800 font-bold',
      description: 'Email & Catalog Publishing'
    },
    {
      id: 'reports' as TransportWorkspaceView,
      label: 'Analytics',
      icon: BarChart3,
      badge: undefined,
      description: 'Fleet & Deliverability KPIs'
    },
    {
      id: 'missing' as TransportWorkspaceView,
      label: 'Data Quality',
      icon: ShieldCheck,
      badge: '100%',
      badgeColor: 'bg-sky-100 text-sky-800',
      description: 'Audit & Enrichment Queue'
    }
  ];

  const handleNavClick = (view: any) => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header Branding */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/transport" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight">FleetTrack Pro</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">v2.0</span>
              </div>
              <p className="text-[11px] text-slate-500">NUNES Fleet Intelligence</p>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations & Fleet
          </div>

          {navItems.map((item) => {
            const target = (item as any).targetView || item.id;
            const isActive = currentView === target;

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(target)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold border border-blue-200/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`
                    text-[11px] px-2 py-0.5 rounded-full font-mono font-medium shrink-0
                    ${item.badgeColor || (isActive ? 'bg-blue-200/70 text-blue-800' : 'bg-slate-100 text-slate-600')}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Secondary Group */}
          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Data Tools
          </div>

          <button
            onClick={() => {
              if (onOpenExport) onOpenExport();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-slate-400" />
              <span>Export CSV / XLSX</span>
            </div>
            <span className="text-[10px] text-slate-400">Download</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>School Directory UI</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Bottom System Status Widget (Matching reference design) */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3.5 bg-blue-50/70 border border-blue-100/80 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">System Status</span>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded font-semibold">
                Live
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-mono text-[11px] text-slate-700 font-semibold truncate">PROD-DB-01 • Connected</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              South India Fleets v2.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
