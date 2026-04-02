"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/shared";

interface CartCheckoutBarProps {
  selectedCount: number;
  totalAmount: number;
  onCheckout: () => void;
  checkoutLabel?: string;
  isCheckoutDisabled?: boolean;
}

export function CartCheckoutBar({
  selectedCount,
  totalAmount,
  onCheckout,
  checkoutLabel = "Đặt hàng",
  isCheckoutDisabled = false,
}: CartCheckoutBarProps) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3">
      <span className="text-sm text-muted-foreground">
        Tổng cộng ({selectedCount} sản phẩm):{" "}
        <span className="font-semibold text-primary">
          {formatPrice(totalAmount)}
        </span>
      </span>

      <Button
        variant="orange"
        size="lg"
        onClick={onCheckout}
        disabled={selectedCount === 0 || isCheckoutDisabled}
        aria-label={`Đặt hàng ${selectedCount} sản phẩm`}
      >
        {checkoutLabel}
      </Button>
    </div>
  );
}