"use client";

import React from 'react';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { Clock, Globe, BookOpen, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course, Discount } from '@/lib/types';
import { calculateFinalPrice } from '@/lib/pricing';
import { SiteSettings } from '@/lib/data-service';

interface CourseCardProps {
  course: Course;
  discounts?: Discount[];
  index?: number;
  settings?: SiteSettings | null;
}

export function CourseCard({ course, discounts, index = 0, settings }: CourseCardProps) {
  const basePrice = course.originalPrice || course.price || 0;
  
  // Filter discounts applicable to this course
  const applicableDiscounts = discounts?.filter(d => 
    d.applies_to === 'all' || (d.applies_to === 'selected' && d.course_ids?.includes(course.id))
  ) || [];

  const pricingResult = calculateFinalPrice(basePrice, applicableDiscounts);
  const finalPrice = pricingResult.finalPrice;
  const hasDiscount = pricingResult.hasDiscount;
  const discountPercentage = hasDiscount && basePrice > 0
    ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
    : 0;

  const whatsappNumber = settings?.contact?.whatsapp?.replace(/\D/g, '') || settings?.contact?.phone?.replace(/\D/g, '') || '919000000000';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I am interested in the ${course.name} course.`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full border border-black/[0.04] shadow-sm hover:shadow-md transition-all duration-500 flex flex-col group overflow-hidden bg-white apple-card-3xl hover:-translate-y-1.5">
        <Link href={`/courses/${course.id}`} className="flex flex-col flex-grow">
          <CardHeader className="p-0 overflow-hidden h-52 relative">
            <div className="relative w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {course.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={course.image} 
                  alt={course.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-nipro-red/5 via-white to-nipro-blue/5 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-slate-300 group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              
              {/* Category Badge - Glassmorphism */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-slate-800 shadow-sm border border-black/[0.04]">
                {course.category}
              </div>

              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-nipro-red text-white px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-tight shadow-sm flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Save {discountPercentage}%
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 flex-grow flex flex-col">
            <CardTitle className="text-xl font-bold text-slate-900 leading-snug mb-2.5 group-hover:text-nipro-red transition-colors tracking-tight">
              {course.name}
            </CardTitle>

            <CardDescription className="text-xs text-slate-500 mb-5 line-clamp-3 font-normal leading-relaxed">
              {course.shortDescription}
            </CardDescription>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-slate-100/60 px-3 py-1 rounded-full">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100/60 px-3 py-1 rounded-full">
                <Globe className="h-3 w-3 text-slate-400" />
                <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider">{course.mode}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mt-auto pt-4 border-t border-black/[0.04] flex items-center justify-between">
              <div className="flex flex-col">
                {hasDiscount ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs text-slate-400 line-through decoration-nipro-red/40 font-medium">
                        ₹{basePrice.toLocaleString()}
                      </span>
                      <span className="text-[9px] bg-nipro-red/10 text-nipro-red px-1.5 py-0.5 rounded-full font-bold">
                        -{discountPercentage}%
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {finalPrice ? `₹${finalPrice.toLocaleString()}` : 'Price on Request'}
                  </span>
                )}
              </div>
              
              {hasDiscount && (
                <div className="text-[9px] font-semibold text-nipro-red bg-nipro-red/5 px-2 py-0.5 rounded-full uppercase tracking-wider border border-nipro-red/10">
                  Special Offer
                </div>
              )}
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button asChild className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold h-10 rounded-full transition-all duration-300 text-xs tracking-wide shadow-sm cursor-pointer px-2">
            <Link href={whatsappUrl} target="_blank" className="w-full flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {course.homepage_cta_text || 'Talk to Us'}
              <svg className="w-4 h-4 fill-current hidden sm:block" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.611-.916-2.205-.24-.582-.48-.504-.67-.514-.19-.01-.408-.012-.625-.012-.217 0-.569.082-.867.409-.297.327-1.134 1.109-1.134 2.705 0 1.597 1.163 3.138 1.323 3.354.16.216 2.285 3.49 5.535 4.894.773.333 1.377.532 1.847.681.777.247 1.485.212 2.043.128.621-.093 1.758-.718 2.008-1.411.25-.694.25-1.288.175-1.411-.075-.124-.273-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98 1.001-3.647-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.032c0 2.121.554 4.189 1.605 5.97L0 24l6.12-.16a11.84 11.84 0 005.928 1.592h.005c6.634 0 12.031-5.396 12.035-12.032a11.772 11.772 0 00-3.525-8.435z"/>
              </svg>
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 h-10 rounded-full text-xs font-semibold hover:bg-slate-50 transition-colors">
            <Link href={`/courses/${course.id}`}>
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
