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
  selectedKeys: Set<string>;
  allSelected: boolean;
  allItemKeys: string[];
  onToggleSelectAll: (allKeys: string[]) => void;
  onToggleSelectShop: (shopId: string, allKeys: string[]) => void;
  onUpdateQuantity: (productId: string, sku: string, delta: number) => void;
  onRemove: (productId: string, sku: string) => void;
}


export function CartTable({
  groups,
  selectedKeys,
  allSelected,
  allItemKeys,
  onToggleSelectAll,
  onToggleSelectShop,
  onUpdateQuantity,
  onRemove,
}: CartTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border hover:bg-transparent">
          {/* Checkbox + Hình ảnh header */}
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background pl-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all-header"
                checked={allSelected}
                onCheckedChange={() => onToggleSelectAll(allItemKeys)}
                aria-label="Chọn tất cả sản phẩm"
              />
              <span>Hình ảnh</span>
            </div>
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">Tên sản phẩm</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">Danh mục</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">Đơn giá</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">Số lượng</TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">Thành tiền</TableHead>
          <TableHead className="bg-background" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {groups.map((group, groupIndex) => {
          const shopItemKeys = group.items.map(
            (i: CartItem) => `${i.productId}_${i.sku}`
          );
          const shopAllSelected = shopItemKeys.every((key: string) =>
            selectedKeys.has(key)
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
                        onToggleSelectShop(group.shopId, shopItemKeys)
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
                  key={`${item.productId}_${item.sku}`}
                  item={item}
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
