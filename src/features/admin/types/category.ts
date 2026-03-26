import { z } from "zod";

export interface AdminCategory {
  _id: string;
  name: string;
  description: string;
  slug: string;
  parentCategoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
  level?: number;
}

export const createCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  parentCategoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
