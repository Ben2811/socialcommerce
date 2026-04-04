"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type {
  SellerProduct,
  UpdateSellerProductStockInput,
} from "@/features/seller/types/product";
import { updateSellerProductStockSchema } from "@/features/seller/types/product";

interface SellerStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: SellerProduct | null;
  onSubmit: (
    productId: string,
    input: UpdateSellerProductStockInput,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function SellerStockDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: SellerStockDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && product && (
          <SellerStockDialogInner
            key={product._id}
            product={product}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SellerStockDialogInner({
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: Omit<SellerStockDialogProps, "open"> & {
  product: SellerProduct;
}) {
  const [stock, setStock] = useState(String(product.stock ?? 0));
  const [inStock, setInStock] = useState(product.inStock ?? true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const parsed = updateSellerProductStockSchema.safeParse({
      stock: stock.trim() === "" ? Number.NaN : Number(stock),
      inStock,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dữ liệu tồn kho không hợp lệ");
      return;
    }

    await onSubmit(product._id, parsed.data);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Cập nhật tồn kho</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Sản phẩm: <span className="font-medium text-foreground">{product.name}</span>
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-medium">
            Số lượng tồn kho
          </label>
          <Input
            id="stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="in-stock"
            checked={inStock}
            onCheckedChange={setInStock}
            disabled={isLoading}
          />
          <label htmlFor="in-stock" className="text-sm font-medium">
            Đang còn hàng
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Sau khi cập nhật tồn kho, sản phẩm sẽ được chuyển về trạng thái chờ
          duyệt để admin kiểm tra lại.
        </p>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu tồn kho"}
        </Button>
      </DialogFooter>
    </>
  );
}
