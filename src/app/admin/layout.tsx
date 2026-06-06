"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AuthGuard from '@/components/admin/AuthGuard';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F5F5F7] flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-zinc-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 relative bg-nipro-blue rounded-md flex items-center justify-center text-white font-bold text-xs">N</div>
            <span className="font-bold text-sm tracking-tight text-slate-950">NIPRO Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 transition-colors"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" 
            onClick={() => setIsMobileOpen(false)} 
          />
        )}

        <AdminSidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />
        
        <main className={cn(
          "flex-grow transition-all duration-300 min-h-screen p-4 md:p-8 pt-6 w-full max-w-[100vw]",
          isCollapsed ? "md:ml-16 md:w-[calc(100vw-64px)]" : "md:ml-64 md:w-[calc(100vw-256px)]"
        )}>
          <div className="max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
