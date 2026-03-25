import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
          <Button
            key={starValue}
            type="button"
            role="radio"
            variant="ghost"
            size="icon-sm"
            aria-checked={rating === starValue}
            aria-label={`${starValue} sao`}
            onClick={() => onChange(starValue)}
            disabled={disabled}
            className="rounded-full"
          >
            <Star
              size={24}
              className={isActive ? "fill-amber-500 text-amber-500" : "text-zinc-300"}
            />
          </Button>
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
    <Avatar size="lg" className="bg-zinc-900">
      <AvatarFallback className="bg-zinc-900 text-sm font-bold text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
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
            <Button
              key={String(filterKey)}
              type="button"
              variant={isActive ? "default" : "secondary"}
              size="xs"
              onClick={() => onFilterChange(filterKey)}
              className="rounded-full"
            >
              {filterKey === "all" ? (
                "Tất cả"
              ) : (
                <>
                  <span>{filterKey}</span>
                  <Star
                    size={12}
                    className={isActive ? "fill-current" : "fill-amber-500 text-amber-500"}
                  />
                </>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}