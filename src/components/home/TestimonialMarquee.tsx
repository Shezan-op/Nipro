"use client";

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rehan Ahmed',
    image: '/images/Rehan.png',
    course: 'Tally Prime with GST',
    quote: 'Got placed within 2 months of completing my course. The practical training was outstanding.',
    rating: 5,
  },
  {
    name: 'Faizan Khan',
    image: '/images/Faizan.png',
    course: 'AutoCAD 2D & 3D',
    quote: 'The best computer institute in Korutla. My drafting skills improved dramatically.',
    rating: 5,
  },
  {
    name: 'Farhan Ali',
    image: '/images/Farhan.png',
    course: 'MS Office Professional',
    quote: 'Multilingual support made learning easy. I now work confidently with spreadsheets daily.',
    rating: 5,
  },
  {
    name: 'Shezan Baig',
    image: '/images/Shezan.png',
    course: 'Adobe Photoshop',
    quote: 'From zero design knowledge to freelancing — Nipro made it possible.',
    rating: 5,
  },
  {
    name: 'Zaid Mohammed',
    image: '/images/Zaid.png',
    course: 'Hardware & Networking',
    quote: 'The hands-on lab sessions gave me real-world repair skills. Highly recommended.',
    rating: 4,
  },
];

// Double the array for seamless infinite loop
const doubledTestimonials = [...testimonials, ...testimonials];

export function TestimonialMarquee() {
  return (
    <section className="py-28 bg-white overflow-hidden relative bg-grid-slate-100">
      {/* Decorative background element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,31,38,0.04),transparent_70%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-4">Success Stories</h2>
          <h3 className="text-4xl md:text-6xl font-extrabold text-nipro-blue tracking-tight leading-tight">
            THE <span className="text-nipro-red">NIPRO</span> IMPACT
          </h3>
          <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Join the ranks of our successful alumni who transformed their passion into professional careers in Korutla.
          </p>
        </div>
      </div>

      {/* Marquee container */}
      <div className="relative z-10">
        {/* Deep Edge Fades for Cinematic Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused] py-10 w-max">
          {doubledTestimonials.map((testimonial, idx) => (
            <TestimonialCard key={`${testimonial.name}-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[340px] bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group ring-1 ring-slate-900/5 hover:-translate-y-1">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-gray-600 leading-relaxed mb-6 min-h-[60px]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-nipro-red/20 group-hover:ring-nipro-red/40 transition-all">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-sm font-bold text-nipro-blue">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.course}</div>
        </div>
      </div>
    </div>
  );
}
