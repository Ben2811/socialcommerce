"use server";

import {
  CreateReviewInput,
  Review,
  UpdateReviewInput,
} from "@/features/reviews/types/review.interface";
import { reviewService } from "@/features/reviews/services/reviews.service";
import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { BaseResponse } from "@/types/global.types";

async function getToken(): Promise<string | null> {
  return getCookies(tokenType.accessToken);
}

function unauthorizedResponse<T>(): BaseResponse<T> {
  return {
    success: false,
    data: null as T,
    message: "Bạn cần đăng nhập để thực hiện thao tác này",
  };
}

export async function createReviewAction(
  input: CreateReviewInput,
): Promise<BaseResponse<Review>> {
  const token = await getToken();

  if (!token) {
    return unauthorizedResponse<Review>();
  }

  return reviewService.createReview(input, token);
}

export async function updateReviewAction(
  reviewId: string,
  input: UpdateReviewInput,
): Promise<BaseResponse<Review>> {
  const token = await getToken();

  if (!token) {
    return unauthorizedResponse<Review>();
  }

  return reviewService.updateReview(reviewId, input, token);
}

export async function deleteReviewAction(
  reviewId: string,
): Promise<BaseResponse<null>> {
  const token = await getToken();

  if (!token) {
    return unauthorizedResponse<null>();
  }

  return reviewService.deleteReview(reviewId, token);
}
