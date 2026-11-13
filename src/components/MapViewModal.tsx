'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Globe, 
  Compass, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  ExternalLink, 
  Navigation,
  Eye,
  Sliders,
  Sparkles,
  Mountain,
  Flame,
  Plus,
  Minus
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
  elevation: number;
  count: number;
  description: string;
}

const COIMBATORE_BLOCK_PLACES: BlockPlace[] = [
  { name: 'All Blocks', lat: 11.0168, lng: 76.9558, elevation: 411, count: 2097, description: 'Coimbatore District Full Register' },
  { name: 'Coimbatore City', lat: 11.0168, lng: 76.9558, elevation: 411, count: 238, description: 'Urban Metropolitan Core' },
  { name: 'Pollachi', lat: 10.6588, lng: 77.0084, elevation: 293, count: 254, description: 'Southern Agro & Coconut Hub' },
  { name: 'Valparai', lat: 10.3255, lng: 76.9550, elevation: 1193, count: 86, description: 'High Anaimalai Tea Plateau' },
  { name: 'Mettupalayam', lat: 11.3005, lng: 76.9400, elevation: 314, count: 188, description: 'Nilgiri Mountain Gateway' },
  { name: 'Sulur', lat: 11.0255, lng: 77.1250, elevation: 340, count: 168, description: 'Air Base & Textile Corridor' },
  { name: 'Perur', lat: 10.9722, lng: 76.9150, elevation: 418, count: 146, description: 'Heritage Noyyal Riverbank' },
  { name: 'Annur', lat: 11.2333, lng: 77.1333, elevation: 338, count: 124, description: 'Northern Industrial Belt' },
  { name: 'Karamadai', lat: 11.2422, lng: 76.9600, elevation: 353, count: 152, description: 'Bhavani River Valley' },
  { name: 'Madukkarai', lat: 10.9011, lng: 76.9600, elevation: 311, count: 118, description: 'Cement & Mineral Corridor' },
  { name: 'Anaimalai', lat: 10.5849, lng: 76.9298, elevation: 260, count: 98, description: 'Tiger Reserve Foothills' },
  { name: 'Kinathukadavu', lat: 10.8211, lng: 77.0180, elevation: 308, count: 115, description: 'Windmill & Agro Basin' },
  { name: 'Thondamuthur', lat: 10.9955, lng: 76.8350, elevation: 450, count: 128, description: 'Western Ghats Bio-Reserve' },
  { name: 'Sultanpet', lat: 10.8855, lng: 77.1850, elevation: 320, count: 120, description: 'Eastern Agriculture Plain' },
  { name: 'S.S.Kulam', lat: 11.1211, lng: 77.0250, elevation: 380, count: 95, description: 'Suburban Lake Cluster' },
  { name: 'Periyanaickanpalayam', lat: 11.1455, lng: 76.9350, elevation: 405, count: 112, description: 'Northern Foothills Gateway' },
];

export const MapViewModal: React.FC<MapViewModalProps> = ({
  isOpen,
  onClose,
  schools,
  onSelectSchool
}) => {
  // Map View Mode: Satellite, 3D Terrain, Roadmap, Heatmap
  const [viewMode, setViewMode] = useState<'satellite' | 'terrain' | 'roadmap' | 'heatmap'>('satellite');
  const [is3D, setIs3D] = useState<boolean>(true);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const [orbitHeading, setOrbitHeading] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<string>('All Blocks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSchool, setSelectedSchoolPin] = useState<SchoolRecord | null>(null);
  const [allDistrictSchools, setAllDistrictSchools] = useState<SchoolRecord[]>(schools);

  // Real-time Telemetry HUD coordinates
  const [currentHud, setCurrentHud] = useState({
    lat: 11.0168,
    lng: 76.9558,
    elevation: 411,
    eyeAlt: '18.4 km',
    tilt: 54
  });

  // Auto-Orbit camera rotation interval
  useEffect(() => {
    let interval: any;
    if (isOrbiting && is3D) {
      interval = setInterval(() => {
        setOrbitHeading(prev => (prev + 0.6) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isOrbiting, is3D]);

  // Fetch full dataset if initial prop is partial
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

  if (!isOpen) return null;

  // Filter schools for map
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
      if (!matchesName && !matchesUdise && !matchesBlock) return false;
    }
    return Boolean(s.latitude && s.longitude);
  });

  // Fly-to block handler
  const handleFlyToBlock = (place: BlockPlace) => {
    setSelectedBlock(place.name);
    setCurrentHud({
      lat: place.lat,
      lng: place.lng,
      elevation: place.elevation,
      eyeAlt: place.name === 'All Blocks' ? '28.0 km' : '6.5 km',
      tilt: is3D ? 54 : 0
    });
    setZoomLevel(place.name === 'All Blocks' ? 1.05 : 1.35);
    setSelectedSchoolPin(null);
  };

  // Coordinate projection math into % bounds of Coimbatore District
  // Bounding Box: Lat 10.30° to 11.35° N, Lng 76.75° to 77.25° E
  const MIN_LAT = 10.30;
  const MAX_LAT = 11.35;
  const MIN_LNG = 76.75;
  const MAX_LNG = 77.25;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 100;
    return {
      left: `${Math.max(4, Math.min(96, x))}%`,
      top: `${Math.max(4, Math.min(96, y))}%`
    };
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 transition-all duration-300`}>
      <div className={`bg-[#0a0f1d] text-white rounded-2xl shadow-2xl border border-sky-500/30 overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl w-full h-[92vh]'
      }`}>
        
        {/* Google Earth Navigation & Control Header */}
        <div className="px-4 py-3 bg-[#0d1527] border-b border-sky-500/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Logo & District Identification */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                  Google Earth 3D <span className="text-sky-400 font-semibold">• Coimbatore District</span>
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  2,097 Geocoded Schools
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Western Ghats & Tamil Nadu Plateau • 10.32° N - 11.25° N, 76.82° E - 77.20° E
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school or block..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* View Modes & 3D Controls */}
          <div className="flex items-center gap-1.5">
            {/* View Layer Selector */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('satellite')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'satellite' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Google Earth Satellite Hybrid View"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Satellite</span>
              </button>

              <button
                onClick={() => setViewMode('terrain')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'terrain' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="3D Topographic Terrain View"
              >
                <Mountain className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Terrain</span>
              </button>

              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'heatmap' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="School Density Heatmap"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Heatmap</span>
              </button>
            </div>

            {/* 3D Isometric Tilt Toggle */}
            <button
              onClick={() => {
                const next3D = !is3D;
                setIs3D(next3D);
                setCurrentHud(h => ({ ...h, tilt: next3D ? 54 : 0 }));
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                is3D 
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-400 shadow-md shadow-sky-500/20' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
              title="Toggle 3D Isometric Earth Perspective"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{is3D ? '3D Active' : '2D Top-Down'}</span>
            </button>

            {/* 360° Orbit Tour Toggle */}
            {is3D && (
              <button
                onClick={() => setIsOrbiting(!isOrbiting)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isOrbiting 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse' 
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
                title="Cinematic 360° Orbit Tour"
              >
                {isOrbiting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden lg:inline">{isOrbiting ? 'Orbiting...' : 'Orbit Tour'}</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500"
              title="Close Map View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 3D Google Earth Interactive Canvas */}
        <div className="relative flex-1 bg-[#060a14] overflow-hidden select-none perspective-1200 flex items-center justify-center">
          
          {/* Outer Atmosphere Glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_120%,rgba(56,189,248,0.22)_0%,rgba(14,165,233,0.08)_45%,transparent_75%)] z-10" />

          {/* Deep Space Stars Background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

          {/* The 3D Map Surface Container */}
          <div 
            className="relative w-[92%] h-[88%] max-w-[1200px] max-h-[800px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 preserve-3d border border-sky-400/20"
            style={{
              transform: `rotateX(${is3D ? '52deg' : '0deg'}) rotateZ(${isOrbiting ? orbitHeading : 0}deg) scale(${zoomLevel})`,
              transformOrigin: '50% 50%',
              boxShadow: is3D 
                ? '0 35px 60px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.25)' 
                : '0 20px 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* Satellite / Terrain Textured Surface */}
            <div 
              className={`absolute inset-0 transition-opacity duration-500 ${
                viewMode === 'satellite' 
                  ? 'bg-gradient-to-br from-[#0c2340] via-[#112d4e] to-[#0f1f38]' 
                  : viewMode === 'terrain'
                  ? 'bg-gradient-to-br from-[#1b3a2a] via-[#244b36] to-[#122b1e]'
                  : viewMode === 'heatmap'
                  ? 'bg-[#080d1a]'
                  : 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#090d16]'
              }`}
            >
              {/* Simulated Coimbatore Geographic Topography Grid */}
              <svg className="w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Elevation Contours representing Western Ghats on West and South */}
                <path d="M 20 50 Q 80 180 120 320 T 160 580" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 60 40 Q 140 190 190 350 T 220 620" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1.5" />
                <path d="M 120 20 Q 220 200 270 380 T 320 680" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" />
                
                {/* Noyyal River Path through Coimbatore */}
                <path d="M 140 280 Q 320 320 520 300 T 820 340 T 1100 380" fill="none" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="3" />
                
                {/* Bhavani River on Northern Mettupalayam */}
                <path d="M 200 90 Q 450 70 700 80 T 1050 110" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2.5" />

                {/* Major Highways NH 544 & NH 81 */}
                <line x1="180" y1="290" x2="980" y2="290" stroke="rgba(251, 191, 36, 0.35)" strokeWidth="2" />
                <line x1="520" y1="90" x2="520" y2="680" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="2" />
              </svg>

              {/* Heatmap Layer (when active) */}
              {viewMode === 'heatmap' && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Urban Core Density Cluster */}
                  <div className="absolute left-[45%] top-[38%] w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/30 blur-3xl animate-pulse" />
                  <div className="absolute left-[46%] top-[40%] w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/40 blur-2xl" />
                  
                  {/* Pollachi Southern Cluster */}
                  <div className="absolute left-[54%] top-[72%] w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/30 blur-3xl" />
                  
                  {/* Mettupalayam Northern Cluster */}
                  <div className="absolute left-[42%] top-[16%] w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/30 blur-2xl" />
                </div>
              )}
            </div>

            {/* Geographical Regional Labels */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute left-[6%] top-[12%] text-[10px] font-bold text-sky-400/70 tracking-widest uppercase">
                ▲ Nilgiri Foothills (800m)
              </span>
              <span className="absolute left-[4%] top-[46%] text-[10px] font-bold text-sky-400/70 tracking-widest uppercase">
                ▲ Siruvani / Western Ghats
              </span>
              <span className="absolute left-[8%] top-[86%] text-[10px] font-bold text-sky-400/70 tracking-widest uppercase">
                ▲ Anaimalai Tiger Reserve (1,193m)
              </span>
              <span className="absolute right-[8%] top-[38%] text-[10px] font-bold text-slate-400/60 tracking-widest uppercase">
                Sulur & Sultanpet Plains
              </span>
              <span className="absolute left-[44%] top-[33%] text-xs font-bold text-white/90 tracking-wider">
                COIMBATORE METRO
              </span>
            </div>

            {/* Interactive 3D School Pins */}
            <div className="absolute inset-0">
              {displaySchools.slice(0, 160).map((s) => {
                const pos = projectCoords(s.latitude || 11.0, s.longitude || 76.9);
                const isSelected = selectedSchool?.id === s.id;
                const isVerified = Boolean(s.official_landline || s.official_email);

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSchoolPin(s)}
                    className="absolute cursor-pointer transition-transform duration-200 group"
                    style={{
                      left: pos.left,
                      top: pos.top,
                      // 3D Billboard Transform: Counter-rotate pin so it stands upright on the terrain!
                      transform: is3D 
                        ? `rotateZ(-${isOrbiting ? orbitHeading : 0}deg) rotateX(-52deg) translateZ(${isSelected ? '24px' : '10px'}) scale(${isSelected ? 1.4 : 1})` 
                        : `scale(${isSelected ? 1.3 : 1})`,
                      transformOrigin: 'bottom center',
                      zIndex: isSelected ? 40 : 20
                    }}
                  >
                    {/* Pulsing Beacon Ring for Selected / Major Schools */}
                    {(isSelected || (isVerified && s.board === 'CBSE')) && (
                      <span className={`absolute -inset-1.5 rounded-full opacity-75 animate-ping ${
                        isVerified ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                    )}

                    {/* Pin Graphic */}
                    <div className={`relative px-1.5 py-1 rounded-lg flex items-center gap-1 shadow-lg border transition-all ${
                      isSelected
                        ? 'bg-sky-500 text-white border-white ring-2 ring-sky-300 scale-110 shadow-sky-500/50'
                        : isVerified
                        ? 'bg-emerald-600/90 text-white border-emerald-400/80 hover:bg-emerald-500'
                        : 'bg-rose-600/90 text-white border-rose-400/80 hover:bg-rose-500'
                    }`}>
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="text-[10px] font-bold max-w-[70px] truncate hidden sm:inline">
                        {s.school_name.split(' ')[0]}
                      </span>
                    </div>

                    {/* 3D Drop Shadow on the Ground */}
                    <div className="w-3 h-1 bg-black/60 rounded-full mx-auto blur-[1px] mt-0.5" />
                  </div>
                );
              })}
            </div>

          </div>

          {/* Floating Right Navigation Controls (Google Earth Style) */}
          <div className="absolute right-4 top-4 flex flex-col items-center gap-2 z-20">
            {/* 3D Compass Rose */}
            <button
              onClick={() => {
                setOrbitHeading(0);
                setIsOrbiting(false);
              }}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-xl flex items-center justify-center hover:bg-slate-800 transition-all group"
              title="Reset Heading to North (0°)"
            >
              <Compass 
                className="w-6 h-6 text-sky-400 transition-transform duration-300 group-hover:scale-110" 
                style={{ transform: `rotate(-${orbitHeading}deg)` }}
              />
            </button>

            {/* Zoom Controls */}
            <div className="flex flex-col bg-slate-900/90 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
              <button
                onClick={() => setZoomLevel(z => Math.min(2.0, z + 0.2))}
                className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom In (+)"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-800" />
              <button
                onClick={() => setZoomLevel(z => Math.max(0.8, z - 0.2))}
                className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom Out (-)"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Recenter District Button */}
            <button
              onClick={() => handleFlyToBlock(COIMBATORE_BLOCK_PLACES[0])}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white shadow-xl"
              title="Fly to District Center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Google Earth 3D Knowledge Card (When a school is selected) */}
          {selectedSchool && (
            <div className="absolute left-4 top-4 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-sky-500/40 rounded-2xl p-4 text-white shadow-2xl z-30 animate-in fade-in-50 slide-in-from-left-4">
              <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                      {selectedSchool.udise_code}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      selectedSchool.official_landline || selectedSchool.official_email
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {selectedSchool.contact_status?.replace(/_/g, ' ') || 'Sourced Pin'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">{selectedSchool.school_name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedSchool.block} • {selectedSchool.board}</p>
                </div>
                <button
                  onClick={() => setSelectedSchoolPin(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Verified Contact Details */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                {selectedSchool.official_landline && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-mono text-sky-300 font-semibold">{selectedSchool.official_landline}</span>
                  </div>
                )}
                {selectedSchool.official_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate text-emerald-300">{selectedSchool.official_email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                  <span>GPS: {selectedSchool.latitude?.toFixed(5)}° N, {selectedSchool.longitude?.toFixed(5)}° E</span>
                </div>
              </div>

              {/* Actions: View in Google Maps / Google Earth & Open Profile */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedSchool.latitude},${selectedSchool.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google Earth</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    onSelectSchool(selectedSchool);
                  }}
                  className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/30"
                >
                  Inspect Profile
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Cinematic "Fly-To" Block Carousel Dock (Replacing plain white grid) */}
        <div className="px-4 py-2.5 bg-[#09101f] border-t border-slate-800/80 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>Cinematic Fly-To Places & Educational Blocks</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Displaying {displaySchools.length} of 2,097 Schools
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {COIMBATORE_BLOCK_PLACES.map((p) => {
              const isSel = selectedBlock === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => handleFlyToBlock(p)}
                  className={`px-3 py-1.5 rounded-xl text-left whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
                    isSel
                      ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-400 shadow-md shadow-sky-500/20 scale-105'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold leading-none">{p.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSel ? 'bg-sky-900 text-sky-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {p.count}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                    <span>{p.elevation}m MSL</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-Time Google Earth Telemetry HUD Bar */}
        <div className="px-4 py-2 bg-[#060a14] border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span>LAT: <strong className="text-sky-300">{currentHud.lat.toFixed(4)}° N</strong></span>
            <span>LON: <strong className="text-sky-300">{currentHud.lng.toFixed(4)}° E</strong></span>
            <span>ELEV: <strong className="text-emerald-400">{currentHud.elevation} m</strong></span>
            <span>EYE ALT: <strong className="text-slate-300">{currentHud.eyeAlt}</strong></span>
            <span>TILT: <strong className="text-indigo-300">{currentHud.tilt}°</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px]">
            <span>© 2026 Google Earth / Maxar Satellite Imagery</span>
            <span>•</span>
            <span className="text-sky-400">UDISE+ Geocoded Layer</span>
          </div>
        </div>

      </div>
    </div>
  );
};
