"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        // Set cookie for server actions
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
        
        toast.success('Access Granted. Welcome back!');
        router.push('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D17] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-nipro-red/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-nipro-red to-red-700 shadow-2xl shadow-nipro-red/20 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">NIPRO <span className="text-nipro-red">ADMIN</span></h1>
          <p className="text-gray-400 font-medium">Secure Authorization Gateway</p>
        </div>

        <Card className="border-none bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
          <CardContent className="p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input 
                    type="email"
                    placeholder="Enter admin email"
                    className="h-14 pl-12 bg-white/5 border-white/10 text-white focus:border-nipro-red focus:ring-nipro-red/20 transition-all rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    className="h-14 pl-12 bg-white/5 border-white/10 text-white focus:border-nipro-red focus:ring-nipro-red/20 transition-all rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-nipro-red hover:bg-nipro-red/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-nipro-red/20 group transition-all"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center">
                    Enter Portal
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Powered by Nipro Core Systems
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">
          © 2026 Nipro Computer Education
        </p>
      </motion.div>
    </div>
  );
}
