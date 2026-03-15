import { Banner } from "@/components/home/Banner";
import { FlashSale } from "@/components/home/FlashSale";
import ProductList from "@/components/home/ProductList";
import { productService } from "@/services/products.service";

export default async function Home() {
  const productsResponse = await productService.getProducts();

  console.log(productsResponse.data.items);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-[1280px] px-10 py-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <Banner />
        </div>
        <FlashSale />
        <ProductList products={productsResponse.data.items} />
      </section>
    </main>
  );
}
