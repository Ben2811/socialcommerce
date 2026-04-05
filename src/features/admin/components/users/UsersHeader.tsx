"use client";

import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "../../types/user";

interface UsersHeaderProps {
  users: User[];
  onAddUser: () => void;
}

export function UsersHeader({ users, onAddUser }: UsersHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Quản lý người dùng
          </h1>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            Xem và quản lý tất cả người dùng trong cửa hàng của bạn
          </p>
        </div>
        <Button
          onClick={onAddUser}
          className="gap-2 rounded-xl bg-[#f6a313] text-white hover:bg-[#eb9800]"
        >
          <Users className="size-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tổng người dùng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Trong hệ thống
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
