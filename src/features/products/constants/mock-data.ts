import { Product } from "../types/product.interface";

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f0f0f0" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16" font-family="Arial"%3EProduct Image%3C/text%3E%3C/svg%3E';

export const MOCK_PRODUCTS: Product[] = Array(6).fill(null).map((_, i) => ({
  _id: `product-${i}`,
  name: "Glorious Grip Tape",
  displayPrice: 270000,
  categoryId: "electronics",
  ownerId: "seller-123",
  variants: [
    {
      sku: "GGT-001",
      price: 270000,
      stock: 100,
      attributes: {
        color: "black",
        size: "M"
      }
    }
  ],
  imageUrls: [
    PLACEHOLDER_IMAGE,
    PLACEHOLDER_IMAGE
  ],
  inStock: true,
  description: "Premium grip tape for gaming mouse pads",
  stock: 100
}));
