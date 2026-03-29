"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { CartItem } from "../types/cart";
import { formatPrice } from "@/features/shared";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <TableRow className="border-b border-border hover:bg-muted/30 transition-colors">
      {/* Image aligned with header Checkbox+Text spacing */}
      <TableCell className="w-[120px] pl-4 py-3">
        <div className="flex items-center gap-2">
          {/* Spacer to align with Header Checkbox (size 4) */}
          <div className="w-4 flex-shrink-0" />
          <div className="relative size-14 rounded overflow-hidden bg-muted flex-shrink-0">
            {!imgError ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="size-full flex items-center justify-center text-muted-foreground text-xs">
                No img
              </div>
            )}
          </div>
        </div>
      </TableCell>

      {/* Product name */}
      <TableCell className="py-3">
        <span className="text-sm text-foreground line-clamp-2">
          {item.name}
        </span>
      </TableCell>

      {/* Category */}
      <TableCell className="py-3">
        <span className="text-sm text-muted-foreground">{item.category}</span>
      </TableCell>

      {/* Unit price */}
      <TableCell className="py-3">
        <span className="text-sm text-foreground">
          {item.price.toLocaleString("vi-VN")}
        </span>
      </TableCell>

      {/* Quantity control */}
      <TableCell className="py-3">
        <div className="inline-flex items-center border border-border rounded overflow-hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            className="rounded-none size-7"
            aria-label={`Giảm số lượng ${item.name}`}
          >
            <Minus className="size-3" />
          </Button>

          <span
            className="min-w-[2rem] text-center text-sm font-medium text-foreground border-x border-border px-2 py-1"
            aria-live="polite"
          >
            {item.quantity}
          </span>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="rounded-none size-7"
            aria-label={`Tăng số lượng ${item.name}`}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </TableCell>

      {/* Subtotal - success/green color from globals.css */}
      <TableCell className="py-3">
        <span className="text-sm font-medium text-success whitespace-nowrap">
          {(item.price * item.quantity).toLocaleString("vi-VN")} đ
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3 pr-4 w-10">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Thêm tùy chọn cho ${item.name}`}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="size-4" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="size-4" />
              Xóa khỏi giỏ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
