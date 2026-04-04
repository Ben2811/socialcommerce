"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ArrowLeft,
  UserCog,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { sellerManagementItems, sellerSupportLink, sellerSettingsLink } from "../constants/sidebar-menu";

export function SellerSidebar() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Sidebar collapsible="none" className="sticky top-0 flex h-dvh flex-col border-r border-border bg-sidebar text-sidebar-foreground w-[240px]">
      <SidebarHeader className="gap-0 p-0 border-b border-border">
        <div className="p-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => router.back()} aria-label="Quay lại">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-[15px]">Trang seller</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="min-h-0 flex-1 gap-4 overflow-auto px-4 pb-4 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="size-10 border border-border">
            <AvatarImage src={user?.imageUrls?.[0]} alt={user?.username || "Seller"} />
            <AvatarFallback className="bg-muted text-[14px] font-semibold text-foreground">
              {user?.username?.substring(0, 2).toUpperCase() || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[14px] font-semibold leading-5">Project title</p>
            <p className="truncate text-[12px] text-muted-foreground leading-4">
              {user?.username || ""}
            </p>
          </div>
        </div>

        <div className="px-0 text-[12px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">Seller sidebar</div>

        <SidebarGroup className="p-0 pt-1">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-0 py-1 text-[13px] font-normal text-sidebar-foreground">
              <span className="flex items-center gap-2 font-medium">
                <UserCog className="size-4" />
                <span>Quản lý</span>
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-2 border-l border-border pl-4">
              <SidebarMenu className="gap-1">
                {sellerManagementItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.href)}
                      className="h-8 rounded-md px-2.5 text-[13px] text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup className="p-0 pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push(sellerSupportLink.href)}
                className="flex w-full items-center justify-between px-0 py-1.5 text-[13px] font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <sellerSupportLink.icon className="size-4" />
                  <span>{sellerSupportLink.label}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="p-0 pt-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push(sellerSettingsLink.href)}
                className="flex w-full items-center justify-between px-0 py-1.5 text-[13px] font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <sellerSettingsLink.icon className="size-4" />
                  <span>{sellerSettingsLink.label}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="shrink-0 p-4">
        <Button
          onClick={() => router.push("/")}
          className="h-10 w-full gap-2 rounded-lg bg-primary text-primary-foreground shadow-none hover:bg-primary/90 font-medium"
        >
          <ArrowLeft className="size-4" />
          Về trang chủ
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
