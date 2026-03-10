import { Banner } from "@/components/home/Banner";
import { FlashSale } from "@/components/home/FlashSale";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto px-2 md:px-12 lg:px-16 py-8">
        <Banner />
        <FlashSale />
      </div>
    </main>
  );
}
