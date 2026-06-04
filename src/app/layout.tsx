import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { getSiteSettings } from "@/lib/data-service";

export const viewport: Viewport = {
  themeColor: "#d61f26",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Nipro Computer Education | Learn Skills. Get Certified.",
  description: "Govt. recognised computer education centre in Korutla, Telangana. Learn Tally, AutoCAD, DTP, and more. Get certified by experts.",
  keywords: ["computer education", "certificate verification", "Tally course", "AutoCAD training", "Korutla", "Nipro"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nipro",
  },
  openGraph: {
    title: "Nipro Computer Education | Learn Skills. Get Certified.",
    description: "Govt. recognised computer education centre in Korutla, Telangana.",
    type: "website",
    locale: "en_IN",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <LayoutWrapper navbar={<Navbar settings={settings} />} footer={<Footer settings={settings} />}>
          {children}
        </LayoutWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
