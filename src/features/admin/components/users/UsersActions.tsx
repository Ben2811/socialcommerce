"use client";

import { Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "../../types/user";

interface UsersActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UsersActions({
  user,
  onEdit,
  onDelete,
}: UsersActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm hover:bg-accent hover:text-accent-foreground">
          <span className="text-xl">⋮</span>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEdit(user)}
          className="gap-2 cursor-pointer"
        >
          <Edit className="size-4" />
          <span>Chỉnh sửa</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(user._id)}
          className="gap-2 cursor-pointer text-red-600"
        >
          <Trash2 className="size-4" />
          <span>Xóa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
