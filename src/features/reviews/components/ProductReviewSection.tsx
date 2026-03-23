"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  useCreateReview,
  useDeleteReview,
  useProductReviews,
  useUpdateReview,
} from "../hooks/useReviews";
import { ProductReviewsBundle } from "../types/review.interface";
import {
  formatReviewTime,
  getReviewAuthorName,
  getReviewUserId,
  INITIAL_VISIBLE_COUNT,
  ReviewFilter,
} from "./review-section/review.helpers";
import {
  ReviewFilterBar,
  StarPicker,
  StarRow,
  UserAvatar,
} from "./review-section/review.primitives";

type ProductReviewSectionProps = {
  productId: string;
  currentUserId?: string | null;
  initialData: ProductReviewsBundle;
};

export function ProductReviewSection({
  productId,
  currentUserId,
  initialData,
}: ProductReviewSectionProps) {
  const { data } = useProductReviews(productId, initialData);
  const createReviewMutation = useCreateReview(productId);
  const updateReviewMutation = useUpdateReview(productId);
  const deleteReviewMutation = useDeleteReview(productId);

  const reviews = useMemo(() => data?.reviews ?? [], [data?.reviews]);
  const summary = data?.summary ?? initialData.summary;

  const ownReview = useMemo(() => {
    if (!currentUserId) {
      return null;
    }

    return reviews.find((review) => getReviewUserId(review) === currentUserId) ?? null;
  }, [currentUserId, reviews]);

  const [rating, setRating] = useState<number>(ownReview?.rating ?? 5);
  const [comment, setComment] = useState<string>(ownReview?.comment ?? "");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "all") {
      return reviews;
    }

    return reviews.filter((review) => review.rating === activeFilter);
  }, [activeFilter, reviews]);

  const visibleReviews = useMemo(
    () => filteredReviews.slice(0, visibleCount),
    [filteredReviews, visibleCount],
  );

  const hasMoreReviews = visibleReviews.length < filteredReviews.length;

  const isMutating =
    createReviewMutation.isPending ||
    updateReviewMutation.isPending ||
    deleteReviewMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setErrorMessage("Vui lòng nhập bình luận trước khi gửi.");
      return;
    }

    try {
      if (ownReview?._id) {
        await updateReviewMutation.mutateAsync({
          reviewId: ownReview._id,
          input: {
            rating,
            comment: trimmedComment,
          },
        });
      } else {
        await createReviewMutation.mutateAsync({
          productId,
          rating,
          comment: trimmedComment,
        });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể gửi đánh giá. Vui lòng thử lại.",
      );
    }
  }

  async function handleDelete() {
    if (!ownReview?._id) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteReviewMutation.mutateAsync(ownReview._id);
      setRating(5);
      setComment("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể xóa đánh giá. Vui lòng thử lại.",
      );
    }
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">Đánh giá khách hàng</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="h-fit rounded-3xl bg-zinc-50 p-5 ring-1 ring-zinc-200/80 lg:sticky lg:top-24">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-zinc-950">
              {summary.averageRating.toFixed(1)}
            </p>
            <div className="mt-2 flex justify-center">
              <StarRow rating={Math.round(summary.averageRating)} />
            </div>
            <p className="mt-2 text-sm text-zinc-500">{summary.totalReviews} lượt đánh giá</p>
          </div>

          <div className="mt-5 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.ratingBreakdown[star as 1 | 2 | 3 | 4 | 5];
              const percentage = summary.totalReviews
                ? Math.round((count / summary.totalReviews) * 100)
                : 0;

              return (
                <div key={star} className="grid grid-cols-[28px_1fr_36px] items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5">
                    <span className="text-zinc-600">{star}</span>
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200">
                    <div
                      className="h-2 rounded-full bg-amber-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-right text-zinc-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {currentUserId ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-center">
                <label className="text-sm font-medium text-zinc-700">
                  Đánh giá sao
                </label>
                <div className="flex items-center gap-3">
                  <StarPicker
                    rating={rating}
                    onChange={setRating}
                    disabled={isMutating}
                  />
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
                    {rating} sao
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                <label htmlFor="comment" className="text-sm font-medium text-zinc-700">
                  Bình luận
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm"
                  className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none focus:border-rose-400"
                  disabled={isMutating}
                />
              </div>

              {errorMessage ? <p className="mt-2 text-sm text-red-600">{errorMessage}</p> : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
                  disabled={isMutating}
                >
                  {ownReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </button>
                {ownReview ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
                    disabled={isMutating}
                  >
                    Xóa đánh giá
                  </button>
                ) : null}
              </div>
            </form>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              Vui lòng <Link href="/login" className="font-semibold text-rose-500">đăng nhập</Link> để gửi đánh giá.
            </div>
          )}

          <ReviewFilterBar
            activeFilter={activeFilter}
            onFilterChange={(filter) => {
              setActiveFilter(filter);
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
          />

          {filteredReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
              Chưa có bình luận nào phù hợp bộ lọc.
            </div>
          ) : (
            <>
              {visibleReviews.map((review) => {
                const authorName = getReviewAuthorName(review);

                return (
                  <article key={review._id} className="rounded-2xl border border-zinc-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <UserAvatar username={authorName} />
                        <div>
                          <h3 className="font-semibold text-zinc-900">{authorName}</h3>
                          <p className="text-xs text-zinc-500">{formatReviewTime(review.createdAt)}</p>
                        </div>
                      </div>
                      <StarRow rating={review.rating} />
                    </div>
                    <p className="mt-3 pl-[52px] text-sm leading-6 text-zinc-700">{review.comment}</p>
                  </article>
                );
              })}

              {hasMoreReviews ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                  >
                    Xem thêm bình luận
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
