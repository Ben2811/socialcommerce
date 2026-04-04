"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SellerProductsHeaderProps {
  totalItems: number;
  onAddProduct: () => void;
}

export function SellerProductsHeader({
  totalItems,
  onAddProduct,
}: SellerProductsHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Quản lý sản phẩm
        </h1>
      </div>

      <Card className="border-border/70 bg-card shadow-sm">
        <div className="flex items-start justify-between gap-6 px-6 ">
          <div>
            <CardHeader className="pb-3 px-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng sản phẩm của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="text-3xl font-bold">
                {totalItems.toLocaleString("vi-VN")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bao gồm cả chờ duyệt và đã duyệt
              </p>
            </CardContent>
          </div>
          <Button onClick={onAddProduct} variant="orange" className="gap-2 shrink-0">
            <Plus className="size-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </Card>
    </section>
  );
}
