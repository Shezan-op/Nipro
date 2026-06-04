"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Discount } from '@/lib/types';
import Link from 'next/link';
import { SiteSettings } from '@/lib/data-service';

interface PromoPopupProps {
  discount: Discount | null;
  settings?: SiteSettings;
}

export function PromoPopup({ discount, settings }: PromoPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!discount || discount.promo_surface !== 'popup') return;

    // Check session storage to avoid spamming the user on every page load
    const hasSeen = sessionStorage.getItem(`promo_seen_${discount.id}`);
    if (hasSeen) return;

    let timeout: NodeJS.Timeout;

    const showPopup = () => {
      setShow(true);
      sessionStorage.setItem(`promo_seen_${discount.id}`, 'true');
    };

    if (discount.popup_mode === 'delay') {
      timeout = setTimeout(showPopup, 7000);
    } else if (discount.popup_mode === 'exit_intent') {
      const handleMouseOut = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          showPopup();
          document.removeEventListener('mouseout', handleMouseOut);
        }
      };
      document.addEventListener('mouseout', handleMouseOut);
      
      return () => {
        document.removeEventListener('mouseout', handleMouseOut);
      };
    } else {
      // Default fallback
      timeout = setTimeout(showPopup, 3000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [discount]);

  if (!show || !discount) return null;

  const whatsappUrl = `https://wa.me/${settings?.contact?.whatsapp?.replace(/\D/g, '') || settings?.contact?.phone?.replace(/\D/g, '') || '919000000000'}?text=Hi,%20I'm%20interested%20in%20the%20${encodeURIComponent(discount.title)}%20offer!`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[9999] flex items-center justify-center opacity-100 transition-opacity backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-[440px] p-8 text-center relative transform translate-y-0 transition-transform shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 bg-slate-100 border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="inline-block bg-red-600/10 text-red-600 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
          Special Offer
        </div>
        
        <div className="text-4xl mb-3">🎁</div>
        <h3 className="text-2xl font-black tracking-tight mb-3 leading-tight text-slate-900">
          {discount.title}
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {discount.description || 'Chat with us on WhatsApp to confirm the current enrollment offer and batch details.'}
        </p>
        
        <Link 
          href={whatsappUrl}
          target="_blank"
          onClick={() => setShow(false)}
          className="flex items-center justify-center gap-2 bg-[#25d366] text-white w-full py-3.5 rounded-xl font-bold text-sm hover:bg-[#128c7e] transition-colors"
        >
          💬 Chat on WhatsApp
        </Link>
      </div>
    </div>
  );
}
