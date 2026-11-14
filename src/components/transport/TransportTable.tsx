'use client';

import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Eye, 
  ShieldCheck, 
  Truck, 
  Bus, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ExternalLink,
  User,
  Star,
  Edit3,
  Building2,
  Package,
  Landmark,
  Zap
} from 'lucide-react';
import { TransportRecord } from '@/types/transport';

interface TransportTableProps {
  operators: TransportRecord[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  onSelectOperator: (operator: TransportRecord) => void;
  onQuickWhatsApp: (operator: TransportRecord) => void;
  onEditOperator?: (operator: TransportRecord) => void;
  onOneClickEmail?: (operator: TransportRecord) => void;
}

export const TransportTable: React.FC<TransportTableProps> = ({
  operators,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSort,
  onSelectOperator,
  onQuickWhatsApp,
  onEditOperator,
  onOneClickEmail
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Table Header Toolbar */}
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
          <span className="font-bold text-slate-900">{totalCount}</span>
          <span> Transport Fleets</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              
              <th scope="col" className="py-3 px-4">
                <button 
                  onClick={() => onSort('company_name')}
                  className="flex items-center gap-1 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  <span>Operator & Fleet</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>

              <th scope="col" className="py-3 px-3">
                <button 
                  onClick={() => onSort('owner_name')}
                  className="flex items-center gap-1 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  <span>Owner / MD Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>

              <th scope="col" className="py-3 px-3 text-center">
                <span>Direct WhatsApp & Call</span>
              </th>

              <th scope="col" className="py-3 px-3">
                <span>Email / Gmail ID</span>
              </th>

              <th scope="col" className="py-3 px-3">
                <button 
                  onClick={() => onSort('district')}
                  className="flex items-center gap-1 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  <span>Hub & Routes</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>

              <th scope="col" className="py-3 px-3">
                <span>Permit & GST</span>
              </th>

              <th scope="col" className="py-3 px-4 text-right">
                <span>Actions</span>
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {operators.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Truck className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No transport operators match the active filters</p>
                    <p className="text-xs text-slate-400">Try loosening your search terms or clearing the selected filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              operators.map((item) => {
                const isBus = item.service_type === 'bus';
                const isLorry = item.service_type === 'lorry';
                const isLogistics = item.service_type === 'logistics';
                const isGovt = item.service_type === 'govt';
                const cleanPhone = item.contact_number.replace(/[^0-9+]/g, '');
                const cleanWhatsApp = item.whatsapp_number.replace(/[^0-9]/g, '');

                const getIconAndColors = () => {
                  if (isGovt) {
                    return {
                      icon: <Landmark className="w-4 h-4" />,
                      boxClass: 'bg-purple-50 text-purple-700',
                      badgeClass: 'bg-purple-50 text-purple-800 border border-purple-200'
                    };
                  }
                  if (isLogistics) {
                    return {
                      icon: <Package className="w-4 h-4" />,
                      boxClass: 'bg-emerald-50 text-emerald-700',
                      badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    };
                  }
                  if (isBus) {
                    return {
                      icon: <Bus className="w-4 h-4" />,
                      boxClass: 'bg-sky-50 text-sky-700',
                      badgeClass: 'bg-sky-50 text-sky-800 border border-sky-200'
                    };
                  }
                  return {
                    icon: <Truck className="w-4 h-4" />,
                    boxClass: 'bg-amber-50 text-amber-700',
                    badgeClass: 'bg-amber-50 text-amber-900 border border-amber-200'
                  };
                };

                const style = getIconAndColors();

                return (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => onSelectOperator(item)}
                  >
                    
                    {/* Operator Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${style.boxClass}`}>
                          {style.icon}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm hover:text-amber-700 transition-colors">
                              {item.company_name}
                            </span>
                            {item.state === 'Kerala' ? (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                🌴 Kerala
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                🏛️ Tamil Nadu
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              (Est. {item.established_year})
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.badgeClass}`}>
                              {item.category}
                            </span>

                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium font-mono">
                              {item.fleet_size}
                            </span>

                            {item.branches && item.branches.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-orange-50 text-orange-800 border border-orange-200 rounded text-[10px] font-bold flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-orange-600" />
                                <span>{item.branches.length} Branches ({item.state === 'Kerala' ? 'Kerala' : 'Across TN'})</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner / MD Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{item.owner_name}</p>
                          <p className="text-[10px] text-slate-500">{item.owner_designation}</p>
                        </div>
                      </div>
                    </td>

                    {/* Direct WhatsApp & Call */}
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-center gap-1">
                        
                        {/* Direct WhatsApp Click Link */}
                        {item.whatsapp_number ? (
                          <a
                            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${item.owner_name}, reaching out from Nunes Instruments regarding transport fleet operations for ${item.company_name}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-300 rounded-full font-semibold text-[11px] transition-all shadow-2xs hover:scale-102"
                            title="Open WhatsApp Chat directly"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                            <span>Chat WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400">No WhatsApp</span>
                        )}

                        {/* Direct Call Link */}
                        {item.contact_number && (
                          <a
                            href={`tel:${cleanPhone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-sky-700"
                            title="Call Operator"
                          >
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{item.contact_number}</span>
                          </a>
                        )}

                      </div>
                    </td>

                    {/* Email / Gmail ID */}
                    <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                      {item.email ? (
                        <div className="flex flex-col items-start gap-1">
                          <a
                            href={`mailto:${item.email}?subject=Transport Fleet Inquiry - ${item.company_name}&body=Dear ${item.owner_name},%0D%0A%0D%0AWe are reaching out regarding transport services.%0D%0A%0D%0ABest regards,%0D%0ANunes Instruments`}
                            className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 hover:underline max-w-[180px] truncate"
                            title="Send Email"
                          >
                            <Mail className="w-3 h-3 shrink-0 text-sky-500" />
                            <span className="truncate">{item.email}</span>
                          </a>

                          {onOneClickEmail && (
                            <button
                              onClick={() => onOneClickEmail(item)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full text-[10px] font-bold transition-all shadow-2xs hover:scale-102 cursor-pointer"
                              title={`1-Click Automated Circular Send to ${item.email}`}
                            >
                              <Zap className="w-2.5 h-2.5 fill-current animate-pulse" />
                              <span>1-Click Email</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">N/A</span>
                      )}
                    </td>

                    {/* Hub & Routes */}
                    <td className="py-3.5 px-3">
                      <div>
                        <div className="flex items-center gap-1 text-slate-900 font-semibold text-xs">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{item.city_hub}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]" title={item.routes.join(' • ')}>
                          {item.routes.slice(0, 2).join(' • ')}
                        </p>
                      </div>
                    </td>

                    {/* Permit & Verification */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{item.verification_status}</span>
                        </span>

                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.gstin ? `GST: ${item.gstin}` : item.permit_type}
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {onOneClickEmail && item.email && (
                          <button
                            onClick={() => onOneClickEmail(item)}
                            className="p-1.5 text-teal-600 hover:text-white hover:bg-teal-600 rounded-lg transition-all shadow-2xs"
                            title={`⚡ 1-Click Instant Circular Dispatch to ${item.email}`}
                          >
                            <Zap className="w-4 h-4 fill-teal-500/20" />
                          </button>
                        )}

                        {onEditOperator && (
                          <button
                            onClick={() => onEditOperator?.(item)}
                            className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit Company Details & Branches"
                          >
                            <Edit3 className="w-4 h-4 text-amber-600" />
                          </button>
                        )}

                        <button
                          onClick={() => onSelectOperator(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                          title="View Full Fleet Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onQuickWhatsApp(item)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Generate WhatsApp Inquiry"
                        >
                          <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
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

      {/* Table Pagination */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <span>Page </span>
          <strong className="text-slate-900">{currentPage}</strong>
          <span> of </span>
          <strong className="text-slate-900">{totalPages}</strong>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900">
            {currentPage}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
