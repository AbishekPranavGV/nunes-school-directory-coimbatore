'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  MoreVertical, 
  Zap, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Maximize2,
  ChevronRight,
  Truck,
  Bus,
  ShieldCheck,
  Building2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Send,
  Layers
} from 'lucide-react';
import { TransportRecord, TransportKPI } from '@/types/transport';
import { TransportKPICards } from './TransportKPICards';

interface TransportDashboardOverviewProps {
  operators: TransportRecord[];
  allOperators: TransportRecord[];
  kpi: TransportKPI | null;
  selectedState: string;
  onSelectState: (state: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (sf: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectOperator: (op: TransportRecord) => void;
  onQuickWhatsApp: (op: TransportRecord) => void;
  onOneClickEmail: (op: TransportRecord) => void;
  onOpen2DMap: () => void;
  onOpenExport: () => void;
  onOpenBlastModal: () => void;
  onViewAllDirectory: () => void;
  onViewAllCirculars: () => void;
  onViewAllBranches: () => void;
  circulars?: any[];
  onPreviewCircular?: (cir: any) => void;
}

export const TransportDashboardOverview: React.FC<TransportDashboardOverviewProps> = ({
  operators,
  allOperators,
  kpi,
  selectedState,
  onSelectState,
  serviceFilter,
  onServiceFilterChange,
  searchQuery,
  onSearchChange,
  onSelectOperator,
  onQuickWhatsApp,
  onOneClickEmail,
  onOpen2DMap,
  onOpenExport,
  onOpenBlastModal,
  onViewAllDirectory,
  onViewAllCirculars,
  onViewAllBranches,
  circulars = [],
  onPreviewCircular
}) => {
  const [activeChip, setActiveChip] = useState<string>('all');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('10:00 AM');
  const [currentDateStr, setCurrentDateStr] = useState<string>('Wednesday, March 4, 2026');
  const [page, setPage] = useState<number>(1);
  const pageSize = 7;

  useEffect(() => {
    const now = new Date();
    setCurrentTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    setCurrentDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  // Filter operators for the table
  const filteredList = operators.filter(op => {
    if (activeChip === 'active') return op.state === 'Tamil Nadu';
    if (activeChip === 'idle') return op.state === 'Kerala';
    if (activeChip === 'bus') return op.service_type === 'bus';
    if (activeChip === 'lorry') return op.service_type === 'lorry';
    if (activeChip === 'logistics') return op.service_type === 'logistics';
    if (activeChip === 'govt') return op.service_type === 'govt';
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const paginatedRows = filteredList.slice((page - 1) * pageSize, page * pageSize);

  // Status badge formatter matching reference image style
  const renderStatusBadge = (op: TransportRecord) => {
    if (op.service_type === 'govt') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active (Govt)
        </span>
      );
    }
    if (op.state === 'Kerala') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Idle (KL Hub)
        </span>
      );
    }
    if (op.service_type === 'lorry') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Freight Transit
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Page Title Header Row (Fleet Overview) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
            Fleet Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentDateStr} — Live South India Fleets data as of {currentTimeStr}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenExport}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer h-10"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onOpenBlastModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer h-10"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>1-Click Dispatch</span>
          </button>
        </div>
      </div>

      {/* 2. Uniform 5-Card KPI Grid */}
      <TransportKPICards
        kpi={kpi}
        activeQuickFilter={null}
        onSelectQuickFilter={(qf) => {
          if (qf === 'has_branches') onViewAllBranches();
          else onViewAllDirectory();
        }}
        onNavigateToBranches={onViewAllBranches}
        onNavigateToCirculars={onViewAllCirculars}
      />

      {/* 3. Split-Screen Section (Fleet Table ~68% + Live Map & Alerts ~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Vehicle Fleet Directory Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          
          {/* Top Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Vehicle Fleet Directory
              </h2>
              <p className="text-xs text-slate-400">
                {filteredList.length} registered commercial operators active in South India corridor
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenExport}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={onViewAllDirectory}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Full Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search & Filter Chips Row (Matching reference image) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setPage(1);
                }}
                placeholder="Search vehicles, operators, locations..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
              />
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <button
                onClick={() => { setActiveChip('all'); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeChip === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All (33)
              </button>

              <button
                onClick={() => { setActiveChip('active'); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeChip === 'active' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeChip === 'active' ? 'bg-white' : 'bg-emerald-500'}`} />
                <span>Active (TN)</span>
              </button>

              <button
                onClick={() => { setActiveChip('idle'); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeChip === 'idle' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeChip === 'idle' ? 'bg-white' : 'bg-amber-500'}`} />
                <span>Idle (KL)</span>
              </button>

              <button
                onClick={() => { setActiveChip('bus'); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeChip === 'bus' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Buses
              </button>

              <button
                onClick={() => { setActiveChip('lorry'); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeChip === 'lorry' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Lorries
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3.5">Vehicle ID</th>
                  <th className="py-3 px-3.5">Operator & Fleet</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Location</th>
                  <th className="py-3 px-3.5">Last Seen</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No vehicles found matching current search.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((op) => (
                    <tr 
                      key={op.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Vehicle ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {op.id}
                      </td>

                      {/* Operator & Fleet */}
                      <td className="py-3 px-3.5 max-w-[200px]">
                        <div className="font-bold text-slate-900 truncate">
                          {op.company_name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {op.category}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {renderStatusBadge(op)}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{op.district}, {op.state === 'Kerala' ? 'KL' : 'TN'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-4">
                          {op.branches.length} Depots
                        </div>
                      </td>

                      {/* Last Seen / Timestamp */}
                      <td className="py-3 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {currentTimeStr}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Eye / View Details */}
                          <button
                            onClick={() => onSelectOperator(op)}
                            title="View Full Details Drawer"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${op.whatsapp_number}?text=Hello%20${encodeURIComponent(op.company_name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Direct WhatsApp"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* 1-Click Email Send */}
                          <button
                            onClick={() => onOneClickEmail(op)}
                            title="⚡ 1-Click Automated Circular Email"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div>
              <span>Showing </span>
              <span className="font-bold text-slate-900">
                {filteredList.length === 0 ? 0 : (page - 1) * pageSize + 1}
              </span>
              <span> to </span>
              <span className="font-bold text-slate-900">
                {Math.min(page * pageSize, filteredList.length)}
              </span>
              <span> of </span>
              <span className="font-bold text-slate-900">{filteredList.length}</span>
              <span> fleets</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-slate-700 font-semibold">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Map View & Recent Alerts (Matching reference image) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card A: Live Map View */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Live Map View
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpen2DMap}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>2D Map</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Map Visual Widget */}
            <div 
              onClick={onOpen2DMap}
              className="relative h-56 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group shadow-inner"
            >
              {/* Map Canvas Background (Simulated 2D GPS Grid with Kerala & Tamil Nadu Hubs) */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-sky-50 to-emerald-50">
                {/* SVG Route Lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-overview" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-overview)" />

                  {/* Inter-State Corridors NH 544 & NH 66 */}
                  <path d="M 40 180 Q 80 120 140 100 T 260 50" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="4 4" />
                  <path d="M 60 170 Q 120 140 180 120 T 240 150" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                </svg>

                {/* GPS Pins on the preview map */}
                {/* Kochi / Vallarpadam */}
                <div className="absolute left-[20%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group-hover:scale-110 transition-transform">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shadow-md shadow-emerald-600/40 border-2 border-white">
                    KL
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1 rounded shadow-2xs mt-0.5 whitespace-nowrap">
                    Kochi ICTT
                  </span>
                </div>

                {/* Palakkad / Walayar Border */}
                <div className="absolute left-[40%] top-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group-hover:scale-110 transition-transform">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shadow-md shadow-emerald-600/40 border-2 border-white">
                    KL
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1 rounded shadow-2xs mt-0.5 whitespace-nowrap">
                    Walayar
                  </span>
                </div>

                {/* Coimbatore */}
                <div className="absolute left-[52%] top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group-hover:scale-110 transition-transform">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shadow-md shadow-blue-600/40 border-2 border-white">
                    TN
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1 rounded shadow-2xs mt-0.5 whitespace-nowrap">
                    Coimbatore
                  </span>
                </div>

                {/* Chennai */}
                <div className="absolute left-[78%] top-[22%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group-hover:scale-110 transition-transform">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shadow-md shadow-blue-600/40 border-2 border-white">
                    TN
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1 rounded shadow-2xs mt-0.5 whitespace-nowrap">
                    Chennai
                  </span>
                </div>

                {/* Click to expand overlay */}
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-slate-900/80 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs transition-opacity flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to open Full 2D Map</span>
                  </span>
                </div>
              </div>

              {/* Map Footer Indicator */}
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 bg-white/90 backdrop-blur-xs rounded-lg border border-slate-200/70 text-[10px] text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  33 Active Fleets Live
                </span>
                <span className="font-mono text-slate-400">103 Depots</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">NH 544 & NH 66 Inter-State Corridors</span>
              <button
                onClick={onViewAllBranches}
                className="text-blue-600 hover:underline font-semibold text-xs flex items-center gap-0.5 cursor-pointer"
              >
                <span>View 103 Depots</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card B: Recent Alerts & Automation (Matching reference image) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Recent Alerts & Automation
              </h3>
              <button
                onClick={onViewAllCirculars}
                className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Circulars Hub
              </button>
            </div>

            <div className="space-y-2.5">
              
              {/* If real circulars are loaded, render the top 4 with dynamic state tags */}
              {circulars && circulars.length > 0 ? (
                circulars.slice(0, 4).map((cir, idx) => {
                  const isKL = cir.target_state === 'Kerala' || cir.target_audience?.includes('Kerala');
                  const isTN = cir.target_state === 'Tamil Nadu' || cir.target_audience?.includes('Tamil Nadu');
                  const badgeColor = isKL ? 'bg-emerald-500' : isTN ? 'bg-indigo-500' : 'bg-blue-500';
                  const bgBox = isKL ? 'bg-emerald-50/80 border-emerald-200/70' : isTN ? 'bg-indigo-50/80 border-indigo-200/70' : 'bg-blue-50/80 border-blue-200/70';
                  const textColor = isKL ? 'text-emerald-950' : isTN ? 'text-indigo-950' : 'text-blue-950';
                  const subColor = isKL ? 'text-emerald-700' : isTN ? 'text-indigo-700' : 'text-blue-700';

                  return (
                    <div 
                      key={cir.id || idx}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 transition-all hover:shadow-2xs ${bgBox}`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${badgeColor}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded font-mono bg-white/80 border border-slate-200/60">
                              {isKL ? '🌴 Kerala' : isTN ? '🌿 Tamil Nadu' : '🌐 South India'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {cir.ref_no}
                            </span>
                          </div>
                          <p className={`text-xs font-bold truncate mt-0.5 ${textColor}`}>
                            {cir.title}
                          </p>
                          <p className={`text-[11px] truncate ${subColor}`}>
                            {cir.recipient_count || 3200} Fleets • {cir.status === 'Sent' ? 'Dispatched (250 OK)' : 'Active Directive'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (onPreviewCircular) onPreviewCircular(cir);
                          else onViewAllCirculars();
                        }}
                        className={`text-xs font-bold hover:underline shrink-0 cursor-pointer pt-0.5 ${subColor}`}
                      >
                        View
                      </button>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* Fallback 1: Red Alert */}
                  <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/70 flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-rose-950">
                          Mandatory Monsoon Brake Retarder Check
                        </p>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          Walayar RTO Checkpost • 10 minutes ago
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onViewAllCirculars}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 hover:underline shrink-0 cursor-pointer pt-0.5"
                    >
                      View
                    </button>
                  </div>

                  {/* Fallback 2: Yellow Warning */}
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-950">
                          FASTag 3.0 RFID Commercial Lane Sync
                        </p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Kochi-Coimbatore Corridor • 25 minutes ago
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onViewAllCirculars}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline shrink-0 cursor-pointer pt-0.5"
                    >
                      View
                    </button>
                  </div>

                  {/* Fallback 3: Green Delivery */}
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-emerald-950">
                          1-Click Email Delivered to KSRTC SWIFT
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          cmd@keralartc.com (TLS 1.3 250 OK) • 1 hour ago
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onViewAllCirculars}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 cursor-pointer pt-0.5"
                    >
                      View
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
