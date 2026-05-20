import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, MessageCircle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteSettings } from '@/lib/data-service';

export function Footer({ settings }: { settings?: SiteSettings }) {
  const whatsappUrl = `https://wa.me/${settings?.contact?.whatsapp?.replace(/\D/g, '') || '919000000000'}`;

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-2">
              <div className="h-10 w-auto flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src="/Logo.png" 
                  alt={settings?.name || "Nipro Logo"} 
                  className="h-12 w-auto object-contain brightness-0 invert" 
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">{settings?.name?.split(' ')[0] || "NIPRO"}</span>
            </Link>
            <p className="text-xs text-blue-200 mb-4">
              Govt Verification ID: {settings?.contact?.googleMapsLink || "Pending"}
            </p>
            <p className="text-sm text-blue-100 mb-6">
              {settings?.tagline || "Empowering students with job-ready computer skills and recognised certification since 2014."}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-blue-100 hover:text-white">Home</Link></li>
              <li><Link href="/courses" className="text-sm text-blue-100 hover:text-white">All Courses</Link></li>
              <li><Link href="/verify" className="text-sm text-blue-100 hover:text-white">Verify Certificate</Link></li>
              <li><Link href="/faq" className="text-sm text-blue-100 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-200 shrink-0" />
                <span className="text-sm text-blue-100">{settings?.contact?.address || "Bhatindi, Jammu"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-200 shrink-0" />
                <span className="text-sm text-blue-100">{settings?.contact?.phone || "+91 90000 00000"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-200 shrink-0" />
                <span className="text-sm text-blue-100">{settings?.contact?.email || "info@niprocomputereducation.com"}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-2">Registration</h3>
            <p className="text-xs text-blue-200 mb-2">
              Recognised by Govt. of AP & Telangana.
            </p>
            <div className="pt-2">
              <Button asChild className="rounded-full bg-green-500 hover:bg-green-600 text-white border-none shadow-lg w-full">
                <Link href={whatsappUrl}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat on WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-300">
            &copy; {new Date().getFullYear()} {settings?.name || "Nipro Computer Education Institute"}. All rights reserved.
          </p>
          <div className="flex gap-6">
             <Link href="/admin/login" className="text-xs text-blue-400 hover:text-blue-200">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
