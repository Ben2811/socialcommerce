import { ShoppingBag } from "lucide-react";

export default function SellerProductsPage() {
  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="mb-4 text-sm font-medium text-muted-foreground">
        <span>Seller</span> <span className="mx-1">&gt;</span> <span className="text-foreground">Sản phẩm</span>
      </div>
      <div className="flex-1 bg-card rounded-xl shadow-sm border border-border/50 flex flex-col items-center justify-center text-muted-foreground/60">
        <ShoppingBag className="size-16 mb-4 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground/80">Quản lý sản phẩm</h2>
        <p className="mt-2 text-sm text-center max-w-sm">
          Tính năng đang được phát triển. Tại đây bạn sẽ có thể quản lý danh sách sản phẩm, thêm mới, sửa, và xóa sản phẩm của mình.
        </p>
      </div>
    </div>
  );
}
