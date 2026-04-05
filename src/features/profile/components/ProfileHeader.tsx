"use client";

import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import type { User } from "@/features/shared/types/user";

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  avatarSrc: string;
  isPending: boolean;
  isUploading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileHeader({
  user,
  isEditing,
  avatarSrc,
  isPending,
  isUploading,
  onEdit,
  onSave,
  onCancel,
}: ProfileHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarSrc} alt={user.username} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {user.username?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <CardDescription>{user.email}</CardDescription>
              <Badge variant="outline" className="capitalize text-xs mt-1">
                {user.role}
              </Badge>
            </div>
          </div>

          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="shrink-0"
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                onClick={onSave}
                disabled={isPending || isUploading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isPending}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
