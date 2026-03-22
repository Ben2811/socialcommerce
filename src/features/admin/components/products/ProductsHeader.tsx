"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminProduct } from "../../types/product";

interface ProductsHeaderProps {
  products: AdminProduct[];
}

export function ProductsHeader({ products }: ProductsHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Quản lý sản phẩm
        </h1>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          Duyệt, cập nhật trạng thái và xóa sản phẩm trong hệ thống
        </p>
      </div>

      <Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tổng sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{products.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Trong hệ thống</p>
        </CardContent>
      </Card>
    </section>
  );
}
