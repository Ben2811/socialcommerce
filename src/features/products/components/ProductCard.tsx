import Image from "next/image";
import { Heart, Star, User } from "lucide-react";
import type { Product } from "../types/product.interface";
import { cn } from "@/features/shared/utils/cn";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { imageUrls, name, displayPrice, ownerId, variants } = product;

  const image = imageUrls?.[0] || "/placeholder-product.png";
  const rating = 4.5;
  const sold = 0;

    return (
      <Card className="w-full h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-ring p-0 relative group flex flex-col">
        <Link href={`/products/${product._id}`} className="absolute inset-0 z-0" aria-label={`View ${name}`}>
          <span className="sr-only">View {name}</span>
        </Link>

        <div className="relative h-[200px] w-full bg-muted overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover",
              "transition-transform duration-300 group-hover:scale-105",
            )}
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 rounded-full z-10",
              "bg-card/80 backdrop-blur-sm",
              "text-muted-foreground hover:text-primary hover:bg-card/90",
            )}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="flex-1 flex flex-col p-4 gap-3">
          <div>
            <h3
              className={cn(
                "text-sm font-semibold text-foreground",
                "line-clamp-2 mb-2",
              )}
            >
              {name}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{rating}/5</span>
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            </div>
          </div>

          <div className="flex-1">
            <div className="text-lg font-bold text-primary">
              {displayPrice.toLocaleString("vi-VN")} VND
            </div>
            <Badge variant="secondary" className="mt-2">
              {variants.length} {variants.length === 1 ? "variant" : "variants"}
            </Badge>
          </div>

          <div
            className={cn(
              "pt-3 border-t border-border",
              "flex items-center justify-between gap-2",
            )}
          >
            <Link
              href={`/shop/${ownerId}`}
              className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity relative z-10"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex-shrink-0",
                  "bg-accent flex items-center justify-center",
                )}
              >
                <User className="w-3 h-3 text-accent-foreground" />
              </div>
              <span className="text-xs text-foreground font-medium truncate hover:underline">
                {ownerId}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              Sold {sold}
            </span>
          </div>
        </CardContent>
      </Card>
  );
}
