"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CategoryCommand } from "@/features/categories/componets/CategoryCommand";
import { Category } from "@/features/categories/types/categories.interface";

interface CategoryButtonProps {
  categories: Category[];
}

export function CategoryButton({ categories }: CategoryButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSelectCategory = (category: Category) => {
    const slug = category.slug || category.name;
    window.location.href = `/categories/${slug}`;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent"
        aria-label="Browse Categories"
      >
        <span className="hidden sm:inline">Danh mục</span>
        <ChevronDown className="h-5 w-5 transition-transform group-hover:scale-110" />
      </button>

      <CategoryCommand
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        onSelectCategory={handleSelectCategory}
      />
    </>
  );
}