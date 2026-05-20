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
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
  { icon: FileCheck, label: 'Certificates', href: '/admin/certificates' },
  { icon: Newspaper, label: 'Blogs', href: '/admin/blogs' },
  { icon: Percent, label: 'Discounts', href: '/admin/discounts' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clear cookie
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    router.push('/');
  };

  return (
    <div className={cn(
      "bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col transition-all duration-300 z-50",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-auto flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src="/Logo.png" 
                alt="Nipro Logo" 
                className="h-8 w-auto object-contain" 
              />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">NIPRO</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Admin</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={cn("p-2 rounded-lg hover:bg-white/10", isCollapsed && "mx-auto")}
        >
          <Menu className="h-5 w-5" />
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
                  "flex items-center justify-between gap-3 p-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-gradient-to-r from-nipro-red to-red-700 text-white font-medium" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className={cn("flex items-center gap-3", isCollapsed && "mx-auto justify-center")}>
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    !isActive && "group-hover:scale-110 text-slate-500 group-hover:text-nipro-red"
                  )} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </div>
                {isActive && !isCollapsed && <ChevronRight className="h-4 w-4 text-nipro-red" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:text-white hover:bg-nipro-red/20 transition-all duration-200 group",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="font-medium">Exit Admin</span>}
        </button>
      </div>
    </div>
  );
}
