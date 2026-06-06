"use client";

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  ShieldCheck, 
  Loader2, 
  ArrowLeft,
  Calendar,
  User,
  GraduationCap,
  Award,
  AlertCircle,
  Search,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getCertificate } from '@/lib/actions';
import { Certificate } from '@/lib/data-service';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [certId, setCertId] = useState(id || '');

  const loadCert = useCallback(async (searchId: string) => {
    setLoading(true);
    setError(false);
    try {
      const data = await getCertificate(searchId);
      if (data) {
        setCert(data);
      } else {
        setCert(null);
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const init = async () => {
        await loadCert(id);
      };
      init();
    }
  }, [id, loadCert]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      router.push(`/verify?id=${certId.trim()}`);
    }
  };

  if (loading && !cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-800 mx-auto mb-4" />
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-8 text-xs">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="hover:bg-slate-100 rounded-full h-8 px-3">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Home
            </Button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-medium">Verification Portal</span>
          </div>

          {!id || error ? (
            <div className="max-w-xl mx-auto text-center">
              <div className="mb-8">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-5 ${error ? 'bg-red-50' : 'bg-slate-100'}`}>
                  {error ? <AlertCircle className="h-8 w-8 text-red-500" /> : <ShieldCheck className="h-8 w-8 text-slate-900" />}
                </div>
                <h1 className="text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">
                  {error ? 'Verification Failed' : 'Verify Certificate'}
                </h1>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  {error 
                    ? `We couldn't find a certificate with the ID #${id}. Please verify the ID and try again.`
                    : 'Enter your Certificate ID below to instantly verify your credentials and download your certificate.'}
                </p>
              </div>

              <Card className="border border-black/[0.04] shadow-sm bg-white overflow-hidden rounded-[24px]">
                <CardContent className="p-6">
                  <form onSubmit={handleVerify} className="space-y-3">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
                      <Input 
                        type="text" 
                        placeholder="Enter Certificate ID (e.g. NK123)" 
                        className="h-11 pl-11 text-sm bg-slate-50 border-none rounded-full focus-visible:ring-1 focus-visible:ring-black/10 transition-all placeholder:text-slate-400"
                        value={certId}
                        onChange={(e) => setCertId(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={loading || !certId}
                      className="w-full h-11 bg-slate-950 hover:bg-slate-900 text-white text-xs font-semibold tracking-wider uppercase rounded-full shadow-sm transition-all"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify Now'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : cert && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Certificate Preview */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-black/[0.04] shadow-sm overflow-hidden bg-white p-2 rounded-[24px]">
                  <div className="relative aspect-[1.414/1] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
                    <img 
                      src={cert.imageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop'} 
                      alt="Certificate" 
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </Card>
                
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-slate-950 hover:bg-slate-900 h-10 px-6 font-semibold rounded-full text-xs tracking-wide shadow-sm">
                    <Download className="mr-1.5 h-4 w-4" /> Download PDF
                  </Button>
                  <Button variant="outline" className="h-10 px-6 font-semibold rounded-full text-xs tracking-wide border-slate-200" onClick={() => {
                    navigator.share?.({
                      title: 'My Nipro Certificate',
                      text: `I just completed ${cert.courseName} at Nipro Computer Education!`,
                      url: window.location.href
                    }).catch(() => {});
                  }}>
                    <Share2 className="mr-1.5 h-4 w-4" /> Share Verification
                  </Button>
                </div>
              </div>

              {/* Validation Details */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border border-black/[0.04] shadow-sm bg-white overflow-hidden rounded-[24px]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/[0.04]">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="inline-block bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-0.5">Verified</span>
                        <p className="text-xs text-slate-500">Official Institute Record</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <DetailRow icon={User} label="Student Name" value={cert.fullName} />
                      <DetailRow icon={GraduationCap} label="Course" value={cert.courseName} />
                      <DetailRow icon={Calendar} label="Issue Date" value={formatDate(cert.issueDate)} />
                      <DetailRow icon={Award} label="Certificate ID" value={`#${cert.id}`} isMono />
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-black/[0.04]">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-black/[0.02]">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        Digital authenticity signature is valid.
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 bg-white rounded-[24px] border border-black/[0.04] shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">About this credential</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    This document was issued by Nipro Computer Education, Korutla. It verifies that the student named above has successfully completed all required curriculum components and examination milestones.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, isMono = false }: { icon: LucideIcon, label: string, value: string, isMono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-400 mt-0.5">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">{label}</p>
        <p className={`font-semibold text-sm text-slate-800 ${isMono ? 'font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-xs' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-800 mx-auto mb-4" />
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Loading Verification Portal...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
