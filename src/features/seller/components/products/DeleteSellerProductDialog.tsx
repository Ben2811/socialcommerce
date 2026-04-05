"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SellerProduct } from "@/features/seller/types/product";

interface DeleteSellerProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: SellerProduct | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteSellerProductDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  isLoading,
}: DeleteSellerProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Bạn có chắc chắn muốn xóa sản phẩm{" "}
          <span className="font-medium text-foreground">{product?.name}</span>?
          Hành động này không thể hoàn tác.
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
