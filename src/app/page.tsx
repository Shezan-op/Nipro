import { Hero } from "@/components/home/Hero";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { CertificateSearch } from "@/components/home/CertificateSearch";
import { TestimonialMarquee } from "@/components/home/TestimonialMarquee";
import { PromotionalBanner } from "@/components/home/PromotionalBanner";
import { TrustGallery } from "@/components/home/TrustGallery";
import { BlogCard } from "@/components/home/BlogCard";
import { getCourses, getBlogPosts, BlogPost } from "@/lib/data-service";
import { Laptop, ShieldCheck, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const courses = await getCourses();
  const blogs = await getBlogPosts();
  
  // Hidden Offer Logic
  const isOfferActive = true;

  return (
    <div className="flex flex-col">
      {isOfferActive && <PromotionalBanner />}
      <Hero />
      
      {/* Stats Banner */}
      <section className="py-10 bg-nipro-blue text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-nipro-red rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="1000+" label="Students Trained" />
            <StatItem value="10+" label="Years of Excellence" />
            <StatItem value="15+" label="Job-Ready Courses" />
            <StatItem value="2000+" label="Certificates Issued" />
          </div>
        </div>
      </section>

      <FeaturedCourses courses={courses} />

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-3">Our Promise</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-nipro-blue mb-4">
              Why <span className="text-nipro-red">1000+ Students</span> Trust Nipro
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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

      <TrustGallery />

      <CertificateSearch />

      {/* Testimonials */}
      <TestimonialMarquee />

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

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-nipro-red via-red-600 to-red-700 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-black/10 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold mb-4">
                <Sparkles className="h-4 w-4" />
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Claim Your Spot — 50% Off First Course</h2>
              <p className="text-red-50 text-lg opacity-90">
                Join Korutla&apos;s most trusted computer education institute. No experience needed — just bring your ambition.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button asChild className="bg-white text-nipro-red font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all h-14 whitespace-nowrap active:scale-95">
                <Link href="/courses">Start Learning Today</Link>
              </Button>
              <Button asChild className="bg-nipro-blue text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-nipro-blue/90 transition-all h-14 whitespace-nowrap active:scale-95">
                <Link href="/contact">Talk to Us First</Link>
              </Button>
            </div>
          </div>
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
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="bg-nipro-red/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-nipro-red/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-nipro-blue mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
