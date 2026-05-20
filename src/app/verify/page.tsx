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
import Image from 'next/image';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-nipro-red mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <span className="text-muted-foreground">/ Verification Portal</span>
          </div>

          {!id || error ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 ${error ? 'bg-red-50' : 'bg-blue-50'}`}>
                  {error ? <AlertCircle className="h-10 w-10 text-red-500" /> : <ShieldCheck className="h-10 w-10 text-nipro-blue" />}
                </div>
                <h1 className="text-3xl font-bold text-nipro-blue mb-4">
                  {error ? 'Verification Failed' : 'Verify Your Certificate'}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {error 
                    ? `We couldn't find a certificate with the ID #${id}. Please check the ID and try again.`
                    : 'Enter your Certificate ID below to instantly verify your credentials and download your certificate.'}
                </p>
              </div>

              <Card className="border-none shadow-2xl bg-white overflow-hidden">
                <CardContent className="p-8">
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-nipro-red transition-colors" />
                      <Input 
                        type="text" 
                        placeholder="Enter Certificate ID (e.g. NK123)" 
                        className="h-16 pl-14 text-lg border-2 border-gray-100 focus:border-nipro-red transition-all"
                        value={certId}
                        onChange={(e) => setCertId(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={loading || !certId}
                      className="w-full h-16 bg-nipro-red hover:bg-nipro-red/90 text-white text-lg font-bold shadow-lg transition-all"
                    >
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Verify Now'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : cert && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Certificate Preview */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-2xl overflow-hidden bg-white p-2">
                  <div className="relative aspect-[1.414/1] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <Image 
                      src={cert.imageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop'} 
                      alt="Certificate" 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-4"
                    />
                  </div>
                </Card>
                
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-nipro-red hover:bg-nipro-red/90 h-12 px-8 font-bold">
                    <Download className="mr-2 h-5 w-5" /> Download PDF
                  </Button>
                  <Button variant="outline" className="h-12 px-8 font-bold border-2" onClick={() => {
                    navigator.share?.({
                      title: 'My Nipro Certificate',
                      text: `I just completed ${cert.courseName} at Nipro Computer Education!`,
                      url: window.location.href
                    }).catch(() => {});
                  }}>
                    <Share2 className="mr-2 h-5 w-5" /> Share Verification
                  </Button>
                </div>
              </div>

              {/* Validation Details */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-xl bg-nipro-blue text-white overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <ShieldCheck className="h-7 w-7 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl leading-tight">Verified</h3>
                        <p className="text-sm text-blue-200">Official Institute Record</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <DetailRow icon={User} label="Student Name" value={cert.fullName} />
                      <DetailRow icon={GraduationCap} label="Course" value={cert.courseName} />
                      <DetailRow icon={Calendar} label="Issue Date" value={new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                      <DetailRow icon={Award} label="Certificate ID" value={`#${cert.id}`} isMono />
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-blue-200 bg-white/5 p-3 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Digital authenticity signature is valid.
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-nipro-blue mb-3">About this credential</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This document was issued by Nipro Computer Education, Korutla. It verifies that the individual named above has successfully completed the required curriculum and examinations.
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
    <div className="flex items-start gap-4">
      <div className="text-nipro-red mt-1">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-1">{label}</p>
        <p className={`font-bold text-lg ${isMono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-nipro-red mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading Verification Portal...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
