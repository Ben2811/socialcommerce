"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Users,
  TableOfContents,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
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
import { managementItems, contentItems, supportLink, settingsLink } from "@/features/admin/constants";

export function AdminSidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="none" className="sticky top-0 flex h-dvh flex-col border-r border-[#e6e6e6] bg-white text-[#101010]">
      <SidebarHeader className="gap-0 p-0">
        <div className="px-4 py-5">
          <div className="flex items-center gap-2 rounded-lg p-2">
            <Avatar className="size-8 border border-[#e5e5e5]">
              <AvatarFallback className="bg-[#f4f4f4] text-[11px] font-semibold text-[#101010]">
                PT
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[14px] font-medium leading-5">Dự án của tôi</p>
              <p className="truncate text-[12px] text-[#7a7a7a] leading-4">
                {user?.username || "Không có tên người dùng"}
              </p>
            </div>
            <ChevronDown className="size-4 text-[#9a9a9a]" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="min-h-0 flex-1 gap-4 overflow-auto px-4 pb-4 pt-1">
        <div className="px-0 text-[13px] font-medium text-[#7a7a7a]">Menu chính</div>

        <SidebarGroup className="p-0 pt-1">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-0 py-1 text-[13px] font-normal text-[#4a4a4a]">
              <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.08em]">
                <Users className="size-4" />
                <span>Quản lý</span>
              </span>
              <ChevronDown className="size-4 text-[#9a9a9a]" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 border-l border-[#e5e5e5] pl-4">
              <SidebarMenu className="gap-1">
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.href)}
                      className="h-9 rounded-md px-2.5 text-[13px] text-[#4a4a4a] hover:bg-[#f5f5f5]"
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup className="p-0 pt-1">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-0 py-1 text-[13px] font-normal text-[#4a4a4a]">
              <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.08em]">
                <TableOfContents className="size-4" />
                <span>Nội dung</span>
              </span>
              <ChevronDown className="size-4 text-[#9a9a9a]" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 border-l border-[#e5e5e5] pl-4">
              <SidebarMenu className="gap-1">
                {contentItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.href)}
                      className="h-9 rounded-md px-2.5 text-[13px] text-[#4a4a4a] hover:bg-[#f5f5f5]"
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup className="p-0 pt-1">
          <SidebarMenu className="border-l border-[#e5e5e5] pl-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push(supportLink.href)}
                className="flex w-full items-center justify-between px-0 py-1 text-[13px] font-normal text-[#4a4a4a] hover:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <supportLink.icon className="size-4" />
                  <span>{supportLink.label}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="p-0 pt-1">
          <SidebarMenu className="border-l border-[#e5e5e5] pl-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push(settingsLink.href)}
                className="flex w-full items-center justify-between px-0 py-1 text-[13px] font-normal text-[#4a4a4a] hover:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <settingsLink.icon className="size-4" />
                  <span>{settingsLink.label}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="shrink-0 border-t border-[#e6e6e6] p-4">
        <Button
          onClick={logout}
          className="h-10 w-full gap-2 rounded-xl bg-[#f6a313] text-white shadow-none hover:bg-[#eb9800]"
        >
          <LogOut className="size-4" />
          Đăng xuất
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}