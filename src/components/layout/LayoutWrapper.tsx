"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

interface LayoutWrapperProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export function LayoutWrapper({ children, navbar, footer }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && navbar}
      {!isAdmin && <ScrollProgress />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && footer}
    </>
  );
}

