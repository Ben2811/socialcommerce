"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProfileSidebar } from "./ProfileSidebar";
import type { ProfileTab } from "./ProfileSidebar";
import { ProfileCard } from "./ProfileCard";
import { AddressesList } from "./AddressesList";
import { OrdersList, OrderDetail } from "@/features/orders";

export function ProfileLayout() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("orders");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <SidebarProvider>
      <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset className="bg-background p-6">
        {activeTab === "info" && <ProfileCard />}
        {activeTab === "addresses" && <AddressesList />}

        {activeTab === "orders" && (
          <>
            {selectedOrderId ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Chi tiết đơn hàng
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Xem thông tin chi tiết, trạng thái và địa chỉ giao hàng
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Quay lại danh sách
                  </Button>
                </div>

                <OrderDetail orderId={selectedOrderId} />
              </div>
            ) : (
              <OrdersList pageSize={10} />
            )}
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}