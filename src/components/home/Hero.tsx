"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ShieldCheck, Award, Users, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const heroSlides = [
  {
    image: '/images/carousel-image1.webp',
    alt: 'Students learning computer skills at Nipro',
  },
  {
    image: '/images/carousel-image2.webp',
    alt: 'Hands-on practical training sessions',
  },
  {
    image: '/images/carousel-image3.webp',
    alt: 'Government recognised certification ceremony',
  },
  {
    image: '/images/carousel-image4.webp',
    alt: 'Modern computer lab facilities',
  },
  {
    image: '/images/carousel-image5.webp',
    alt: 'Career-ready graduates at Nipro',
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[95vh] min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel with Cinematic Transitions */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[current].image}
              alt={heroSlides[current].alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-nipro-blue via-nipro-blue/20 to-nipro-blue/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Layer */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center">
        {/* Centered Logo - Premium Placement */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative w-[320px] sm:w-[500px] aspect-[652/413]">
            <Image
              src="/images/Logo.png"
              alt="Nipro Computer Education"
              fill
              className="object-contain drop-shadow-[0_0_40px_rgba(214,31,38,0.4)]"
              priority
            />
          </div>
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
            className="text-lg sm:text-2xl text-white/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Empowering 1000+ students in Korutla with job-ready skills in Design, Accounting, and IT. Get certified by the experts.
          </motion.p>

          {/* Conversion-Focused CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button asChild size="lg" className="bg-nipro-red hover:bg-red-700 text-white h-16 px-12 text-xl font-black rounded-2xl shadow-[0_20px_50px_rgba(214,31,38,0.4)] transition-all hover:scale-105 active:scale-95">
              <Link href="https://wa.me/919000000000">
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
          <TrustBadge icon={<Users className="h-6 w-6" />} value="1000+" label="Alumni Success Stories" />
          <TrustBadge icon={<Award className="h-6 w-6" />} value="15+" label="Industry-Standard Modules" />
          <TrustBadge icon={<ShieldCheck className="h-6 w-6" />} value="100%" label="Verified Certifications" />
        </motion.div>
      </div>

        {/* Cinematic Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-20">
          <motion.div 
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full bg-nipro-red shadow-[0_0_15px_#D61F26]"
          />
        </div>

        {/* Slide Navigation - Subtle */}
        <div className="absolute bottom-10 right-10 z-20 hidden lg:flex items-center gap-4">
          <div className="flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === current ? 'w-12 bg-nipro-red' : 'w-4 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2 ml-4">
            <button onClick={prev} className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={next} className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
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
