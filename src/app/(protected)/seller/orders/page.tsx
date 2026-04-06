"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/shared";
import { useSellerOrders } from "@/features/orders/hooks/useOrders";
import type { Order, OrderStatus } from "@/features/orders/types/order";

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  pending: { label: "Chờ xác nhận", variant: "outline", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  confirmed: { label: "Đã xác nhận", variant: "secondary", color: "text-blue-600 bg-blue-50 border-blue-200" },
  shipped: { label: "Đang giao", variant: "secondary", color: "text-purple-600 bg-purple-50 border-purple-200" },
  delivered: { label: "Đã giao", variant: "default", color: "text-green-600 bg-green-50 border-green-200" },
  cancelled: { label: "Đã hủy", variant: "destructive", color: "text-red-600 bg-red-50 border-red-200" },
};

const PAGE_SIZE = 10;

interface SellerOrderCardProps {
  order: Order & { user?: { displayName?: string; email?: string } };
}

function formatCreatedAt(value: string | Date | undefined | null): string {
  if (!value) {
    return "Không rõ thời gian";
  }

  const parsedDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Không rõ thời gian";
  }

  return format(parsedDate, "dd/MM/yyyy HH:mm");
}

function SellerOrderCard({ order }: SellerOrderCardProps) {
  const statusInfo = statusConfig[order.status];
  const buyerName = order.user?.displayName ?? order.user?.email ?? "Khách hàng";

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/30">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-xs text-muted-foreground">Mã đơn hàng</p>
          <p className="truncate text-sm font-semibold text-foreground">#{order._id}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
        <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="text-sm text-foreground">{buyerName}</span>
      </div>

      <div className="mb-4 space-y-2">
        {order.items.map((item, idx) => (
          <div
            key={`${item.productId}-${item.sku}-${idx}`}
            className="flex items-center justify-between text-sm"
          >
            <div className="min-w-0 flex-1">
              <span className="truncate text-foreground">{item.productName ?? `SKU: ${item.sku}`}</span>
              <span className="ml-2 text-xs text-muted-foreground">×{item.quantity}</span>
            </div>
            <span className="ml-4 shrink-0 font-medium text-foreground">
              {formatPrice((item.price ?? 0) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatCreatedAt(order.createdAt)}
          </span>
          {order.shippingAddress && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {order.shippingAddress.city}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Tổng cộng</p>
          <p className="text-base font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
        </div>
      </div>
    </div>
  );
}

export default function SellerOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useSellerOrders(currentPage, PAGE_SIZE);

  const totalPages = data?.totalPages ?? 1;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="mb-5 text-sm font-medium text-muted-foreground">
        <span>Seller</span>
        <span className="mx-1">&gt;</span>
        <span className="text-foreground">Đơn đặt hàng</span>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Đơn đặt hàng</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý các đơn hàng từ khách hàng của bạn
          </p>
        </div>
        {data && (
          <div className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
            {data.totalItems} đơn hàng
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-destructive">Lỗi tải dữ liệu</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Không thể tải danh sách đơn hàng"}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground/80">Chưa có đơn đặt hàng</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Khi khách hàng đặt mua sản phẩm của bạn, đơn hàng sẽ xuất hiện tại đây.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.items.map((order) => (
              <SellerOrderCard
                key={order._id}
                order={order as Order & { user?: { displayName?: string; email?: string } }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-auto flex items-center justify-between gap-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages} • {data.totalItems} đơn hàng
              </p>
              <div className="flex items-center gap-2">
                <Button
                  id="seller-orders-prev-btn"
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevious}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  id="seller-orders-next-btn"
                  variant="outline"
                  size="sm"
                  disabled={!hasNext}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="gap-1"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
