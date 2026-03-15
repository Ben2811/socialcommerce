"use client";

import { Search } from "lucide-react";
import { cn } from "@/features/shared/utils/cn";
import { Category } from "@/features/categories";
import { CategoryButton } from "@/features/categories/componets/CategoryButton";

interface SearchBarProps {
  className?: string;
  categories: Category[];
}

export function SearchBar({ className, categories }: SearchBarProps) {
  return (
    <div className={cn("relative flex-1", className)}>
      <div className="flex h-10 w-full overflow-hidden rounded-full border border-input bg-background transition-shadow hover:ring-1 hover:ring-ring focus-within:ring-2 focus-within:ring-ring">
        <div className="flex min-w-[130px] cursor-pointer items-center justify-between bg-muted/50 px-4 text-sm transition-colors hover:bg-muted group">
          <CategoryButton categories={categories} />
        </div>
        <div className="flex flex-1 items-center px-4">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:placeholder:opacity-70"
          />
        </div>
      </div>
    </div>
  );
}
