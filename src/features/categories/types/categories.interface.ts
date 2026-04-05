import z from "zod";

export const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  parentCategoryId: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
  level: z.number().int().optional(),
});

export type Category = z.infer<typeof categorySchema>;
