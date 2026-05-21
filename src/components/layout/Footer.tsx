import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, MessageCircle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteSettings } from '@/lib/data-service';

export function Footer({ settings }: { settings?: SiteSettings }) {
  const whatsappUrl = `https://wa.me/${settings?.contact?.whatsapp?.replace(/\D/g, '') || '919000000000'}`;

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-11 w-[67px] shrink-0 bg-white rounded-xl p-1 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/images/Logo.png" 
                  alt={settings?.name || "Nipro Logo"} 
                  fill
                  sizes="67px"
                  className="object-contain" 
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">{settings?.name?.split(' ')[0] || "NIPRO"}</span>
            </Link>
            <p className="text-xs text-zinc-500 mb-4">
              Govt Verification ID: {settings?.contact?.googleMapsLink || "Pending"}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {settings?.tagline || "Empowering students with job-ready computer skills and recognised certification since 2014."}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-200 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/courses" className="text-xs text-zinc-400 hover:text-white transition-colors">All Courses</Link></li>
              <li><Link href="/verify" className="text-xs text-zinc-400 hover:text-white transition-colors">Verify Certificate</Link></li>
              <li><Link href="/faq" className="text-xs text-zinc-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-200 mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-400 leading-normal">{settings?.contact?.address || "Bhatindi, Jammu"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-xs text-zinc-400">{settings?.contact?.phone || "+91 90000 00000"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-xs text-zinc-400 break-all">{settings?.contact?.email || "info@niprocomputereducation.com"}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-200 mb-2">Registration</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Recognised by Govt. of AP & Telangana.
            </p>
            <div className="pt-2">
              <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm transition-all active:scale-95 duration-200 w-full text-xs font-medium h-10">
                <Link href={whatsappUrl}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat on WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-650 tracking-tight">
            &copy; {new Date().getFullYear()} {settings?.name || "Nipro Computer Education Institute"}. All rights reserved.
          </p>
          <div className="flex gap-6">
             <Link href="/admin/login" className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
