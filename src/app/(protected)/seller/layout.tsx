import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SellerSidebar } from "@/features/seller/components/SellerSidebar";

export default async function SellerLayout({ children }: { children: ReactNode }) {

  return (
    <SidebarProvider defaultOpen className="items-start bg-muted/30">
      <SellerSidebar />
      <SidebarInset className="flex-1 min-h-screen bg-transparent">{children}</SidebarInset>
    </SidebarProvider>
  );
}
