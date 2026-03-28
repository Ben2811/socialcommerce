import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CartHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link
        href="/"
        aria-label="Quay lại trang chủ"
        className="inline-flex size-9 items-center justify-center rounded-4xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-5" />
      </Link>
      <h1 className="text-2xl font-bold text-foreground">Giỏ Hàng</h1>
    </div>
  );
}
