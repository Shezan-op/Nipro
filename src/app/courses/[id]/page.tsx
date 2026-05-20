import React from 'react';
import { getCourseById } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import { Clock, Globe, ShieldCheck, CheckCircle2, ChevronLeft, Phone, Tag, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link href="/courses" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-nipro-red mb-8 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to all courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="mb-8">
              <div className="inline-block px-4 py-1 bg-nipro-red/10 text-nipro-red text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                {course.category}
              </div>
              <h1 className="text-4xl font-extrabold text-nipro-blue sm:text-5xl mb-6">
                {course.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {course.shortDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <Clock className="h-6 w-6 text-nipro-red mb-4" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Duration</div>
                <div className="text-lg font-bold text-nipro-blue">{course.duration}</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <Globe className="h-6 w-6 text-nipro-red mb-4" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Learning Mode</div>
                <div className="text-lg font-bold text-nipro-blue">{course.mode}</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <ShieldCheck className="h-6 w-6 text-nipro-red mb-4" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Certification</div>
                <div className="text-lg font-bold text-nipro-blue">{course.certification ? 'Included' : 'On Request'}</div>
              </div>
            </div>

            <div className="prose prose-blue max-w-none mb-12">
              <h2 className="text-2xl font-bold text-nipro-blue mb-6">Course Curriculum Overview</h2>
              <div className="space-y-4">
                {[
                  "Fundamentals and concepts",
                  "Hands-on practical sessions",
                  "Industry standard best practices",
                  "Real-world project implementation",
                  "Examination and Assessment"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-nipro-red/20 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-nipro-red/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-nipro-red" />
                    </div>
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-gradient-to-br from-nipro-blue via-nipro-blue to-nipro-red/90 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/10 backdrop-blur-md">
                {/* Background decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-nipro-red/20 rounded-full blur-xl" />

                <h3 className="text-xl font-bold mb-6 relative z-10">Enrollment Details</h3>
                <div className="space-y-6 mb-8 relative z-10">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-200" />
                      <span className="text-blue-200 text-sm">Course Fee</span>
                    </div>
                    <div className="text-right">
                      {course.originalPrice && course.price && course.originalPrice > course.price ? (
                        <>
                          <div className="text-xs text-blue-300 line-through opacity-60">₹{course.originalPrice.toLocaleString()}/-</div>
                          <div className="text-2xl font-black text-white">₹{course.price.toLocaleString()}/-</div>
                        </>
                      ) : (
                        <div className="text-2xl font-black text-white">
                          {course.price ? `₹${course.price.toLocaleString()}/-` : 'Price on Request'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-blue-200" />
                      <span className="text-blue-200 text-sm">Status</span>
                    </div>
                    <span className="font-bold text-green-400">Open</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-200" />
                      <span className="text-blue-200 text-sm">Next Batch</span>
                    </div>
                    <span className="font-bold">Monday, Next Week</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-200" />
                      <span className="text-blue-200 text-sm">Course Type</span>
                    </div>
                    <span className="font-bold">Job-Ready</span>
                  </div>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <Button asChild className="w-full h-14 bg-nipro-red hover:bg-nipro-red/90 font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
                    <Link href="/contact">Enroll Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-14 bg-transparent border-2 border-white/20 hover:bg-white/10 font-bold text-lg rounded-xl transition-all active:scale-95">
                    <a href="tel:+919000000000">
                      <Phone className="mr-2 h-5 w-5" />
                      Enquire via Phone
                    </a>
                  </Button>
                </div>
                
                <p className="mt-6 text-center text-xs text-blue-300 relative z-10">
                  Prefer messaging? <Link href="https://wa.me/919000000000" className="text-white font-bold underline">WhatsApp us</Link>
                </p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h4 className="font-bold text-nipro-blue mb-4">Location Info</h4>
                <div className="flex gap-4 items-start mb-6">
                   <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Globe className="h-5 w-5 text-nipro-red" />
                   </div>
                   <div className="text-sm">
                      <div className="font-bold text-nipro-blue">Main Campus</div>
                      <div className="text-muted-foreground">Korutla, Jagtial, Telangana</div>
                   </div>
                </div>
                <Link href="/contact" className="text-sm font-bold text-nipro-red hover:underline">
                  Get directions on map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
