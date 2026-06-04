"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Course, Discount } from '@/lib/types';
import { CourseCard } from '@/components/courses/CourseCard';
import { SiteSettings } from '@/lib/data-service';

interface FeaturedCoursesProps {
  courses: Course[];
  discounts?: Discount[];
  settings?: SiteSettings | null;
}

export function FeaturedCourses({ courses, discounts, settings }: FeaturedCoursesProps) {
  return (
    <section className="bg-gray-50 py-28 relative bg-grid-slate-100">
      {/* Soft Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,31,38,0.02),transparent_70%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-nipro-blue sm:text-4xl lg:text-5xl leading-tight mb-4">
              Explore Our <span className="text-nipro-red">Top Courses</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Pick the skill you want, learn at your pace, and walk out with a recognised certificate. It&apos;s that simple.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-nipro-red font-bold hover:text-nipro-red hover:bg-nipro-red/5">
            <Link href="/courses">
              Browse All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course, index) => (
            <CourseCard key={course.id} course={course} discounts={discounts} index={index} settings={settings} />
          ))}
        </div>
      </div>
    </section>
  );
}
