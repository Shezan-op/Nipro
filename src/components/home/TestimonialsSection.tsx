"use client";

import React, { useState } from 'react';
import { Testimonial } from '@/lib/types';
import { Sparkles, X } from 'lucide-react';

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const activeTestimonials = testimonials.filter(t => t.is_active);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  if (activeTestimonials.length === 0) return null;

  // Duplicate items for seamless loop if there are few
  const displayItems = activeTestimonials.length < 6 
    ? [...activeTestimonials, ...activeTestimonials, ...activeTestimonials] 
    : [...activeTestimonials, ...activeTestimonials];

  return (
    <section className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden bg-grid-white-5">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
      
      {/* Decorative BG / Glows */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
         <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-nipro-red rounded-full blur-[150px]" />
         <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-blue-650 rounded-full blur-[120px]" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        <div className="text-center">
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">Real Outcomes</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Don&apos;t just take our word for it
          </h3>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg tracking-tight">
            Our graduates are working in leading companies across India. Hear their stories.
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex z-10 py-4 group">
        <div className="flex w-max animate-marquee gap-6 px-3">
          {displayItems.map((t, i) => {
            const cleanText = t.testimony.replace(/\n\s*\n/g, '\n').trim();
            const isLong = cleanText.length > 150 || cleanText.split('\n').length > 4;
            const shortText = isLong ? cleanText.substring(0, 150) + '...' : cleanText;

            return (
              <div 
                key={`${t.id}-${i}`} 
                className="apple-material-dark apple-card-3xl p-5 md:p-8 flex flex-col justify-between shadow-lg w-[300px] md:w-[400px] shrink-0 border border-white/5 cursor-pointer hover:border-white/20 transition-colors"
                onClick={() => isLong && setSelectedTestimonial(t)}
              >
                <div>
                  <div className="flex text-amber-400 mb-4 md:mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Sparkles key={j} className="w-3.5 h-3.5 md:w-5 md:h-5 fill-current" />
                    ))}
                  </div>
                  <div className="text-slate-200 text-sm md:text-lg leading-relaxed mb-6 italic font-medium">
                    <p className="whitespace-pre-wrap line-clamp-5 md:line-clamp-none">
                      &quot;{shortText}&quot;
                    </p>
                    {isLong && (
                      <span className="text-red-400 font-bold hover:underline mt-2 inline-block text-xs md:text-sm">Read More</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0 bg-slate-800 flex items-center justify-center font-bold text-lg md:text-xl text-white">
                    {t.image_url ? (
                      <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      t.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white tracking-tight">{t.name}</h4>
                    <p className="text-xs md:text-sm text-slate-400">{t.role_course}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for long testimonials */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTestimonial(null)}>
          <div 
            className="apple-material-dark apple-card-3xl max-w-2xl w-full p-8 relative border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
              onClick={() => setSelectedTestimonial(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-slate-800 flex items-center justify-center font-bold text-2xl text-white">
                {selectedTestimonial.image_url ? (
                  <img src={selectedTestimonial.image_url} alt={selectedTestimonial.name} className="w-full h-full object-cover" />
                ) : (
                  selectedTestimonial.name.charAt(0)
                )}
              </div>
              <div>
                <h4 className="font-bold text-xl text-white tracking-tight">{selectedTestimonial.name}</h4>
                <p className="text-red-400 font-medium">{selectedTestimonial.role_course}</p>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-slate-200 text-lg leading-relaxed italic font-medium whitespace-pre-wrap">
                &quot;{selectedTestimonial.testimony}&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
