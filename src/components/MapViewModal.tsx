'use client';

import React, { useState } from 'react';
import { X, MapPin, Building, Phone, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { SchoolRecord } from '@/types';

interface MapViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: SchoolRecord[];
  onSelectSchool: (school: SchoolRecord) => void;
}

export const MapViewModal: React.FC<MapViewModalProps> = ({
  isOpen,
  onClose,
  schools,
  onSelectSchool
}) => {
  const [selectedBlock, setSelectedBlock] = useState<string>('All');

  if (!isOpen) return null;

  const blocksList = [
    'All', 'Anaimalai', 'Annur', 'Coimbatore City', 'Karamadai', 'Kinathukadavu',
    'Madukkarai', 'Periyanaickanpalayam', 'Perur', 'Pollachi North',
    'Pollachi South', 'S.S.Kulam', 'Sultanpet', 'Sulur', 'Thondamuthur', 'Valparai'
  ];

  const filteredSchools = selectedBlock === 'All' 
    ? schools.slice(0, 80) // preview first 80 geocoded points
    : schools.filter(s => s.block === selectedBlock).slice(0, 80);

  // Block counts
  const blockCounts: Record<string, number> = {};
  for (const s of schools) {
    blockCounts[s.block] = (blockCounts[s.block] || 0) + 1;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-50 via-slate-50 to-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Coimbatore District Geographic Map View</h3>
              <p className="text-xs text-slate-500">Visual block distribution & verified sourced school coordinates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Block Filter Selector */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/70 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1 uppercase">
            <Layers className="w-3.5 h-3.5" />
            Block:
          </span>
          {blocksList.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBlock(b)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedBlock === b
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {b} {b !== 'All' && `(${blockCounts[b] || 0})`}
            </button>
          ))}
        </div>

        {/* Map Visualization Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Visual SVG Map of Coimbatore District Blocks */}
          <div className="bg-sky-50/40 rounded-2xl border border-sky-100 p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 w-full max-w-xl text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 border border-sky-200 rounded-full text-xs font-semibold text-sky-800 mb-3 shadow-xs">
                <span>Coimbatore District Coordinates: 10.32° N - 11.25° N, 76.82° E - 77.20° E</span>
              </div>

              {/* Grid representation of blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mt-2">
                {Object.keys(blockCounts).map(b => {
                  const cnt = blockCounts[b];
                  const isSel = selectedBlock === b;
                  return (
                    <div
                      key={b}
                      onClick={() => setSelectedBlock(b)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSel 
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-105' 
                          : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300 hover:shadow-xs'
                      }`}
                    >
                      <p className={`text-xs font-bold truncate ${isSel ? 'text-white' : 'text-slate-900'}`}>{b}</p>
                      <p className={`text-[11px] mt-0.5 ${isSel ? 'text-sky-100' : 'text-slate-500'}`}>{cnt} Schools</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sourced Geocoded School Pins List */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Geocoded Locations ({selectedBlock}): {filteredSchools.length} Displayed
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredSchools.map(s => (
                <div
                  key={s.id}
                  onClick={() => {
                    onClose();
                    onSelectSchool(s);
                  }}
                  className="p-3 bg-slate-50 hover:bg-sky-50/60 rounded-xl border border-slate-200 hover:border-sky-300 cursor-pointer transition-all flex items-start justify-between"
                >
                  <div className="flex-1 pr-2">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{s.school_name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {s.block} • {s.pincode}
                    </p>
                    <p className="text-[10px] font-mono text-sky-700 mt-1">
                      Lat: {s.latitude?.toFixed(4)}, Lon: {s.longitude?.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    {s.is_contact_complete ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
