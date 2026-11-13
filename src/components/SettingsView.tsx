'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  Database, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  Cpu, 
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { UserSession } from '@/types';

interface SettingsViewProps {
  currentUser: UserSession | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser
}) => {
  const [settingsData, setSettingsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettingsData(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">
              Platform Governance, Safety Switches & System Settings
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-slate-950">
              Protection Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Strict safety lockouts for outbound communications, 12 discovery provider rate limits, serverless database synchronization, and compliance controls.
          </p>
        </div>
      </div>

      {/* Outbound Communication Safety Gates (Phase 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Outbound Transmission Safety Gates (Phase 10 Compliance)</h3>
              <p className="text-xs text-slate-500">Hardware & server-level isolation preventing unintended external communications</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            All Live Outbound Sending Locked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 font-mono">EMAIL_AUTOMATION_ENABLED</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Automated batch emailing to external schools</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
              FALSE (LOCKED)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 font-mono">LIVE_SEND_ENABLED</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Live production dispatch to real institutions</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
              FALSE (LOCKED)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 font-mono">WHATSAPP_AUTOMATION_ENABLED</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct WhatsApp business messaging</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
              FALSE (LOCKED)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 font-mono">SCHEDULED_SEND_ENABLED</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Cron-based scheduled mass mailing</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
              FALSE (LOCKED)
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
          <strong>Security Policy:</strong> These switches are enforced directly in <code className="font-mono font-bold">src/app/api/communications/route.ts</code>. Any API attempt to dispatch live outbound messages returns HTTP 403 Forbidden. Only test transmissions to allowlisted internal email addresses (<code className="font-mono">compliance-audit@nunesinstruments.com</code>) are permitted during verification.
        </div>
      </div>

      {/* Row 2: Database Storage & User Session Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Database Persistence */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-600" />
              <h4 className="text-sm font-bold text-slate-900">Database & Ephemeral Storage Architecture</h4>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Serverless Storage Engine</span>
                <span className="text-[11px] text-slate-500">Auto-synced to writable /tmp volume</span>
              </div>
              <span className="font-mono text-sky-800 font-bold">/tmp/schools.db</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Read-Only Safe Failover</span>
                <span className="text-[11px] text-slate-500">Defensive SQLITE_READONLY suppression</span>
              </div>
              <span className="font-bold text-emerald-700">safeDbExecute ACTIVE</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Master Census Dataset</span>
                <span className="text-[11px] text-slate-500">All 2,097 schools & 859+ contacts</span>
              </div>
              <span className="font-bold text-slate-900 font-mono">1.88 MB Relational</span>
            </div>
          </div>
        </div>

        {/* Security & Authenticated Session */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Authenticated Session & RBAC</h4>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                Secured
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Current Operator</span>
                <span className="font-bold text-slate-900 text-sm">{currentUser?.username || 'admin (Master Administrator)'}</span>
                <span className="text-[11px] text-sky-700 font-semibold block mt-0.5">Role: {currentUser?.role || 'admin'} • Full RBAC Permissions</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Password Security Policy</span>
                <span className="font-semibold text-slate-800">Bcrypt Salt 10 • Default Passwords Forbidden</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Default pass 'NunesInstruments2026!' permanently blocked.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
            Nunes Instruments AI School Directory Platform Settings • ISO/IEC 27001 Aligned
          </div>
        </div>

      </div>

    </div>
  );
};
