"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function CertificateSearch() {
  const [certId, setCertId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) {
      toast.error("Please enter a Certificate ID");
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    // Mock verification logic
    setTimeout(() => {
      setIsLoading(false);
      if (certId.trim() === '221067') {
        setResult('success');
        toast.success("Certificate Verified Successfully!");
      } else {
        setResult('error');
        toast.error("Certificate Not Found");
      }
    }, 1500);
  };

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-nipro-blue mb-2">Verify Your Certificate</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              Enter your Certificate ID to verify authenticity. Employers can check registration status instantly.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter Certificate ID (e.g. 221067)"
                  className="h-12 pl-12 bg-white text-nipro-blue border-slate-200 focus:border-nipro-blue focus:ring-nipro-blue text-base rounded-xl"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                />
              </div>
              <Button 
                disabled={isLoading}
                className="h-12 px-6 bg-nipro-blue hover:bg-nipro-blue/90 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>

            {/* Result Display */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`mt-6 p-4 rounded-xl max-w-2xl mx-auto flex items-center gap-3 ${
                    result === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {result === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                  <div className="text-left">
                    <p className={`font-bold text-sm ${result === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {result === 'success' ? 'Certificate Verified' : 'Verification Failed'}
                    </p>
                    <p className={`text-xs mt-0.5 ${result === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {result === 'success' 
                        ? 'This certificate is authentic and registered in our database.' 
                        : 'No certificate found with this ID. Please check and try again.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-slate-500 border-t border-slate-200/60 pt-4">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                Official Database
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                Instant Results
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                Secure Access
              </div>
            </div>
        </div>
      </div>
      </div>
    </section>
  );
}
