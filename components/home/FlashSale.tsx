import { Bolt } from "lucide-react";
import { ProductCard } from "@/components/home/ProductCard";
import { IMAGES } from "@/constants/images";

const MOCK_PRODUCTS = Array(6).fill({
  title: "Glorious Grip Tape",
  price: 270000,
  originalPrice: 300000,
  rating: 4.6,
  discount: 10,
  sold: 123,
  author: "Nguyễn Thành Quang",
  image: IMAGES.PRODUCT,
});

export function FlashSale() {
  return (
    <section className="mx-auto mt-8 w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Bolt className="h-6 w-6 fill-chart-1 text-chart-1" />
          </div>

          <h2 className="text-2xl font-bold uppercase text-chart-4">
            FLASH SALE
          </h2>

          <div className="hidden items-center gap-2 text-2xl font-bold text-foreground md:flex">
            <span>02</span>:<span>45</span>:<span>12</span>
          </div>
        </div>

        <button
          type="button"
          className="text-sm font-bold text-chart-4 transition-colors hover:text-chart-3 hover:underline"
        >
          Xem Tất Cả Deal
        </button>
      </div>

      <div className="flex items-center gap-8 overflow-x-auto py-2 pb-4">
        {MOCK_PRODUCTS.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
}
