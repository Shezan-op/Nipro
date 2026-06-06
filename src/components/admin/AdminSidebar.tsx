"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  Newspaper, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  Percent,
  Users,
  MessageSquareQuote,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
  { icon: FileCheck, label: 'Certificates', href: '/admin/certificates' },
  { icon: Newspaper, label: 'Blogs', href: '/admin/blogs' },
  { icon: Users, label: 'Faculty', href: '/admin/faculty' },
  { icon: Percent, label: 'Discounts', href: '/admin/discounts' },
  { icon: MessageSquareQuote, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: ShieldCheck, label: 'Govt Certs', href: '/admin/govt-certificates' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (value: boolean) => void;
}

export default function AdminSidebar({ isCollapsed, setIsCollapsed, isMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    router.push('/');
  };

  return (
    <div className={cn(
      "bg-zinc-50 border-r border-zinc-200/60 h-screen fixed left-0 top-0 text-zinc-900 flex flex-col transition-transform duration-300 z-50 shadow-sm",
      isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
      isCollapsed ? "md:w-16" : "md:w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-zinc-200/50">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-[55px] shrink-0">
              <Image 
                src="/Logo.png" 
                alt="Nipro Logo" 
                fill
                sizes="55px"
                className="object-contain" 
              />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-slate-950">NIPRO</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-500">Admin</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={cn("hidden md:block p-2 rounded-lg hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900 transition-colors", isCollapsed && "mx-auto")}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-grow px-2 mt-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-3 p-2.5 rounded-lg transition-all duration-150 group text-xs",
                  isActive 
                    ? "bg-nipro-blue/10 text-nipro-blue font-semibold shadow-sm border border-nipro-blue/[0.04]" 
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/40 font-medium"
                )}
              >
                <div className={cn("flex items-center gap-3", isCollapsed && "mx-auto justify-center")}>
                  <Icon className={cn(
                    "h-4 w-4 transition-transform duration-300 shrink-0",
                    isActive ? "text-nipro-blue" : "text-zinc-400 group-hover:scale-105 group-hover:text-zinc-800"
                  )} />
                  {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                </div>
                {isActive && (!isCollapsed || isMobileOpen) && <ChevronRight className="h-3 w-3 text-nipro-blue shrink-0" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-200/50">
        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 p-2.5 rounded-lg text-zinc-600 hover:text-red-600 hover:bg-red-50/80 transition-all duration-150 group text-xs",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
          {(!isCollapsed || isMobileOpen) && <span className="font-semibold">Exit Admin</span>}
        </button>
      </div>
    </div>
  );
}
