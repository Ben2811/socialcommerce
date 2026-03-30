import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SellerSidebar } from "@/features/seller/components/SellerSidebar";
import { getSession } from "@/features/auth/lib/getSession";

export default async function SellerLayout({ children }: { children: ReactNode }) {
  const user = await getSession();

  if (!user || user.role !== "seller") {
    redirect("/");
  }

  return (
    <SidebarProvider defaultOpen className="items-start bg-muted/30">
      <SellerSidebar />
      <SidebarInset className="flex-1 min-h-screen bg-transparent">{children}</SidebarInset>
    </SidebarProvider>
  );
}
