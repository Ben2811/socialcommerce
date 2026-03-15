import z from "zod";

export const VariantZodSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required"),
  attributes: z.record(z.string(), z.string()).optional(),
  price: z.number().min(0, "Price must be non-negative"),
  stock: z.number().min(0).optional(),
});

export const ProductZodSchema = z.object({
  _id: z.string().optional(),
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().trim().optional(),
  displayPrice: z.number().min(0, "Display price must be non-negative"),
  categoryId: z.string().trim().min(1, "Category ID is required"),
  ownerId: z.string().trim().min(1, "Owner ID is required"),
  stock: z.number().min(0).optional(),
  variants: z
    .array(VariantZodSchema)
    .min(1, "Product must have at least one variant"),
  imageUrls: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "Product must have at least one image URL"),
  inStock: z.boolean().default(true),
});

export type Variant = z.infer<typeof VariantZodSchema>;
export type Product = z.infer<typeof ProductZodSchema>;
