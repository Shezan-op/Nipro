import { getBlog } from "@/lib/actions";
import { Calendar, ArrowLeft, Share2, Globe, MessageCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog || blog.status !== 'Published') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24 pb-12 md:pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/news" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-nipro-red transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to News
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-nipro-red/10 text-nipro-red text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Announcement
              </span>
              <div className="h-1 w-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                <Calendar className="h-4 w-4" />
                {formatDate(blog.createdAt)}
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-nipro-blue tracking-tight leading-[1.15] md:leading-[1.1] mb-8">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-nipro-blue flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div>
                  <div className="text-sm font-bold text-nipro-blue">Nipro Editorial</div>
                  <div className="text-xs text-muted-foreground">Admin Team</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-muted-foreground">
                  <Globe className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="relative aspect-video md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden mb-8 md:mb-12 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={blog.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none prose-headings:text-nipro-blue prose-p:text-gray-600 prose-a:text-nipro-red hover:prose-a:underline">
            <div className="whitespace-pre-wrap leading-relaxed text-lg text-gray-700">
              {blog.content}
            </div>
          </div>

          <footer className="mt-12 md:mt-20 pt-10 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-6 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-nipro-blue mb-2">Spread the word</h3>
                  <p className="text-muted-foreground text-sm md:text-base">Share this update with your friends and fellow students.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button className="flex items-center justify-center gap-2 bg-nipro-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-nipro-blue/90 transition-all shadow-lg shadow-nipro-blue/20 w-full md:w-auto">
                    <Share2 className="h-4 w-4" />
                    Share Link
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
