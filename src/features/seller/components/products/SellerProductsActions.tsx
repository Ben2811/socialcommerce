"use client";

import { Edit3, MoreVertical, PackageCheck, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SellerProduct } from "@/features/seller/types/product";

interface SellerProductsActionsProps {
  product: SellerProduct;
  onEdit: (product: SellerProduct) => void;
  onUpdateStock: (product: SellerProduct) => void;
  onDelete: (product: SellerProduct) => void;
}

export function SellerProductsActions({
  product,
  onEdit,
  onUpdateStock,
  onDelete,
}: SellerProductsActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm hover:bg-accent hover:text-accent-foreground"
        aria-label={`Mở menu thao tác cho sản phẩm ${product.name}`}
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEdit(product)}
          className="gap-2 cursor-pointer"
        >
          <Edit3 className="size-4" />
          <span>Chỉnh sửa</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStock(product)}
          className="gap-2 cursor-pointer"
        >
          <PackageCheck className="size-4" />
          <span>Cập nhật tồn kho</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(product)}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="size-4" />
          <span>Xóa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
