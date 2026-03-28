"use client";

import React from "react";
import { CartGroupByShop, CartItem } from "../types/cart";
import { CartItemRow } from "./CartItemRow";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CartTableProps {
  groups: CartGroupByShop[];
  selectedIds: Set<number>;
  onToggleSelectItem: (id: number) => void;
  onToggleSelectShop: (shopId: number, allIds: number[]) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const COLUMN_HEADERS = [
  { key: "checkbox", label: "" },
  { key: "image", label: "Hình ảnh" },
  { key: "name", label: "Tên sản phẩm" },
  { key: "category", label: "Danh mục" },
  { key: "price", label: "Đơn giá" },
  { key: "quantity", label: "Số lượng" },
  { key: "total", label: "Thành tiền" },
  { key: "actions", label: "" },
] as const;

export function CartTable({
  groups,
  selectedIds,
  onToggleSelectItem,
  onToggleSelectShop,
  onUpdateQuantity,
  onRemove,
}: CartTableProps) {
  return (
    <Table>
      {/* Header */}
      <TableHeader>
        <TableRow className="border-b border-border hover:bg-transparent">
          {COLUMN_HEADERS.map((col) => (
            <TableHead
              key={col.key}
              className="text-muted-foreground font-medium text-sm py-3 bg-background"
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {groups.map((group, groupIndex) => {
          const shopItemIds = group.items.map((i: CartItem) => i.id);
          const shopAllSelected = shopItemIds.every((id: number) =>
            selectedIds.has(id)
          );

          return (
            <React.Fragment key={group.shopId}>
              {/* Shop group header row */}
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableCell className="pl-4 py-2" colSpan={8}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`select-shop-${group.shopId}`}
                      checked={shopAllSelected}
                      onCheckedChange={() =>
                        onToggleSelectShop(group.shopId, shopItemIds)
                      }
                      aria-label={`Chọn tất cả sản phẩm của ${group.shopName}`}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {group.shopName}
                    </span>
                  </div>
                </TableCell>
              </TableRow>

              {/* Product rows */}
              {group.items.map((item: CartItem) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={onToggleSelectItem}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}

              {/* Divider between shops */}
              {groupIndex < groups.length - 1 && (
                <TableRow className="hover:bg-transparent border-0 p-0">
                  <TableCell colSpan={8} className="p-0">
                    <Separator />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
