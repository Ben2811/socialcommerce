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

export interface CreateCategoryInput {
  name: string;
  description: string;
  slug: string;
  parentCategoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
