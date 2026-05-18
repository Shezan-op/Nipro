import { getBlogPosts } from "@/lib/data-service";
import { BlogCard } from "@/components/home/BlogCard";
import { GraduationCap, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewsPage() {
  const allBlogs = await getBlogPosts();
  const publishedBlogs = allBlogs.filter(blog => blog.status === 'Published');

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-28 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 md:mb-16">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-nipro-red transition-all mb-8 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-nipro-blue tracking-tight mb-4 md:mb-6 leading-[1.1]">
              Latest Updates & <span className="text-nipro-red italic">Stories</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Discover what&apos;s happening at Nipro Computer Education&mdash;from student achievements to new course launches and campus events.
            </p>
          </div>
        </div>

        {publishedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-nipro-blue mb-2">No updates yet</h2>
            <p className="text-muted-foreground">Check back later for news and success stories.</p>
          </div>
        )}

        <section className="mt-20 md:mt-32 bg-nipro-blue rounded-[2.5rem] p-8 md:p-16 lg:p-20 text-white overflow-hidden relative shadow-2xl shadow-nipro-blue/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-nipro-red/10 rounded-full -ml-48 -mb-48 blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                Want to be our next <span className="text-nipro-red">success story?</span>
              </h2>
              <p className="text-blue-100/80 text-lg md:text-xl mb-10">
                Join our expert-led courses and build the high-demand skills you need for a rewarding career in technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/courses" className="bg-white text-nipro-blue font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center">
                  Explore Courses
                </Link>
                <Link href="/contact" className="bg-nipro-red text-white font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-inner">
                <div className="flex items-center gap-5 mb-8">
                  <div className="bg-nipro-red h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shadow-nipro-red/20 rotate-3">
                    <GraduationCap className="h-8 w-8 text-white -rotate-3" />
                  </div>
                  <div>
                    <div className="text-xs font-bold opacity-60 uppercase tracking-[0.2em] mb-1">Next Batch</div>
                    <div className="text-xl md:text-2xl font-black">Enrollment Open</div>
                  </div>
                </div>
                <div className="space-y-5">
                  {[
                    "Limited seats per batch",
                    "Flexible timing available",
                    "Hands-on practical training"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="h-2 w-2 rounded-full bg-nipro-red group-hover:scale-150 transition-transform" />
                      <span className="text-sm md:text-base font-medium opacity-90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
