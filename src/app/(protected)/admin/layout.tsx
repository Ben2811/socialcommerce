import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen className="items-start">
      <AdminSidebar />
      <SidebarInset className="flex-1 min-h-screen">{children}</SidebarInset>
    </SidebarProvider>
  );
}
