"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShieldCheck, Award, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { SiteSettings } from '@/lib/data-service';

export function Hero({ settings }: { settings?: SiteSettings }) {
  const whatsappUrl = `https://wa.me/${settings?.contact?.whatsapp?.replace(/\D/g, '') || '919000000000'}`;
  return (
    <section className="relative w-full py-16 md:py-24 min-h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-950 bg-gradient-to-b from-slate-900 to-slate-950 bg-grid-white-5">
      {/* Soft Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,31,38,0.08),transparent_70%)] pointer-events-none" />

      {/* Content Layer */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        {/* Centered Logo - Premium Placement */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Image
            src="/images/Logo.png"
            alt="Nipro Computer Education"
            width={632}
            height={413}
            className="w-[320px] sm:w-[500px] h-auto object-contain drop-shadow-[0_0_40px_rgba(214,31,38,0.4)] animate-fade-in"
            priority
          />
        </motion.div>

        {/* Messaging Area */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Official Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-6 py-2.5 text-xs sm:text-sm font-bold text-white mb-8 border border-white/20 shadow-2xl"
          >
            <ShieldCheck className="h-4 w-4 text-green-400" />
            <span className="tracking-widest uppercase">Official Govt. Recognised Training Centre</span>
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Impactful Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl"
          >
            MASTER JOB-READY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nipro-red via-red-500 to-red-600 drop-shadow-[0_0_30px_rgba(214,31,38,0.5)]">
              COMPUTER SKILLS
            </span>
          </motion.h1>

          {/* Benefits-Oriented Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-medium leading-relaxed tracking-tight"
          >
            Empowering 20,000+ students in Korutla with job-ready skills in Design, Accounting, and IT. Get certified by the experts.
          </motion.p>

          {/* Conversion-Focused CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button asChild size="lg" className="bg-nipro-red hover:bg-red-700 text-white h-16 px-12 text-xl font-black rounded-2xl shadow-[0_20px_50px_rgba(214,31,38,0.4)] transition-all hover:scale-105 active:scale-95">
              <Link href={whatsappUrl}>
                <MessageCircle className="mr-3 h-6 w-6 text-white" />
                Enquire on WhatsApp
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/5 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 h-16 px-12 text-xl font-black rounded-2xl transition-all hover:scale-105 active:scale-95">
              <Link href="/courses">
                <Sparkles className="mr-3 h-6 w-6 text-nipro-red" />
                Explore Courses
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Bottom Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl w-full border-t border-white/10 pt-10"
        >
          <TrustBadge icon={<Users className="h-6 w-6" />} value="20,000+" label="Alumni Success Stories" />
          <TrustBadge icon={<Award className="h-6 w-6" />} value="15+" label="Industry-Standard Modules" />
          <TrustBadge icon={<ShieldCheck className="h-6 w-6" />} value="100%" label="Verified Certifications" />
        </motion.div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-nipro-red">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-[11px] text-white/60 uppercase tracking-wider font-medium">{label}</div>
      </div>
    </div>
  );
}
