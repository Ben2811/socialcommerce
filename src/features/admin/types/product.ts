export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface AdminVariant {
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  stock?: number;
}

export interface AdminProduct {
  _id: string;
  name: string;
  description?: string;
  displayPrice: number;
  stock?: number;
  inStock: boolean;
  status: ProductStatus;
  variants: AdminVariant[];
  imageUrls: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  owner: {
    _id: string;
    username: string;
  };
}

export interface UpdateAdminProductStatusInput {
  status: ProductStatus;
}

