"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Globe, BookOpen, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const hasDiscount = course.originalPrice && course.originalPrice > (course.price || 0);
  const discountPercentage = hasDiscount 
    ? Math.round(((course.originalPrice! - course.price!) / course.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col group overflow-hidden bg-white/80 backdrop-blur-sm hover:-translate-y-2 ring-1 ring-slate-900/5">
        <CardHeader className="p-0 overflow-hidden h-56 relative">
          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
            {course.image ? (
              <Image 
                src={course.image} 
                alt={course.name} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-nipro-red/10 via-white to-nipro-blue/10 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-nipro-blue/20 group-hover:scale-110 transition-transform duration-500" />
              </div>
            )}
            
            {/* Glassmorphism Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-nipro-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Category Badge - Glassmorphism */}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-nipro-blue shadow-sm border border-white/50">
              {course.category}
            </div>

            {/* Discount Badge - High Impact */}
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-nipro-red text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(214,31,38,0.4)] flex items-center gap-1.5 animate-bounce">
                <Tag className="h-3.5 w-3.5" />
                Save {discountPercentage}%
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-7 flex-grow flex flex-col">
          <CardTitle className="text-2xl font-black text-nipro-blue leading-[1.1] mb-3 group-hover:text-nipro-red transition-colors tracking-tighter">
            {course.name}
          </CardTitle>

          <CardDescription className="text-sm text-slate-600 mb-6 line-clamp-3 font-medium leading-relaxed">
            {course.shortDescription}
          </CardDescription>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-nipro-red" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
              <Globe className="h-3.5 w-3.5 text-nipro-red" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{course.mode}</span>
            </div>
          </div>

          {/* Pricing Section - High Conversion UI */}
          <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-slate-400 line-through decoration-nipro-red/50 font-bold">
                      ₹{course.originalPrice?.toLocaleString()}/-
                    </span>
                    <span className="text-[10px] bg-nipro-red/10 text-nipro-red px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                      -{discountPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-nipro-blue tracking-tighter">
                      ₹{course.price?.toLocaleString()}/-
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-3xl font-black text-nipro-blue tracking-tighter">
                  {course.price ? `₹${course.price.toLocaleString()}/-` : 'Price on Request'}
                </span>
              )}
            </div>
            
            {hasDiscount && (
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[9px] font-black text-nipro-red bg-nipro-red/5 px-2 py-1 rounded-full uppercase tracking-widest border border-nipro-red/20"
              >
                Limited Offer
              </motion.div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-7 pt-0">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.97] text-sm uppercase tracking-wider">
            <Link href={`https://wa.me/919000000000?text=Hi, I am interested in the ${course.name} course.`} target="_blank" className="w-full flex items-center justify-center gap-2">
              Talk to Us on WhatsApp
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.611-.916-2.205-.24-.582-.48-.504-.67-.514-.19-.01-.408-.012-.625-.012-.217 0-.569.082-.867.409-.297.327-1.134 1.109-1.134 2.705 0 1.597 1.163 3.138 1.323 3.354.16.216 2.285 3.49 5.535 4.894.773.333 1.377.532 1.847.681.777.247 1.485.212 2.043.128.621-.093 1.758-.718 2.008-1.411.25-.694.25-1.288.175-1.411-.075-.124-.273-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98 1.001-3.647-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.032c0 2.121.554 4.189 1.605 5.97L0 24l6.12-.16a11.84 11.84 0 005.928 1.592h.005c6.634 0 12.031-5.396 12.035-12.032a11.772 11.772 0 00-3.525-8.435z"/>
              </svg>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

}
