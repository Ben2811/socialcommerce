import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./StarRating";

interface ProductHeaderProps {
  title: string;
  rating: number;
  reviewCount: number;
}

export function ProductHeader({ title, rating, reviewCount }: ProductHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <StarRating rating={rating} />
          <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
          <Separator orientation="vertical" className="h-3" />
          <span>{reviewCount} đánh giá</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      </div>

      <Button variant="outline" size="icon" aria-label="Thêm vào yêu thích">
        <HeartIcon />
      </Button>
    </div>
  );
}