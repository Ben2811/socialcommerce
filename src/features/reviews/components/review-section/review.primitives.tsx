import { Star } from "lucide-react";

import { ReviewFilter, REVIEW_FILTERS } from "./review.helpers";

type StarRowProps = {
  rating: number;
};

export function StarRow({ rating }: StarRowProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Đánh giá ${rating} trên 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={18}
          className={index < rating ? "fill-amber-500 text-amber-500" : "text-zinc-300"}
        />
      ))}
    </div>
  );
}

type StarPickerProps = {
  rating: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function StarPicker({ rating, onChange, disabled }: StarPickerProps) {
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Chọn số sao đánh giá">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= rating;

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={rating === starValue}
            aria-label={`${starValue} sao`}
            onClick={() => onChange(starValue)}
            disabled={disabled}
            className={`transition ${disabled ? "cursor-not-allowed opacity-70" : "hover:scale-110"}`}
          >
            <Star
              size={24}
              className={isActive ? "fill-amber-500 text-amber-500" : "text-zinc-300"}
            />
          </button>
        );
      })}
    </div>
  );
}

type UserAvatarProps = {
  username: string;
};

export function UserAvatar({ username }: UserAvatarProps) {
  const trimmed = username.trim();
  const initials = trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "U";

  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-900 text-sm font-bold text-white">
      {initials}
    </div>
  );
}

type ReviewFilterBarProps = {
  activeFilter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
};

export function ReviewFilterBar({ activeFilter, onFilterChange }: ReviewFilterBarProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap gap-2">
        {REVIEW_FILTERS.map((filterKey) => {
          const isActive = activeFilter === filterKey;

          return (
            <button
              key={String(filterKey)}
              type="button"
              onClick={() => onFilterChange(filterKey)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {filterKey === "all" ? (
                "Tất cả"
              ) : (
                <>
                  <span>{filterKey}</span>
                  <Star
                    size={14}
                    className={isActive ? "fill-current text-white" : "fill-amber-500 text-amber-500"}
                  />
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}