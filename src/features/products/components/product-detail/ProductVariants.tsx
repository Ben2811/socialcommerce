"use client";
import type { Variant } from "@/features/products/types/product.interface";
import {
  useSelectedVariant,
  useSetSelectedVariant,
} from "../../store/productDetailsStore";
import { cn } from "@/features/shared/utils/cn";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

interface ProductVariantsProps {
  variants: Variant[];
}

export function ProductVariants({ variants }: ProductVariantsProps) {
  const setSelectedVariant = useSetSelectedVariant();
  const selectedVariant = useSelectedVariant();
  const handleSelectVariant = (variant: Variant) => {
    if (selectedVariant?.sku === variant.sku) {
      setSelectedVariant(null);
      return;
    }
    setSelectedVariant(variant);
  };
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Tùy chọn sản phẩm</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {variants.map((variant) => (
          <div
            key={variant.sku}
            className={cn(
              "border border-border rounded-sm p-3 cursor-pointer hover:bg-accent",
              selectedVariant?.sku === variant.sku && "border-primary border-2",
            )}
            onClick={() => handleSelectVariant(variant)}
          >
            <p className="text-xs upperc965 ₫ase tracking-wide text-muted-foreground">
              SKU
            </p>
            <p className="mt-1 text-sm font-medium">{variant.sku}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Giá: </span>
              <span className="font-semibold text-primary">
                {currencyFormatter.format(variant.price)}
              </span>
            </div>
            {variant.stock !== undefined && (
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Kho:</span>
                <span className="font-medium">{variant.stock} sản phẩm</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
