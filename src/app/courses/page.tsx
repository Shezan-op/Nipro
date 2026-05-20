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
    <div className="bg-white">
      {/* Header - Premium Visuals */}
      <section className="bg-nipro-blue pt-40 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-nipro-red/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter">
                ELEVATE YOUR <br />
                <span className="text-nipro-red italic underline decoration-white/10 underline-offset-8">POTENTIAL</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100/90 leading-relaxed max-w-2xl font-medium">
                From core computer basics to advanced engineering drafting and professional accounting. Discover the program built for your future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CourseList initialCourses={courses} categories={categories} />

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-nipro-blue mb-6">Need help choosing a course?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Our career counselors are here to help you select the best course based on your background and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-nipro-red h-14 px-8 font-bold text-lg">
              <Link href="tel:+919000000000">Call Counselor</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 font-bold text-lg border-2 border-nipro-blue text-nipro-blue">
              <Link href="https://wa.me/919000000000">Chat on WhatsApp</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
