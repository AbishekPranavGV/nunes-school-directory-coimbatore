'use client';

import React from 'react';

interface NunesLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'glass';
  animated?: boolean;
  className?: string;
}

export const NunesLogo: React.FC<NunesLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'dark',
  animated = true,
  className = ''
}) => {
  // Dimension mappings
  const dimensions = {
    sm: { box: 'w-8 h-8', icon: 32, fontTitle: 'text-xs', fontSub: 'text-[9px]' },
    md: { box: 'w-10 h-10 sm:w-11 sm:h-11', icon: 44, fontTitle: 'text-sm sm:text-base', fontSub: 'text-[10px]' },
    lg: { box: 'w-12 h-12 sm:w-14 sm:h-14', icon: 56, fontTitle: 'text-base sm:text-lg', fontSub: 'text-xs' },
    xl: { box: 'w-16 h-16 sm:w-20 sm:h-20', icon: 80, fontTitle: 'text-xl sm:text-2xl', fontSub: 'text-xs sm:text-sm' },
  }[size];

  const textColor = variant === 'light' 
    ? 'text-white' 
    : 'text-slate-900';

  const subColor = variant === 'light'
    ? 'text-sky-200'
    : 'text-sky-700';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      
      {/* Precision Metrology Company Emblem */}
      <div className={`relative ${dimensions.box} shrink-0 group`}>
        {/* Subtle Ambient Glow Effect */}
        {animated && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse pointer-events-none" />
        )}

        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="nunesHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="nunesGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="nunesEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <filter id="nunesGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Outer Frame (Engineering & Metrology Shield) */}
          <polygon
            points="50,4 90,26 90,74 50,96 10,74 10,26"
            fill="url(#nunesHexGrad)"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Calibrated Precision Ring */}
          <circle
            cx="50"
            cy="50"
            r="37"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* 4 Precision Caliper Gauge Ticks */}
          <line x1="50" y1="8" x2="50" y2="14" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="86" x2="50" y2="92" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="50" x2="20" y2="50" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="50" x2="86" y2="50" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Stylized "N" Monogram (Bold Geometric Engineering Lines) */}
          <path
            d="M 30,70 L 30,30 L 44,53 L 44,70"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 30,30 L 56,70 L 56,30"
            fill="none"
            stroke="url(#nunesEmeraldGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stylized "I" Monogram (Precision Column with Gold Calibration Crown) */}
          <line
            x1="70"
            y1="36"
            x2="70"
            y2="70"
            stroke="#ffffff"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Golden 4-Point Metrology Precision Star (Top of I) */}
          <path
            d="M 70,22 L 72,27 L 77,27 L 73,30 L 75,35 L 70,32 L 65,35 L 67,30 L 63,27 L 68,27 Z"
            fill="url(#nunesGoldGrad)"
          />

          {/* Active Sensor Waveform Pulse at Base */}
          <path
            d="M 34,77 Q 42,73 50,77 T 66,77"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Live Active Status Indicator Dot */}
        {animated && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${dimensions.fontTitle} ${textColor} uppercase leading-none`}>
              Nunes Instruments
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-sky-100 text-sky-800 border border-sky-300 font-mono">
              ESTD 1974
            </span>
          </div>
          <span className={`font-semibold tracking-wider ${dimensions.fontSub} ${subColor} uppercase mt-1 leading-none`}>
            Precision Instruments • Metrology & Campus Safety
          </span>
        </div>
      )}

    </div>
  );
};
