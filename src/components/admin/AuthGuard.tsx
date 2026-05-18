"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    // Skip check for login page
    if (pathname === '/admin/login') {
      if (isAuthorized !== true) {
        Promise.resolve().then(() => {
          if (mounted) setIsAuthorized(true);
        });
      }
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        if (!session) {
          router.push('/admin/login');
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      }
    };

    checkAuth();
    return () => { mounted = false; };
  }, [router, pathname, isAuthorized]);

  // Handle loading state to prevent hydration mismatch
  if (isAuthorized === null && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-nipro-red mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
