import Image from "next/image";
import { Heart, Star, User } from "lucide-react";
import type { Product } from "../types/product.interface";
import { cn } from "@/features/shared/utils/cn";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    imageUrls,
    name,
    displayPrice,
    ownerId,
    variants,
  } = product;

  const image = imageUrls?.[0] || "/placeholder-product.png";
  const rating = 4.5;
  const sold = 0;

  return (
    <div className={cn(
      "w-full rounded-lg overflow-hidden",
      "bg-card border border-border",
      "flex flex-col cursor-pointer",
      "transition-all duration-300",
      "hover:shadow-lg hover:border-ring"
    )}>
      <div className="relative h-[200px] w-full bg-muted overflow-hidden group">
        <Image
          src={image}
          alt={name}
          fill
          className={cn(
            "object-cover",
            "transition-transform duration-300 group-hover:scale-105"
          )}
        />
        <button className={cn(
          "absolute top-3 right-3 rounded-full p-2",
          "bg-card/80 backdrop-blur-sm",
          "text-muted-foreground hover:text-primary",
          "transition-colors z-10"
        )}>
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-3">
        <div>
          <h3 className={cn(
            "text-sm font-semibold text-foreground",
            "line-clamp-2 mb-2"
          )}>
            {name}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{rating}/5</span>
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          </div>
        </div>

        <div className="flex-1">
          <div className="text-lg font-bold text-primary">
            {displayPrice.toLocaleString('vi-VN')} VND
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {variants.length} {variants.length === 1 ? 'variant' : 'variants'}
          </div>
        </div>

        <div className={cn(
          "pt-3 border-t border-border",
          "flex items-center justify-between gap-2"
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn(
              "w-5 h-5 rounded-full flex-shrink-0",
              "bg-accent flex items-center justify-center"
            )}>
              <User className="w-3 h-3 text-accent-foreground" />
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {ownerId}
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            Sold {sold}
          </span>
        </div>
      </div>
    </div>
  );
}
