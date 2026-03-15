import {
  Banner,
  FlashSale,
  ProductList,
  MOCK_PRODUCTS,
} from "@/features/products";
import { productService } from "@/features/products/services/products.service";

export default async function Home() {
  const productReponse = await productService.getProducts();

  const products = productReponse.data?.items || [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-[1280px] px-10 py-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <Banner />
        </div>
        <FlashSale />
        <ProductList products={products} />
      </section>
    </main>
  );
}
