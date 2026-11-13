'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  Bus, 
  Phone, 
  MessageCircle, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Navigation
} from 'lucide-react';
import { TransportRecord } from '@/types/transport';

interface TransportMapViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  operators: TransportRecord[];
  onSelectOperator: (operator: TransportRecord) => void;
}

const HUBS_GEO = [
  { city: 'Namakkal', name: 'Namakkal National Trucking Hub', desc: '12,000+ Heavy Multi-Axle Lorries & LPG Bulkers', x: 50, y: 48, count: 5, color: 'bg-amber-600' },
  { city: 'Salem', name: 'Sankagiri & Salem Cement Bulker Hub', desc: 'Sankagiri Lorry Owners Association Base', x: 49, y: 38, count: 4, color: 'bg-emerald-600' },
  { city: 'Coimbatore', name: 'Coimbatore Industrial Freight & Bus Hub', desc: 'Industrial Pumps, Machinery & Omni Bus Terminal', x: 34, y: 53, count: 7, color: 'bg-sky-600' },
  { city: 'Chennai', name: 'Chennai Port Container & Koyambedu Omni', desc: 'Customs Bonded Containers & Interstate Luxury Coaches', x: 74, y: 16, count: 5, color: 'bg-indigo-600' },
  { city: 'Tiruppur', name: 'Tirupur Textile Garment Export Hub', desc: 'Waterproof High-Volume Containers & Express Cargo', x: 39, y: 50, count: 2, color: 'bg-rose-600' },
  { city: 'Madurai', name: 'Madurai South Gateway Transit Hub', desc: 'Southern Corridors & Mattuthavani Bus Hub', x: 50, y: 68, count: 2, color: 'bg-purple-600' },
  { city: 'Tiruchirappalli', name: 'Trichy BHEL Heavy ODC Hub', desc: 'Heavy Boilers, Power Plant Components & Multi-Axle Haulers', x: 56, y: 52, count: 2, color: 'bg-teal-600' },
  { city: 'Thoothukudi', name: 'Tuticorin VOC Port Sea Container Hub', desc: 'Maritime Container Prime Movers & Port Drayage', x: 51, y: 84, count: 1, color: 'bg-blue-600' },
  { city: 'Krishnagiri', name: 'Hosur SIPCOT Auto Cluster', desc: 'Automotive Component Express Haulage', x: 46, y: 22, count: 1, color: 'bg-orange-600' }
];

export const TransportMapViewModal: React.FC<TransportMapViewModalProps> = ({
  isOpen,
  onClose,
  operators,
  onSelectOperator
}) => {
  const [selectedHub, setSelectedHub] = useState<string>('Namakkal');

  if (!isOpen) return null;

  const currentHubData = HUBS_GEO.find(h => h.city.toLowerCase() === selectedHub.toLowerCase()) || HUBS_GEO[0];
  const hubOperators = operators.filter(o => 
    o.district.toLowerCase() === selectedHub.toLowerCase() || 
    o.city_hub.toLowerCase().includes(selectedHub.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tamil Nadu Transport Hubs & Freight Corridors Map
              </h2>
              <p className="text-xs text-slate-500">
                Geographic distribution of Bus Operators, Heavy Multi-Axle Trucks, and LPG Bulkers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Map Visualizer (Left 2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between">
              
              {/* Map Title Overlay */}
              <div className="relative z-10 flex items-center justify-between text-white/90">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Interactive Map View</span>
                  <h3 className="text-sm sm:text-base font-bold">Tamil Nadu Transport Grid</h3>
                </div>
                <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                  38 Districts • 14 Hubs
                </span>
              </div>

              {/* Geographic Hub Nodes */}
              <div className="relative w-full h-full my-4">
                {HUBS_GEO.map((hub) => {
                  const isSelected = selectedHub.toLowerCase() === hub.city.toLowerCase();

                  return (
                    <div
                      key={hub.city}
                      style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                      onClick={() => setSelectedHub(hub.city)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-200 z-20 ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                      }`}
                    >
                      <div className="relative flex flex-col items-center">
                        <span className={`w-3.5 h-3.5 rounded-full ${hub.color} border-2 border-white shadow-lg ${
                          isSelected ? 'ring-4 ring-amber-400/80 animate-bounce' : ''
                        }`}></span>
                        <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-all shadow-md ${
                          isSelected ? 'bg-amber-400 text-slate-900' : 'bg-slate-900/90 text-white/90 group-hover:bg-white group-hover:text-slate-900'
                        }`}>
                          {hub.city}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer Legend */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Truck City (Namakkal)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Industrial / Bus (Coimbatore)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Port / Omni (Chennai)
                  </span>
                </div>
                <span>Click any hub pin</span>
              </div>

            </div>

            {/* Quick Hub Selector Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {HUBS_GEO.map((h) => (
                <button
                  key={h.city}
                  onClick={() => setSelectedHub(h.city)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedHub.toLowerCase() === h.city.toLowerCase()
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {h.city}
                </button>
              ))}
            </div>
          </div>

          {/* Hub Operators Drawer (Right 1 Col) */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{currentHubData.name}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentHubData.desc}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Operators in this Hub ({hubOperators.length}):
              </span>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {hubOperators.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No operators listed under this specific hub filter</p>
                ) : (
                  hubOperators.map((item) => {
                    const isBus = item.service_type === 'bus';

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectOperator(item);
                          onClose();
                        }}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 text-xs hover:text-amber-700">
                            {item.company_name}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            isBus ? 'bg-sky-50 text-sky-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {isBus ? 'Bus' : 'Lorry'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 font-medium">
                          MD: {item.owner_name}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>{item.fleet_size}</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
