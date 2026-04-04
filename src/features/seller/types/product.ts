import { z } from "zod";
import type { Product } from "@/features/products/types";

export const sellerProductStatusValues = [
  "pending",
  "approved",
  "rejected",
] as const;

export type SellerProductStatus = (typeof sellerProductStatusValues)[number];

export interface SellerProduct extends Product {
  _id: string;
  status: SellerProductStatus;
}

export const sellerVariantInputSchema = z.object({
  sku: z.string().trim().min(1, "SKU không được để trống"),
  attributes: z.record(z.string(), z.string()).optional(),
  price: z.number().min(0, "Giá biến thể phải >= 0"),
  stock: z.number().min(0, "Tồn kho biến thể phải >= 0").optional(),
});

export const createSellerProductSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().trim().optional(),
  displayPrice: z.number().min(0, "Giá hiển thị phải >= 0"),
  categoryId: z.string().trim().min(1, "Danh mục không được để trống"),
  stock: z.number().min(0, "Tồn kho phải >= 0").optional(),
  inStock: z.boolean().default(true),
  variants: z
    .array(sellerVariantInputSchema)
    .min(1, "Sản phẩm phải có ít nhất 1 biến thể"),
  imageUrls: z
    .array(z.string().url("URL hình ảnh không hợp lệ"))
    .min(1, "Sản phẩm phải có ít nhất 1 ảnh"),
});

export const updateSellerProductSchema = createSellerProductSchema.partial();

export const updateSellerProductStockSchema = z.object({
  stock: z.number().min(0, "Tồn kho phải >= 0"),
  inStock: z.boolean(),
});

export type CreateSellerProductInput = z.infer<typeof createSellerProductSchema>;
export type UpdateSellerProductInput = z.infer<typeof updateSellerProductSchema>;
export type UpdateSellerProductStockInput = z.infer<
  typeof updateSellerProductStockSchema
>;

export interface SellerProductsFilter {
  page?: number;
  limit?: number;
  status?: SellerProductStatus;
}
