"use client";

import React, { useState } from 'react';
import type { Course } from '@/lib/types';
import { Search, X, SlidersHorizontal } from 'lucide-react';
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
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const filteredCourses = initialCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) || 
                         course.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Filter & Search Bar - High Premium Sticky */}
      <section className="sticky top-16 z-20 bg-white/80 backdrop-blur-md pb-4 pt-4 border-b border-black/[0.04]">
        <div className="container mx-auto px-4">
          {/* Desktop Filter Bar (lg and up) */}
          <div className="hidden lg:flex lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-2.5 items-center justify-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Filter By:</span>
              <Button 
                variant="ghost"
                size="sm"
                className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 ${
                  selectedCategory === null 
                    ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" 
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
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
                  className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 ${
                    selectedCategory === cat 
                      ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" 
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            
            <div className="relative w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <Input 
                placeholder="Search programs..." 
                className="pl-11 h-10 bg-slate-100/80 border-none rounded-full text-xs font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all placeholder:text-slate-400" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Filter Bar (under lg) */}
          <div className="flex lg:hidden flex-col gap-3">
            <div className="flex gap-2 w-full items-center">
              <div className="relative flex-grow group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <Input 
                  placeholder="Search programs..." 
                  className="pl-10 h-10 bg-slate-100/80 border-none rounded-full text-xs font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all placeholder:text-slate-400" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className={`rounded-full h-10 px-4 flex items-center gap-2 border-slate-200 text-xs font-semibold transition-all duration-300 ${
                  selectedCategory 
                    ? "bg-slate-950 text-white border-slate-950" 
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => setShowMobileCategories(!showMobileCategories)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {selectedCategory ? selectedCategory : "Filters"}
              </Button>
            </div>

            <AnimatePresence>
              {showMobileCategories && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-50 border border-black/[0.04] rounded-2xl p-4 relative shadow-sm">
                    {/* Header with Close / Clear Buttons */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter By Category</span>
                      <div className="flex items-center gap-2">
                        {selectedCategory && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-full px-2.5 text-[10px] font-semibold text-nipro-red hover:bg-nipro-red/5 hover:text-nipro-red uppercase tracking-wider"
                            onClick={() => setSelectedCategory(null)}
                          >
                            Clear
                          </Button>
                        )}
                        <button 
                          onClick={() => setShowMobileCategories(false)}
                          className="p-1 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-200"
                          aria-label="Close filters"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Categories Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className={`rounded-full px-4 py-2.5 h-auto text-xs font-semibold transition-all duration-300 justify-start ${
                          selectedCategory === null 
                            ? "bg-slate-900 text-white hover:bg-slate-800" 
                            : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-100"
                        }`}
                        onClick={() => {
                          setSelectedCategory(null);
                          setShowMobileCategories(false);
                        }}
                      >
                        All Courses
                      </Button>
                      {categories.map(cat => (
                        <Button 
                          key={cat} 
                          variant="ghost"
                          size="sm"
                          className={`rounded-full px-4 py-2.5 h-auto text-xs font-semibold transition-all duration-300 justify-start truncate ${
                            selectedCategory === cat 
                              ? "bg-slate-900 text-white hover:bg-slate-800" 
                              : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-100"
                          }`}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowMobileCategories(false);
                          }}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Course Grid - Premium Spacing */}
      <section className="py-16 bg-[#FAFAFB] min-h-[600px]">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'Program' : 'Programs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredCourses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white rounded-3xl border border-black/[0.04]"
            >
              <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-6 w-6 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-400 max-w-sm mx-auto mb-6 text-xs font-medium">We couldn&apos;t find any programs matching your search filters.</p>
              <Button 
                variant="outline" 
                className="rounded-full px-6 py-2.5 border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-all text-xs"
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
