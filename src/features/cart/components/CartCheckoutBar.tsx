"use client";

import { formatPrice } from "@/features/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CartCheckoutBarProps {
  selectedCount: number;
  totalAmount: number;
  totalItems: number;
  allSelected: boolean;
  allItemIds: number[];
  onToggleSelectAll: (allIds: number[]) => void;
  onCheckout: () => void;
}

export function CartCheckoutBar({
  selectedCount,
  totalAmount,
  totalItems,
  allSelected,
  allItemIds,
  onToggleSelectAll,
  onCheckout,
}: CartCheckoutBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-sm">
      {/* Left: select all + total */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="checkout-select-all"
          checked={allSelected}
          onCheckedChange={() => onToggleSelectAll(allItemIds)}
          aria-label="Chọn tất cả"
        />
        <label
          htmlFor="checkout-select-all"
          className="text-sm text-foreground cursor-pointer select-none"
        >
          Chọn tất cả ({totalItems})
        </label>

        <span className="text-sm text-muted-foreground ml-4">
          Tổng cộng ({selectedCount} sản phẩm):{" "}
          <span className="text-primary font-semibold">
            {formatPrice(totalAmount)}
          </span>
        </span>
      </div>

      {/* Right: checkout button */}
      <Button
        variant="orange"
        size="lg"
        onClick={onCheckout}
        disabled={selectedCount === 0}
        aria-label={`Đặt hàng ${selectedCount} sản phẩm`}
      >
        Đặt hàng
      </Button>
    </div>
  );
}
