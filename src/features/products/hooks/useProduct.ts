import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "../services/products.service";
import type { ProductFilter } from "../types";
import type { Product } from "../types/product.interface";
import type { PaginationResponse } from "@/types/global.types";

export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (filter?: ProductFilter) => [...productQueryKeys.lists(), filter ?? {}] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
};

export function useProducts(filter: ProductFilter = {}) {
  return useInfiniteQuery({
    queryKey: productQueryKeys.list(filter),
    queryFn: ({ pageParam = filter.page ?? 1 }) =>
      productService.getProducts({
        ...filter,
        page: pageParam,
      }),
    initialPageParam: filter.page ?? 1,
    getNextPageParam: (
      lastPage: { data: PaginationResponse<Product> },
    ) => {
      if (!lastPage.data) return undefined;
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
}