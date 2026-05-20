"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Verify Certificate', href: '/verify' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="relative z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-auto flex items-center justify-center overflow-hidden shrink-0">
                <Image 
                  src="/Logo.png" 
                  alt="Nipro Computer Education" 
                  width={88} 
                  height={40} 
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-nipro-blue">NIPRO</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-nipro-red">Computer Education</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors relative py-1",
                    pathname === link.href 
                      ? "text-nipro-red" 
                      : "text-muted-foreground hover:text-nipro-red"
                  )}
                >
                  {link.name}
                  {pathname === link.href && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-nipro-red rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
              <Link href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98 1.001-3.646-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.029a11.966 11.966 0 001.597 5.976L0 24l6.143-1.611a11.813 11.813 0 005.903 1.56c6.637 0 12.032-5.392 12.035-12.03a11.84 11.84 0 00-3.528-8.497z"/>
                </svg>
                WhatsApp Us
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-gray-100 hover:text-nipro-red focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white animate-fade-up">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-4 text-base font-medium",
                  pathname === link.href ? "bg-nipro-red/10 text-nipro-red" : "text-muted-foreground hover:bg-gray-50 hover:text-nipro-red"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <Button asChild className="w-full bg-primary">
                <Link href="https://wa.me/91XXXXXXXXXX" onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer">
                  <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98 1.001-3.646-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.029a11.966 11.966 0 001.597 5.976L0 24l6.143-1.611a11.813 11.813 0 005.903 1.56c6.637 0 12.032-5.392 12.035-12.03a11.84 11.84 0 00-3.528-8.497z"/>
                  </svg>
                  WhatsApp Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
