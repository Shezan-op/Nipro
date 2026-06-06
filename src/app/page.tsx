import { Hero } from "@/components/home/Hero";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { PromotionalBanner } from "@/components/home/PromotionalBanner";
import { PromoPopup } from "@/components/home/PromoPopup";
import { TrustGallery } from "@/components/home/TrustGallery";
import { BlogCard } from "@/components/home/BlogCard";
import { FacultySection } from "@/components/home/FacultySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { getCourses, getBlogPosts, getSiteSettings, getDiscounts, getFaculty, getTestimonials, getGovtCertificates, BlogPost, SiteSettings, Discount, Faculty } from "@/lib/data-service";
import { Laptop, ShieldCheck, Globe, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [courses, blogs, settings, discountsData, faculty, testimonials, govtCertificates] = await Promise.all([
    getCourses(),
    getBlogPosts(),
    getSiteSettings(),
    getDiscounts(),
    getFaculty(),
    getTestimonials(),
    getGovtCertificates(),
  ]);

  // Filter only active discounts
  const activeDiscounts = discountsData.filter(d => d.is_active && new Date(d.starts_at) <= new Date() && new Date(d.ends_at) >= new Date());

  // Helper to find discount by surface
  const getDiscountBySurface = (surface: string) => activeDiscounts.find(d => d.promo_surface === surface) || null;
  
  const topBarDiscount = getDiscountBySurface('top_bar');
  const popupDiscount = getDiscountBySurface('popup');
  const softReminderDiscount = getDiscountBySurface('soft_reminder');
  

  const whatsappUrl = `https://wa.me/${(settings as SiteSettings)?.contact?.whatsapp?.replace(/\D/g, '') || (settings as SiteSettings)?.contact?.phone?.replace(/\D/g, '')}`;


  return (
    <div className="flex flex-col">
      {topBarDiscount && <PromotionalBanner discount={topBarDiscount} whatsappUrl={whatsappUrl} />}
      <PromoPopup discount={popupDiscount} settings={settings as SiteSettings} />
      
      <Hero settings={settings as SiteSettings} />
      
      {/* Alumni / Placement Strip */}
      <section className="bg-slate-50 border-b border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Our graduates are hired by top companies:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            <div className="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Building2 className="w-8 h-8 text-nipro-blue" />
              <span className="text-xl font-bold text-slate-800">TCS</span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Building2 className="w-8 h-8 text-nipro-blue" />
              <span className="text-xl font-bold text-slate-800">Wipro</span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Building2 className="w-8 h-8 text-nipro-blue" />
              <span className="text-xl font-bold text-slate-800">Infosys</span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Building2 className="w-8 h-8 text-nipro-blue" />
              <span className="text-xl font-bold text-slate-800">HDFC Bank</span>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Pathway */}
      <section className="py-28 bg-white bg-grid-slate-100 relative">
        {/* Soft Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(31,61,138,0.03),transparent_70%)] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-3">Your Journey to Success</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-nipro-blue tracking-tight leading-tight mb-4">
              A 3-Step Proven Learning Pathway
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              We guide you from absolute beginner to certified professional through a structured, hands-on approach.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            
            <div className="apple-material apple-card-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative z-10 text-center flex flex-col items-center hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-nipro-red/10 flex items-center justify-center text-nipro-red font-bold text-xl mb-6 shadow-md border-4 border-white">1</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Fundamentals</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Master the core concepts with guided instruction. Build a strong foundation before writing a single line of complex code.
              </p>
            </div>

            <div className="apple-material apple-card-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative z-10 text-center flex flex-col items-center hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-nipro-blue/10 flex items-center justify-center text-nipro-blue font-bold text-xl mb-6 shadow-md border-4 border-white">2</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Hands-on Projects</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Apply what you learn by building real-world projects. Every student gets their own computer for uninterrupted practice.
              </p>
            </div>

            <div className="apple-material apple-card-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative z-10 text-center flex flex-col items-center hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl mb-6 shadow-md border-4 border-white">3</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Govt. Certification</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Graduate with an official, government-recognized certificate that opens doors to private and public sector jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Grid */}
      <section className="py-28 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-3">World-Class Infrastructure</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-nipro-blue tracking-tight leading-tight mb-4">
              Learn in a Professional Environment
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
              Our labs are equipped with modern systems, high-speed internet, and a distraction-free environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 aspect-video md:aspect-auto md:h-80 bg-slate-200 apple-card-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                <p className="text-white font-bold text-xl">Main Computer Lab</p>
                <p className="text-slate-200 text-sm">Spacious seating, modern hardware</p>
              </div>
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" alt="Computer Lab" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square md:aspect-auto md:h-80 bg-slate-200 apple-card-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                <p className="text-white font-bold text-lg">One-to-One Focus</p>
              </div>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Student coding" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square md:aspect-auto md:h-80 bg-slate-200 apple-card-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                <p className="text-white font-bold text-lg">Discussion Zones</p>
              </div>
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" alt="Discussion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="md:col-span-2 aspect-video md:aspect-auto md:h-80 bg-slate-200 apple-card-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                <p className="text-white font-bold text-xl">Interactive Sessions</p>
                <p className="text-slate-200 text-sm">Learn with modern projectors and tools</p>
              </div>
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200" alt="Interactive Class" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-10 bg-nipro-blue text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-nipro-red rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="20,000+" label="Students Trained" />
            <StatItem value="10+" label="Years of Excellence" />
            <StatItem value="15+" label="Job-Ready Courses" />
            <StatItem value="2000+" label="Certificates Issued" />
          </div>
        </div>
      </section>

      <FeaturedCourses courses={courses} discounts={activeDiscounts} settings={settings as SiteSettings} />

      {/* Why Choose Us */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-3">Our Promise</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-nipro-blue tracking-tight leading-tight mb-4">
              Why <span className="text-nipro-red">20,000+ Students</span> Trust Nipro
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
              We don&apos;t just teach — we prepare you for the real world. Here&apos;s what makes Nipro different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Laptop className="h-8 w-8 text-nipro-red" />}
              title="Your Own Computer, Every Class"
              description="No sharing, no waiting. Every student gets their own system for hands-on practice throughout the course."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-nipro-red" />}
              title="Govt. Recognised Certification"
              description="Your certificate is officially registered — accepted by government offices, private companies, and higher education."
            />
            <FeatureCard 
              icon={<Globe className="h-8 w-8 text-nipro-red" />}
              title="Learn in Your Language"
              description="Comfortable in Telugu, Hindi, Urdu, or English? We teach in all four, so nothing gets lost in translation."
            />
          </div>
        </div>
      </section>

      <TrustGallery certificates={govtCertificates} />

      {/* Outcome-Driven Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Blog Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-3">Stay Updated</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-nipro-blue tracking-tight">Latest News & Success Stories</h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Discover new courses, celebrate student achievements, and keep up with everything happening at Nipro.
              </p>
            </div>
            <Link href="/news" className="text-nipro-blue font-bold flex items-center group">
              View All Updates
              <div className="ml-3 h-10 w-10 rounded-full border-2 border-nipro-blue flex items-center justify-center group-hover:bg-nipro-blue group-hover:text-white transition-all">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog: BlogPost) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      {/* Soft Reminder Block */}
      {softReminderDiscount && (
        <section className="bg-red-50/50 border-t border-red-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-extrabold text-red-800 mb-4">{softReminderDiscount.title || "Don't Miss Out on This Offer"}</h3>
            <p className="text-red-700/80 mb-8 max-w-lg mx-auto">
              {softReminderDiscount.description || "The current batch is filling up. Claim your discount before it expires."}
            </p>
            <Button asChild className="bg-[#25d366] hover:bg-[#128c7e] text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all">
              <Link href={`https://wa.me/${(settings as SiteSettings)?.contact?.whatsapp?.replace(/\D/g, '') || (settings as SiteSettings)?.contact?.phone?.replace(/\D/g, '')}?text=Hi,%20I'm%20interested%20in%20the%20${encodeURIComponent(softReminderDiscount.title)}%20offer!`} target="_blank">
                💬 Claim Offer on WhatsApp
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Faculty Section */}
      <FacultySection faculty={faculty} />

      {/* Final CTA / WhatsApp Community */}
      <section className="py-24 bg-nipro-blue text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Stay Updated with Nipro</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join our WhatsApp community to get alerts about new courses, upcoming batch dates, and exclusive student offers before anyone else.
          </p>
          <Button asChild className="bg-white hover:bg-slate-50 text-nipro-blue font-bold h-14 px-8 rounded-xl shadow-xl transition-all hover:scale-105">
            <Link href={`https://wa.me/${(settings as SiteSettings)?.contact?.whatsapp?.replace(/\D/g, '') || (settings as SiteSettings)?.contact?.phone?.replace(/\D/g, '')}?text=Hi,%20I%20would%20like%20to%20join%20the%20Nipro%20WhatsApp%20Community!`} target="_blank">
              💬 Join WhatsApp Community
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold mb-1">{value}</div>
      <div className="text-xs uppercase tracking-widest text-blue-200">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="apple-material apple-card-3xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 group">
      <div className="bg-nipro-red/5 w-16 h-16 rounded-[16px] flex items-center justify-center mb-6 group-hover:bg-nipro-red/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-nipro-blue tracking-tight mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
