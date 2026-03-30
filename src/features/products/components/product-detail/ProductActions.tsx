"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon, ShoppingCartIcon, ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductActionsProps {
  inStock: boolean;
  stockQuantity?: number;
}

export function ProductActions({
  inStock,
  stockQuantity,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Giảm số lượng"
          >
            <MinusIcon />
          </Button>
          <span className="w-10 text-center text-sm font-semibold">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={!inStock}
            aria-label="Tăng số lượng"
          >
            <PlusIcon />
          </Button>
        </div>

        <Badge variant={inStock ? "secondary" : "destructive"}>
          {inStock ? "Còn hàng" : "Hết hàng"}
        </Badge>
        <Badge variant={inStock ? "secondary" : "destructive"}>
          {stockQuantity !== undefined
            ? `Số lượng: ${stockQuantity}`
            : "Không có thông tin"}
        </Badge>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1" disabled={!inStock}>
          <ShoppingCartIcon />
          Thêm vào giỏ hàng
        </Button>
        <Button className="flex-1" disabled={!inStock}>
          <ZapIcon />
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
