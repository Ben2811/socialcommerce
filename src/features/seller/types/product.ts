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

function createRequiredNonNegativeNumberSchema(message: string) {
  return z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length === 0 ? Number.NaN : Number(trimmed);
      }

      if (value === null || value === undefined) {
        return Number.NaN;
      }

      return value;
    },
    z.union([z.number(), z.nan()]).superRefine((value, ctx) => {
      if (!Number.isFinite(value) || value < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      }
    }),
  );
}

function createOptionalNonNegativeNumberSchema(message: string) {
  return z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length === 0 ? undefined : Number(trimmed);
      }

      if (value === null) {
        return undefined;
      }

      return value;
    },
    z
      .union([z.number(), z.nan(), z.undefined()])
      .superRefine((value, ctx) => {
        if (value === undefined) {
          return;
        }

        if (!Number.isFinite(value) || value < 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message });
        }
      }),
  );
}

export const sellerVariantInputSchema = z.object({
  sku: z.string().trim().min(1, "SKU không được để trống"),
  attributes: z.record(z.string(), z.string()).optional(),
  price: createRequiredNonNegativeNumberSchema("Giá biến thể phải >= 0"),
  stock: createOptionalNonNegativeNumberSchema("Tồn kho biến thể phải >= 0"),
});

export const createSellerProductSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().trim().optional(),
  displayPrice: createRequiredNonNegativeNumberSchema("Giá hiển thị phải >= 0"),
  categoryId: z.string().trim().min(1, "Danh mục không được để trống"),
  stock: createOptionalNonNegativeNumberSchema("Tồn kho phải >= 0"),
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
  stock: createRequiredNonNegativeNumberSchema("Tồn kho phải >= 0"),
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
  search?: string;
}
