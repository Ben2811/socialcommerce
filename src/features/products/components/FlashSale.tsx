import { Bolt } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { MOCK_PRODUCTS } from "../constants/mock-data";
import { cn } from "@/features/shared/utils/cn";

export function FlashSale() {
  return (
    <div className="my-8">
      <div className={cn(
        "flex items-center justify-between mb-6",
        "flex-wrap gap-4"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            "bg-accent"
          )}>
            <Bolt className="w-6 h-6 text-accent-foreground fill-accent-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary uppercase">
            FLASH SALE
          </h2>
          <div className="hidden md:flex items-center gap-2 text-2xl font-bold text-foreground">
            <span>02</span>:<span>45</span>:<span>12</span>
          </div>
        </div>

        <button className="text-primary font-bold hover:text-primary/80 transition-colors">
          Xem Tất Cả Deal
        </button>
      </div>

      <div className={cn(
        "flex gap-6 overflow-x-auto pb-4",
        "scrollbar-hide py-2"
      )}>
        {MOCK_PRODUCTS.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-[250px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
