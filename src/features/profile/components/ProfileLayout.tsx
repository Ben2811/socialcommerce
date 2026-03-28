"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProfileSidebar } from "./ProfileSidebar";
import type { ProfileTab } from "./ProfileSidebar";
import { ProfileCard } from "./ProfileCard";
import { AddressesList } from "./AddressesList";

export function ProfileLayout() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");

  return (
    <SidebarProvider>
      <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset className="p-6 bg-background">
        {activeTab === "info" && <ProfileCard />}
        {activeTab === "addresses" && <AddressesList />}
        {activeTab === "orders" && (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            Tính năng đơn hàng đang được phát triển
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
