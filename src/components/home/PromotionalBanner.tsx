"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromotionalBannerProps {
  onClose?: () => void;
}

export function PromotionalBanner({ onClose }: PromotionalBannerProps) {
  return (
    <div className="bg-nipro-red text-white py-3 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 animate-pulse" />
          <span className="font-bold">Special Offer:</span>
        </div>
        <span>Flat 20% off on all Advanced Diploma courses this month!</span>
        <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-nipro-red font-bold text-xs h-7 px-3 mt-1 sm:mt-0 sm:ml-4">
          Claim Now
        </Button>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
