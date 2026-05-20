import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { getSiteSettings } from "@/lib/data-service";

export const metadata: Metadata = {
  title: "Nipro Computer Education | Learn Skills. Get Certified.",
  description: "Nipro Computer Education in Korutla offers practical computer training, recognised certification, and online/offline exams.",
  keywords: ["computer education", "certificate verification", "Tally course", "AutoCAD training", "Korutla"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <LayoutWrapper navbar={<Navbar settings={settings} />} footer={<Footer settings={settings} />}>
          {children}
        </LayoutWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
