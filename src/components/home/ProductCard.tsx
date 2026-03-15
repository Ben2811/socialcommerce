import { Product } from "@/interfaces";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Heart, Star, UserRound } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  const discount = 10;
  const rating = "4.6/5";
  const soldCount = 123;
  const originalPriceValue = product.displayPrice
    ? Number(product.displayPrice)
    : 300000;
  const discountedPriceValue = originalPriceValue * (1 - discount / 100);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  return (
    <Card className="group h-96 flex p-0 flex-col overflow-hidden rounded-2xl border-none bg-card shadow-md transition-all w-full max-w-[280px]">
      <CardHeader className="relative aspect-square p-0 overflow-hidden">
        <Image
          src={product.imageUrls?.[0] || "/img/placeholder.png"}
          alt={product.name || "Product"}
          fill
          className="object-cover "
        />
        {discount > 0 && (
          <div className="absolute text-white top-3 left-3 bg-destructive px-2 py-0.5 rounded text-[10px] font-bold text-destructive-foreground">
            -{discount}%
          </div>
        )}
        <div className="absolute w-6 h-6 top-3 right-3 bg-secondary rounded-md items-center justify-center flex">
          <Heart className="w-4 h-4 " />
        </div>
      </CardHeader>

      {/* Info Section */}
      <CardContent className="flex flex-1 flex-col pb-4 gap-2 px-2 ">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground h-9">
            {product.name || "Product Name"}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 bg-muted/50 px-1.5 py-0.5 rounded">
            <span className="text-[10px] font-medium text-muted-foreground">
              {rating}
            </span>
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-lg font-bold text-primary leading-none">
            {formatPrice(discountedPriceValue)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground line-through opacity-70">
              {formatPrice(originalPriceValue)}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-[60%]">
            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
              <UserRound className="w-4 h-4" />
            </div>
            <span className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
              {"Seller Name"}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase">
            Sold {soldCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
