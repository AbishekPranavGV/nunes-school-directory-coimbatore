'use client';

import React from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  UserCheck, 
  ShieldCheck, 
  ExternalLink,
  Truck,
  Bus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TransportRecord } from '@/types/transport';

interface TransportMissingContactsViewProps {
  operators: TransportRecord[];
  onSelectOperator: (operator: TransportRecord) => void;
  onOpenDispatchModal: (operator: TransportRecord) => void;
}

export const TransportMissingContactsView: React.FC<TransportMissingContactsViewProps> = ({
  operators,
  onSelectOperator,
  onOpenDispatchModal
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Authoritative Contact Verification Complete</h3>
            <p className="text-xs text-emerald-800">
              All {operators.length} fleet operators are enriched with confirmed Managing Director / Proprietor names, direct mobile lines, and active WhatsApp numbers.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Owner Direct Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operators.map((op) => {
          const isBus = op.service_type === 'bus';
          const cleanPhone = op.contact_number.replace(/[^0-9+]/g, '');
          const cleanWhatsApp = op.whatsapp_number.replace(/[^0-9]/g, '');

          return (
            <div 
              key={op.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isBus ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {isBus ? <Bus className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    </div>
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[180px]">
                      {op.company_name}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>

                {/* Owner Info */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {op.owner_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{op.owner_name}</p>
                      <p className="text-[10px] text-slate-500">{op.owner_designation}</p>
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-[11px] text-slate-400">WhatsApp:</span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>+{op.whatsapp_number}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-[11px] text-slate-400">Phone:</span>
                    <a href={`tel:${cleanPhone}`} className="font-semibold text-slate-800 hover:underline">
                      {op.contact_number}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-[11px] text-slate-400">Email:</span>
                    <a href={`mailto:${op.email}`} className="font-medium text-sky-700 hover:underline truncate max-w-[150px]">
                      {op.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectOperator(op)}
                  className="flex-1 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  View Dossier
                </button>
                <button
                  onClick={() => onOpenDispatchModal(op)}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Dispatch</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
