"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { LogOut, ShoppingCart, User, Settings } from "lucide-react";
import Link from "next/link";
import type { UserRole } from "@/features/admin/types/user";

export function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center space-x-4 font-medium text-foreground">
        <Link href="/login" className="hover:text-primary transition-colors">
          Đăng nhập
        </Link>
        <div className="h-3 w-[1px] bg-border"></div>
        <Link href="/register" className="hover:text-primary transition-colors">
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 appearance-none bg-transparent border-0 p-0 cursor-pointer outline-none hover:text-foreground transition-colors group">
        <Avatar
          size="sm"
          className="h-6 w-6 ring-offset-background transition-all group-hover:ring-2 group-hover:ring-ring"
        >
          <AvatarImage src={user.imageUrls?.[0]} alt={user.username} />
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            {user.username?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium max-w-[120px] truncate">
          {user.username}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          render={
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Tài khoản của tôi</span>
            </Link>
          }
        ></DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          render={
            <Link href="/profile">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Đơn mua</span>
            </Link>
          }
        ></DropdownMenuItem>
        {(user.role as UserRole) === "admin" && (
          <DropdownMenuItem
            className="cursor-pointer"
            render={
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                <span>Quản lý</span>
              </Link>
            }
          ></DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          variant="destructive"
          className="cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
