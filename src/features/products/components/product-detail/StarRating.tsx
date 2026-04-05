import { Star, StarHalf } from "lucide-react";
import { cn } from "@/features/shared/utils/cn";

interface StarRatingProps {
  rating?: number;
  className?: string;
}

export function StarRating({ rating = 0, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${rating} trên 5 sao`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < fullStars) {
          return (
            <Star key={index} className="size-3.5 fill-amber-400 text-amber-400" />
          );
        }
        if (index === fullStars && hasHalfStar) {
          return (
            <StarHalf key={index} className="size-3.5 fill-amber-400 text-amber-400" />
          );
        }
        return (
          <Star key={index} className="size-3.5 text-muted-foreground/30" />
        );
      })}
    </div>
  );
}