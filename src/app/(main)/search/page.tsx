import { ProductList } from "@/features/products";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-[1280px] px-10 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Kết quả tìm kiếm cho: <span className="text-primary">&quot;{q}&quot;</span>
            {category && <span className="text-muted-foreground text-lg ml-2">(Danh mục: {category})</span>}
          </h1>
        </div>
        <ProductList filter={{ search: q, category }} />
      </section>
    </main>
  );
}
