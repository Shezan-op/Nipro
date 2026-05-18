"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function TrustGallery() {
  const certifications = [
    { id: 1, title: 'Govt. of AP Registration', file: '/cert-placeholder.png' },
    { id: 2, title: 'Govt. of Telangana Registration', file: '/cert-placeholder.png' },
    { id: 3, title: 'ISO 9001:2015 Certified', file: '/cert-placeholder.png' },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-sm font-bold text-nipro-red uppercase tracking-widest mb-2">Verification</h2>
          <h3 className="text-2xl font-bold text-nipro-blue mb-2">Govt. Authorised & Recognized</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Our institute is officially registered and recognized by the government, ensuring your certificates carry value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: cert.id * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center"
            >
              <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center text-slate-400 text-xs text-center p-4">
                {/* We use a placeholder div since we don't have actual images yet */}
                <div className="border-2 border-dashed border-slate-200 w-full h-full flex flex-col items-center justify-center p-2">
                  <span>[ Mock Image ]</span>
                  <span className="mt-1 text-slate-500 font-semibold">{cert.title}</span>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-nipro-blue text-center">{cert.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
