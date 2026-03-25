export interface ReviewAuthor {
  _id: string;
  username: string;
}

export interface Review {
  _id: string;
  userId: string | ReviewAuthor;
  productId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  user?: ReviewAuthor;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ProductReviewsBundle {
  reviews: Review[];
  summary: ReviewSummary;
}
