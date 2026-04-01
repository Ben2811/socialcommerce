import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "../services/products.service";
import type { ProductFilter } from "../types";
import type { Product } from "../types/product.interface";
import type { BaseResponse, PaginationResponse } from "@/types/global.types";

export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (filter?: ProductFilter) => [...productQueryKeys.lists(), filter ?? {}] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
};

interface UseProductsOptions {
  initialPage?: BaseResponse<PaginationResponse<Product>>;
}

export function useProducts(
  filter: ProductFilter = {},
  options: UseProductsOptions = {},
) {
  const initialPageParam = filter.page ?? 1;

  return useInfiniteQuery({
    queryKey: productQueryKeys.list(filter),
    queryFn: ({ pageParam = initialPageParam }) =>
      productService.getProducts({
        ...filter,
        page: pageParam,
      }),
    initialPageParam,
    getNextPageParam: (
      lastPage: { data: PaginationResponse<Product> },
    ) => {
      if (!lastPage.data) return undefined;
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialData: options.initialPage
      ? {
          pages: [options.initialPage],
          pageParams: [initialPageParam],
        }
      : undefined,
    refetchOnMount: options.initialPage ? false : undefined,
  });
}