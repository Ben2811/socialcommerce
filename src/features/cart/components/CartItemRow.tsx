"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { CartItem } from "../types/cart";
import { formatPrice } from "@/features/shared";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemRow({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <TableRow className="border-b border-border hover:bg-muted/30 transition-colors">
      {/* Checkbox */}
      <TableCell className="w-10 pl-4">
        <Checkbox
          id={`cart-item-${item.id}`}
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(item.id)}
          aria-label={`Chọn ${item.name}`}
        />
      </TableCell>

      {/* Image */}
      <TableCell className="w-20 py-3">
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
        <div className="inline-flex items-center border border-border rounded">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            className="px-2 py-1 text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            aria-label={`Giảm số lượng ${item.name}`}
          >
            <Minus className="size-3" />
          </button>

          <span className="min-w-[2rem] text-center text-sm font-medium text-foreground border-x border-border px-2 py-1"
            aria-live="polite"
          >
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="px-2 py-1 text-foreground hover:bg-muted transition-colors text-sm"
            aria-label={`Tăng số lượng ${item.name}`}
          >
            <Plus className="size-3" />
          </button>
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
