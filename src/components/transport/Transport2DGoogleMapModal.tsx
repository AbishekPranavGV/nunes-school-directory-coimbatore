'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Navigation, 
  Layers, 
  Compass, 
  Plus, 
  Minus, 
  Truck, 
  Bus, 
  MessageCircle, 
  Phone, 
  Star, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Route,
  Info
} from 'lucide-react';
import { TransportRecord, BranchOffice } from '@/types/transport';

interface Transport2DGoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  operators: TransportRecord[];
  onSelectOperator: (operator: TransportRecord) => void;
}

// Key Tamil Nadu cities with realistic map coordinates on 2D canvas (0-100% relative coordinates)
const CITIES_2D = [
  { name: 'Chennai', x: 78, y: 16, label: 'Chennai (Port & Koyambedu)' },
  { name: 'Salem', x: 48, y: 38, label: 'Salem & Sankagiri' },
  { name: 'Namakkal', x: 50, y: 48, label: 'Namakkal (Truck City)' },
  { name: 'Coimbatore', x: 32, y: 54, label: 'Coimbatore' },
  { name: 'Tiruppur', x: 39, y: 51, label: 'Tiruppur' },
  { name: 'Erode', x: 43, y: 45, label: 'Erode' },
  { name: 'Karur', x: 48, y: 53, label: 'Karur' },
  { name: 'Trichy', x: 57, y: 53, label: 'Tiruchirappalli' },
  { name: 'Madurai', x: 51, y: 70, label: 'Madurai' },
  { name: 'Thoothukudi', x: 53, y: 86, label: 'Thoothukudi (VOC Port)' },
  { name: 'Tirunelveli', x: 48, y: 88, label: 'Tirunelveli' },
  { name: 'Hosur', x: 44, y: 22, label: 'Hosur / Krishnagiri' },
  { name: 'Vellore', x: 67, y: 22, label: 'Vellore / Ranipet' }
];

export const Transport2DGoogleMapModal: React.FC<Transport2DGoogleMapModalProps> = ({
  isOpen,
  onClose,
  operators,
  onSelectOperator
}) => {
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'bus' | 'lorry' | 'branches'>('all');
  const [selectedPin, setSelectedPin] = useState<{
    operator: TransportRecord;
    branch?: BranchOffice;
  } | null>(null);

  if (!isOpen) return null;

  // Filtered operators for pins
  const filteredOperators = operators.filter(op => {
    if (categoryFilter === 'bus' && op.service_type !== 'bus') return false;
    if (categoryFilter === 'lorry' && (op.service_type !== 'lorry' && op.service_type !== 'logistics')) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return op.company_name.toLowerCase().includes(q) ||
             op.city_hub.toLowerCase().includes(q) ||
             op.owner_name.toLowerCase().includes(q) ||
             op.branches?.some(b => b.city.toLowerCase().includes(q) || b.branch_name.toLowerCase().includes(q));
    }
    return true;
  });

  const getPinPosition = (city: string) => {
    const c = CITIES_2D.find(ci => ci.name.toLowerCase() === city.toLowerCase() || city.toLowerCase().includes(ci.name.toLowerCase()));
    if (c) {
      // Add slight jitter so overlapping pins don't hide each other
      const jitterX = (Math.random() - 0.5) * 3;
      const jitterY = (Math.random() - 0.5) * 3;
      return { x: c.x + jitterX, y: c.y + jitterY };
    }
    return { x: 50, y: 50 };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh] border border-slate-200 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Header Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              Tamil Nadu Live Transport & Logistics 2D Geographic Map
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Live Fleet Corridors
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2D Google Maps Canvas Area */}
        <div className={`relative flex-1 overflow-hidden transition-all duration-300 ${
          mapType === 'satellite' ? 'bg-[#0f1d2b]' : 'bg-[#e8eaed]'
        }`}>
          
          {/* Authentic Google Maps Floating Search Bar at Top Left */}
          <div className="absolute top-4 left-4 z-20 w-80 sm:w-96 space-y-2 pointer-events-auto">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 p-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transport hub (Namakkal, Sankagiri...)"
                className="w-full text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips in Google Maps Style */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Fleets ({operators.length})
              </button>

              <button
                onClick={() => setCategoryFilter('bus')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === 'bus'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bus className="w-3.5 h-3.5 text-sky-600" />
                <span>Omni Buses</span>
              </button>

              <button
                onClick={() => setCategoryFilter('lorry')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === 'lorry'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Heavy Lorries</span>
              </button>
            </div>
          </div>

          {/* Authentic Google Maps Map / Satellite Toggle at Top Left (below search) */}
          <div className="absolute top-20 right-4 sm:left-4 sm:top-24 z-20 pointer-events-auto">
            <div className="bg-white rounded-lg shadow-md border border-slate-200 p-0.5 inline-flex text-xs font-bold text-slate-700">
              <button
                onClick={() => setMapType('map')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  mapType === 'map' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'hover:bg-slate-100'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  mapType === 'satellite' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'hover:bg-slate-100'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Authentic Google Maps Zoom Controls & Compass at Bottom Right */}
          <div className="absolute bottom-6 right-4 z-20 flex flex-col items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setSelectedPin(null)}
              className="w-9 h-9 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              title="Reset View"
            >
              <Compass className="w-4 h-4 text-rose-600" />
            </button>

            <div className="bg-white rounded-lg shadow-md border border-slate-200 flex flex-col overflow-hidden">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-100 transition-all"
                title="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all"
                title="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Map Canvas with Vector Roads, Corridors, and Cities */}
          <div 
            className="w-full h-full relative transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* SVG Roads & Water Body Overlay */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              
              {/* Sea Body (Bay of Bengal & Indian Ocean) */}
              <path 
                d="M 85,0 Q 95,50 88,85 T 60,100 L 100,100 L 100,0 Z" 
                fill={mapType === 'satellite' ? '#0a1622' : '#c5e2f7'}
                opacity={mapType === 'satellite' ? 0.8 : 0.6}
              />

              {/* Major National Highway Freight Corridors */}
              
              {/* NH 44: Krishnagiri/Hosur -> Salem -> Namakkal -> Madurai -> Tirunelveli */}
              <polyline 
                points="44,22 48,38 50,48 51,70 48,88" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.85"
              />

              {/* NH 544: Salem -> Erode -> Tiruppur -> Coimbatore */}
              <polyline 
                points="48,38 43,45 39,51 32,54" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.85"
              />

              {/* NH 48: Chennai Port -> Sriperumbudur -> Vellore -> Hosur */}
              <polyline 
                points="78,16 67,22 44,22" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.85"
              />

              {/* NH 38: Chennai -> Trichy -> Madurai */}
              <polyline 
                points="78,16 57,53 51,70" 
                fill="none" 
                stroke="#8b5cf6" 
                strokeWidth="3.5" 
                strokeDasharray="4,4"
                opacity="0.75"
              />

              {/* NH 138: Madurai -> Tuticorin Port */}
              <polyline 
                points="51,70 53,86" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="4" 
                opacity="0.85"
              />

              {/* Animated Live Pulse Along Highway (Trucks in Transit) */}
              <circle cx="49" cy="43" r="3.5" fill="#ef4444">
                <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="36" cy="52" r="3.5" fill="#0284c7">
                <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="65" cy="23" r="3.5" fill="#10b981">
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* City Label Badges on Canvas */}
            {CITIES_2D.map((city) => (
              <div
                key={city.name}
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <span className={`text-[11px] font-extrabold tracking-tight px-1.5 py-0.5 rounded shadow-xs ${
                  mapType === 'satellite' 
                    ? 'text-white/90 bg-slate-950/70 border border-white/20' 
                    : 'text-slate-800/90 bg-white/80 border border-slate-300'
                }`}>
                  {city.name}
                </span>
              </div>
            ))}

            {/* Highway Badges */}
            <div style={{ left: '49%', top: '42%' }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded text-[9px] font-black border border-white shadow-xs font-mono">
                NH 44
              </span>
            </div>
            <div style={{ left: '36%', top: '51%' }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="px-1.5 py-0.2 bg-sky-600 text-white rounded text-[9px] font-black border border-white shadow-xs font-mono">
                NH 544
              </span>
            </div>
            <div style={{ left: '60%', top: '20%' }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[9px] font-black border border-white shadow-xs font-mono">
                NH 48
              </span>
            </div>

            {/* Operator Main Hub Pins */}
            {filteredOperators.map((op, idx) => {
              const pos = getPinPosition(op.district || op.city_hub);
              const isBus = op.service_type === 'bus';
              const isSelected = selectedPin?.operator.id === op.id;

              return (
                <div
                  key={op.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => setSelectedPin({ operator: op })}
                  className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer group transition-all duration-150 z-20 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    
                    {/* Google Maps Styled Teardrop Pin */}
                    <div className={`w-8 h-8 rounded-full rounded-br-none rotate-[-45deg] flex items-center justify-center shadow-lg border-2 border-white transition-all ${
                      isBus ? 'bg-sky-600' : 'bg-amber-600'
                    } ${isSelected ? 'ring-4 ring-amber-400' : ''}`}>
                      <div className="rotate-45 text-white">
                        {isBus ? <Bus className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Small Shadow beneath pin */}
                    <div className="w-3 h-1.5 bg-slate-900/40 rounded-full blur-[1px] mt-0.5"></div>

                    {/* Company Pill Tooltip */}
                    <span className="opacity-0 group-hover:opacity-100 absolute top-[-26px] bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap transition-opacity pointer-events-none">
                      {op.company_name}
                    </span>

                  </div>
                </div>
              );
            })}

            {/* Regional Branches Pins */}
            {filteredOperators.map((op) => 
              op.branches?.map((branch) => {
                const bPos = getPinPosition(branch.city);
                const isSelected = selectedPin?.branch?.id === branch.id;

                return (
                  <div
                    key={branch.id}
                    style={{ left: `${bPos.x}%`, top: `${bPos.y}%` }}
                    onClick={() => setSelectedPin({ operator: op, branch })}
                    className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer group transition-all duration-150 z-10 ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full rounded-br-none rotate-[-45deg] bg-emerald-600 flex items-center justify-center shadow-md border border-white">
                        <div className="rotate-45 text-white text-[8px] font-bold">
                          B
                        </div>
                      </div>
                      <div className="w-2 h-1 bg-slate-900/30 rounded-full blur-[0.5px]"></div>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          {/* Authentic Google Maps InfoWindow Popup on Marker Click */}
          {selectedPin && (
            <div className="absolute bottom-6 left-4 z-40 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
              
              {/* InfoWindow Header Banner */}
              <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    {selectedPin.branch ? `Branch Office: ${selectedPin.branch.city}` : selectedPin.operator.category}
                  </span>
                  <h4 className="text-sm font-bold leading-tight">
                    {selectedPin.branch ? selectedPin.branch.branch_name : selectedPin.operator.company_name}
                  </h4>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    Parent Fleet: {selectedPin.operator.company_name}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedPin(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* InfoWindow Body */}
              <div className="p-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                    <span>{selectedPin.operator.rating}</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">
                    {selectedPin.operator.fleet_size}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-700 font-semibold">
                    {selectedPin.operator.verification_status}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="font-bold text-slate-900">
                    {selectedPin.branch ? `Manager: ${selectedPin.branch.manager_name}` : `MD: ${selectedPin.operator.owner_name}`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedPin.branch ? selectedPin.branch.address : selectedPin.operator.address}
                  </p>
                </div>

                {/* Branches Preview */}
                {selectedPin.operator.branches && selectedPin.operator.branches.length > 0 && !selectedPin.branch && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Registered Branches ({selectedPin.operator.branches.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPin.operator.branches.slice(0, 4).map(b => (
                        <span key={b.id} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                          {b.city}
                        </span>
                      ))}
                      {selectedPin.operator.branches.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px]">
                          +{selectedPin.operator.branches.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${(selectedPin.branch ? selectedPin.branch.whatsapp : selectedPin.operator.whatsapp_number).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, reaching out from Nunes Instruments regarding ${selectedPin.operator.company_name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${(selectedPin.branch ? selectedPin.branch.phone : selectedPin.operator.contact_number).replace(/[^0-9+]/g, '')}`}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      onSelectOperator(selectedPin.operator);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold text-xs"
                  >
                    View Dossier
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Authentic Google Maps Attribution Bar at Bottom Right */}
          <div className="absolute bottom-1 right-2 z-10 text-[9px] text-slate-500/80 bg-white/70 px-2 py-0.5 rounded font-sans pointer-events-none">
            Map data ©2026 Google • Imagery ©2026 CNES / Airbus • Terms • Privacy
          </div>

          {/* Scale Indicator at Bottom Left */}
          <div className="absolute bottom-1 left-2 z-10 flex items-center gap-1 text-[9px] text-slate-600 font-mono bg-white/80 px-2 py-0.5 rounded pointer-events-none">
            <span className="border-b-2 border-l-2 border-r-2 border-slate-700 w-12 h-1.5 inline-block"></span>
            <span>50 km</span>
          </div>

        </div>

      </div>
    </div>
  );
};
