"use client";

import React, { useState } from 'react';
import type { Course } from '@/lib/types';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  initialCourses: Course[];
  categories: string[];
}

export function CourseList({ initialCourses, categories }: CourseListProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCourses = initialCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) || 
                         course.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Filter & Search Bar - High Premium Sticky */}
      <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">Filter By:</span>
              <Button 
                variant="ghost"
                size="sm"
                className={`rounded-xl px-5 py-5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === null 
                    ? "bg-nipro-blue text-white shadow-[0_5px_15px_rgba(31,61,138,0.2)] hover:bg-nipro-blue" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Courses
              </Button>
              {categories.map(cat => (
                <Button 
                  key={cat} 
                  variant="ghost"
                  size="sm"
                  className={`rounded-xl px-5 py-5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    selectedCategory === cat 
                      ? "bg-nipro-blue text-white shadow-[0_5px_15px_rgba(31,61,138,0.2)] hover:bg-nipro-blue" 
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-nipro-red transition-colors" />
              <Input 
                placeholder="What do you want to learn today?" 
                className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-nipro-blue/10 transition-all placeholder:text-slate-400" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid - Premium Spacing */}
      <section className="py-24 bg-[#FAFAFB] min-h-[800px]">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-baseline justify-between">
            <h2 className="text-sm font-black text-nipro-blue uppercase tracking-[0.3em]">
              Showing {filteredCourses.length} Excellence {filteredCourses.length === 1 ? 'Program' : 'Programs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredCourses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100"
            >
              <div className="bg-slate-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-nipro-blue mb-4 tracking-tighter">No courses found matching &quot;{search}&quot;</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">We couldn&apos;t find any programs matching your current filters. Try broadening your search.</p>
              <Button 
                variant="outline" 
                className="rounded-xl px-8 py-6 border-2 border-nipro-blue text-nipro-blue font-black hover:bg-nipro-blue hover:text-white transition-all"
                onClick={() => { setSearch(''); setSelectedCategory(null); }}
              >
                Reset Search Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </>

  );
}
