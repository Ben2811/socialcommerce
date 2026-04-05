"use client";

import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "@/actions/reviews/reviews";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviews.service";
import {
  CreateReviewInput,
  ProductReviewsBundle,
  UpdateReviewInput,
} from "../types/review.interface";

export const reviewQueryKeys = {
  all: ["reviews"] as const,
  byProduct: (productId: string) => [...reviewQueryKeys.all, "product", productId] as const,
};

export function useProductReviews(
  productId: string,
  initialData?: ProductReviewsBundle,
) {
  return useQuery({
    queryKey: reviewQueryKeys.byProduct(productId),
    queryFn: async () => {
      const response = await reviewService.getProductReviewsBundle(productId);
      if (!response.success) {
        throw new Error(response.message || "Không thể tải đánh giá sản phẩm");
      }
      return response.data;
    },
    initialData,
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const response = await createReviewAction(input);
      if (!response.success) {
        throw new Error(response.message || "Không thể gửi đánh giá");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.byProduct(productId),
      });
    },
  });
}

export function useUpdateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      input,
    }: {
      reviewId: string;
      input: UpdateReviewInput;
    }) => {
      const response = await updateReviewAction(reviewId, input);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật đánh giá");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.byProduct(productId),
      });
    },
  });
}

export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await deleteReviewAction(reviewId);
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa đánh giá");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.byProduct(productId),
      });
    },
  });
}
