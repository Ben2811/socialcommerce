"use client";

import { useCallback, useMemo } from "react";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { cn } from "@/features/shared/utils/cn";
import { Category } from "../types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface CategoryCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
}

export function CategoryCommand({
  open,
  onOpenChange,
  categories,
  onSelectCategory,
}: CategoryCommandProps) {
  const parentCategories = useMemo(
    () => {
      if (!categories || !Array.isArray(categories)) {
        return [];
      }
      return categories.filter((cat) => !cat.parentCategoryId);
    },
    [categories],
  );

  const getSubcategories = useCallback(
    (parentId: string) => {
      if (!categories || !Array.isArray(categories)) {
        return [];
      }
      return categories.filter((cat) => cat.parentCategoryId === parentId);
    },
    [categories],
  );

  const handleSelectCategory = useCallback(
    (category: Category) => {
      onSelectCategory?.(category);
      onOpenChange(false);
    },
    [onSelectCategory, onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border border-border">
        <CommandInput
          placeholder="Search categories..."
          className="border-b border-border"
        />
        <CommandList className="max-h-[300px]">
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No categories found.
          </CommandEmpty>

          <CommandGroup>
            <CommandItem
              value=""
              onSelect={() => handleSelectCategory({ _id: "", name: "Tất cả danh mục", slug: "", description: "" })}
            >
              Tất cả danh mục
            </CommandItem>
          </CommandGroup>

          {parentCategories && parentCategories.length > 0 ? (
            parentCategories.map((category) => {
              const subcategories = getSubcategories(category._id || "");
              const hasSubcategories = subcategories.length > 0;

              return (
                <CommandGroup
                  key={category._id}
                  heading={
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {category.imageUrl && (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-4 w-4 rounded object-cover"
                        />
                      )}
                      {category.name}
                    </div>
                  }
                  className="overflow-hidden"
                >
                  {hasSubcategories ? (
                    subcategories.map((subcategory) => (
                      <CommandItem
                        key={subcategory._id}
                        value={subcategory.slug || subcategory.name}
                        onSelect={() => handleSelectCategory(subcategory)}
                        className={cn(
                          "flex items-center justify-between cursor-pointer",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground",
                        )}
                      >
                        <span className="flex-1 truncate">
                          {subcategory.name}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem
                      key={category._id}
                      value={category.slug || category.name}
                      onSelect={() => handleSelectCategory(category)}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                      )}
                    >
                      <span className="flex-1 truncate">{category.name}</span>
                      {category.description && (
                        <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                          {category.description.substring(0, 30)}...
                        </span>
                      )}
                    </CommandItem>
                  )}
                </CommandGroup>
              );
            })
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}