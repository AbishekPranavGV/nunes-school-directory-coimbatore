'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Package, 
  Landmark, 
  Maximize2, 
  Minimize2, 
  Radio, 
  Check, 
  Eye, 
  RotateCcw
} from 'lucide-react';
import { TransportRecord, BranchOffice } from '@/types/transport';

interface Transport2DGoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  operators: TransportRecord[];
  onSelectOperator: (operator: TransportRecord) => void;
}

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

// Major South India (Tamil Nadu & Kerala) Hub Shortcuts for Quick Fly-To
const SOUTH_INDIA_HUBS = [
  { id: 'all_south', name: 'All South India (TN & KL)', lat: 10.5000, lng: 77.2000, zoom: 7, desc: 'Inter-State Corridors' },
  // Tamil Nadu
  { id: 'coimbatore', name: 'Coimbatore (TN)', lat: 11.0168, lng: 76.9558, zoom: 11, desc: 'Pumps & Omni Bus Hub' },
  { id: 'namakkal', name: 'Namakkal (TN)', lat: 11.2189, lng: 78.1674, zoom: 12, desc: 'National Truck City' },
  { id: 'salem', name: 'Salem & Sankagiri (TN)', lat: 11.6643, lng: 78.1460, zoom: 11, desc: 'Bulkers & Cement Hub' },
  { id: 'chennai', name: 'Chennai Port (TN)', lat: 13.0827, lng: 80.2707, zoom: 11, desc: 'Port CFS & Koyambedu' },
  { id: 'madurai', name: 'Madurai (TN)', lat: 9.9252, lng: 78.1198, zoom: 11, desc: 'South Highway Hub' },
  { id: 'thoothukudi', name: 'Tuticorin (TN)', lat: 8.7642, lng: 78.1348, zoom: 12, desc: 'VOC Port Sea Container' },
  // Kerala
  { id: 'kochi', name: 'Kochi Vallarpadam (KL)', lat: 9.9816, lng: 76.2490, zoom: 12, desc: 'ICTT Port & KSRTC SWIFT Hub' },
  { id: 'palakkad', name: 'Palakkad Walayar (KL)', lat: 10.7867, lng: 76.6548, zoom: 12, desc: 'TN-KL Border Corridor & Goods Hub' },
  { id: 'kozhikode', name: 'Kozhikode Mavoor (KL)', lat: 11.2588, lng: 75.7804, zoom: 12, desc: 'Malabar Freight Corridor' },
  { id: 'trivandrum', name: 'Trivandrum Central (KL)', lat: 8.5241, lng: 76.9366, zoom: 12, desc: 'Vizhinjam Port Gateway' },
  { id: 'thrissur', name: 'Thrissur Central (KL)', lat: 10.5276, lng: 76.2144, zoom: 12, desc: 'Commercial Transit Depot' }
];

export const Transport2DGoogleMapModal: React.FC<Transport2DGoogleMapModalProps> = ({
  isOpen,
  onClose,
  operators,
  onSelectOperator
}) => {
  // Map coordinates & zoom state
  // Default centered on Tamil Nadu: 11.1271° N, 78.6569° E, Zoom level 8
  const [centerLat, setCenterLat] = useState<number>(11.1271);
  const [centerLng, setCenterLng] = useState<number>(78.6569);
  const [zoom, setZoom] = useState<number>(8);

  // Map Layer: 'roadmap' (Google Maps 2D standard), 'satellite' (Google Satellite Hybrid), 'terrain'
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [showTraffic, setShowTraffic] = useState<boolean>(false);
  const [showBranches, setShowBranches] = useState<boolean>(true);

  // Filters & Selected Pin
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'bus' | 'lorry' | 'logistics' | 'govt'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPin, setSelectedPin] = useState<{
    operator: TransportRecord;
    branch?: BranchOffice;
    lat: number;
    lng: number;
  } | null>(null);

  // Pan / Dragging interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragCenterStart, setDragCenterStart] = useState<{ px: number; py: number }>({ px: 0, py: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Viewport dimensions
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({ width: 1000, height: 600 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Measure container dimensions
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

  if (!isOpen) return null;

  // Web Mercator current center in pixels
  const centerPixelX = projectLngToPixel(centerLng, zoom);
  const centerPixelY = projectLatToPixel(centerLat, zoom);

  // Compute visible slippy tiles
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

      let layerCode = 'm'; // Roadmap
      if (mapType === 'satellite') {
        layerCode = 'y'; // Hybrid satellite with streets/labels
      } else if (mapType === 'terrain') {
        layerCode = 'p'; // Terrain relief
      }

      if (showTraffic && mapType === 'roadmap') {
        layerCode = 'm,traffic';
      }

      const tileUrl = `https://mt1.google.com/vt/lyrs=${layerCode}&x=${tx}&y=${ty}&z=${zoom}`;
      visibleTiles.push({ x: tx, y: ty, left, top, url: tileUrl });
    }
  }

  // Filter operators
  const filteredOperators = operators.filter(op => {
    if (categoryFilter === 'bus' && op.service_type !== 'bus') return false;
    if (categoryFilter === 'lorry' && op.service_type !== 'lorry') return false;
    if (categoryFilter === 'logistics' && op.service_type !== 'logistics') return false;
    if (categoryFilter === 'govt' && op.service_type !== 'govt') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCompany = op.company_name.toLowerCase().includes(q);
      const matchOwner = op.owner_name.toLowerCase().includes(q);
      const matchCity = op.city_hub.toLowerCase().includes(q) || op.district.toLowerCase().includes(q);
      const matchBranch = op.branches?.some(b => b.city.toLowerCase().includes(q) || b.branch_name.toLowerCase().includes(q));
      return matchCompany || matchOwner || matchCity || matchBranch;
    }
    return true;
  });

  // Calculate screen positions for Operator Pins
  const operatorPins = filteredOperators.map(op => {
    const lat = op.latitude || 11.0;
    const lng = op.longitude || 77.0;
    const px = projectLngToPixel(lng, zoom);
    const py = projectLatToPixel(lat, zoom);
    const screenX = px - centerPixelX + halfW;
    const screenY = py - centerPixelY + halfH;
    return {
      operator: op,
      lat,
      lng,
      screenX,
      screenY,
      isVisible: screenX >= -40 && screenX <= viewportSize.width + 40 && screenY >= -40 && screenY <= viewportSize.height + 40
    };
  }).filter(p => p.isVisible);

  // Calculate screen positions for Branch Offices if enabled
  const branchPins: {
    operator: TransportRecord;
    branch: BranchOffice;
    lat: number;
    lng: number;
    screenX: number;
    screenY: number;
    isVisible: boolean;
  }[] = [];

  if (showBranches) {
    filteredOperators.forEach(op => {
      if (op.branches && op.branches.length > 0) {
        op.branches.forEach(b => {
          if (b.latitude && b.longitude) {
            const px = projectLngToPixel(b.longitude, zoom);
            const py = projectLatToPixel(b.latitude, zoom);
            const screenX = px - centerPixelX + halfW;
            const screenY = py - centerPixelY + halfH;
            if (screenX >= -30 && screenX <= viewportSize.width + 30 && screenY >= -30 && screenY <= viewportSize.height + 30) {
              branchPins.push({
                operator: op,
                branch: b,
                lat: b.latitude,
                lng: b.longitude,
                screenX,
                screenY,
                isVisible: true
              });
            }
          }
        });
      }
    });
  }

  // Mouse pan / drag handlers
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

  // Wheel zoom centered on cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 1 : -1;
    const newZoom = Math.min(16, Math.max(6, zoom + zoomDelta));
    if (newZoom === zoom) return;

    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const mouseWorldPx = centerPixelX + (mouseX - halfW);
      const mouseWorldPy = centerPixelY + (mouseY - halfH);

      const mouseLng = pixelToLng(mouseWorldPx, zoom);
      const mouseLat = pixelToLat(mouseWorldPy, zoom);

      setZoom(newZoom);
      setCenterLng(mouseLng);
      setCenterLat(mouseLat);
    } else {
      setZoom(newZoom);
    }
  };

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setDragCenterStart({ px: centerPixelX, py: centerPixelY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    const newPx = dragCenterStart.px - dx;
    const newPy = dragCenterStart.py - dy;
    setCenterLng(pixelToLng(newPx, zoom));
    setCenterLat(pixelToLat(newPy, zoom));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick Hub Fly-To
  const flyToHub = (hub: typeof SOUTH_INDIA_HUBS[0]) => {
    setCenterLat(hub.lat);
    setCenterLng(hub.lng);
    setZoom(hub.zoom);
  };

  // Get style & icon for Pin
  const getPinStyle = (serviceType: string) => {
    if (serviceType === 'govt') {
      return {
        bg: 'bg-purple-600',
        text: 'text-white',
        border: 'border-purple-200',
        shadow: 'shadow-purple-600/30',
        icon: Landmark,
        label: 'Govt STU'
      };
    }
    if (serviceType === 'logistics') {
      return {
        bg: 'bg-emerald-600',
        text: 'text-white',
        border: 'border-emerald-200',
        shadow: 'shadow-emerald-600/30',
        icon: Package,
        label: '3PL Logistics'
      };
    }
    if (serviceType === 'bus') {
      return {
        bg: 'bg-sky-600',
        text: 'text-white',
        border: 'border-sky-200',
        shadow: 'shadow-sky-600/30',
        icon: Bus,
        label: 'Omni Bus'
      };
    }
    return {
      bg: 'bg-amber-600',
      text: 'text-white',
      border: 'border-amber-200',
      shadow: 'shadow-amber-600/30',
      icon: Truck,
      label: 'Heavy Lorry'
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3 animate-in fade-in duration-150">
      <div 
        className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 relative select-none transition-all ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-7xl h-[95vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* TOP BAR 1: Brand & Window Actions */}
        <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>South India Live Transport & Logistics Google Map</span>
              <span className="hidden md:inline text-slate-400 font-normal">| Tamil Nadu & Kerala RTO Highway Corridors</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {filteredOperators.length} Registered Fleets
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {branchPins.length} Regional Depots
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              title="Close Map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP BAR 2: Live Controls, Search & Filter Bar */}
        <div className="px-3 sm:px-4 py-2 bg-white border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 z-20 shrink-0">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, hub, depot (VRL, SETC, Namakkal, Sankagiri...)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Fleets
            </button>
            <button
              onClick={() => setCategoryFilter('bus')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'bus'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <Bus className="w-3 h-3" />
              <span>Omni Buses</span>
            </button>
            <button
              onClick={() => setCategoryFilter('lorry')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'lorry'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>Heavy Lorries</span>
            </button>
            <button
              onClick={() => setCategoryFilter('logistics')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'logistics'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>3PL Logistics</span>
            </button>
            <button
              onClick={() => setCategoryFilter('govt')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'govt'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Landmark className="w-3 h-3" />
              <span>Govt STU</span>
            </button>
          </div>

          {/* Layer & Traffic Toggles */}
          <div className="flex items-center gap-1.5 self-end md:self-auto">
            {/* Google Maps Layer Switcher */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  mapType === 'roadmap' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  mapType === 'satellite' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapType('terrain')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  mapType === 'terrain' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Terrain
              </button>
            </div>

            {/* Show Branches Checkbox Toggle */}
            <button
              onClick={() => setShowBranches(!showBranches)}
              className={`px-2 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                showBranches ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Toggle Regional Branch Depots"
            >
              <Building2 className="w-3 h-3 text-teal-600" />
              <span className="hidden sm:inline">Depots</span>
            </button>
          </div>

        </div>

        {/* TOP BAR 3: Quick Hub Jumps */}
        <div className="px-3 sm:px-4 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none z-10 shrink-0 text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 whitespace-nowrap">
            Fly to Hub:
          </span>
          {SOUTH_INDIA_HUBS.map(hub => (
            <button
              key={hub.id}
              onClick={() => flyToHub(hub)}
              className="px-2 py-0.5 rounded-full bg-white hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 text-slate-700 text-[11px] font-medium border border-slate-200 whitespace-nowrap transition-all shadow-2xs"
            >
              {hub.name}
            </button>
          ))}
        </div>

        {/* MAIN SLIPPY MAP CANVAS */}
        <div
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`flex-1 relative overflow-hidden bg-slate-100 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          
          {/* SLIPPY MAP TILES CONTAINER */}
          <div className="absolute inset-0 pointer-events-none">
            {visibleTiles.map(tile => (
              <img
                key={`${tile.x}-${tile.y}-${zoom}-${mapType}`}
                src={tile.url}
                alt=""
                loading="eager"
                draggable={false}
                style={{
                  position: 'absolute',
                  left: `${tile.left}px`,
                  top: `${tile.top}px`,
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                  userSelect: 'none'
                }}
                className="select-none"
              />
            ))}
          </div>

          {/* HIGHWAY CORRIDOR BADGES (Float on map relative to center) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* NH 44 Badge (Kashmir to Kanyakumari via Salem, Namakkal, Madurai) */}
            {(() => {
              const px = projectLngToPixel(78.1674, zoom);
              const py = projectLatToPixel(11.2189, zoom);
              const sx = px - centerPixelX + halfW;
              const sy = py - centerPixelY + halfH - 35;
              if (sx >= 0 && sx <= viewportSize.width && sy >= 0 && sy <= viewportSize.height) {
                return (
                  <div style={{ left: `${sx}px`, top: `${sy}px` }} className="absolute -translate-x-1/2 -translate-y-1/2">
                    <span className="px-2 py-0.5 rounded font-black font-mono text-[9px] bg-amber-500 text-slate-950 border border-white shadow-md">
                      NH 44 (Truck Corridor)
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            {/* NH 544 Badge (Salem - Coimbatore Corridor) */}
            {(() => {
              const px = projectLngToPixel(77.3411, zoom);
              const py = projectLatToPixel(11.1085, zoom);
              const sx = px - centerPixelX + halfW;
              const sy = py - centerPixelY + halfH - 35;
              if (sx >= 0 && sx <= viewportSize.width && sy >= 0 && sy <= viewportSize.height) {
                return (
                  <div style={{ left: `${sx}px`, top: `${sy}px` }} className="absolute -translate-x-1/2 -translate-y-1/2">
                    <span className="px-2 py-0.5 rounded font-black font-mono text-[9px] bg-sky-600 text-white border border-white shadow-md">
                      NH 544 (Industrial Corridor)
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* REGIONAL BRANCH DEPOT PINS (Greenish Depot Markers) */}
          {branchPins.map(({ operator, branch, lat, lng, screenX, screenY }) => (
            <div
              key={`branch-${branch.id}`}
              style={{ left: `${screenX}px`, top: `${screenY}px` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPin({ operator, branch, lat, lng });
              }}
              className="interactive-control absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15 group hover:z-30 transition-transform hover:scale-125"
              title={`${operator.company_name} - ${branch.branch_name} (${branch.city})`}
            >
              <div className="w-5 h-5 rounded-full bg-teal-600 border-2 border-white text-white flex items-center justify-center shadow-md">
                <Building2 className="w-2.5 h-2.5" />
              </div>
            </div>
          ))}

          {/* PRIMARY TRANSPORT OPERATOR PINS */}
          {operatorPins.map(({ operator, lat, lng, screenX, screenY }) => {
            const style = getPinStyle(operator.service_type);
            const Icon = style.icon;
            const isSelected = selectedPin?.operator.id === operator.id && !selectedPin.branch;

            return (
              <div
                key={`op-${operator.id}`}
                style={{ left: `${screenX}px`, top: `${screenY}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin({ operator, lat, lng });
                }}
                className={`interactive-control absolute -translate-x-1/2 -translate-y-full cursor-pointer z-20 group transition-all duration-150 ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-115 hover:z-35'
                }`}
              >
                {/* Google Maps Style Custom Pin Bubble */}
                <div className="flex flex-col items-center">
                  <div className={`px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-lg border-2 ${style.bg} ${style.border} ${style.text} ${style.shadow}`}>
                    {operator.state === 'Kerala' ? (
                      <span className="px-1 py-0.2 rounded bg-teal-950/80 text-[8px] font-bold text-teal-200">KL</span>
                    ) : (
                      <span className="px-1 py-0.2 rounded bg-amber-950/80 text-[8px] font-bold text-amber-200">TN</span>
                    )}
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold max-w-[90px] truncate leading-none">
                      {operator.company_name.split(' ')[0]}
                    </span>
                  </div>
                  {/* Pin Point Pointer Triangle */}
                  <div className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-[1px] ${
                    operator.service_type === 'govt' ? 'border-t-purple-600' :
                    operator.service_type === 'logistics' ? 'border-t-emerald-600' :
                    operator.service_type === 'bus' ? 'border-t-sky-600' : 'border-t-amber-600'
                  }`}></div>
                </div>
              </div>
            );
          })}

          {/* GOOGLE MAPS STYLE INFOWINDOW MODAL */}
          {selectedPin && (() => {
            const px = projectLngToPixel(selectedPin.lng, zoom);
            const py = projectLatToPixel(selectedPin.lat, zoom);
            const screenX = px - centerPixelX + halfW;
            const screenY = py - centerPixelY + halfH - 45; // Above pin
            const op = selectedPin.operator;
            const br = selectedPin.branch;
            const style = getPinStyle(op.service_type);

            return (
              <div
                style={{
                  left: `${screenX}px`,
                  top: `${screenY}px`
                }}
                className="interactive-control absolute -translate-x-1/2 -translate-y-full z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
              >
                {/* InfoWindow Header */}
                <div className={`p-3 text-white flex items-start justify-between gap-2 ${style.bg}`}>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 border border-white/30 uppercase tracking-wide">
                        {br ? `Regional Depot • ${op.state}` : `${style.label} • ${op.state}`}
                      </span>
                      <span className="text-[10px] font-mono text-white/80">
                        Est. {op.established_year}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mt-1 leading-snug">
                      {br ? br.branch_name : op.company_name}
                    </h3>
                    <p className="text-[11px] text-white/90">
                      {br ? `Parent Fleet: ${op.company_name} (${op.state})` : `${op.category} • ${op.state}`}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedPin(null)}
                    className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* InfoWindow Body */}
                <div className="p-3.5 space-y-2.5 text-xs text-slate-700">
                  
                  {/* Contact & Owner */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">
                        {br ? 'Depot Manager' : 'Managing Director / Owner'}
                      </p>
                      <p className="font-bold text-slate-900 text-xs">
                        {br ? br.manager_name : op.owner_name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Hub & City</p>
                      <p className="font-bold text-slate-900 text-xs">
                        {br ? `${br.city}, ${br.district}` : `${op.city_hub}, ${op.district}`}
                      </p>
                    </div>
                  </div>

                  {/* Fleet Strength / Depots */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fleet Capacity</span>
                      <strong className="text-slate-900 font-mono">{op.fleet_size}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Statewide Depots</span>
                      <strong className="text-slate-900 font-mono">
                        {op.branches ? `${op.branches.length} Branches across TN` : 'Headquarters'}
                      </strong>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {br ? br.address : op.address}
                    </span>
                  </div>

                  {/* Actions: Direct WhatsApp & Full Dossier */}
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${(br ? br.whatsapp : op.whatsapp_number).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${br ? br.manager_name : op.owner_name}, inquiring with ${op.company_name} regarding transport services via Nunes Transport Directory.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct</span>
                    </a>

                    <button
                      onClick={() => {
                        setSelectedPin(null);
                        onClose();
                        onSelectOperator(op);
                      }}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Dossier</span>
                    </button>
                  </div>

                </div>

                {/* Little triangle arrow at bottom of InfoWindow */}
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white mx-auto -mb-[8px]"></div>
              </div>
            );
          })()}

          {/* FLOATING MAP CONTROLS OVERLAY (Bottom-Right) */}
          <div className="interactive-control absolute bottom-6 right-4 z-20 flex flex-col gap-2 shadow-lg">
            
            {/* Recenter / Compass */}
            <button
              onClick={() => {
                setCenterLat(11.1271);
                setCenterLng(78.6569);
                setZoom(8);
              }}
              className="w-9 h-9 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-200 shadow-md transition-all"
              title="Reset View to All Tamil Nadu"
            >
              <Compass className="w-4 h-4 text-amber-600" />
            </button>

            {/* Zoom In & Out */}
            <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <button
                onClick={() => setZoom(Math.min(16, zoom + 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(Math.max(6, zoom - 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* ZOOM LEVEL BADGE (Bottom-Left) */}
          <div className="interactive-control absolute bottom-3 left-4 z-20 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[10px] font-mono text-slate-700 rounded-lg border border-slate-200 shadow-xs">
              Zoom: {zoom}x ({zoom <= 8 ? 'Statewide' : zoom <= 12 ? 'City Hub' : 'Street & Depot'})
            </span>
            <span className="px-2 py-0.5 bg-slate-900/80 text-[10px] text-white rounded font-mono shadow-xs">
              {centerLat.toFixed(4)}°N, {centerLng.toFixed(4)}°E
            </span>
          </div>

          {/* ATTRIBUTION WATERMARK */}
          <div className="absolute bottom-1 right-2 z-10 text-[9px] text-slate-500 bg-white/80 px-2 py-0.5 rounded shadow-2xs pointer-events-none">
            Google Maps Slippy Tiles • Tamil Nadu Transport Directorate
          </div>

        </div>

      </div>
    </div>
  );
};
