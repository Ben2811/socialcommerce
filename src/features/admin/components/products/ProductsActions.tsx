"use client";

import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminProduct } from "../../types/product";

interface ProductsActionsProps {
  product: AdminProduct;
  onUpdateStatus: (productId: string, status: "approved" | "rejected") => void;
  onDelete: (productId: string) => void;
}

export function ProductsActions({
  product,
  onUpdateStatus,
  onDelete,
}: ProductsActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm hover:bg-accent hover:text-accent-foreground">
        <span className="text-xl">⋮</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onUpdateStatus(product._id, "approved")}
          className="gap-2 cursor-pointer text-green-600"
          disabled={product.status === "approved"}
        >
          <CheckCircle className="size-4" />
          <span>Duyệt</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(product._id, "rejected")}
          className="gap-2 cursor-pointer text-yellow-600"
          disabled={product.status === "rejected"}
        >
          <XCircle className="size-4" />
          <span>Từ chối</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(product._id)}
          className="gap-2 cursor-pointer text-red-600"
        >
          <Trash2 className="size-4" />
          <span>Xóa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
