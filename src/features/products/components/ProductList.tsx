"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { useProducts } from "../hooks/useProduct";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/features/shared/utils/cn";
import type { Product } from "../types/product.interface";
import type { ProductFilter } from "../types";
import type { BaseResponse, PaginationResponse } from "@/types/global.types";

export interface ProductListProps {
  filter?: ProductFilter;
  initialProductsPage?: BaseResponse<PaginationResponse<Product>>;
}

function getItemsPerRow(width: number) {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 2;
}

function getEstimatedRowHeight(itemsPerRow: number) {
  if (itemsPerRow === 2) return 500;
  if (itemsPerRow === 3) return 500;
  return 500;
}

export function ProductList({ filter, initialProductsPage }: ProductListProps = {}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState(4);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useProducts(filter, { initialPage: initialProductsPage });

  const isIntersecting = useIntersectionObserver(sentinelRef, {
    enabled: !!hasNextPage,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isIntersecting]);

  useEffect(() => {
    const updateItemsPerRow = () => {
      setItemsPerRow(getItemsPerRow(window.innerWidth));
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);

    return () => {
      window.removeEventListener("resize", updateItemsPerRow);
    };
  }, []);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.data.items) ?? [],
    [data],
  );

  const rows = useMemo(() => {
    const grouped: Product[][] = [];
    for (let i = 0; i < products.length; i += itemsPerRow) {
      grouped.push(products.slice(i, i + itemsPerRow));
    }
    return grouped;
  }, [products, itemsPerRow]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => getEstimatedRowHeight(itemsPerRow) + 32,
    overscan: 6,
  });

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-6",
          "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length && !isFetchingNextPage) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <p className="text-lg text-muted-foreground">No products available</p>
      </div>
    );
  }

  const virtualRows = rowVirtualizer.getVirtualItems();
  const visibleRows = virtualRows.map((virtualRow) => rows[virtualRow.index]);

  return (
    <div className="space-y-10">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualRows.map((virtualRow, index) => {
          const row = visibleRows[index];
          if (!row) return null;

          const isLastVisibleRow = virtualRow.index === virtualRows.length - 1;
          const skeletonCount =
            isFetchingNextPage && isLastVisibleRow
              ? Math.max(0, itemsPerRow - row.length)
              : 0;

          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 top-0 w-full px-1"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: 32,
              }}
            >
              <div
                className={cn(
                  "grid w-full gap-8",
                  itemsPerRow === 2 && "grid-cols-2",
                  itemsPerRow === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                  itemsPerRow === 4 &&
                  "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                )}
              >
                {row.map((product) => (
                  <ProductCard key={product._id || product.name} product={product} />
                ))}

                {Array.from({ length: skeletonCount }).map((_, skeletonIndex) => (
                  <ProductCardSkeleton
                    key={`skeleton-${virtualRow.index}-${skeletonIndex}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={sentinelRef} className="h-1 w-full" />
    </div>
  );
}