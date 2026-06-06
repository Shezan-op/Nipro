"use client";

import React from 'react';
import { Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Discount } from '@/lib/types';
import Link from 'next/link';

interface PromotionalBannerProps {
  discount: Discount;
  whatsappUrl?: string;
  onClose?: () => void;
}

export function PromotionalBanner({ discount, whatsappUrl, onClose }: PromotionalBannerProps) {
  const ctaLink = discount.cta_link || whatsappUrl || '/contact';
  const ctaText = discount.cta_text || 'Contact Us';
  const isExternal = ctaLink.startsWith('http');

  return (
    <div className="bg-nipro-red text-white py-1.5 sm:py-2.5 relative">
      <div className="container mx-auto px-4 sm:px-12 lg:px-8 flex flex-wrap sm:flex-nowrap items-center justify-center gap-y-1.5 gap-x-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 leading-tight flex-1">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <Megaphone className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse shrink-0" />
            <span className="font-bold text-[13px] sm:text-sm">{discount.title || 'Special Offer'}:</span>
          </div>
          <span className="text-[12px] sm:text-[13px] leading-tight">
            {discount.discount_type === 'percentage' ? `Flat ${discount.discount_value}% off` : 
             discount.discount_type === 'flat' ? `Flat ₹${discount.discount_value} off` : 
             `Just ₹${discount.discount_value}`} {discount.description ? `- ${discount.description}` : 'on selected courses this month!'}
          </span>
        </div>
        <div className="shrink-0 w-full sm:w-auto flex justify-center mt-0.5 sm:mt-0">
          <Button asChild size="sm" className="bg-white hover:bg-slate-100 text-nipro-red font-bold text-[11px] sm:text-xs h-7 sm:h-8 px-4 sm:px-5 rounded-full shadow-sm transition-colors border-0">
            <Link href={ctaLink} target={isExternal ? '_blank' : undefined}>
              {ctaText}
            </Link>
          </Button>
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}
    </div>
  );
}

