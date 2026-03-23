"use server";

import {
  CreateReviewInput,
  Review,
  UpdateReviewInput,
} from "@/features/reviews/types/review.interface";
import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
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

  const url = new URLBuilder().addPath(API_ENDPOINTS.reviews).build();
  return apiClient.post<CreateReviewInput, Review>(url, input, token);
}

export async function updateReviewAction(
  reviewId: string,
  input: UpdateReviewInput,
): Promise<BaseResponse<Review>> {
  const token = await getToken();

  if (!token) {
    return unauthorizedResponse<Review>();
  }

  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.reviews)
    .addParam(reviewId)
    .build();

  return apiClient.put<UpdateReviewInput, Review>(url, input, token);
}

export async function deleteReviewAction(
  reviewId: string,
): Promise<BaseResponse<null>> {
  const token = await getToken();

  if (!token) {
    return unauthorizedResponse<null>();
  }

  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.reviews)
    .addParam(reviewId)
    .build();

  return apiClient.delete<null>(url, token);
}
