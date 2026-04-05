"use client";

import { Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminCategory } from "../../types/category";

interface CategoriesHeaderProps {
  categories: AdminCategory[];
  onAddCategory: () => void;
}

export function CategoriesHeader({ categories, onAddCategory }: CategoriesHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Quản lý danh mục
          </h1>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            Xem và quản lý tất cả danh mục sản phẩm trong hệ thống
          </p>
        </div>
        <Button
          onClick={onAddCategory}
          className="gap-2 rounded-xl bg-[#f6a313] text-white hover:bg-[#eb9800]"
        >
          <Tags className="size-4" />
          Thêm danh mục
        </Button>
      </div>

      <Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tổng danh mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{categories.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Trong hệ thống</p>
        </CardContent>
      </Card>
    </section>
  );
}
