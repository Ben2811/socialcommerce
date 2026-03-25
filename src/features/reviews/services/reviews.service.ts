import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { BaseResponse } from "@/types/global.types";
import {
  CreateReviewInput,
  ProductReviewsBundle,
  Review,
  ReviewSummary,
  UpdateReviewInput,
} from "../types/review.interface";

interface IReviewService {
  getReviewsByProduct(productId: string): Promise<BaseResponse<Review[]>>;
  getReviewSummaryByProduct(productId: string): Promise<BaseResponse<ReviewSummary>>;
  getProductReviewsBundle(productId: string): Promise<BaseResponse<ProductReviewsBundle>>;
  createReview(input: CreateReviewInput, token: string): Promise<BaseResponse<Review>>;
  updateReview(reviewId: string, input: UpdateReviewInput, token: string): Promise<BaseResponse<Review>>;
  deleteReview(reviewId: string, token: string): Promise<BaseResponse<null>>;
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

  async createReview(
    input: CreateReviewInput,
    token: string,
  ): Promise<BaseResponse<Review>> {
    const url = new URLBuilder().addPath(API_ENDPOINTS.reviews).build();
    return apiClient.post<CreateReviewInput, Review>(url, input, token);
  }

  async updateReview(
    reviewId: string,
    input: UpdateReviewInput,
    token: string,
  ): Promise<BaseResponse<Review>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.reviews)
      .addParam(reviewId)
      .build();
    return apiClient.put<UpdateReviewInput, Review>(url, input, token);
  }

  async deleteReview(
    reviewId: string,
    token: string,
  ): Promise<BaseResponse<null>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.reviews)
      .addParam(reviewId)
      .build();
    return apiClient.delete<null>(url, token);
  }
}

export const reviewService = new ReviewService();
