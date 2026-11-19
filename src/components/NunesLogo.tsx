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
  // Dimension mappings for official logo image
  const imgHeight = {
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-16'
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Corporate Logo Image */}
      <div className="relative shrink-0 transition-transform duration-200 hover:scale-102 bg-white px-2 py-1 rounded-xl shadow-xs border border-slate-200/80">
        <img
          src="/images/nunes_logo_clean.png"
          alt="NUNES INSTRUMENTS - ISO 9001 : 2008 Certified Company"
          className={`${imgHeight} w-auto object-contain`}
        />
        {animated && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
          </span>
        )}
      </div>

      {showText && (
        <div className="hidden lg:flex flex-col border-l border-slate-200/60 pl-2.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${variant === 'light' ? 'text-sky-200' : 'text-slate-600'}`}>
            Precision Instruments
          </span>
          <span className={`text-[9px] font-medium tracking-wide ${variant === 'light' ? 'text-slate-300' : 'text-slate-500'}`}>
            Coimbatore, Tamil Nadu
          </span>
        </div>
      )}
    </div>
  );
};
