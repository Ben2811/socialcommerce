import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { BaseResponse } from "@/types/global.types";
import {
  ProductReviewsBundle,
  Review,
  ReviewSummary,
} from "../types/review.interface";

interface IReviewService {
  getReviewsByProduct(productId: string): Promise<BaseResponse<Review[]>>;
  getReviewSummaryByProduct(productId: string): Promise<BaseResponse<ReviewSummary>>;
  getProductReviewsBundle(productId: string): Promise<BaseResponse<ProductReviewsBundle>>;
}

const emptySummary: ReviewSummary = {
  averageRating: 0,
  totalReviews: 0,
  ratingBreakdown: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
};

export class ReviewService implements IReviewService {
  async getReviewsByProduct(productId: string): Promise<BaseResponse<Review[]>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.reviews)
      .addParam("product")
      .addParam(productId)
      .build();

    return apiClient.get<Review[]>(url);
  }

  async getReviewSummaryByProduct(
    productId: string,
  ): Promise<BaseResponse<ReviewSummary>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.reviews)
      .addParam("product")
      .addParam(productId)
      .addParam("summary")
      .build();

    return apiClient.get<ReviewSummary>(url);
  }

  async getProductReviewsBundle(
    productId: string,
  ): Promise<BaseResponse<ProductReviewsBundle>> {
    const [reviewsResponse, summaryResponse] = await Promise.all([
      this.getReviewsByProduct(productId),
      this.getReviewSummaryByProduct(productId),
    ]);

    if (!reviewsResponse.success) {
      return {
        success: false,
        data: {
          reviews: [],
          summary: emptySummary,
        },
        message: reviewsResponse.message,
      };
    }

    if (!summaryResponse.success) {
      return {
        success: false,
        data: {
          reviews: reviewsResponse.data ?? [],
          summary: emptySummary,
        },
        message: summaryResponse.message,
      };
    }

    return {
      success: true,
      data: {
        reviews: reviewsResponse.data ?? [],
        summary: summaryResponse.data ?? emptySummary,
      },
      message: "Reviews fetched successfully",
    };
  }
}

export const reviewService = new ReviewService();
