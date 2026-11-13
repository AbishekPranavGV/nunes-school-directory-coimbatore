'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  ExternalLink, 
  Navigation,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Crosshair,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Layers,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { SchoolRecord } from '@/types';

interface MapViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: SchoolRecord[];
  onSelectSchool: (school: SchoolRecord) => void;
}

interface BlockPlace {
  name: string;
  lat: number;
  lng: number;
  count: number;
}

const COIMBATORE_BLOCK_PLACES: BlockPlace[] = [
  { name: 'All Blocks', lat: 11.0168, lng: 76.9558, count: 2097 },
  { name: 'Coimbatore City', lat: 11.0168, lng: 76.9558, count: 238 },
  { name: 'Pollachi', lat: 10.6588, lng: 77.0084, count: 254 },
  { name: 'Sulur', lat: 11.0255, lng: 77.1250, count: 168 },
  { name: 'Valparai', lat: 10.3255, lng: 76.9550, count: 86 },
  { name: 'Mettupalayam', lat: 11.3005, lng: 76.9400, count: 188 },
  { name: 'Perur', lat: 10.9722, lng: 76.9150, count: 146 },
  { name: 'Annur', lat: 11.2333, lng: 77.1333, count: 124 },
  { name: 'Karamadai', lat: 11.2422, lng: 76.9600, count: 152 },
  { name: 'Madukkarai', lat: 10.9011, lng: 76.9600, count: 118 },
  { name: 'Anaimalai', lat: 10.5849, lng: 76.9298, count: 98 },
  { name: 'Kinathukadavu', lat: 10.8211, lng: 77.0180, count: 115 },
  { name: 'Thondamuthur', lat: 10.9955, lng: 76.8350, count: 128 },
  { name: 'Sultanpet', lat: 10.8855, lng: 77.1850, count: 120 },
  { name: 'S.S.Kulam', lat: 11.1211, lng: 77.0250, count: 95 },
  { name: 'Periyanaickanpalayam', lat: 11.1455, lng: 76.9350, count: 112 },
];

// Web Mercator Math for Live Google Maps Slippy Tiles
const TILE_SIZE = 256;

function projectLngToPixel(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * TILE_SIZE * Math.pow(2, zoom);
}

function projectLatToPixel(lat: number, zoom: number): number {
  const rad = (lat * Math.PI) / 180;
  const sin = Math.sin(rad);
  const clampedSin = Math.max(-0.9999, Math.min(0.9999, sin));
  const y = (1 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (2 * Math.PI)) / 2;
  return y * TILE_SIZE * Math.pow(2, zoom);
}

function pixelToLng(pixelX: number, zoom: number): number {
  return (pixelX / (TILE_SIZE * Math.pow(2, zoom))) * 360 - 180;
}

function pixelToLat(pixelY: number, zoom: number): number {
  const y = pixelY / (TILE_SIZE * Math.pow(2, zoom));
  const n = Math.PI - 2 * Math.PI * y;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

export const MapViewModal: React.FC<MapViewModalProps> = ({
  isOpen,
  onClose,
  schools,
  onSelectSchool
}) => {
  // Live Google Map Coordinates & Zoom State
  // Default centered at Coimbatore: 11.0168° N, 76.9558° E, Zoom Level 12 (City & Roads)
  const [centerLat, setCenterLat] = useState<number>(11.0168);
  const [centerLng, setCenterLng] = useState<number>(76.9558);
  const [zoom, setZoom] = useState<number>(12);
  
  // Map Layer: 'roadmap' (Google Maps 2D standard), 'satellite' (Google Satellite Hybrid), 'terrain'
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');

  // UI state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<string>('All Blocks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSchool, setSelectedSchoolPin] = useState<SchoolRecord | null>(null);
  const [hoveredSchoolId, setHoveredSchoolId] = useState<string | null>(null);
  const [allDistrictSchools, setAllDistrictSchools] = useState<SchoolRecord[]>(schools);

  // Mouse pan / drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragCenterStart, setDragCenterStart] = useState<{ px: number; py: number }>({ px: 0, py: 0 });

  // Viewport dimensions
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({ width: 1000, height: 600 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Measure container size
  useEffect(() => {
    if (!isOpen) return;
    const updateSize = () => {
      if (mapContainerRef.current) {
        setViewportSize({
          width: mapContainerRef.current.clientWidth || 1000,
          height: mapContainerRef.current.clientHeight || 600
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isOpen, isFullscreen]);

  // Fetch full dataset if needed
  useEffect(() => {
    if (isOpen && allDistrictSchools.length < 500) {
      fetch('/api/schools?pageSize=3000')
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data.length > 0) {
            setAllDistrictSchools(data.data);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, allDistrictSchools.length]);

  // Center pixel coordinates
  const centerPixelX = projectLngToPixel(centerLng, zoom);
  const centerPixelY = projectLatToPixel(centerLat, zoom);

  // Compute visible slippy map tiles
  const halfW = viewportSize.width / 2;
  const halfH = viewportSize.height / 2;

  const minTileX = Math.max(0, Math.floor((centerPixelX - halfW) / TILE_SIZE));
  const maxTileX = Math.min(Math.pow(2, zoom) - 1, Math.floor((centerPixelX + halfW) / TILE_SIZE));
  const minTileY = Math.max(0, Math.floor((centerPixelY - halfH) / TILE_SIZE));
  const maxTileY = Math.min(Math.pow(2, zoom) - 1, Math.floor((centerPixelY + halfH) / TILE_SIZE));

  const visibleTiles: { x: number; y: number; left: number; top: number; url: string }[] = [];

  for (let tx = minTileX; tx <= maxTileX; tx++) {
    for (let ty = minTileY; ty <= maxTileY; ty++) {
      const left = tx * TILE_SIZE - centerPixelX + halfW;
      const top = ty * TILE_SIZE - centerPixelY + halfH;
      
      let tileUrl = `https://mt1.google.com/vt/lyrs=m&x=${tx}&y=${ty}&z=${zoom}`;
      if (mapType === 'satellite') {
        // Satellite Hybrid with street labels
        tileUrl = `https://mt1.google.com/vt/lyrs=y&x=${tx}&y=${ty}&z=${zoom}`;
      } else if (mapType === 'terrain') {
        tileUrl = `https://mt1.google.com/vt/lyrs=p&x=${tx}&y=${ty}&z=${zoom}`;
      }

      visibleTiles.push({ x: tx, y: ty, left, top, url: tileUrl });
    }
  }

  // Filter schools for current view
  const displaySchools = allDistrictSchools.filter(s => {
    if (selectedBlock !== 'All Blocks') {
      const bNorm = selectedBlock.toLowerCase();
      const sBlock = (s.block || '').toLowerCase();
      if (!sBlock.includes(bNorm) && !bNorm.includes(sBlock)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = s.school_name.toLowerCase().includes(q);
      const matchesUdise = s.udise_code.includes(q);
      const matchesBlock = s.block.toLowerCase().includes(q);
      const matchesPin = (s.pincode || '').includes(q);
      if (!matchesName && !matchesUdise && !matchesBlock && !matchesPin) return false;
    }
    return Boolean(s.latitude && s.longitude);
  });

  // Calculate pixel positions for visible school pins
  const visibleSchoolPins = displaySchools.map(s => {
    const lat = s.latitude || 11.0;
    const lng = s.longitude || 76.9;
    const px = projectLngToPixel(lng, zoom);
    const py = projectLatToPixel(lat, zoom);
    const screenX = px - centerPixelX + halfW;
    const screenY = py - centerPixelY + halfH;
    return {
      school: s,
      screenX,
      screenY,
      isVisible: screenX >= -40 && screenX <= viewportSize.width + 40 && screenY >= -40 && screenY <= viewportSize.height + 40
    };
  }).filter(item => item.isVisible);

  // Drag / Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragCenterStart({ px: centerPixelX, py: centerPixelY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const newPx = dragCenterStart.px - dx;
    const newPy = dragCenterStart.py - dy;
    setCenterLng(pixelToLng(newPx, zoom));
    setCenterLat(pixelToLat(newPy, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zoom centered on cursor
  const handleWheel = (e: React.WheelEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setZoom(prev => Math.min(18, prev + 1));
    } else if (e.deltaY > 0) {
      // Zoom out
      setZoom(prev => Math.max(10, prev - 1));
    }
  };

  // Block Selector Handler: Flies directly to block coordinates
  const handleSelectBlock = (place: BlockPlace) => {
    setSelectedBlock(place.name);
    setSelectedSchoolPin(null);
    setCenterLat(place.lat);
    setCenterLng(place.lng);
    setZoom(place.name === 'All Blocks' ? 11 : 13);
  };

  // Re-center on Coimbatore city hub
  const handleRecenter = () => {
    setSelectedBlock('All Blocks');
    setCenterLat(11.0168);
    setCenterLng(76.9558);
    setZoom(12);
    setSelectedSchoolPin(null);
  };

  // Search Jump handler
  const handleSearchSelectSchool = (s: SchoolRecord) => {
    if (s.latitude && s.longitude) {
      setCenterLat(s.latitude);
      setCenterLng(s.longitude);
      setZoom(15);
      setSelectedSchoolPin(s);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in-50 duration-200">
      <div 
        className={`bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col relative transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl w-full h-[92vh]'
        }`}
      >
        
        {/* ========================================================================= */}
        {/* LIVE GOOGLE MAPS INTERACTIVE CANVAS CONTAINER                             */}
        {/* ========================================================================= */}
        <div 
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`relative flex-1 overflow-hidden select-none bg-[#e5e3df] ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          
          {/* 1. Live Google Maps Tile Layer (Roadmap / Satellite Hybrid / Terrain) */}
          <div className="absolute inset-0 pointer-events-none">
            {visibleTiles.map(t => (
              <img
                key={`${mapType}-${zoom}-${t.x}-${t.y}`}
                src={t.url}
                alt=""
                className="absolute select-none pointer-events-none"
                style={{
                  left: `${t.left}px`,
                  top: `${t.top}px`,
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`
                }}
                loading="eager"
                onError={(e) => {
                  // Graceful fallback to CartoDB Voyager tiles if Google tile rate-limited
                  (e.target as HTMLImageElement).src = `https://a.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${t.x}/${t.y}.png`;
                }}
              />
            ))}
          </div>

          {/* 2. Top-Left Google Maps Search Box */}
          <div className="interactive-control absolute top-3 left-3 z-30 max-w-sm w-full">
            <div className="relative bg-white rounded-xl shadow-lg border border-slate-200/90 flex items-center px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schools or localities in Coimbatore..."
                className="w-full text-xs sm:text-sm text-slate-800 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick search dropdown results */}
            {searchQuery && displaySchools.length > 0 && (
              <div className="mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {displaySchools.slice(0, 5).map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSearchSelectSchool(s)}
                    className="w-full p-2.5 text-left text-xs hover:bg-sky-50 flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">{s.school_name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{s.block} • {s.pincode}</p>
                    </div>
                    <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded ml-2 shrink-0">
                      Jump To
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Top-Right Controls: Google Maps Layer Switcher & Modal Exit */}
          <div className="interactive-control absolute top-3 right-3 z-30 flex items-center gap-2">
            
            {/* Layer Switcher: Map vs Satellite vs Terrain */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0.5 flex items-center text-xs font-semibold">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mapType === 'roadmap'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mapType === 'satellite'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapType('terrain')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mapType === 'terrain'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Terrain
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Exit Modal Button */}
            <button
              onClick={onClose}
              className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="Close Map View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Live Geographical School Pins Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {visibleSchoolPins.map(({ school: s, screenX, screenY }) => {
              const isSelected = selectedSchool?.id === s.id;
              const isHovered = hoveredSchoolId === s.id;
              const isVerified = Boolean(s.official_landline || s.official_mobile || s.official_whatsapp || s.official_email);

              return (
                <div
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSchoolPin(s);
                  }}
                  onMouseEnter={() => setHoveredSchoolId(s.id)}
                  onMouseLeave={() => setHoveredSchoolId(null)}
                  className="interactive-control absolute pointer-events-auto cursor-pointer transition-transform duration-150"
                  style={{
                    left: `${screenX}px`,
                    top: `${screenY}px`,
                    transform: `translate(-50%, -100%) scale(${isSelected ? 1.3 : isHovered ? 1.2 : 1})`,
                    zIndex: isSelected ? 50 : isHovered ? 40 : 20
                  }}
                >
                  {/* Pin Graphic */}
                  {isSelected || isHovered ? (
                    <div className="flex flex-col items-center">
                      <div className={`px-2.5 py-1 rounded-xl shadow-xl flex items-center gap-1.5 text-white whitespace-nowrap text-xs font-bold border ${
                        isSelected 
                          ? 'bg-sky-600 border-white ring-2 ring-sky-300' 
                          : isVerified 
                          ? 'bg-emerald-600 border-emerald-300' 
                          : 'bg-rose-600 border-rose-300'
                      }`}>
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="max-w-[130px] truncate">{s.school_name}</span>
                      </div>
                      <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1 shadow-xs" />
                    </div>
                  ) : (
                    /* Default Google Maps Style Teardrop Pin */
                    <div className="relative group">
                      <div className={`w-6 h-6 rounded-full rounded-br-none -rotate-45 flex items-center justify-center shadow-md border border-white ${
                        isVerified ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-white rotate-45" />
                      </div>
                      {/* Ground drop shadow */}
                      <div className="w-2 h-1 bg-black/40 rounded-full mx-auto blur-[1px] mt-0.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 5. Google Maps Style InfoWindow Card (when pin selected) */}
          {selectedSchool && (
            <div className="interactive-control absolute bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] sm:w-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-800 border border-sky-200">
                      {selectedSchool.udise_code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">• {selectedSchool.block}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedSchool.is_contact_complete ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedSchool.is_contact_complete ? 'Verified Contact' : 'Missing Contact'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{selectedSchool.school_name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedSchool.address}</p>
                </div>

                <button 
                  onClick={() => setSelectedSchoolPin(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Verified Contact Details Bar */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Official Landline:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedSchool.official_landline || selectedSchool.official_mobile || 'Not published'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Official Email:</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {selectedSchool.official_email || 'Awaiting verification'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSchool.school_name + ' ' + selectedSchool.block + ' Coimbatore')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
                >
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => {
                    onSelectSchool(selectedSchool);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1"
                >
                  <span>Inspect Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 6. Bottom-Right Navigation & Zoom Controls (Google Maps Style) */}
          <div className="interactive-control absolute bottom-24 right-4 z-30 flex flex-col gap-2">
            
            {/* Recenter Button */}
            <button
              onClick={handleRecenter}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-lg border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
              title="Re-center Map to Coimbatore Hub"
            >
              <Crosshair className="w-4 h-4 text-sky-600" />
            </button>

            {/* Zoom In & Out */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
              <button
                onClick={() => setZoom(prev => Math.min(18, prev + 1))}
                className="p-2.5 text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-all flex items-center justify-center cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(10, prev - 1))}
                className="p-2.5 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7. Bottom-Left Authentic Google Brand & Copyright */}
          <div className="absolute bottom-20 left-3 z-30 pointer-events-none flex items-center gap-2 text-[10px] text-slate-600 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/60 shadow-xs">
            <span className="font-bold text-slate-800">Google</span>
            <span className="text-slate-400">•</span>
            <span>Map data ©2026 Google • UDISE+ Coimbatore District Master Register</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM BLOCK SELECTION BAR (FROM IMAGE 3)                                  */}
        {/* ========================================================================= */}
        <div className="bg-white border-t border-slate-200 p-2.5 px-4 flex items-center gap-2 overflow-x-auto scrollbar-none z-30 shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1 shrink-0">
            Blocks:
          </span>
          {COIMBATORE_BLOCK_PLACES.map((b) => {
            const isSelected = selectedBlock === b.name;
            return (
              <button
                key={b.name}
                onClick={() => handleSelectBlock(b)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-700 text-white shadow-xs ring-2 ring-sky-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{b.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-sky-900 text-white' : 'bg-white text-slate-600'
                }`}>
                  {b.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};