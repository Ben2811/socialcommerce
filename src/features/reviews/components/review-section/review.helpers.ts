import { Review } from "../../types/review.interface";

export type ReviewFilter = "all" | 1 | 2 | 3 | 4 | 5;

export const REVIEW_FILTERS: ReviewFilter[] = ["all", 5, 4, 3, 2, 1];

export const INITIAL_VISIBLE_COUNT = 10;

export function getReviewUserId(review: Review): string {
  if (typeof review.userId === "string") {
    return review.userId;
  }

  if (review.userId && typeof review.userId === "object" && "_id" in review.userId) {
    return String(review.userId._id);
  }

  return "";
}

export function getReviewAuthorName(review: Review): string {
  if (review.user?.username) {
    return review.user.username;
  }

  if (review.userId && typeof review.userId === "object" && "username" in review.userId) {
    return review.userId.username;
  }

  return "Người dùng";
}

export function formatReviewTime(isoDate?: string): string {
  if (!isoDate) {
    return "Vừa xong";
  }

  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return "Vừa xong";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute));
    return `${minutes} phút trước`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.floor(diffMs / hour));
    return `${hours} giờ trước`;
  }

  const days = Math.max(1, Math.floor(diffMs / day));
  return `${days} ngày trước`;
}