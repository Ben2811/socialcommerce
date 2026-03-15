"use client";

import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <div className={cn("relative flex-1", className)}>
      <div className="flex h-10 w-full overflow-hidden rounded-full border border-input bg-background transition-shadow hover:ring-1 hover:ring-ring focus-within:ring-2 focus-within:ring-ring">
        <div className="flex min-w-[130px] cursor-pointer items-center justify-between bg-muted/50 px-4 text-sm transition-colors hover:bg-muted group">
          <span className="truncate text-muted-foreground group-hover:text-foreground">Danh mục</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
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