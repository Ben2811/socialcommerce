"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/features/shared/utils/cn";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const displayImages =
    images.length > 0 ? images : ["/placeholder-product.jpg"];

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <Card className="border-0 w-1/2">
      <CardContent className="space-y-4 pt-6">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {displayImages.map((image, index) => (
              <CarouselItem key={`main-${index}`}>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image}
                    alt={`${title} - ảnh ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {displayImages.length > 1 && (
            <>
              <CarouselPrevious className="-left-12 sm:-left-14" />
              <CarouselNext className="-right-12 sm:-right-14" />
            </>
          )}
        </Carousel>

        {displayImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {displayImages.map((image, index) => (
              <button
                key={`thumb-${index}`}
                type="button"
                onClick={() => handleThumbnailClick(index)}
                aria-label={`Xem ảnh ${index + 1}`}
                className={cn(
                  "relative overflow-hidden rounded-lg border-2 transition hover:opacity-75",
                  current === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent",
                )}
              >
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={image}
                    alt={`${title} - thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
