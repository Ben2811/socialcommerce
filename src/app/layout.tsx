import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Navbar } from "@/features/shared";
import "./globals.css";
import { cn } from "@/features/shared/utils/cn";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/features/auth/lib/getSession";
import AuthProvider from "@/features/auth/providers/AuthProvider";
import { QueryProvider } from "@/providers/query-provider";
import { SocketProvider, ChatWindow } from "@/features/chat";
import { FooterWrapper } from "./_components/FooterWrapper";

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
          <SocketProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <Navbar />
              {children}
              <FooterWrapper />
              <Toaster />
              <ChatWindow />
            </body>
          </SocketProvider>
        </QueryProvider>
      </AuthProvider>
    </html>
  );
}
