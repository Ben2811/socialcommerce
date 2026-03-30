import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Navbar, Footer } from "@/features/shared";
import "./globals.css";
import { cn } from "@/features/shared/utils/cn";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/features/auth/lib/getSession";
import AuthProvider from "@/features/auth/providers/AuthProvider";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Social Commerce",
  description: "Modern social commerce platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <AuthProvider initialUser={user}>
        <QueryProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </body>
        </QueryProvider>
      </AuthProvider>
    </html>
  );
}