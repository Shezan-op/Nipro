import React from 'react';
import { getCourses } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CourseList } from '@/components/courses/CourseList';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();
  const categories = Array.from(new Set(courses.map(c => c.category)));

  return (
    <div className="bg-[#FAFAFB]">
      {/* Header - Minimalist Apple Design */}
      <section className="bg-[#F5F5F7] border-b border-black/[0.04] pt-32 pb-20 relative overflow-hidden">
        {/* Subtle decorative mesh gradients */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-nipro-red/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] bg-nipro-blue/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-nipro-blue/10 text-nipro-blue px-3.5 py-1 rounded-full text-xs font-semibold tracking-tight mb-4">
              Our Curriculum
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight text-slate-950">
              Elevate Your Potential.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal tracking-tight">
              From core computer basics to advanced engineering drafting and professional accounting. Discover the program built for your future.
            </p>
          </div>
        </div>
      </section>

      <CourseList initialCourses={courses} categories={categories} />

      {/* CTA */}
      <section className="py-24 bg-white border-t border-black/[0.04]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-block bg-nipro-red/10 text-nipro-red px-3.5 py-1 rounded-full text-xs font-semibold tracking-tight mb-4">
            Get Guidance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mb-6 tracking-tight">Need help choosing a course?</h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto font-normal text-base sm:text-lg leading-relaxed">
            Our career counselors are here to help you select the best course based on your background and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-nipro-red hover:bg-nipro-red/90 text-white h-12 px-8 rounded-full font-semibold text-base transition-all duration-300">
              <Link href="tel:+919000000000">Call Counselor</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 h-12 px-8 rounded-full font-semibold text-base transition-all duration-300">
              <Link href="https://wa.me/919000000000">Chat on WhatsApp</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
