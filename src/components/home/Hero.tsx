"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteSettings, Discount } from '@/lib/data-service';

export function Hero({ settings, discount }: { settings?: SiteSettings, discount?: Discount | null }) {
  const whatsappUrl = `https://wa.me/${settings?.contact?.whatsapp?.replace(/\D/g, '') || settings?.contact?.phone?.replace(/\D/g, '') || '919000000000'}`;

  return (
    <section className="relative w-full bg-[#0a0a0a]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">

        {/* Mobile: stacked top-to-bottom. Desktop: two columns side by side */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* Logo — shown first on mobile (top), right col on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-end lg:order-2 mb-8 lg:mb-0"
          >
            <Image
              src="/images/Logo.png"
              alt="Nipro Computer Education"
              width={632}
              height={413}
              className="w-[180px] sm:w-[260px] lg:w-[380px] h-auto object-contain"
              priority
            />
          </motion.div>

          {/* Copy — left col on desktop, below logo on mobile */}
          <div className="lg:order-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[12px] text-neutral-500 font-medium mb-4 sm:mb-5 flex flex-wrap gap-2 items-center"
            >
              <span>Govt. Recognised · Since 2014 · Korutla, Telangana</span>
              {discount && (
                <span className="inline-flex items-center bg-nipro-red/20 text-nipro-red px-2 py-0.5 rounded-full font-bold text-[10px] tracking-widest uppercase border border-nipro-red/30">
                  🎉 Special Enrollment Offer
                </span>
              )}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[2rem] sm:text-[2.6rem] lg:text-[3.2rem] font-semibold text-white leading-[1.1] tracking-[-0.03em] mb-4 sm:mb-5"
            >
              Learn the skills<br />
              that actually get<br />
              you <span className="text-[#d61f26]">hired.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-sm mb-7 sm:mb-8"
            >
              Practical computer training in Tally, AutoCAD, DTP, and more —
              with real certification that employers trust.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link
                href={whatsappUrl}
                className="inline-flex items-center justify-center gap-2 bg-[#d61f26] hover:bg-[#b91c22] text-white h-11 px-6 text-sm font-semibold rounded-xl transition-colors w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                Enquire Now
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 text-neutral-400 hover:text-white h-11 px-6 text-sm font-medium rounded-xl transition-colors group w-full sm:w-auto"
              >
                Browse Courses
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>
            </motion.div>

            {/* Stats — horizontal pill row, not a grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-0 border-t border-white/[0.08] pt-6"
            >
              <div className="flex-1 text-center sm:text-left">
                <div className="text-base font-semibold text-white">20k+</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Students</div>
              </div>
              <div className="w-px h-8 bg-white/[0.08]" />
              <div className="flex-1 text-center">
                <div className="text-base font-semibold text-white">15+</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Courses</div>
              </div>
              <div className="w-px h-8 bg-white/[0.08]" />
              <div className="flex-1 text-center sm:text-right">
                <div className="text-base font-semibold text-white">10 yrs</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Experience</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
