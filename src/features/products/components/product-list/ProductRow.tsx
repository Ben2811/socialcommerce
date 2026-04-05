"use client";

import { ProductCard } from "../ProductCard";
import { ProductCardSkeleton } from "../ProductCardSkeleton";
import type { Product } from "../../types/product.interface";

interface ProductRowProps {
  products: Product[];
  isLoadingMore?: boolean;
}

const COLUMNS = 4;

export function ProductRow({ products, isLoadingMore }: ProductRowProps) {
  const visibleProducts = products.slice(0, COLUMNS);
  const remainingSlots = Math.max(0, COLUMNS - visibleProducts.length);

  return (
    <div className="grid w-full grid-cols-1 gap-8 px-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visibleProducts.map((product) => (
        <ProductCard key={product._id || product.name} product={product} />
      ))}

      {isLoadingMore
        ? Array.from({ length: remainingSlots }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        : null}
    </div>
  );
}