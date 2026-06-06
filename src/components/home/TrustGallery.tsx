"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GovtCertificate } from '@/lib/types';
import { X, ZoomIn } from 'lucide-react';

export function TrustGallery({ certificates }: { certificates: GovtCertificate[] }) {
  const activeCertificates = certificates.filter(c => c.is_active);
  const [selectedCert, setSelectedCert] = useState<GovtCertificate | null>(null);

  if (activeCertificates.length === 0) return null;

  // Duplicate items for seamless loop if there are few
  const displayItems = activeCertificates.length < 6 
    ? [...activeCertificates, ...activeCertificates, ...activeCertificates] 
    : [...activeCertificates, ...activeCertificates];

  return (
    <section className="py-16 bg-slate-50 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10">
        <div className="text-center">
          <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-2">Verification</h2>
          <h3 className="text-2xl font-bold text-nipro-blue mb-2">Govt. Authorised & Recognized</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Our institute is officially registered and recognized by the government, ensuring your certificates carry value.
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex z-10 py-4 group">
        <div className="flex w-max animate-marquee gap-6 px-3">
          {displayItems.map((cert, index) => (
            <div
              key={`${cert.id}-${index}`}
              onClick={() => setSelectedCert(cert)}
              className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center w-[280px] shrink-0 cursor-pointer hover:shadow-md transition-all hover:border-slate-300 relative group/cert"
            >
              <div className="absolute inset-0 bg-black/0 group-hover/cert:bg-black/5 transition-colors rounded-xl z-10 flex items-center justify-center">
                <div className="opacity-0 group-hover/cert:opacity-100 transition-opacity bg-white text-slate-800 p-2 rounded-full shadow-lg">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
              <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center text-slate-400 text-xs text-center">
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.title} className="w-full h-full object-contain bg-white" />
                ) : (
                  <div className="border-2 border-dashed border-slate-200 w-full h-full flex flex-col items-center justify-center p-2">
                    <span>[ Mock Image ]</span>
                    <span className="mt-1 text-slate-500 font-semibold">{cert.title}</span>
                  </div>
                )}
              </div>
              <h4 className="text-sm font-semibold text-nipro-blue text-center line-clamp-1 w-full px-2">{cert.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div className="relative max-w-5xl w-full h-full max-h-[90vh] flex flex-col items-center justify-center">
            <button 
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-20"
              onClick={() => setSelectedCert(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full p-2 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={selectedCert.image_url} 
                alt={selectedCert.title} 
                className="max-w-full max-h-[85vh] object-contain rounded border border-white/10 shadow-2xl" 
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              <span className="text-white font-semibold">{selectedCert.title}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
