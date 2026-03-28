"use client";

import { formatPrice } from "@/features/shared";
import { Button } from "@/components/ui/button";

interface CartCheckoutBarProps {
  selectedCount: number;
  totalAmount: number;
  onCheckout: () => void;
}

export function CartCheckoutBar({
  selectedCount,
  totalAmount,
  onCheckout,
}: CartCheckoutBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-sm">
      {/* Total */}
      <span className="text-sm text-muted-foreground">
        Tổng cộng ({selectedCount} sản phẩm):{" "}
        <span className="text-primary font-semibold">
          {formatPrice(totalAmount)}
        </span>
      </span>

      {/* Checkout button */}
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
