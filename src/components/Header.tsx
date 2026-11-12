'use client';

import React from 'react';
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
  Activity
} from 'lucide-react';
import { UserSession } from '@/types';

interface HeaderProps {
  user: UserSession | null;
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
  onOpenImport,
  onOpenExport,
  onOpenSources,
  onOpenTests,
  onOpenMap,
  onOpenLogin,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & District Branding */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-brand-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Nunes Instruments <span className="text-sky-600 font-semibold">AI School Directory</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Coimbatore District
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Tamil Nadu, India</span>
                <span className="text-slate-300">•</span>
                <span>Authoritative UDISE+ & TNEA 2026 Master Register</span>
                <span className="text-slate-300">•</span>
                <span className="text-sky-700 font-medium">Urban & Rural Coverage</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenMap}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-200 rounded-lg transition-all"
              title="Geocoded Map View"
            >
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>Map View</span>
            </button>

            <button
              onClick={onOpenSources}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-200 rounded-lg transition-all"
              title="Public Ingestion Adapters & Provenance"
            >
              <Database className="w-4 h-4 text-sky-600" />
              <span>Sources</span>
            </button>

            <button
              onClick={onOpenTests}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
              title="Run 14-point Acceptance Test Suite"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Acceptance</span> Tests
            </button>

            <button
              onClick={onOpenImport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-lg transition-all shadow-sm"
              title="Import Register (CSV / XLSX / PDF)"
            >
              <Upload className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/20 transition-all"
              title="Export Full District or Filtered Subset"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg">
                  <UserCheck className="w-4 h-4 text-sky-700" />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-sky-900 leading-none">{user.username}</p>
                    <p className="text-[10px] text-sky-600 capitalize leading-none mt-0.5">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50 border border-transparent hover:border-sky-200 rounded-lg transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>Admin Login</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
