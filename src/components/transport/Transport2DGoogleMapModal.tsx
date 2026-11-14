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
  RotateCcw,
  Pin,
  PinOff,
  Lock,
  Unlock,
  Crosshair,
  LocateFixed,
  AlertCircle
} from 'lucide-react';
import { TransportRecord, BranchOffice } from '@/types/transport';

interface Transport2DGoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  operators: TransportRecord[];
  onSelectOperator: (operator: TransportRecord) => void;
}

export interface PinnedMapLocation {
  id: string;
  name: string;
  subtitle?: string;
  lat: number;
  lng: number;
  category?: string;
  source: 'operator' | 'branch' | 'hub' | 'custom' | 'gps';
  operatorId?: string;
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

  // Location Pinning & Camera Lock State (User Request Feature)
  const [pinnedLocation, setPinnedLocation] = useState<PinnedMapLocation | null>(null);
  const [isCameraLocked, setIsCameraLocked] = useState<boolean>(false);
  const [isDropPinMode, setIsDropPinMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filters & Selected Pin
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'bus' | 'lorry' | 'logistics' | 'govt'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPin, setSelectedPin] = useState<{
    operator: TransportRecord;
    branch?: BranchOffice;
    lat: number;
    lng: number;
  } | null>(null);

  // Pan / Dragging interaction state with deadband threshold & pointer capture
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isPointerDownRef = useRef<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragCenterStartRef = useRef<{ px: number; py: number }>({ px: 0, py: 0 });
  const hasExceededDeadbandRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Viewport dimensions
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({ width: 1000, height: 600 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Prevent background page scrolling completely when map modal is open
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen]);

  // 2. Measure container dimensions
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

  // 3. Isolated non-passive Wheel zoom listener to prevent parent page bounce/scrolling
  useEffect(() => {
    if (!isOpen) return;
    const container = mapContainerRef.current;
    if (!container) return;

    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomDelta = e.deltaY < 0 ? 1 : -1;
      setZoom(prev => {
        const nextZoom = Math.min(16, Math.max(6, prev + zoomDelta));
        return nextZoom;
      });
    };

    container.addEventListener('wheel', onWheelNative, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheelNative);
    };
  }, [isOpen]);

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

  // Pointer Down (Mouse or Touch) with Deadband to Prevent Click Jitter
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicked inside an interactive button, marker, or popup, do not initiate map pan
    if ((e.target as HTMLElement).closest('.interactive-control')) return;

    // Handle Drop Pin Mode: place pin at exact clicked point
    if (isDropPinMode) {
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const worldPx = centerPixelX + (clickX - halfW);
        const worldPy = centerPixelY + (clickY - halfH);
        const clickedLng = pixelToLng(worldPx, zoom);
        const clickedLat = pixelToLat(worldPy, zoom);

        // Determine nearest transport corridor
        let corridor = 'South India Freight Corridor';
        if (Math.abs(clickedLng - 78.16) < 0.3) corridor = 'NH 44 (Truck Corridor)';
        else if (Math.abs(clickedLat - 11.1) < 0.3) corridor = 'NH 544 (Industrial Corridor)';
        else if (clickedLng < 76.5) corridor = 'NH 66 (Kerala Coastal Corridor)';

        setPinnedLocation({
          id: `custom-${Date.now()}`,
          name: `Custom Waypoint (${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E)`,
          subtitle: corridor,
          lat: clickedLat,
          lng: clickedLng,
          category: 'custom',
          source: 'custom'
        });
        setIsDropPinMode(false);
        showToast(`📌 Custom Location Pinned at ${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E`);
      }
      return;
    }

    // If Camera is locked, do not allow panning
    if (isCameraLocked) {
      showToast('🔒 Camera is locked on pinned location. Click "Unlock Pan" to move freely.');
      return;
    }

    isPointerDownRef.current = true;
    pointerIdRef.current = e.pointerId;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    dragCenterStartRef.current = { px: centerPixelX, py: centerPixelY };
    hasExceededDeadbandRef.current = false;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  // Pointer Move with 5px Deadband & requestAnimationFrame Throttling
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || isCameraLocked) return;

    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;

    // 5px deadband to prevent accidental dragging during pin click
    if (!hasExceededDeadbandRef.current) {
      if (Math.hypot(dx, dy) >= 5) {
        hasExceededDeadbandRef.current = true;
        setIsDragging(true);
      } else {
        return;
      }
    }

    // Schedule coordinate update on next animation frame
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      const newPx = dragCenterStartRef.current.px - dx;
      const newPy = dragCenterStartRef.current.py - dy;
      setCenterLng(pixelToLng(newPx, zoom));
      setCenterLat(pixelToLat(newPy, zoom));
    });
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    hasExceededDeadbandRef.current = false;
    if (pointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      } catch {}
      pointerIdRef.current = null;
    }
  };

  // Quick Fly-To
  const flyToCoordinates = (lat: number, lng: number, targetZoom?: number) => {
    setCenterLat(lat);
    setCenterLng(lng);
    if (targetZoom) setZoom(targetZoom);
  };

  // Pinning Handlers
  const handlePinOperator = (operator: TransportRecord) => {
    const lat = operator.latitude || 11.0;
    const lng = operator.longitude || 77.0;
    setPinnedLocation({
      id: `op-${operator.id}`,
      name: operator.company_name,
      subtitle: `${operator.category} • ${operator.city_hub}, ${operator.district} (${operator.state})`,
      lat,
      lng,
      category: operator.service_type,
      source: 'operator',
      operatorId: operator.id
    });
    flyToCoordinates(lat, lng, Math.max(zoom, 12));
    showToast(`📌 Pinned: ${operator.company_name}`);
  };

  const handlePinBranch = (operator: TransportRecord, branch: BranchOffice) => {
    const lat = branch.latitude || 11.0;
    const lng = branch.longitude || 77.0;
    setPinnedLocation({
      id: `branch-${branch.id}`,
      name: `${operator.company_name} — ${branch.branch_name}`,
      subtitle: `Depot: ${branch.city}, ${branch.district} (Mgr: ${branch.manager_name})`,
      lat,
      lng,
      category: 'depot',
      source: 'branch',
      operatorId: operator.id
    });
    flyToCoordinates(lat, lng, Math.max(zoom, 13));
    showToast(`📌 Pinned Depot: ${branch.branch_name}`);
  };

  const handlePinHub = (hub: typeof SOUTH_INDIA_HUBS[0]) => {
    setPinnedLocation({
      id: `hub-${hub.id}`,
      name: hub.name,
      subtitle: hub.desc,
      lat: hub.lat,
      lng: hub.lng,
      category: 'hub',
      source: 'hub'
    });
    flyToCoordinates(hub.lat, hub.lng, hub.zoom);
    showToast(`📌 Pinned Hub: ${hub.name}`);
  };

  const handlePinMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('❌ Geolocation is not supported by your browser');
      return;
    }
    showToast('🛰️ Acquiring live GPS position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPinnedLocation({
          id: 'gps-my-location',
          name: 'My Live GPS Location',
          subtitle: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Accuracy: ±${Math.round(pos.coords.accuracy)}m)`,
          lat,
          lng,
          category: 'gps',
          source: 'gps'
        });
        flyToCoordinates(lat, lng, 13);
        showToast('📍 Live GPS Location Pinned!');
      },
      (err) => {
        showToast(`⚠️ GPS Notice: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
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
        className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 relative select-none ${
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
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP BAR 2: Live Controls, Search & Filter Bar + Pinning Controls */}
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'bus'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Omni Buses
            </button>
            <button
              onClick={() => setCategoryFilter('lorry')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'lorry'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lorries
            </button>
            <button
              onClick={() => setCategoryFilter('logistics')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'logistics'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              3PL Logistics
            </button>
            <button
              onClick={() => setCategoryFilter('govt')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === 'govt'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Govt STU
            </button>
          </div>

          {/* Pin Tools & Map Layers Switcher */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            
            {/* Drop Pin Mode Toggle Button */}
            <button
              onClick={() => {
                setIsDropPinMode(!isDropPinMode);
                if (!isDropPinMode) {
                  showToast('🎯 Drop Pin Mode Active: Click anywhere on the map to pin that location!');
                }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDropPinMode
                  ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-sm animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Click anywhere on the map to drop a custom GPS pin"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isDropPinMode ? 'Click Map to Pin' : 'Drop Pin'}</span>
            </button>

            {/* GPS My Location Pin */}
            <button
              onClick={handlePinMyLocation}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Pin my current GPS location on the map"
            >
              <LocateFixed className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">My GPS</span>
            </button>

            {/* Camera Lock / Freeze View Toggle */}
            <button
              onClick={() => {
                const nextLocked = !isCameraLocked;
                setIsCameraLocked(nextLocked);
                showToast(nextLocked ? '🔒 View Locked: Pan is frozen to prevent jitter' : '🔓 View Unlocked: Free pan enabled');
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isCameraLocked
                  ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isCameraLocked ? 'Camera is locked (click to unlock pan)' : 'Lock view on this location'}
            >
              {isCameraLocked ? <Lock className="w-3.5 h-3.5 text-rose-600" /> : <Unlock className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isCameraLocked ? 'Locked' : 'Lock View'}</span>
            </button>

            {/* Map Type Switcher */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  mapType === 'roadmap' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  mapType === 'satellite' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapType('terrain')}
                className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  mapType === 'terrain' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Terrain
              </button>
            </div>

            {/* Show Branches Checkbox Toggle */}
            <button
              onClick={() => setShowBranches(!showBranches)}
              className={`px-2 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showBranches ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Toggle Regional Branch Depots"
            >
              <Building2 className="w-3 h-3 text-teal-600" />
              <span className="hidden sm:inline">Depots</span>
            </button>
          </div>

        </div>

        {/* TOP BAR 3: Quick Hub Jumps with 1-Click Fly & Pin */}
        <div className="px-3 sm:px-4 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none z-10 shrink-0 text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 whitespace-nowrap">
            Fly & Pin Hub:
          </span>
          {SOUTH_INDIA_HUBS.map(hub => {
            const isThisHubPinned = pinnedLocation?.id === `hub-${hub.id}`;
            return (
              <button
                key={hub.id}
                onClick={() => handlePinHub(hub)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap transition-all shadow-2xs cursor-pointer flex items-center gap-1 ${
                  isThisHubPinned
                    ? 'bg-amber-500 border-amber-600 text-slate-950 font-bold'
                    : 'bg-white hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 text-slate-700 border-slate-200'
                }`}
                title={`Fly to & pin ${hub.name}`}
              >
                {isThisHubPinned && <Pin className="w-2.5 h-2.5 fill-slate-950" />}
                <span>{hub.name}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE PINNED LOCATION STATUS STRIP (When a location is pinned) */}
        {pinnedLocation && (
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-b border-amber-300/40 flex items-center justify-between gap-3 text-xs z-15 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="p-1 rounded-lg bg-amber-500 text-slate-950 shadow-sm shrink-0">
                <Pin className="w-3.5 h-3.5 fill-slate-950" />
              </span>
              <div className="truncate">
                <span className="font-bold text-slate-900 mr-2">
                  Pinned Location: {pinnedLocation.name}
                </span>
                <span className="text-slate-500 text-[11px] font-mono">
                  ({pinnedLocation.lat.toFixed(4)}°N, {pinnedLocation.lng.toFixed(4)}°E)
                </span>
                {pinnedLocation.subtitle && (
                  <span className="hidden md:inline text-slate-600 text-[11px] ml-2">
                    • {pinnedLocation.subtitle}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Recenter / Focus button */}
              <button
                onClick={() => flyToCoordinates(pinnedLocation.lat, pinnedLocation.lng, Math.max(zoom, 12))}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Center camera on pinned location"
              >
                <Crosshair className="w-3 h-3 text-amber-600" />
                <span>Focus</span>
              </button>

              {/* Lock / Unlock Camera Toggle */}
              <button
                onClick={() => {
                  const nextLocked = !isCameraLocked;
                  setIsCameraLocked(nextLocked);
                  showToast(nextLocked ? '🔒 View Locked on Pinned Location' : '🔓 Pan Unlocked');
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer ${
                  isCameraLocked
                    ? 'bg-rose-600 text-white border-rose-700'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Lock camera to prevent panning instability"
              >
                {isCameraLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{isCameraLocked ? 'Locked' : 'Lock'}</span>
              </button>

              {/* Unpin button */}
              <button
                onClick={() => {
                  setPinnedLocation(null);
                  setIsCameraLocked(false);
                  showToast('Location Unpinned');
                }}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Unpin location"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MAIN SLIPPY MAP CANVAS */}
        <div
          ref={mapContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            touchAction: 'none',
            overscrollBehavior: 'contain'
          }}
          className={`flex-1 relative overflow-hidden bg-slate-100 select-none ${
            isDropPinMode ? 'cursor-crosshair' : isCameraLocked ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          
          {/* SLIPPY MAP TILES CONTAINER */}
          <div className="absolute inset-0 pointer-events-none select-none">
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
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
                className="select-none"
              />
            ))}
          </div>

          {/* HIGHWAY CORRIDOR BADGES (Float on map relative to center) */}
          <div className="absolute inset-0 pointer-events-none select-none">
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

            {/* NH 66 Badge (Kerala Malabar Coastal Freight) */}
            {(() => {
              const px = projectLngToPixel(76.2490, zoom);
              const py = projectLatToPixel(9.9816, zoom);
              const sx = px - centerPixelX + halfW;
              const sy = py - centerPixelY + halfH - 35;
              if (sx >= 0 && sx <= viewportSize.width && sy >= 0 && sy <= viewportSize.height) {
                return (
                  <div style={{ left: `${sx}px`, top: `${sy}px` }} className="absolute -translate-x-1/2 -translate-y-1/2">
                    <span className="px-2 py-0.5 rounded font-black font-mono text-[9px] bg-emerald-600 text-white border border-white shadow-md">
                      NH 66 (Kochi Port Corridor)
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* REGIONAL BRANCH DEPOT PINS (Greenish Depot Markers) */}
          {branchPins.map(({ operator, branch, lat, lng, screenX, screenY }) => {
            const isThisPinned = pinnedLocation?.id === `branch-${branch.id}`;

            return (
              <div
                key={`branch-${branch.id}`}
                style={{ left: `${screenX}px`, top: `${screenY}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin({ operator, branch, lat, lng });
                }}
                className={`interactive-control absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15 group hover:z-30 transition-transform ${
                  isThisPinned ? 'scale-125 z-40' : 'hover:scale-125'
                }`}
                title={`${operator.company_name} - ${branch.branch_name} (${branch.city})`}
              >
                <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center shadow-md border-2 ${
                  isThisPinned ? 'bg-amber-500 border-slate-950 scale-110' : 'bg-teal-600 border-white'
                }`}>
                  {isThisPinned ? <Pin className="w-2.5 h-2.5 fill-white" /> : <Building2 className="w-2.5 h-2.5" />}
                </div>
              </div>
            );
          })}

          {/* PRIMARY TRANSPORT OPERATOR PINS */}
          {operatorPins.map(({ operator, lat, lng, screenX, screenY }) => {
            const style = getPinStyle(operator.service_type);
            const Icon = style.icon;
            const isSelected = selectedPin?.operator.id === operator.id && !selectedPin.branch;
            const isThisPinned = pinnedLocation?.id === `op-${operator.id}`;

            return (
              <div
                key={`op-${operator.id}`}
                style={{ left: `${screenX}px`, top: `${screenY}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin({ operator, lat, lng });
                }}
                className={`interactive-control absolute -translate-x-1/2 -translate-y-full cursor-pointer z-20 group transition-all duration-150 ${
                  isThisPinned ? 'scale-125 z-45' : isSelected ? 'scale-125 z-40' : 'hover:scale-115 hover:z-35'
                }`}
              >
                {/* Google Maps Style Custom Pin Bubble */}
                <div className="flex flex-col items-center">
                  <div className={`px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-lg border-2 ${
                    isThisPinned ? 'bg-amber-500 border-slate-950 text-slate-950 shadow-amber-500/50' : `${style.bg} ${style.border} ${style.text} ${style.shadow}`
                  }`}>
                    {operator.state === 'Kerala' ? (
                      <span className="px-1 py-0.2 rounded bg-teal-950/80 text-[8px] font-bold text-teal-200">KL</span>
                    ) : (
                      <span className="px-1 py-0.2 rounded bg-amber-950/80 text-[8px] font-bold text-amber-200">TN</span>
                    )}
                    {isThisPinned ? <Pin className="w-3.5 h-3.5 fill-slate-950" /> : <Icon className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold max-w-[90px] truncate leading-none">
                      {operator.company_name.split(' ')[0]}
                    </span>
                  </div>
                  {/* Pin Point Pointer Triangle */}
                  <div className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-[1px] ${
                    isThisPinned ? 'border-t-amber-500' :
                    operator.service_type === 'govt' ? 'border-t-purple-600' :
                    operator.service_type === 'logistics' ? 'border-t-emerald-600' :
                    operator.service_type === 'bus' ? 'border-t-sky-600' : 'border-t-amber-600'
                  }`}></div>
                </div>
              </div>
            );
          })}

          {/* DEDICATED PINNED LOCATION VISUAL BEACON (High-Visibility Animated Radar) */}
          {pinnedLocation && (() => {
            const px = projectLngToPixel(pinnedLocation.lng, zoom);
            const py = projectLatToPixel(pinnedLocation.lat, zoom);
            const screenX = px - centerPixelX + halfW;
            const screenY = py - centerPixelY + halfH;
            if (screenX < -60 || screenX > viewportSize.width + 60 || screenY < -60 || screenY > viewportSize.height + 60) return null;

            return (
              <div
                style={{ left: `${screenX}px`, top: `${screenY}px` }}
                className="interactive-control absolute -translate-x-1/2 -translate-y-full z-45 pointer-events-auto"
              >
                {/* Pulsing Radar Beacon Waves */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-amber-400 opacity-75 -left-6 -top-6"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white shadow-lg"></span>
                </div>

                {/* Floating Anchor Badge */}
                <div className="flex flex-col items-center">
                  <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-2xl border-2 border-white flex items-center gap-1.5 animate-bounce">
                    <Pin className="w-3.5 h-3.5 fill-slate-950" />
                    <span className="max-w-[130px] truncate">{pinnedLocation.name}</span>
                    {isCameraLocked && <Lock className="w-3 h-3 text-slate-950" />}
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-600 -mt-[1px]"></div>
                </div>
              </div>
            );
          })()}

          {/* GOOGLE MAPS STYLE INFOWINDOW MODAL */}
          {selectedPin && (() => {
            const px = projectLngToPixel(selectedPin.lng, zoom);
            const py = projectLatToPixel(selectedPin.lat, zoom);
            const screenX = px - centerPixelX + halfW;
            const screenY = py - centerPixelY + halfH - 45; // Above pin
            const op = selectedPin.operator;
            const br = selectedPin.branch;
            const style = getPinStyle(op.service_type);
            const isCurrentlyPinned = pinnedLocation?.id === (br ? `branch-${br.id}` : `op-${op.id}`);

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
                    className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
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
                        {op.branches ? `${op.branches.length} Branches across TN/KL` : 'Headquarters'}
                      </strong>
                    </div>
                  </div>

                  {/* Address & Exact Coordinates */}
                  <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="line-clamp-2">{br ? br.address : op.address}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        GPS: {selectedPin.lat.toFixed(4)}°N, {selectedPin.lng.toFixed(4)}°E
                      </p>
                    </div>
                  </div>

                  {/* Actions: Pin This Location, Direct WhatsApp & Full Dossier */}
                  <div className="pt-2 flex items-center gap-2">
                    {/* Pin Location Button */}
                    <button
                      onClick={() => {
                        if (isCurrentlyPinned) {
                          setPinnedLocation(null);
                          showToast('Location Unpinned');
                        } else {
                          if (br) handlePinBranch(op, br);
                          else handlePinOperator(op);
                        }
                      }}
                      className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCurrentlyPinned
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                      title={isCurrentlyPinned ? 'Click to unpin location' : 'Pin this location and stabilize camera'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${isCurrentlyPinned ? 'fill-slate-950' : ''}`} />
                      <span>{isCurrentlyPinned ? 'Pinned' : 'Pin Location'}</span>
                    </button>

                    <a
                      href={`https://wa.me/${(br ? br.whatsapp : op.whatsapp_number).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${br ? br.manager_name : op.owner_name}, inquiring with ${op.company_name} regarding transport services via Nunes Transport Directory.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        setSelectedPin(null);
                        onClose();
                        onSelectOperator(op);
                      }}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
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
                showToast('Re-centered to All South India');
              }}
              className="w-9 h-9 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-200 shadow-md transition-all cursor-pointer"
              title="Reset View to All Tamil Nadu & Kerala"
            >
              <Compass className="w-4 h-4 text-amber-600" />
            </button>

            {/* Camera Lock / Freeze view button */}
            <button
              onClick={() => {
                const nextLocked = !isCameraLocked;
                setIsCameraLocked(nextLocked);
                showToast(nextLocked ? '🔒 View Locked: Pan is frozen to prevent jitter' : '🔓 Free Pan Enabled');
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-md transition-all cursor-pointer ${
                isCameraLocked
                  ? 'bg-rose-600 text-white border-rose-700 shadow-rose-600/30'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title={isCameraLocked ? 'Unlock camera pan' : 'Lock camera pan'}
            >
              {isCameraLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            {/* Zoom In & Out */}
            <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <button
                onClick={() => setZoom(Math.min(16, zoom + 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(Math.max(6, zoom - 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* ZOOM LEVEL & COORDINATES BADGE (Bottom-Left) */}
          <div className="interactive-control absolute bottom-3 left-4 z-20 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[10px] font-mono text-slate-700 rounded-lg border border-slate-200 shadow-xs">
              Zoom: {zoom}x ({zoom <= 8 ? 'Statewide' : zoom <= 12 ? 'City Hub' : 'Street & Depot'})
            </span>
            <span className="px-2 py-0.5 bg-slate-900/80 text-[10px] text-white rounded font-mono shadow-xs">
              {centerLat.toFixed(4)}°N, {centerLng.toFixed(4)}°E
            </span>
            {isCameraLocked && (
              <span className="px-2 py-0.5 bg-rose-600 text-[10px] text-white font-bold rounded shadow-xs flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>Pan Frozen</span>
              </span>
            )}
          </div>

          {/* TOAST POPUP NOTIFICATION (Bottom-Center) */}
          {toastMessage && (
            <div className="interactive-control absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-950/90 text-white text-xs px-4 py-2 rounded-xl border border-amber-500/40 shadow-2xl backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2 pointer-events-none">
              <span className="text-amber-400 font-bold">ℹ️</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ATTRIBUTION WATERMARK */}
          <div className="absolute bottom-1 right-2 z-10 text-[9px] text-slate-500 bg-white/80 px-2 py-0.5 rounded shadow-2xs pointer-events-none">
            Google Maps Slippy Tiles • Tamil Nadu & Kerala Transport Directorates
          </div>

        </div>

      </div>
    </div>
  );
};
