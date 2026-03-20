"use client";

import { ProductRow } from "./ProductRow";
import type { Product } from "../../types/product.interface";

interface VirtualProductListProps {
  rows: Product[][];
  isLoadingMore?: boolean;
}

export function VirtualProductList({
  rows,
  isLoadingMore = false,
}: VirtualProductListProps) {
  return (
    <div className="space-y-10">
      {rows.map((row, index) => (
        <div key={index} className="w-full">
          <ProductRow
            products={row}
            isLoadingMore={isLoadingMore && index === rows.length - 1}
          />
        </div>
      ))}
    </div>
  );
}