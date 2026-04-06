"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Package, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function CodResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId")?.trim();

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-foreground">Không tìm thấy đơn hàng</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Liên kết xác nhận không hợp lệ hoặc thiếu mã đơn hàng.
          </p>

          <Button id="cod-go-home-btn" onClick={() => router.replace("/")}>
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
          Đặt hàng thành công!
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Đơn hàng của bạn đã được xác nhận. Vui lòng chuẩn bị tiền mặt khi
          shipper giao hàng đến.
        </p>

        <div className="mb-8 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Mã đơn hàng</span>
            <span className="text-right font-medium break-all">{orderId}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Phương thức thanh toán</span>
            <span className="text-right font-medium">Tiền mặt khi nhận hàng</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Trạng thái</span>
            <span className="text-right font-medium text-success">Đã xác nhận</span>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <div className="mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-semibold text-primary">Lưu ý khi nhận hàng</span>
          </div>
          <ul className="list-inside list-disc space-y-1 text-primary/80">
            <li>Chuẩn bị đúng số tiền cần thanh toán</li>
            <li>Kiểm tra hàng trước khi thanh toán cho shipper</li>
            <li>Giữ lại biên lai giao hàng sau khi nhận</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            id="cod-view-order-btn"
            onClick={() => router.push("/profile")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Xem đơn hàng của tôi
          </Button>
          <Button
            id="cod-continue-shopping-btn"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}

function CodResultSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function CodResultPage() {
  return (
    <Suspense fallback={<CodResultSkeleton />}>
      <CodResultContent />
    </Suspense>
  );
}
