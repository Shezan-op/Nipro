import React from 'react';
import { getCourseById, getSiteSettings, SiteSettings, getDiscounts } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, MonitorPlay, Award, ArrowLeft, CheckCircle2, Star } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [course, settings, discounts] = await Promise.all([
    getCourseById(id),
    getSiteSettings(),
    getDiscounts()
  ]);

  if (!course) {
    notFound();
  }

  const activeDiscounts = discounts.filter(d => d.is_active && new Date(d.starts_at) <= new Date() && new Date(d.ends_at) >= new Date());
  
  // Find applicable discount
  let finalPrice = course.price;
  let activeDiscount = null;
  
  if (course.price) {
    activeDiscount = activeDiscounts.find(d => 
      (d.applies_to === 'all' || (d.applies_to === 'selected' && d.course_ids.includes(course.id))) && 
      course.price! >= d.min_floor_price
    );

    if (activeDiscount) {
      if (activeDiscount.discount_type === 'percentage') {
        finalPrice = course.price - (course.price * (activeDiscount.discount_value / 100));
      } else if (activeDiscount.discount_type === 'flat') {
        finalPrice = Math.max(0, course.price - activeDiscount.discount_value);
      } else if (activeDiscount.discount_type === 'fixed') {
        finalPrice = activeDiscount.discount_value;
      }
    }
  }

  const whatsappUrl = `https://wa.me/${(settings as SiteSettings)?.contact?.whatsapp?.replace(/\D/g, '') || (settings as SiteSettings)?.contact?.phone?.replace(/\D/g, '')}?text=Hi,%20I'm%20interested%20in%20the%20${encodeURIComponent(course.name)}%20course.`;

  return (
    <div className="bg-[#FAFAFB] min-h-screen">
      {/* Header / Breadcrumb */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <Link href="/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-nipro-blue transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 mb-16">
        <div className="bg-white rounded-[2rem] border border-black/[0.04] shadow-sm overflow-hidden flex flex-col lg:flex-row">
          <div className="p-8 md:p-12 lg:w-[60%] flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block bg-nipro-blue/10 text-nipro-blue px-3 py-1 rounded-full text-xs font-bold tracking-tight uppercase">
                {course.category}
              </span>
              {course.rating && (
                <span className="inline-flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold tracking-tight">
                  <Star className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-500" />
                  {course.rating} Rating
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 mb-6 tracking-tight leading-[1.1]">
              {course.name}
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
              {course.description || course.shortDescription}
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center text-slate-700 font-medium">
                <Clock className="w-5 h-5 text-nipro-red mr-3" />
                {course.duration}
              </div>
              <div className="flex items-center text-slate-700 font-medium">
                <MonitorPlay className="w-5 h-5 text-nipro-red mr-3" />
                {course.mode} Learning
              </div>
              {course.certification && (
                <div className="flex items-center text-slate-700 font-medium">
                  <Award className="w-5 h-5 text-nipro-red mr-3" />
                  Govt. Certificate
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                {course.price ? (
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-extrabold text-slate-950">₹{finalPrice?.toLocaleString('en-IN')}</span>
                    {activeDiscount && (
                      <span className="text-lg text-slate-400 line-through font-medium mb-1">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    )}
                    {(!activeDiscount && course.originalPrice && course.originalPrice > course.price) && (
                      <span className="text-lg text-slate-400 line-through font-medium mb-1">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-2xl font-extrabold text-slate-950">Price varies</span>
                )}
                {activeDiscount && (
                  <div className="text-xs font-bold text-green-600 mt-1 uppercase tracking-wider">
                    {activeDiscount.title} Applied
                  </div>
                )}
              </div>
              <Button asChild className="bg-nipro-red hover:bg-nipro-red/90 text-white h-12 px-8 rounded-full font-bold text-sm w-full sm:w-auto shadow-sm transition-all duration-300">
                <Link href={whatsappUrl} target="_blank">
                  {course.detail_cta_text || 'Enroll Now'}
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Image Side */}
          <div className="lg:w-[40%] bg-slate-100 relative min-h-[300px] lg:min-h-auto flex items-center justify-center p-8">
            {course.image ? (
              <img 
                src={course.image} 
                alt={course.name} 
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <div className="text-center z-10">
                <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <MonitorPlay className="w-10 h-10 text-nipro-blue" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">NIPRO COURSE</h3>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Course Details Content */}
      <section className="container mx-auto px-4 md:px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-950 mb-6 tracking-tight">Course Overview</h2>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-black/[0.04] shadow-sm">
            {course.long_description ? (
              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-extrabold prose-a:text-nipro-blue prose-img:rounded-xl">
                <div dangerouslySetInnerHTML={{ __html: course.long_description.replace(/\n/g, '<br/>') }} />
              </div>
            ) : (
              <div className="text-slate-600 leading-relaxed text-lg">
                <p className="mb-6">{course.description || course.shortDescription}</p>
                <div className="space-y-4 mt-8">
                  <h3 className="font-bold text-slate-900 text-xl">What you'll learn:</h3>
                  <ul className="space-y-3">
                    {[
                      'Comprehensive understanding of core concepts',
                      'Hands-on practical assignments and projects',
                      'Industry-standard tools and workflows',
                      'Preparation for real-world scenarios'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
