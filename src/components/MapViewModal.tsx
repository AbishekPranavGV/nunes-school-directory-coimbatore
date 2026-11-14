'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  ArrowUpRight,
  Globe2,
  MessageSquare,
  Loader2,
  Pin,
  Lock,
  Unlock,
  Target
} from 'lucide-react';
import { SchoolRecord } from '@/types';
import { getCanonicalDistrictName, matchesDistrict } from '@/lib/data/tamilNaduDistricts';

export interface PinnedLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  district?: string;
  block?: string;
  school?: SchoolRecord;
  pinnedAt: string;
  isCustom?: boolean;
}

interface MapViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: SchoolRecord[];
  onSelectSchool: (school: SchoolRecord) => void;
  selectedDistrict?: string;
}

interface RegionPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  district?: string;
  count: number;
}

interface BlockPlace {
  name: string;
  lat: number;
  lng: number;
  count: number;
}

// 1. Statewide Tamil Nadu Major Hubs & Districts
const TAMIL_NADU_REGION_PLACES: RegionPlace[] = [
  { id: 'all_tn', name: 'All Tamil Nadu (38 Districts)', lat: 11.1271, lng: 78.6569, zoom: 7, count: 16300 },
  { id: 'coimbatore', name: 'Coimbatore District', lat: 11.0168, lng: 76.9558, zoom: 11, district: 'Coimbatore', count: 2097 },
  { id: 'chennai', name: 'Chennai Metropolitan', lat: 13.0827, lng: 80.2707, zoom: 11, district: 'Chennai', count: 1420 },
  { id: 'madurai', name: 'Madurai District', lat: 9.9252, lng: 78.1198, zoom: 11, district: 'Madurai', count: 980 },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, zoom: 11, district: 'Tiruchirappalli', count: 890 },
  { id: 'salem', name: 'Salem District', lat: 11.6643, lng: 78.1460, zoom: 11, district: 'Salem', count: 890 },
  { id: 'tiruppur', name: 'Tiruppur District', lat: 11.1085, lng: 77.3411, zoom: 11, district: 'Tiruppur', count: 750 },
  { id: 'erode', name: 'Erode District', lat: 11.3410, lng: 77.7172, zoom: 11, district: 'Erode', count: 680 },
  { id: 'tirunelveli', name: 'Tirunelveli District', lat: 8.7139, lng: 77.7567, zoom: 11, district: 'Tirunelveli', count: 620 },
  { id: 'kanniyakumari', name: 'Kanniyakumari', lat: 8.0883, lng: 77.5385, zoom: 11, district: 'Kanniyakumari', count: 540 },
  { id: 'thanjavur', name: 'Thanjavur Delta', lat: 10.7870, lng: 79.1378, zoom: 11, district: 'Thanjavur', count: 490 },
  { id: 'vellore', name: 'Vellore District', lat: 12.9165, lng: 79.1325, zoom: 11, district: 'Vellore', count: 480 },
  { id: 'nilgiris', name: 'The Nilgiris Hills', lat: 11.4102, lng: 76.6950, zoom: 11, district: 'The Nilgiris', count: 370 },
  { id: 'dindigul', name: 'Dindigul District', lat: 10.3673, lng: 77.9803, zoom: 11, district: 'Dindigul', count: 510 },
  { id: 'cuddalore', name: 'Cuddalore Coastal', lat: 11.7480, lng: 79.7714, zoom: 11, district: 'Cuddalore', count: 460 },
  { id: 'dharmapuri', name: 'Dharmapuri', lat: 12.1211, lng: 78.1582, zoom: 11, district: 'Dharmapuri', count: 420 },
  { id: 'namakkal', name: 'Namakkal', lat: 11.2189, lng: 78.1674, zoom: 11, district: 'Namakkal', count: 410 },
];

// 2. Statewide Kerala Major Hubs & Districts (14 Districts)
const KERALA_REGION_PLACES: RegionPlace[] = [
  { id: 'all_kl', name: 'All Kerala (14 Districts)', lat: 10.8505, lng: 76.2711, zoom: 7, count: 4820 },
  { id: 'ernakulam', name: 'Ernakulam / Kochi', lat: 9.9816, lng: 76.2999, zoom: 11, district: 'Ernakulam', count: 440 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram Capital', lat: 8.5241, lng: 76.9366, zoom: 11, district: 'Thiruvananthapuram', count: 480 },
  { id: 'kozhikode', name: 'Kozhikode Malabar', lat: 11.2588, lng: 75.7804, zoom: 11, district: 'Kozhikode', count: 420 },
  { id: 'thrissur', name: 'Thrissur Cultural Capital', lat: 10.5276, lng: 76.2144, zoom: 11, district: 'Thrissur', count: 410 },
  { id: 'palakkad', name: 'Palakkad Gateway', lat: 10.7867, lng: 76.6548, zoom: 11, district: 'Palakkad', count: 390 },
  { id: 'malappuram', name: 'Malappuram District', lat: 11.0732, lng: 76.0740, zoom: 11, district: 'Malappuram', count: 490 },
  { id: 'kollam', name: 'Kollam Coastal', lat: 8.8932, lng: 76.6141, zoom: 11, district: 'Kollam', count: 380 },
  { id: 'kottayam', name: 'Kottayam Highlands', lat: 9.5916, lng: 76.5222, zoom: 11, district: 'Kottayam', count: 360 },
  { id: 'kannur', name: 'Kannur District', lat: 11.8745, lng: 75.3704, zoom: 11, district: 'Kannur', count: 370 },
  { id: 'alappuzha', name: 'Alappuzha Backwaters', lat: 9.4981, lng: 76.3388, zoom: 11, district: 'Alappuzha', count: 320 },
  { id: 'pathanamthitta', name: 'Pathanamthitta', lat: 9.2648, lng: 76.7870, zoom: 11, district: 'Pathanamthitta', count: 280 },
  { id: 'idukki', name: 'Idukki Hill Ranges', lat: 9.8500, lng: 76.9700, zoom: 10, district: 'Idukki', count: 260 },
  { id: 'wayanad', name: 'Wayanad Ghats', lat: 11.6854, lng: 76.1320, zoom: 10, district: 'Wayanad', count: 240 },
  { id: 'kasaragod', name: 'Kasaragod North', lat: 12.5102, lng: 74.9852, zoom: 11, district: 'Kasaragod', count: 250 },
];

// 3. Coimbatore Educational Blocks (15 Blocks Baseline)
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

interface MarkerCluster {
  id: string;
  isCluster: true;
  count: number;
  verifiedCount: number;
  lat: number;
  lng: number;
  screenX: number;
  screenY: number;
  schools: SchoolRecord[];
}

interface SingleMarker {
  id: string;
  isCluster: false;
  school: SchoolRecord;
  screenX: number;
  screenY: number;
}

type MapDisplayItem = MarkerCluster | SingleMarker;

export const MapViewModal: React.FC<MapViewModalProps> = ({
  isOpen,
  onClose,
  schools,
  onSelectSchool,
  selectedDistrict = 'coimbatore'
}) => {
  // Region Navigation Tab: 'kerala' | 'tamil_nadu' | 'coimbatore_blocks'
  const [regionTab, setRegionTab] = useState<'kerala' | 'tamil_nadu' | 'coimbatore_blocks'>(
    selectedDistrict && (selectedDistrict === 'ernakulam' || selectedDistrict.startsWith('kl_')) ? 'kerala' : 'tamil_nadu'
  );

  // Live Google Map Coordinates & Zoom State
  // Default centered at Coimbatore: 11.0168° N, 76.9558° E, Zoom Level 11
  const [centerLat, setCenterLat] = useState<number>(11.0168);
  const [centerLng, setCenterLng] = useState<number>(76.9558);
  const [zoom, setZoom] = useState<number>(11);
  
  // Map Layer: 'roadmap' (Google Maps 2D standard), 'satellite' (Google Satellite Hybrid), 'terrain'
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');

  // UI state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all_tn');
  const [selectedBlock, setSelectedBlock] = useState<string>('All Blocks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSchool, setSelectedSchoolPin] = useState<SchoolRecord | null>(null);
  const [hoveredSchoolId, setHoveredSchoolId] = useState<string | null>(null);
  const [pulsingSchoolId, setPulsingSchoolId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchStatusMessage, setSearchStatusMessage] = useState<string>('');
  
  // Advanced Pinned Location System State
  const [pinnedLocation, setPinnedLocation] = useState<PinnedLocation | null>(null);
  const [isLockCameraToPin, setIsLockCameraToPin] = useState<boolean>(false);
  const [isDropPinMode, setIsDropPinMode] = useState<boolean>(false);

  // School Dataset State
  const [allLoadedSchools, setAllLoadedSchools] = useState<SchoolRecord[]>(schools);

  // 60FPS Hardware-Accelerated Pan / Drag Engine State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartRef = useRef<{ x: number; y: number; centerPx: number; centerPy: number }>({ x: 0, y: 0, centerPx: 0, centerPy: 0 });

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

  // Prevent background page scrolling completely when map modal is open
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen]);

  // Load statewide or district dataset when modal opens
  useEffect(() => {
    if (isOpen && allLoadedSchools.length < 500) {
      fetch('/api/schools?district=all&pageSize=3000')
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data.length > 0) {
            setAllLoadedSchools(data.data);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, allLoadedSchools.length]);

  // Keep camera locked to pinned location if active
  useEffect(() => {
    if (isLockCameraToPin && pinnedLocation) {
      setCenterLat(pinnedLocation.lat);
      setCenterLng(pinnedLocation.lng);
    }
  }, [isLockCameraToPin, pinnedLocation]);

  // Center pixel coordinates
  const centerPixelX = projectLngToPixel(centerLng, zoom);
  const centerPixelY = projectLatToPixel(centerLat, zoom);

  // Compute visible slippy map tiles with 1-tile buffer on all sides to eliminate edge gaps during drag
  const halfW = viewportSize.width / 2;
  const halfH = viewportSize.height / 2;

  const minTileX = Math.max(0, Math.floor((centerPixelX - halfW) / TILE_SIZE) - 1);
  const maxTileX = Math.min(Math.pow(2, zoom) - 1, Math.floor((centerPixelX + halfW) / TILE_SIZE) + 1);
  const minTileY = Math.max(0, Math.floor((centerPixelY - halfH) / TILE_SIZE) - 1);
  const maxTileY = Math.min(Math.pow(2, zoom) - 1, Math.floor((centerPixelY + halfH) / TILE_SIZE) + 1);

  const visibleTiles: { x: number; y: number; left: number; top: number; url: string }[] = useMemo(() => {
    const tiles: { x: number; y: number; left: number; top: number; url: string }[] = [];
    for (let tx = minTileX; tx <= maxTileX; tx++) {
      for (let ty = minTileY; ty <= maxTileY; ty++) {
        const left = tx * TILE_SIZE - centerPixelX + halfW;
        const top = ty * TILE_SIZE - centerPixelY + halfH;
        
        let tileUrl = `https://mt1.google.com/vt/lyrs=m&x=${tx}&y=${ty}&z=${zoom}`;
        if (mapType === 'satellite') {
          tileUrl = `https://mt1.google.com/vt/lyrs=y&x=${tx}&y=${ty}&z=${zoom}`;
        } else if (mapType === 'terrain') {
          tileUrl = `https://mt1.google.com/vt/lyrs=p&x=${tx}&y=${ty}&z=${zoom}`;
        }

        tiles.push({ x: tx, y: ty, left, top, url: tileUrl });
      }
    }
    return tiles;
  }, [minTileX, maxTileX, minTileY, maxTileY, centerPixelX, centerPixelY, halfW, halfH, zoom, mapType]);

  // Filter schools for current view
  const displaySchools = useMemo(() => {
    return allLoadedSchools.filter(s => {
      if (regionTab === 'coimbatore_blocks' && selectedBlock !== 'All Blocks') {
        const bNorm = selectedBlock.toLowerCase();
        const sBlock = (s.block || '').toLowerCase();
        if (!sBlock.includes(bNorm) && !bNorm.includes(sBlock)) return false;
      }
      if (regionTab === 'tamil_nadu' && selectedRegionId !== 'all_tn') {
        const region = TAMIL_NADU_REGION_PLACES.find(r => r.id === selectedRegionId);
        if (region?.district) {
          if ((s.district || '').toLowerCase() !== region.district.toLowerCase()) return false;
        }
      }
      return Boolean(s.latitude && s.longitude);
    });
  }, [allLoadedSchools, regionTab, selectedBlock, selectedRegionId]);

  // Intelligent Spatial Grid Clustering Algorithm (Resolves Image 1 Overlapping Clutter)
  // When zoom < 14, clusters schools within 40px radius into sleek, high-tech count badges
  const mapDisplayItems: MapDisplayItem[] = useMemo(() => {
    // 1. Calculate screen coordinates for all visible schools
    const rawVisible = displaySchools.map(s => {
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
        lat,
        lng,
        isVisible: screenX >= -60 && screenX <= viewportSize.width + 60 && screenY >= -60 && screenY <= viewportSize.height + 60
      };
    }).filter(item => item.isVisible);

    // If zoom is street/block level (>= 14), render individual pins without clustering
    if (zoom >= 14) {
      return rawVisible.map(item => ({
        id: item.school.id,
        isCluster: false as const,
        school: item.school,
        screenX: item.screenX,
        screenY: item.screenY
      }));
    }

    // Grid clustering with 42px cell width
    const CLUSTER_CELL_SIZE = 42;
    const grid: Record<string, typeof rawVisible> = {};

    rawVisible.forEach(item => {
      // If this school is explicitly pinned, let it render individually with top priority
      if (pinnedLocation?.school?.id === item.school.id) {
        return;
      }
      const cellKey = `${Math.floor(item.screenX / CLUSTER_CELL_SIZE)}_${Math.floor(item.screenY / CLUSTER_CELL_SIZE)}`;
      if (!grid[cellKey]) grid[cellKey] = [];
      grid[cellKey].push(item);
    });

    const items: MapDisplayItem[] = [];

    // Add back the pinned school as a single pin if it was visible
    if (pinnedLocation?.school) {
      const pinSchoolItem = rawVisible.find(r => r.school.id === pinnedLocation.school?.id);
      if (pinSchoolItem) {
        items.push({
          id: pinSchoolItem.school.id,
          isCluster: false,
          school: pinSchoolItem.school,
          screenX: pinSchoolItem.screenX,
          screenY: pinSchoolItem.screenY
        });
      }
    }

    Object.entries(grid).forEach(([cellKey, cellSchools]) => {
      if (cellSchools.length === 1) {
        items.push({
          id: cellSchools[0].school.id,
          isCluster: false,
          school: cellSchools[0].school,
          screenX: cellSchools[0].screenX,
          screenY: cellSchools[0].screenY
        });
      } else {
        // Multi-school cluster
        let sumX = 0;
        let sumY = 0;
        let sumLat = 0;
        let sumLng = 0;
        let verifiedCount = 0;

        cellSchools.forEach(cs => {
          sumX += cs.screenX;
          sumY += cs.screenY;
          sumLat += cs.lat;
          sumLng += cs.lng;
          if (cs.school.official_landline || cs.school.official_email || cs.school.is_contact_complete) {
            verifiedCount++;
          }
        });

        items.push({
          id: `cluster_${cellKey}`,
          isCluster: true,
          count: cellSchools.length,
          verifiedCount,
          lat: sumLat / cellSchools.length,
          lng: sumLng / cellSchools.length,
          screenX: sumX / cellSchools.length,
          screenY: sumY / cellSchools.length,
          schools: cellSchools.map(cs => cs.school)
        });
      }
    });

    return items;
  }, [displaySchools, zoom, centerPixelX, centerPixelY, halfW, halfH, viewportSize.width, viewportSize.height, pinnedLocation]);

  // Click on a Cluster: Zooms in by +2 levels directly centered on cluster centroid
  const handleClusterClick = (cluster: MarkerCluster, e: React.MouseEvent) => {
    e.stopPropagation();
    setCenterLat(cluster.lat);
    setCenterLng(cluster.lng);
    setZoom(prev => Math.min(18, prev + 2));
    setSearchStatusMessage(`Zoomed into cluster of ${cluster.count} schools`);
    setTimeout(() => setSearchStatusMessage(''), 2500);
  };

  // 60FPS Drag / Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;

    if (isDropPinMode) {
      handleMapClickDropPin(e);
      return;
    }

    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      centerPx: centerPixelX,
      centerPy: centerPixelY
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset.x !== 0 || dragOffset.y !== 0) {
      const finalPx = dragStartRef.current.centerPx - dragOffset.x;
      const finalPy = dragStartRef.current.centerPy - dragOffset.y;
      setCenterLng(pixelToLng(finalPx, zoom));
      setCenterLat(pixelToLat(finalPy, zoom));
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse Wheel Zoom centered on cursor
  const handleWheel = (e: React.WheelEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    e.preventDefault();
    if (isLockCameraToPin && pinnedLocation) {
      setCenterLat(pinnedLocation.lat);
      setCenterLng(pinnedLocation.lng);
    }
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(18, prev + 1));
    } else if (e.deltaY > 0) {
      setZoom(prev => Math.max(6, prev - 1));
    }
  };

  // Region Selector Handler: Fly to Region
  const handleSelectRegion = (region: RegionPlace) => {
    setSelectedRegionId(region.id);
    setSelectedSchoolPin(null);
    setCenterLat(region.lat);
    setCenterLng(region.lng);
    setZoom(region.zoom);
    setSearchStatusMessage(`Centered on ${region.name}`);
    setTimeout(() => setSearchStatusMessage(''), 3000);
  };

  // Block Selector Handler: Flies directly to block coordinates
  const handleSelectBlock = (place: BlockPlace) => {
    setSelectedBlock(place.name);
    setSelectedSchoolPin(null);
    setCenterLat(place.lat);
    setCenterLng(place.lng);
    setZoom(place.name === 'All Blocks' ? 11 : 13);
    setSearchStatusMessage(`Centered on Coimbatore • ${place.name}`);
    setTimeout(() => setSearchStatusMessage(''), 3000);
  };

  // Re-center on Tamil Nadu center or Coimbatore Hub
  const handleRecenter = () => {
    if (isLockCameraToPin && pinnedLocation) {
      setCenterLat(pinnedLocation.lat);
      setCenterLng(pinnedLocation.lng);
      setSearchStatusMessage(`Centered on Pinned Location: ${pinnedLocation.title}`);
      setTimeout(() => setSearchStatusMessage(''), 3000);
      return;
    }

    if (regionTab === 'tamil_nadu') {
      setSelectedRegionId('all_tn');
      setCenterLat(11.1271);
      setCenterLng(78.6569);
      setZoom(7);
      setSearchStatusMessage('Re-centered to Tamil Nadu Statewide View');
    } else if (regionTab === 'kerala') {
      setSelectedRegionId('all_kl');
      setCenterLat(10.8505);
      setCenterLng(76.2711);
      setZoom(7);
      setSearchStatusMessage('Re-centered to Kerala Statewide View');
    } else {
      setSelectedBlock('All Blocks');
      setCenterLat(11.0168);
      setCenterLng(76.9558);
      setZoom(11);
      setSearchStatusMessage('Re-centered to Coimbatore Hub');
    }
    setSelectedSchoolPin(null);
    setTimeout(() => setSearchStatusMessage(''), 3000);
  };

  // Pinning Handlers
  const handlePinSchool = (school: SchoolRecord) => {
    if (!school.latitude || !school.longitude) return;
    const pin: PinnedLocation = {
      id: school.id,
      lat: school.latitude,
      lng: school.longitude,
      title: school.school_name,
      subtitle: `${school.block || ''} • ${school.district || ''}`,
      district: school.district,
      block: school.block,
      school,
      pinnedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCustom: false
    };
    setPinnedLocation(pin);
    setSearchStatusMessage(`📌 Pinned Location: ${school.school_name}`);
    setTimeout(() => setSearchStatusMessage(''), 3500);
  };

  const handleUnpinLocation = () => {
    setPinnedLocation(null);
    setIsLockCameraToPin(false);
    setSearchStatusMessage('Unpinned location.');
    setTimeout(() => setSearchStatusMessage(''), 2500);
  };

  const handleCenterOnPin = () => {
    if (!pinnedLocation) return;
    setCenterLat(pinnedLocation.lat);
    setCenterLng(pinnedLocation.lng);
    setZoom(prev => Math.max(prev, 14));
    setSearchStatusMessage(`🎯 Centered on pinned location: ${pinnedLocation.title}`);
    setTimeout(() => setSearchStatusMessage(''), 3000);
  };

  const handleToggleLockPin = () => {
    if (!pinnedLocation) return;
    setIsLockCameraToPin(prev => {
      const next = !prev;
      if (next) {
        setCenterLat(pinnedLocation.lat);
        setCenterLng(pinnedLocation.lng);
        setSearchStatusMessage('🔒 Camera locked to pinned location');
      } else {
        setSearchStatusMessage('🔓 Camera unlocked');
      }
      setTimeout(() => setSearchStatusMessage(''), 3000);
      return next;
    });
  };

  // Drop Custom Pin anywhere on the map
  const handleMapClickDropPin = (e: React.MouseEvent) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;
    
    const clickPixelX = centerPixelX - halfW + clickScreenX;
    const clickPixelY = centerPixelY - halfH + clickScreenY;
    const dropLat = pixelToLat(clickPixelY, zoom);
    const dropLng = pixelToLng(clickPixelX, zoom);

    // Look for a school nearby within 35 pixels
    const nearby = displaySchools.find(s => {
      if (!s.latitude || !s.longitude) return false;
      const sPx = projectLngToPixel(s.longitude, zoom);
      const sPy = projectLatToPixel(s.latitude, zoom);
      const dist = Math.hypot(sPx - clickPixelX, sPy - clickPixelY);
      return dist < 35;
    });

    if (nearby) {
      handlePinSchool(nearby);
      setSelectedSchoolPin(nearby);
    } else {
      const customPin: PinnedLocation = {
        id: `custom_${Date.now()}`,
        lat: dropLat,
        lng: dropLng,
        title: `Pinned Waypoint (${dropLat.toFixed(4)}°, ${dropLng.toFixed(4)}°)`,
        subtitle: `${regionTab === 'kerala' ? 'Kerala' : 'Tamil Nadu'} Custom Anchor`,
        district: regionTab === 'kerala' ? 'Kerala' : 'Tamil Nadu',
        pinnedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCustom: true
      };
      setPinnedLocation(customPin);
      setSearchStatusMessage(`📍 Custom Pin Dropped at ${dropLat.toFixed(4)}° N, ${dropLng.toFixed(4)}° E`);
      setTimeout(() => setSearchStatusMessage(''), 4000);
    }
    setIsDropPinMode(false);
  };

  // LIVE SCHOOL SEARCH HANDLER
  const handleExecuteSearch = async () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    setIsSearching(true);
    setSearchStatusMessage(`Searching live locations for "${searchQuery}"...`);

    // 1. Search in locally loaded schools with canonical district alias resolution
    const canonicalDistrict = getCanonicalDistrictName(q);
    let match = allLoadedSchools.find(s => 
      (s.school_name || '').toLowerCase().includes(q) ||
      (s.udise_code || '').includes(q) ||
      (s.locality || '').toLowerCase().includes(q) ||
      (s.block || '').toLowerCase().includes(q) ||
      (s.district || '').toLowerCase().includes(q) ||
      (canonicalDistrict && matchesDistrict(s.district || '', canonicalDistrict))
    );

    // 2. If not found in loaded array, query server /api/schools
    if (!match) {
      try {
        const res = await fetch(`/api/schools?q=${encodeURIComponent(q)}&district=all&pageSize=10`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          match = json.data[0];
          setAllLoadedSchools(prev => [match!, ...prev.filter(x => x.id !== match!.id)]);
        }
      } catch (err) {
        console.error('Search API error:', err);
      }
    }

    setIsSearching(false);

    if (match && match.latitude && match.longitude) {
      setCenterLat(match.latitude);
      setCenterLng(match.longitude);
      setZoom(15);
      setSelectedSchoolPin(match);
      setPulsingSchoolId(match.id);
      setSearchStatusMessage(`📍 Live Location Found: ${match.school_name} (${match.district || 'Tamil Nadu'})`);
      
      setTimeout(() => {
        setPulsingSchoolId(null);
      }, 6000);
    } else {
      setSearchStatusMessage(`No school found matching "${searchQuery}". Try school name, UDISE, or city.`);
      setTimeout(() => setSearchStatusMessage(''), 4000);
    }
  };

  if (!isOpen) return null;

  // Screen coordinates for pinned location anchor
  const pinnedScreenX = pinnedLocation ? projectLngToPixel(pinnedLocation.lng, zoom) - centerPixelX + halfW : 0;
  const pinnedScreenY = pinnedLocation ? projectLatToPixel(pinnedLocation.lat, zoom) - centerPixelY + halfH : 0;
  const isPinnedVisible = pinnedLocation && pinnedScreenX >= -100 && pinnedScreenX <= viewportSize.width + 100 && pinnedScreenY >= -100 && pinnedScreenY <= viewportSize.height + 100;

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
          style={{
            touchAction: 'none',
            overscrollBehavior: 'contain'
          }}
          className={`relative flex-1 overflow-hidden select-none bg-[#e5e3df] ${
            isDropPinMode ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* HARDWARE GPU-ACCELERATED WORLD CONTAINER */}
          {/* Decouples pan motion from React state re-renders for fluid 60FPS dragging */}
          <div 
            className="absolute inset-0"
            style={{
              transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
              willChange: isDragging ? 'transform' : 'auto',
              transition: isDragging ? 'none' : 'transform 0.05s ease-out'
            }}
          >
            {/* 1. Google Slippy Tiles Layer */}
            <div className="absolute inset-0 pointer-events-none">
              {visibleTiles.map(t => (
                <img
                  key={`${t.x}-${t.y}-${zoom}-${mapType}`}
                  src={t.url}
                  alt=""
                  className="absolute select-none pointer-events-none transition-opacity duration-150"
                  style={{
                    left: `${t.left}px`,
                    top: `${t.top}px`,
                    width: `${TILE_SIZE}px`,
                    height: `${TILE_SIZE}px`
                  }}
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://a.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${t.x}/${t.y}.png`;
                  }}
                />
              ))}
            </div>

            {/* 2. Interactive Markers & Clusters Layer */}
            <div className={`absolute inset-0 ${isDragging ? 'pointer-events-none' : 'pointer-events-none'}`}>
              {mapDisplayItems.map(item => {
                if (item.isCluster) {
                  // High-tech Cluster Bubble
                  const hasVerified = item.verifiedCount > 0;
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => handleClusterClick(item, e)}
                      className="interactive-control absolute pointer-events-auto cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
                      style={{
                        left: `${item.screenX}px`,
                        top: `${item.screenY}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 25
                      }}
                      title={`${item.count} Schools in this area (${item.verifiedCount} verified) • Click to Zoom`}
                    >
                      <div className="relative group flex items-center justify-center">
                        {/* Outer Glow Ring */}
                        <div className={`absolute -inset-1.5 rounded-full blur-[2px] opacity-75 animate-pulse ${
                          hasVerified ? 'bg-emerald-400' : 'bg-sky-400'
                        }`} />

                        {/* Cluster Badge */}
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center text-white font-black text-xs shadow-xl border-2 border-white ${
                          hasVerified 
                            ? 'bg-gradient-to-tr from-emerald-600 to-teal-700' 
                            : 'bg-gradient-to-tr from-sky-600 to-indigo-700'
                        }`}>
                          <span className="leading-none">{item.count}</span>
                          <span className="text-[8px] font-normal opacity-90 leading-none mt-0.5">sch</span>
                        </div>

                        {/* Mini Verified Dot */}
                        {hasVerified && (
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 border border-white rounded-full flex items-center justify-center shadow-xs">
                            <span className="text-[7px] text-amber-950 font-black">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Individual School Pin
                const s = item.school;
                const isSelected = selectedSchool?.id === s.id;
                const isHovered = hoveredSchoolId === s.id;
                const isPulsing = pulsingSchoolId === s.id;
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
                    className="interactive-control absolute pointer-events-auto cursor-pointer transition-transform duration-100"
                    style={{
                      left: `${item.screenX}px`,
                      top: `${item.screenY}px`,
                      transform: `translate(-50%, -100%) scale(${isSelected || isPulsing ? 1.3 : isHovered ? 1.2 : 1})`,
                      zIndex: isSelected || isPulsing ? 50 : isHovered ? 40 : 20
                    }}
                  >
                    {/* Pulsing Radar Ring Animation when Searched */}
                    {isPulsing && (
                      <div className="absolute -inset-3 -top-6 rounded-full bg-sky-500/40 animate-ping pointer-events-none" />
                    )}
                    {isPulsing && (
                      <div className="absolute -inset-1.5 -top-4 rounded-full bg-emerald-400/60 animate-pulse pointer-events-none" />
                    )}

                    {/* Pin Graphic */}
                    {isSelected || isHovered || isPulsing ? (
                      <div className="flex flex-col items-center">
                        <div className={`px-2.5 py-1 rounded-xl shadow-xl flex items-center gap-1.5 text-white whitespace-nowrap text-xs font-bold border ${
                          isSelected || isPulsing
                            ? 'bg-sky-600 border-white ring-4 ring-sky-300' 
                            : isVerified 
                            ? 'bg-emerald-600 border-emerald-300' 
                            : 'bg-rose-600 border-rose-300'
                        }`}>
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="max-w-[140px] truncate">{s.school_name}</span>
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
                        <div className="w-2 h-1 bg-black/40 rounded-full mx-auto blur-[1px] mt-0.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 3. DEDICATED HIGH-VISIBILITY PINNED ANCHOR (Active Pinned Location) */}
              {pinnedLocation && isPinnedVisible && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pinnedLocation.school) {
                      setSelectedSchoolPin(pinnedLocation.school);
                    }
                  }}
                  className="interactive-control absolute pointer-events-auto cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
                  style={{
                    left: `${pinnedScreenX}px`,
                    top: `${pinnedScreenY}px`,
                    transform: 'translate(-50%, -100%)',
                    zIndex: 60
                  }}
                >
                  {/* Triple Animated Sonar Rings */}
                  <div className="absolute -inset-6 -top-8 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
                  <div className="absolute -inset-3 -top-5 rounded-full bg-indigo-500/30 animate-pulse pointer-events-none" />

                  <div className="relative flex flex-col items-center">
                    {/* Header Banner */}
                    <div className="px-3 py-1 rounded-xl shadow-2xl flex items-center gap-1.5 text-white whitespace-nowrap text-xs font-black bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 border-2 border-white ring-4 ring-amber-300">
                      <span className="text-amber-200">📌</span>
                      <span className="max-w-[160px] truncate">{pinnedLocation.title}</span>
                    </div>

                    {/* 3D Radiant Anchor Pin Head */}
                    <div className="w-8 h-8 rounded-full rounded-br-none -rotate-45 flex items-center justify-center shadow-2xl border-2 border-white bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 mt-0.5">
                      <span className="rotate-45 text-white text-xs font-black">★</span>
                    </div>
                    {/* Shadow */}
                    <div className="w-3 h-1.5 bg-black/50 rounded-full mx-auto blur-[1.5px] mt-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* TOP CONTROLS & FLOATING HUD OVERLAYS                                     */}
          {/* ======================================================================= */}

          {/* Top-Left Search Box */}
          <div className="interactive-control absolute top-3 left-3 z-30 max-w-md w-full">
            <div className="bg-white rounded-xl shadow-xl border-2 border-sky-300 ring-4 ring-sky-50 flex items-center p-1.5 gap-1.5 transition-all">
              <div className="flex items-center flex-1 pl-2">
                <Search className="w-4 h-4 text-sky-600 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleExecuteSearch();
                    }
                  }}
                  placeholder="Search school name, UDISE, district..."
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedSchoolPin(null); }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleExecuteSearch}
                disabled={isSearching}
                className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
              >
                {isSearching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Search</span>
              </button>
            </div>

            {/* Live Search Feedback Toast */}
            {searchStatusMessage && (
              <div className="mt-1.5 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-medium rounded-lg shadow-lg backdrop-blur-xs flex items-center gap-2 animate-in fade-in-50 duration-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="truncate">{searchStatusMessage}</span>
              </div>
            )}
          </div>

          {/* Top-Right Tools: Drop Pin, Layers, Fullscreen, Close */}
          <div className="interactive-control absolute top-3 right-3 z-30 flex items-center gap-2">
            
            {/* Dedicated "Drop Pin" Mode Toggle Button */}
            <button
              onClick={() => {
                setIsDropPinMode(prev => !prev);
                if (!isDropPinMode) {
                  setSearchStatusMessage('📍 Drop Pin Mode: Click anywhere on the map to pin that location.');
                } else {
                  setSearchStatusMessage('');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border ${
                isDropPinMode 
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-white ring-2 ring-amber-300 animate-pulse'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
              title="Click anywhere on the map to pin that location"
            >
              <span>📍</span>
              <span className="hidden sm:inline">{isDropPinMode ? 'Click Map to Pin' : 'Drop Pin'}</span>
            </button>

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
              className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Exit Modal Button */}
            <button
              onClick={onClose}
              className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              title="Close Map View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FLOATING PINNED LOCATION HUD BANNER */}
          {pinnedLocation && (
            <div className="interactive-control absolute top-16 left-3 right-3 sm:left-auto sm:right-3 z-30 sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-amber-400 p-2.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-md font-bold text-sm">
                  📌
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Pinned Location
                    </span>
                    {isLockCameraToPin && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5 inline" /> Locked
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{pinnedLocation.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {pinnedLocation.lat.toFixed(4)}° N, {pinnedLocation.lng.toFixed(4)}° E • {pinnedLocation.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCenterOnPin}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Center Camera on Pinned Location"
                >
                  <Target className="w-3 h-3 text-amber-700" />
                  <span>Center</span>
                </button>

                <button
                  onClick={handleToggleLockPin}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isLockCameraToPin
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                  title={isLockCameraToPin ? 'Unlock Camera' : 'Lock Camera to Pinned Location'}
                >
                  {isLockCameraToPin ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleUnpinLocation}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all cursor-pointer"
                  title="Unpin Location"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* InfoWindow Card (when pin selected) */}
          {selectedSchool && (
            <div className="interactive-control absolute bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[94%] sm:w-[460px] bg-white rounded-2xl shadow-2xl border-2 border-sky-300 p-4 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-start justify-between gap-3 mb-2.5 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                      UDISE: {selectedSchool.udise_code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {selectedSchool.district || 'Tamil Nadu'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">• {selectedSchool.block}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedSchool.is_contact_complete || selectedSchool.official_landline ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedSchool.is_contact_complete || selectedSchool.official_landline ? 'Verified Contacts' : 'Queue Configured'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{selectedSchool.school_name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                    <span className="truncate">{selectedSchool.address}</span>
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedSchoolPin(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Complete 4-Field Official Contact Details Box */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 mb-2.5 space-y-1.5 text-xs">
                {/* Principal / Headmaster Name */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">Principal:</span>
                  <span className="font-semibold text-slate-900 truncate">
                    {selectedSchool.principal_name || <span className="text-slate-400 font-normal italic">Not publicly listed</span>}
                  </span>
                </div>

                {/* Office Telephone */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">Office Phone:</span>
                  {selectedSchool.official_landline || selectedSchool.official_mobile ? (
                    <a
                      href={`tel:${(selectedSchool.official_landline || selectedSchool.official_mobile || '').replace(/\s+/g, '')}`}
                      className="text-indigo-600 font-mono font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-indigo-500" />
                      <span>{selectedSchool.official_landline || selectedSchool.official_mobile}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not available</span>
                  )}
                </div>

                {/* WhatsApp Business */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">WhatsApp:</span>
                  {selectedSchool.official_whatsapp ? (
                    <a
                      href={`https://wa.me/${selectedSchool.official_whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-mono font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>{selectedSchool.official_whatsapp.replace('https://wa.me/', '+')}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not established</span>
                  )}
                </div>

                {/* Official Email */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">Official Email:</span>
                  {selectedSchool.official_email ? (
                    <a
                      href={`mailto:${selectedSchool.official_email}`}
                      className="text-sky-700 font-mono font-semibold hover:underline truncate"
                    >
                      <Mail className="w-3 h-3 text-sky-600 inline mr-1" />
                      {selectedSchool.official_email}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Awaiting verification</span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Pin Location, Google Directions, Inspect Record */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                {/* Pin Location Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (pinnedLocation?.id === selectedSchool.id) {
                      handleUnpinLocation();
                    } else {
                      handlePinSchool(selectedSchool);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    pinnedLocation?.id === selectedSchool.id
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border-slate-200'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pinnedLocation?.id === selectedSchool.id ? '📍 Pinned Anchor' : '📌 Pin Location'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSchool.school_name + ' ' + (selectedSchool.district || 'Tamil Nadu'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      onSelectSchool(selectedSchool);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom-Right Navigation & Zoom Controls */}
          <div className="interactive-control absolute bottom-24 right-4 z-30 flex flex-col gap-2">
            
            {/* Recenter Button */}
            <button
              onClick={handleRecenter}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-lg border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
              title="Re-center Map View"
            >
              <Crosshair className="w-4 h-4 text-sky-600" />
            </button>

            {/* Zoom In & Out */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
              <button
                onClick={() => {
                  if (isLockCameraToPin && pinnedLocation) {
                    setCenterLat(pinnedLocation.lat);
                    setCenterLng(pinnedLocation.lng);
                  }
                  setZoom(prev => Math.min(18, prev + 1));
                }}
                className="p-2.5 text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-all flex items-center justify-center cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (isLockCameraToPin && pinnedLocation) {
                    setCenterLat(pinnedLocation.lat);
                    setCenterLng(pinnedLocation.lng);
                  }
                  setZoom(prev => Math.max(6, prev - 1));
                }}
                className="p-2.5 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom-Left Authentic Google Brand & Copyright */}
          <div className="absolute bottom-20 left-3 z-30 pointer-events-none flex items-center gap-2 text-[10px] text-slate-600 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/60 shadow-xs">
            <span className="font-bold text-slate-800">Google</span>
            <span className="text-slate-400">•</span>
            <span>Map data ©2026 Google • South India (Tamil Nadu & Kerala) UDISE+, Sametham KITE & TNEA Master Register</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM REGION & BLOCK SELECTION BAR                                       */}
        {/* ========================================================================= */}
        <div className="bg-white border-t border-slate-200 p-2 px-4 flex items-center gap-3 overflow-x-auto scrollbar-none z-30 shrink-0">
          
          {/* Mode Switcher Pill */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center shrink-0">
            <button
              onClick={() => {
                setRegionTab('kerala');
                setSelectedRegionId('all_kl');
                setCenterLat(10.8505);
                setCenterLng(76.2711);
                setZoom(7);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                regionTab === 'kerala' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌴 Kerala (14 Districts)
            </button>
            <button
              onClick={() => {
                setRegionTab('tamil_nadu');
                setSelectedRegionId('all_tn');
                setCenterLat(11.1271);
                setCenterLng(78.6569);
                setZoom(7);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                regionTab === 'tamil_nadu' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌿 Tamil Nadu (38 Districts)
            </button>
            <button
              onClick={() => {
                setRegionTab('coimbatore_blocks');
                setSelectedBlock('All Blocks');
                setCenterLat(11.0168);
                setCenterLng(76.9558);
                setZoom(11);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                regionTab === 'coimbatore_blocks' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Coimbatore Blocks (15)
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 shrink-0" />

          {/* Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {regionTab === 'kerala' ? (
              KERALA_REGION_PLACES.map((r) => {
                const isSelected = selectedRegionId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRegion(r)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-emerald-900 text-white' : 'bg-white text-slate-600'
                    }`}>
                      {r.count.toLocaleString()}
                    </span>
                  </button>
                );
              })
            ) : regionTab === 'tamil_nadu' ? (
              TAMIL_NADU_REGION_PLACES.map((r) => {
                const isSelected = selectedRegionId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRegion(r)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-700 text-white shadow-xs ring-2 ring-sky-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-sky-900 text-white' : 'bg-white text-slate-600'
                    }`}>
                      {r.count.toLocaleString()}
                    </span>
                  </button>
                );
              })
            ) : (
              COIMBATORE_BLOCK_PLACES.map((b) => {
                const isSelected = selectedBlock === b.name;
                return (
                  <button
                    key={b.name}
                    onClick={() => handleSelectBlock(b)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
