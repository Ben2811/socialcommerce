"use client";

import { Search } from "lucide-react";
import { cn } from "@/features/shared/utils/cn";
import { Category } from "@/features/categories";
import { CategoryButton } from "@/features/categories/componets/CategoryButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  className?: string;
  categories: Category[];
}

function SearchForm({
  categories,
  initialQuery,
  initialCategory,
}: {
  categories: Category[];
  initialQuery: string;
  initialCategory: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.append("q", query.trim());
    if (category) params.append("category", category);
    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  const handleCategorySelect = (selected: Category | null) => {
    const catSlug = selected?.slug ?? "";
    setCategory(catSlug);

    const params = new URLSearchParams();
    if (query.trim()) params.append("q", query.trim());
    if (catSlug) params.append("category", catSlug);
    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  return (
    <>
      <div className="flex min-w-[130px] cursor-pointer items-center justify-between bg-muted/50 px-4 text-sm transition-colors hover:bg-muted group">
        <CategoryButton
          categories={categories}
          value={category}
          onChange={handleCategorySelect}
        />
      </div>
      <form onSubmit={handleSearch} className="flex flex-1 items-center pl-2 pr-1">
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-8 shrink-0 rounded-full hover:bg-transparent hover:text-foreground"
          aria-label="Tìm kiếm"
        >
          <Search className="size-4" />
        </Button>
        <Input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          aria-label="Ô nhập từ khóa tìm kiếm"
          className="h-full flex-1 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
        />
      </form>
    </>
  );
}

function SearchFormContainer({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";
  const initialCategory = searchParams?.get("category") ?? "";
  const searchKey = searchParams?.toString() ?? "";

  return (
    <SearchForm
      key={searchKey}
      categories={categories}
      initialQuery={initialQuery}
      initialCategory={initialCategory}
    />
  );
}

export function SearchBar({ className, categories }: SearchBarProps) {
  return (
    <div className={cn("relative flex-1", className)}>
      <div className="flex h-10 w-full overflow-hidden rounded-full border border-input bg-background transition-shadow hover:ring-1 hover:ring-ring focus-within:ring-2 focus-within:ring-ring">
        <Suspense
          fallback={
            <>
              <div className="flex min-w-[130px] items-center justify-between bg-muted/50 px-4 text-sm text-muted-foreground/50">
                <span>Danh mục</span>
                <Search className="h-4 w-4" />
              </div>
              <div className="flex flex-1 items-center pl-2 pr-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground/30 size-8 shrink-0 rounded-full cursor-not-allowed"
                  disabled
                >
                  <Search className="size-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="h-full flex-1 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0 disabled:opacity-30"
                  disabled
                />
              </div>
            </>
          }
        >
          <SearchFormContainer categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
