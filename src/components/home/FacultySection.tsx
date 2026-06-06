"use client";

import React, { useState } from 'react';
import { Faculty } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function FacultySection({ faculty }: { faculty: Faculty[] }) {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const activeFaculty = faculty.filter(f => f.is_active);
  const founders = activeFaculty.filter(f => f.type === 'founder');
  const instructors = activeFaculty.filter(f => f.type !== 'founder');

  if (activeFaculty.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-3">Expert Mentors</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-nipro-blue tracking-tight mb-4">Learn From The Best</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our instructors are industry professionals who bring real-world experience directly to the classroom.
          </p>
        </div>
        
        {/* Founders */}
        {founders.length > 0 && (
          <div className="mb-12">
            {founders.map(f => (
              <div 
                key={f.id} 
                className="max-w-4xl w-full mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {f.image_url ? (
                    <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 font-bold text-4xl">
                      {f.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">{f.name}</h4>
                  <div className="text-lg font-bold text-nipro-red mb-4">{f.role}</div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{f.bio || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructors */}
        {instructors.length > 0 && (
          <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-6xl mx-auto">
            {instructors.map(f => (
              <div 
                key={f.id} 
                onClick={() => setSelectedFaculty(f)}
                className="cursor-pointer w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[260px] bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 text-center transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-start"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-sm mb-5 shrink-0">
                  {f.image_url ? (
                    <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 font-bold text-xl md:text-2xl">
                      {f.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-1.5 leading-tight">{f.name}</h4>
                <div className="text-xs md:text-sm font-bold text-nipro-red">{f.role}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedFaculty} onOpenChange={(open) => !open && setSelectedFaculty(null)}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-2xl border-none">
          {selectedFaculty && (
            <div>
              <div className="bg-slate-50 border-b border-slate-100 p-8 text-center flex flex-col items-center">
                 <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4">
                    {selectedFaculty.image_url ? (
                      <img src={selectedFaculty.image_url} alt={selectedFaculty.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 font-bold text-2xl">
                        {selectedFaculty.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <DialogTitle className="text-2xl font-bold text-slate-900 mb-1">{selectedFaculty.name}</DialogTitle>
                  <div className="text-sm font-bold text-nipro-red">{selectedFaculty.role}</div>
              </div>
              <div className="p-8 bg-white">
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedFaculty.bio || 'No biography available.'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
