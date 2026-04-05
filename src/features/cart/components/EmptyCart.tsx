import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center gap-4">
      <div className="size-24 rounded-full bg-muted flex items-center justify-center">
        <ShoppingCart className="size-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        Giỏ hàng của bạn trống
      </h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        Hãy khám phá những sản phẩm tuyệt vời và thêm chúng vào giỏ hàng của
        bạn.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-4xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        <ArrowLeft className="size-4" />
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
