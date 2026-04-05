import { Badge } from "@/components/ui/badge";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

interface ProductPricingProps {
  price?: number;
  discountPercent?: number;
  description?: string;
}

export function ProductPricing({
  price,
  discountPercent,
  description,
}: ProductPricingProps) {
  const formattedPrice =
    typeof price === "number" && !Number.isNaN(price)
      ? currencyFormatter.format(price)
      : "Liên hệ";

  return (
    <div className="rounded-xl bg-muted/50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
        {discountPercent && (
          <Badge variant="destructive">-{discountPercent}%</Badge>
        )}
      </div>
      {description ? (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}