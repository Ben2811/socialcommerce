"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CategoryCommand } from "@/features/categories/componets/CategoryCommand";
import { Category } from "@/features/categories/types/categories.interface";

interface CategoryButtonProps {
  categories: Category[];
  value?: string;
  onChange?: (category: Category | null) => void;
}

export function CategoryButton({ categories, value, onChange }: CategoryButtonProps) {
  const [open, setOpen] = useState(false);

  const selectedCategory = categories.find(
    (c) => (c.slug || c.name) === value
  );

  const handleSelectCategory = (category: Category | null) => {
    if (onChange) {
      onChange(category);
      setOpen(false);
    } else if (category) {
      const slug = category.slug || category.name;
      window.location.href = `/categories/${slug}`;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent"
        aria-label="Browse Categories"
      >
        <span className="hidden sm:inline w-[80px] truncate text-left">
          {selectedCategory ? selectedCategory.name : "Danh mục"}
        </span>
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