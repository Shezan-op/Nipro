"use client";

import React, { useState, useEffect } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0) return null;

  // Circle geometry
  const size = 40;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Desktop: Circular indicator on the left */}
      <div
        className="fixed left-5 bottom-8 z-50 hidden md:flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: progress > 1 ? 1 : 0 }}
        aria-hidden="true"
      >
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#d61f26"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
        <span className="absolute text-[9px] font-bold text-slate-500 select-none">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Mobile: Horizontal progress bar at top */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] md:hidden"
        style={{ opacity: progress > 1 ? 1 : 0 }}
        aria-hidden="true"
      >
        <div
          className="h-[3px] bg-nipro-red transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
