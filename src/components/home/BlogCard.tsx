import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/data-service';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={blog.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'} 
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-nipro-red text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg">
            Update
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(blog.createdAt)}
        </div>
        
        <h3 className="text-xl font-bold text-nipro-blue mb-3 group-hover:text-nipro-red transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
          {blog.content}
        </p>
        
        <div className="mt-auto">
          <Link href={`/news/${blog.id}`} className="inline-flex items-center text-nipro-red font-bold text-sm group/btn">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
