"use client";

import React from "react";
import { CartItem } from "../types/cart";
import { CartItemRow } from "./CartItemRow";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CartTableProps {
  items: CartItem[];
  selectedKeys: Set<string>;
  allSelected: boolean;
  allItemKeys: string[];
  onToggleSelectAll: (allKeys: string[]) => void;
  onToggleSelectItem: (productId: string, sku: string) => void;
  onUpdateQuantity: (productId: string, sku: string, delta: number) => void;
  onRemove: (productId: string, sku: string) => void;
}

function getItemKey(item: CartItem): string {
  return `${item.productId}_${item.sku}`;
}

export function CartTable({
  items,
  selectedKeys,
  allSelected,
  allItemKeys,
  onToggleSelectAll,
  onToggleSelectItem,
  onUpdateQuantity,
  onRemove,
}: CartTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border hover:bg-transparent">
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
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">
            Tên sản phẩm
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">
            Danh mục
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">
            Đơn giá
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">
            Số lượng
          </TableHead>
          <TableHead className="text-muted-foreground font-medium text-sm py-3 bg-background">
            Thành tiền
          </TableHead>
          <TableHead className="bg-background" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => {
          const itemKey = getItemKey(item);
          const isSelected = selectedKeys.has(itemKey);

          return (
            <React.Fragment key={itemKey}>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableCell className="pl-4 py-2" colSpan={8}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`select-item-${itemKey}`}
                      checked={isSelected}
                      onCheckedChange={() =>
                        onToggleSelectItem(item.productId, item.sku)
                      }
                      aria-label={`Chọn sản phẩm ${item.productName}`}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {item.productName}
                    </span>
                  </div>
                </TableCell>
              </TableRow>

              <CartItemRow
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}