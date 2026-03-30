import type { Variant } from "@/features/products/types/product.interface";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

interface ProductVariantsProps {
  variants: Variant[];
}

export function ProductVariants({ variants }: ProductVariantsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Tùy chọn sản phẩm</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {variants.map((variant) => (
          <div
            key={variant.sku}
            className="rounded-lg border bg-muted/30 px-3 py-2"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              SKU
            </p>
            <p className="mt-1 text-sm font-medium">{variant.sku}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Giá:</span>
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