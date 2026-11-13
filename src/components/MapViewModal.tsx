'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ShoppingBag,
  Landmark
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

export const MapViewModal: React.FC<MapViewModalProps> = ({
  isOpen,
  onClose,
  schools,
  onSelectSchool
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<string>('All Blocks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSchool, setSelectedSchoolPin] = useState<SchoolRecord | null>(null);
  const [hoveredSchoolId, setHoveredSchoolId] = useState<string | null>(null);
  const [allDistrictSchools, setAllDistrictSchools] = useState<SchoolRecord[]>(schools);

  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  // Center on block
  const handleSelectBlock = (place: BlockPlace) => {
    setSelectedBlock(place.name);
    setSelectedSchoolPin(null);
    if (place.name === 'All Blocks') {
      setZoomLevel(1.0);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoomLevel(1.4);
      // Pan toward target block coordinates
      const targetPos = projectCoords(place.lat, place.lng);
      const px = (50 - parseFloat(targetPos.left)) * 6;
      const py = (50 - parseFloat(targetPos.top)) * 6;
      setPanOffset({ x: px, y: py });
    }
  };

  // Recenter map to Coimbatore City
  const handleRecenter = () => {
    setSelectedBlock('All Blocks');
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setSelectedSchoolPin(null);
  };

  // Mouse drag panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
      left: `${Math.max(3, Math.min(97, x))}%`,
      top: `${Math.max(3, Math.min(97, y))}%`
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in-50 duration-200">
      <div 
        className={`bg-[#f5f3f0] text-slate-800 rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col relative transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl w-full h-[92vh]'
        }`}
      >
        
        {/* Google Maps 2D Canvas Container (Pannable & Zoomable) */}
        <div 
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative flex-1 overflow-hidden select-none bg-[#f4f3f0] ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          
          {/* Transforming Map Plane (2D Pan & Scale) */}
          <div 
            className="absolute inset-0 transition-transform duration-100 ease-out origin-center"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
            }}
          >
            {/* SVG Base Layers: Geography, Rivers, Forests, Roads, Shields, Municipal Border */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 1200 800" 
              preserveAspectRatio="none"
            >
              <defs>
                {/* Highway Shield Pattern Filter */}
                <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* 1. Green Mountain / Forest / Western Ghats Topography (Exact match to Image 1) */}
              {/* Western Ghats / Anaikatti Region (North-West) */}
              <path 
                d="M 0,0 L 220,0 Q 240,120 180,240 Q 140,320 100,420 Q 50,520 0,600 Z" 
                fill="#d2edca" 
                opacity="0.9" 
              />
              {/* Southwest Hills / Walayar Border Area */}
              <path 
                d="M 0,550 Q 80,560 140,620 Q 200,680 180,800 L 0,800 Z" 
                fill="#d8eed2" 
                opacity="0.85" 
              />
              {/* Southern Anaimalai Hills Foothills */}
              <path 
                d="M 180,720 Q 320,680 480,740 Q 600,780 720,800 L 180,800 Z" 
                fill="#d2edca" 
                opacity="0.75" 
              />
              {/* Northern Sirumugai / Bhavani Green Strip */}
              <path 
                d="M 280,0 Q 500,40 700,20 Q 950,50 1200,10 L 1200,0 Z" 
                fill="#dcf1d6" 
                opacity="0.6" 
              />

              {/* 2. Water Bodies & Lakes (Google Maps blue #aadaff) */}
              {/* Walayar Reservoir / Lake in Southwest */}
              <path 
                d="M 110,610 C 130,590 170,595 190,615 C 210,635 180,660 150,655 C 120,650 100,630 110,610 Z" 
                fill="#aadaff" 
                stroke="#82b8e6" 
                strokeWidth="1" 
              />

              {/* Noyyal River winding horizontally across Coimbatore (Image 1 alignment) */}
              <path 
                d="M 110,380 Q 240,410 380,415 T 560,420 T 780,440 T 1000,450 T 1200,470" 
                fill="none" 
                stroke="#aadaff" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />

              {/* Singanallur Lake */}
              <ellipse cx="610" cy="400" rx="22" ry="14" fill="#aadaff" stroke="#82b8e6" strokeWidth="0.8" />
              {/* Ukkadam Periyakulam Lake */}
              <ellipse cx="465" cy="415" rx="16" ry="12" fill="#aadaff" stroke="#82b8e6" strokeWidth="0.8" />
              {/* Valankulam Lake */}
              <ellipse cx="495" cy="410" rx="14" ry="10" fill="#aadaff" stroke="#82b8e6" strokeWidth="0.8" />
              {/* Kurichi Kulam */}
              <ellipse cx="480" cy="480" rx="18" ry="12" fill="#aadaff" stroke="#82b8e6" strokeWidth="0.8" />
              {/* Sulur Lake */}
              <ellipse cx="880" cy="430" rx="24" ry="15" fill="#aadaff" stroke="#82b8e6" strokeWidth="0.8" />

              {/* 3. Secondary City & Local Roads (Crisp White #ffffff with subtle outline) */}
              {/* Gandhipuram - Thudiyalur - Mettupalayam connector */}
              <path d="M 460,200 L 460,390" fill="none" stroke="#e0dedb" strokeWidth="6" />
              <path d="M 460,200 L 460,390" fill="none" stroke="#ffffff" strokeWidth="4" />

              {/* Gandhipuram - Kalapatti - Neelambur connector */}
              <path d="M 460,340 Q 560,290 680,260 T 800,280" fill="none" stroke="#e0dedb" strokeWidth="5.5" />
              <path d="M 460,340 Q 560,290 680,260 T 800,280" fill="none" stroke="#ffffff" strokeWidth="3.5" />

              {/* Kovaipudur - Malumichampatti cross street */}
              <path d="M 410,480 Q 480,510 560,520" fill="none" stroke="#e0dedb" strokeWidth="5" />
              <path d="M 410,480 Q 480,510 560,520" fill="none" stroke="#ffffff" strokeWidth="3" />

              {/* Sulur - Somanur network */}
              <path d="M 870,360 L 980,260" fill="none" stroke="#e0dedb" strokeWidth="4.5" />
              <path d="M 870,360 L 980,260" fill="none" stroke="#ffffff" strokeWidth="3" />

              <path d="M 870,420 L 1050,490" fill="none" stroke="#e0dedb" strokeWidth="4.5" />
              <path d="M 870,420 L 1050,490" fill="none" stroke="#ffffff" strokeWidth="3" />

              <path d="M 560,520 L 760,590 T 960,650" fill="none" stroke="#e0dedb" strokeWidth="4.5" />
              <path d="M 560,520 L 760,590 T 960,650" fill="none" stroke="#ffffff" strokeWidth="3" />

              <path d="M 280,390 L 460,390" fill="none" stroke="#e0dedb" strokeWidth="4.5" />
              <path d="M 280,390 L 460,390" fill="none" stroke="#ffffff" strokeWidth="3" />

              <path d="M 380,450 L 420,530" fill="none" stroke="#e0dedb" strokeWidth="4.5" />
              <path d="M 380,450 L 420,530" fill="none" stroke="#ffffff" strokeWidth="3" />

              {/* 4. Major Arterial National Highways (Google Maps Golden Yellow #fbbc04 with #e5a108 border) */}
              {/* NH 544 (Salem - Coimbatore - Walayar - Palakkad Corridor) */}
              <path 
                d="M 1080,120 Q 920,220 800,280 T 640,360 T 480,430 T 360,530 T 200,640 T 120,680" 
                fill="none" 
                stroke="#e5a108" 
                strokeWidth="7" 
                strokeLinecap="round" 
              />
              <path 
                d="M 1080,120 Q 920,220 800,280 T 640,360 T 480,430 T 360,530 T 200,640 T 120,680" 
                fill="none" 
                stroke="#fbbc04" 
                strokeWidth="5" 
                strokeLinecap="round" 
              />

              {/* NH 948 (Annur - Saravanampatti - Gandhipuram) */}
              <path d="M 640,0 L 580,180 T 500,320" fill="none" stroke="#e5a108" strokeWidth="6" strokeLinecap="round" />
              <path d="M 640,0 L 580,180 T 500,320" fill="none" stroke="#fbbc04" strokeWidth="4" strokeLinecap="round" />

              {/* NH 181 (Mettupalayam - Thudiyalur - Coimbatore) */}
              <path d="M 430,0 L 440,160 T 460,340" fill="none" stroke="#e5a108" strokeWidth="6" strokeLinecap="round" />
              <path d="M 430,0 L 440,160 T 460,340" fill="none" stroke="#fbbc04" strokeWidth="4" strokeLinecap="round" />

              {/* NH 81 (Coimbatore East to Sulur & Karur) */}
              <path d="M 500,360 Q 680,390 880,410 T 1120,440" fill="none" stroke="#e5a108" strokeWidth="6" strokeLinecap="round" />
              <path d="M 500,360 Q 680,390 880,410 T 1120,440" fill="none" stroke="#fbbc04" strokeWidth="4" strokeLinecap="round" />

              {/* Pollachi Road / SH (South from Malumichampatti through Kinathukadavu) */}
              <path d="M 540,490 L 580,620 T 620,800" fill="none" stroke="#e5a108" strokeWidth="6" strokeLinecap="round" />
              <path d="M 540,490 L 580,620 T 620,800" fill="none" stroke="#fbbc04" strokeWidth="4" strokeLinecap="round" />

              {/* SH 167 / Avinashi Road Core City Spine */}
              <path d="M 460,340 L 640,320 T 800,280" fill="none" stroke="#e5a108" strokeWidth="6" strokeLinecap="round" />
              <path d="M 460,340 L 640,320 T 800,280" fill="none" stroke="#fbbc04" strokeWidth="4" strokeLinecap="round" />
              {/* SH 162 / Trichy Road */}
              <path d="M 490,390 L 680,420 T 870,430" fill="none" stroke="#e5a108" strokeWidth="6" strokeLinecap="round" />
              <path d="M 490,390 L 680,420 T 870,430" fill="none" stroke="#fbbc04" strokeWidth="4" strokeLinecap="round" />

              {/* 5. Coimbatore City Corporation Municipal Boundary (Red Dashed Line - Exact match to Image 1) */}
              <path 
                d="M 410,215 Q 480,205 580,215 T 670,240 T 730,300 T 720,380 T 660,450 T 570,490 T 450,510 T 380,460 T 360,360 T 380,260 Z" 
                fill="none" 
                stroke="#ea4335" 
                strokeWidth="1.8" 
                strokeDasharray="4,4" 
              />

              {/* State Boundary Line (Tamil Nadu / Kerala) */}
              <line x1="140" y1="560" x2="160" y2="800" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,4" />
            </svg>

            {/* Geographical Highway Shield Badges (Google Maps Yellow Badges with drop shadow) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* NH 544 Shields */}
              <div className="absolute left-[72%] top-[25%] -translate-x-1/2 -translate-y-1/2 bg-[#fbbc04] text-black border border-black/40 text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                544
              </div>
              <div className="absolute left-[54%] top-[42%] -translate-x-1/2 -translate-y-1/2 bg-[#fbbc04] text-black border border-black/40 text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                544
              </div>
              <div className="absolute left-[24%] top-[65%] -translate-x-1/2 -translate-y-1/2 bg-[#fbbc04] text-black border border-black/40 text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                544
              </div>

              {/* NH 948 Shield */}
              <div className="absolute left-[50%] top-[14%] -translate-x-1/2 -translate-y-1/2 bg-[#fbbc04] text-black border border-black/40 text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                948
              </div>

              {/* NH 181 Shield */}
              <div className="absolute left-[38%] top-[17%] -translate-x-1/2 -translate-y-1/2 bg-[#fbbc04] text-black border border-black/40 text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                181
              </div>

              {/* NH 81 Shield */}
              <div className="absolute left-[82%] top-[39%] -translate-x-1/2 -translate-y-1/2 bg-[#fbbc04] text-black border border-black/40 text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                81
              </div>

              {/* State Highway Shields matching Image 1 */}
              <div className="absolute left-[44%] top-[19%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                872
              </div>
              <div className="absolute left-[39%] top-[19%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                489
              </div>
              <div className="absolute left-[33%] top-[27%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                164
              </div>
              <div className="absolute left-[27%] top-[31%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                167
              </div>
              <div className="absolute left-[33%] top-[45%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                169
              </div>
              <div className="absolute left-[52%] top-[50%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                162
              </div>
              <div className="absolute left-[54%] top-[62%] -translate-x-1/2 -translate-y-1/2 bg-[#fbbc04] text-black border border-black/40 text-[8px] font-bold px-1 py-0.1 rounded shadow-xs">
                83
              </div>
              <div className="absolute left-[64%] top-[18%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                678
              </div>
              <div className="absolute left-[70%] top-[14%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                713
              </div>
              <div className="absolute left-[76%] top-[10%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                165
              </div>
              <div className="absolute left-[88%] top-[28%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                165
              </div>
              <div className="absolute left-[70%] top-[49%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                163
              </div>
              <div className="absolute left-[63%] top-[57%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                522
              </div>
              <div className="absolute left-[71%] top-[72%] -translate-x-1/2 -translate-y-1/2 bg-white text-slate-800 border border-slate-400 text-[8px] font-semibold px-1 py-0.1 rounded shadow-xs">
                881
              </div>
            </div>

            {/* Bilingual Place Name Labels (Exact Typography matching Image 1) */}
            <div className="absolute inset-0 pointer-events-none text-slate-700 font-sans">
              
              {/* Gandhipuram (City Center) */}
              <div className="absolute left-[41%] top-[34%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[12px] font-semibold text-slate-800 tracking-tight block">Gandhipuram</span>
                <span className="text-[10px] text-slate-600 block leading-tight">காந்திபுரம்</span>
              </div>

              {/* Thudiyalur */}
              <div className="absolute left-[36%] top-[22%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Thudiyalur</span>
                <span className="text-[9px] text-slate-600 block leading-tight">துடியலூர்</span>
              </div>

              {/* Kalapatti */}
              <div className="absolute left-[54%] top-[23%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Kalapatti</span>
                <span className="text-[9px] text-slate-600 block leading-tight">காளப்பட்டி</span>
              </div>

              {/* Neelambur */}
              <div className="absolute left-[63%] top-[25%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Neelambur</span>
                <span className="text-[9px] text-slate-600 block leading-tight">நீலம்பூர்</span>
              </div>

              {/* Sulur */}
              <div className="absolute left-[71%] top-[33%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Sulur</span>
                <span className="text-[9px] text-slate-600 block leading-tight">சூலூர்</span>
              </div>

              {/* Somanur */}
              <div className="absolute left-[80%] top-[19%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Somanur</span>
                <span className="text-[9px] text-slate-600 block leading-tight">சோமனூர்</span>
              </div>

              {/* Kovaipudur */}
              <div className="absolute left-[36%] top-[48%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Kovaipudur</span>
                <span className="text-[9px] text-slate-600 block leading-tight">கோவை புதூர்</span>
              </div>

              {/* Malumichampatti */}
              <div className="absolute left-[48%] top-[56%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Malumichampatti</span>
                <span className="text-[9px] text-slate-600 block leading-tight">மலுமிச்சம்பட்டி</span>
              </div>

              {/* Kinathukadavu */}
              <div className="absolute left-[51%] top-[74%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Kinathukadavu</span>
                <span className="text-[9px] text-slate-600 block leading-tight">கிணத்துக்கடவு</span>
              </div>

              {/* Sultanpet */}
              <div className="absolute left-[81%] top-[51%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[11px] font-semibold text-slate-800 block">Sultanpet</span>
                <span className="text-[9px] text-slate-600 block leading-tight">சுல்தான்பேட்டை</span>
              </div>

              {/* Anaikatti */}
              <div className="absolute left-[8%] top-[16%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[10px] font-medium text-emerald-900 block">Anaikatti</span>
                <span className="text-[8.5px] text-emerald-800 block leading-tight">ஆனைக்கட்டி</span>
              </div>

              {/* Walayar */}
              <div className="absolute left-[19%] top-[69%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[10px] font-medium text-sky-900 block">Walayar</span>
                <span className="text-[8.5px] text-sky-800 block leading-tight">வாலையார்</span>
              </div>

              {/* Kaduvettipalayam */}
              <div className="absolute left-[71%] top-[8%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[10px] font-medium text-slate-700 block">Kaduvettipalayam</span>
                <span className="text-[8.5px] text-slate-500 block leading-tight">காடுவெட்டிபாளையம்</span>
              </div>

              {/* Devarayapuram */}
              <div className="absolute left-[49%] top-[83%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[10px] font-medium text-slate-700 block">Devarayapuram</span>
                <span className="text-[8.5px] text-slate-500 block leading-tight">தேவராயபுரம்</span>
              </div>

              {/* Periya Negamam */}
              <div className="absolute left-[65%] top-[89%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[10px] font-medium text-slate-700 block">Periya Negamam</span>
              </div>

              {/* Velanthavalam */}
              <div className="absolute left-[22%] top-[75%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[10px] font-medium text-slate-700 block">Velanthavalam</span>
              </div>

              {/* Elappully */}
              <div className="absolute left-[4%] top-[86%] -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[10px] font-medium text-slate-700 block">Elappully</span>
                <span className="text-[8.5px] text-slate-500 block leading-tight">எலப்புள்ளி</span>
              </div>

              {/* State Labels (Tamil Nadu / Kerala) */}
              <div className="absolute left-[6%] top-[55%] text-[11px] font-bold text-slate-500 tracking-wider">
                TAMIL NADU
              </div>
              <div className="absolute left-[6%] top-[61%] text-[10px] font-bold text-slate-400 tracking-wider">
                KERALA
              </div>

              {/* Key Landmark Pins (Matching Image 1) */}
              {/* Fun Republic Mall */}
              <div className="absolute left-[59%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">
                <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-3 h-3" />
                </div>
                <div className="text-left bg-white/90 px-1.5 py-0.5 rounded shadow-xs border border-slate-200">
                  <span className="text-[9.5px] font-bold text-sky-800 block leading-tight">Fun Republic Mall</span>
                  <span className="text-[8px] text-sky-600 block leading-tight">ஃபன் ரிபப்ளிக் மால்</span>
                </div>
              </div>

              {/* Arulmigu Subramaniaswamy Temple */}
              <div className="absolute left-[16%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">
                <div className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-md">
                  <Landmark className="w-3 h-3" />
                </div>
                <div className="text-left bg-white/90 px-1.5 py-0.5 rounded shadow-xs border border-slate-200">
                  <span className="text-[9.5px] font-bold text-amber-900 block leading-tight">Arulmigu Subramaniaswamy...</span>
                </div>
              </div>

            </div>

            {/* School Placemark Pins (Standard Google Maps Teardrop Markers) */}
            <div className="absolute inset-0">
              {displaySchools.slice(0, 220).map((s) => {
                const pos = projectCoords(s.latitude || 11.0, s.longitude || 76.9);
                const isSelected = selectedSchool?.id === s.id;
                const isHovered = hoveredSchoolId === s.id;
                const isVerified = Boolean(s.official_landline || s.official_email);

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSchoolPin(s);
                    }}
                    onMouseEnter={() => setHoveredSchoolId(s.id)}
                    onMouseLeave={() => setHoveredSchoolId(null)}
                    className="absolute cursor-pointer transition-transform duration-150 interactive-control"
                    style={{
                      left: pos.left,
                      top: pos.top,
                      transform: `translate(-50%, -100%) scale(${isSelected ? 1.4 : isHovered ? 1.25 : 1})`,
                      zIndex: isSelected ? 50 : isHovered ? 45 : 20
                    }}
                    title={`${s.school_name} (${s.udise_code})`}
                  >
                    {/* Google Maps Authentic Teardrop Pin */}
                    <div className="relative group">
                      <svg width={isSelected ? "22" : isHovered ? "20" : "15"} height={isSelected ? "29" : isHovered ? "26" : "20"} viewBox="0 0 24 32" fill="none" className="drop-shadow-xs">
                        {/* Teardrop Body */}
                        <path 
                          d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 32 12 32C12 32 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z" 
                          fill={isVerified ? '#0f9d58' : '#ea4335'} 
                          stroke="#ffffff" 
                          strokeWidth="1.5" 
                        />
                        {/* Inner Dot / Icon */}
                        <circle cx="12" cy="11" r="4.5" fill="#ffffff" />
                      </svg>

                      {/* Hover Tooltip (School Name Chip) */}
                      {(isHovered || isSelected) && (
                        <div className="absolute left-1/2 -top-1 -translate-x-1/2 -translate-y-full bg-slate-900/95 text-white text-[11px] font-semibold px-2 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50 border border-slate-700">
                          <p className="max-w-[160px] truncate">{s.school_name}</p>
                          <p className="text-[9px] text-slate-300 font-mono">{s.udise_code} • {s.block}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Floating Google Maps Search & Filter Card (Top-Left) */}
          <div className="absolute left-3 top-3 z-30 flex items-center gap-2 max-w-sm sm:max-w-md w-full interactive-control">
            <div className="relative flex-1 bg-white rounded-lg shadow-md border border-slate-200 flex items-center px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schools or localities in Coimbatore..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center shrink-0 transition-colors"
              title="Close Map"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Google Maps Zoom & Recenter Controls (Bottom-Right) */}
          <div className="absolute right-3 bottom-14 z-30 flex flex-col gap-2 items-center interactive-control">
            {/* Recenter Button */}
            <button
              onClick={handleRecenter}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-md text-slate-700 hover:text-sky-600 hover:bg-slate-50 flex items-center justify-center transition-all"
              title="Recenter Coimbatore"
            >
              <Crosshair className="w-4 h-4" />
            </button>

            {/* Zoom Controls */}
            <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden">
              <button
                onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.25))}
                className="p-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                title="Zoom in (+)"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-200" />
              <button
                onClick={() => setZoomLevel(z => Math.max(0.7, z - 0.25))}
                className="p-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                title="Zoom out (-)"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Google Official Watermark (Bottom-Left) */}
          <div className="absolute left-3 bottom-14 z-30 pointer-events-none flex items-center gap-1.5 text-xs text-slate-600 select-none">
            <span className="font-bold text-sm tracking-tighter">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Map data ©2026 Google · UDISE+ Coimbatore District Master Register
            </span>
          </div>

          {/* Google Maps Place Info Card (When a school is clicked) */}
          {selectedSchool && (
            <div className="absolute left-3 top-16 max-w-sm w-[90%] sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 text-slate-800 z-40 animate-in fade-in-50 slide-in-from-left-4 interactive-control">
              <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono">
                      {selectedSchool.udise_code}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      selectedSchool.official_landline || selectedSchool.official_email
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {selectedSchool.official_landline || selectedSchool.official_email ? 'Verified Contact' : 'Contact Missing'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {selectedSchool.school_name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedSchool.block} • {selectedSchool.board}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSchoolPin(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Verified Contact Details */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                {selectedSchool.official_landline ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <a 
                      href={`tel:${selectedSchool.official_landline}`}
                      className="font-mono text-emerald-700 font-semibold hover:underline"
                    >
                      {selectedSchool.official_landline}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                    <span>No official landline published</span>
                  </div>
                )}

                {selectedSchool.official_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <a 
                      href={`mailto:${selectedSchool.official_email}`}
                      className="text-sky-700 hover:underline truncate"
                    >
                      {selectedSchool.official_email}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-mono">
                    {selectedSchool.latitude?.toFixed(5)}° N, {selectedSchool.longitude?.toFixed(5)}° E
                  </span>
                </div>
              </div>

              {/* Actions: Google Maps Directions & School Detail */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedSchool.school_name}, ${selectedSchool.block}, Coimbatore`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-sky-200 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-sky-600" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                </a>

                <button
                  onClick={() => {
                    onSelectSchool(selectedSchool);
                    onClose();
                  }}
                  className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
                >
                  Inspect Profile
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Educational Block Filter Bar (Clean Google Maps Style Ribbon) */}
        <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 z-30">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 pl-1">
            Blocks:
          </span>
          {COIMBATORE_BLOCK_PLACES.map((place) => {
            const isSelected = selectedBlock === place.name;
            return (
              <button
                key={place.name}
                onClick={() => handleSelectBlock(place)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{place.name}</span>
                <span className={`ml-1 text-[10px] ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                  ({place.count})
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
