import { ProductCard } from "@/components/home/ProductCard";
import { Product } from "@/interfaces";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <section className="mx-auto mt-10 w-full max-w-[1200px]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Danh sách sản phẩm
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-primary transition-colors hover:opacity-80"
        >
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {products?.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
}
