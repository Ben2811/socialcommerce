"use client";

import { User, MapPin, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ProfileTab = "info" | "orders" | "addresses";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const menuItems: { tab: ProfileTab; label: string; icon: React.ElementType }[] =
  [
    { tab: "info", label: "Thông tin cá nhân", icon: User },
    { tab: "orders", label: "Đơn hàng của tôi", icon: ShoppingBag },
    { tab: "addresses", label: "Địa chỉ", icon: MapPin },
  ];

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="none">
      {/* User info */}
      <SidebarHeader className="gap-3 py-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.imageUrls?.[0]} alt={user?.username} />
            <AvatarFallback className="bg-orange-100 text-orange-600 text-sm font-semibold">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-sidebar-foreground truncate leading-tight">
              {user?.username ?? "Người dùng"}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent className="pt-2">
        <SidebarMenu>
          {menuItems.map(({ tab, label, icon: Icon }) => (
            <SidebarMenuItem key={tab}>
              <SidebarMenuButton
                isActive={activeTab === tab}
                onClick={() => onTabChange(tab)}
              >
                <Icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Logout */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-destructive hover:bg-destructive/10 hover:text-destructive data-active:bg-destructive/10 data-active:text-destructive"
              onClick={logout}
            >
              <LogOut />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
