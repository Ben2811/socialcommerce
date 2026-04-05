"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  Check,
  Clock,
  Loader2,
  Package,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/shared";
import { useCancelOrder, useOrder } from "../hooks/useOrders";
import type { OrderStatus } from "../types/order";

interface OrderDetailProps {
  orderId: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Chờ xác nhận", variant: "outline" },
  confirmed: { label: "Đã xác nhận", variant: "secondary" },
  shipped: { label: "Đang giao", variant: "secondary" },
  delivered: { label: "Đã giao", variant: "default" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

const timelineSteps = [
  { status: "pending" as const, label: "Chờ xác nhận", icon: Clock },
  { status: "confirmed" as const, label: "Đã xác nhận", icon: Check },
  { status: "shipped" as const, label: "Đang giao", icon: Truck },
  { status: "delivered" as const, label: "Đã giao", icon: Package },
];

function getStepIndex(status: OrderStatus): number {
  if (status === "pending") return 0;
  if (status === "confirmed") return 1;
  if (status === "shipped") return 2;
  if (status === "delivered") return 3;
  return -1;
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const { data: order, isLoading, error } = useOrder(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div>
          <h3 className="mb-1 font-semibold text-destructive">
            Lỗi tải đơn hàng
          </h3>
          <p className="text-sm text-destructive/80">
            {error instanceof Error
              ? error.message
              : "Không thể tải chi tiết đơn hàng"}
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const canCancel = order.status === "pending" || order.status === "confirmed";
  const currentStep = getStepIndex(order.status);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Đơn hàng #{order._id}
            </h2>
            <p className="text-sm text-muted-foreground">
              Đặt hàng vào {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        <div className="mb-6 grid gap-4 border-b border-border pb-6 sm:grid-cols-3">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Tổng cộng</p>
            <p className="text-2xl font-bold text-foreground">
              {formatPrice(order.totalAmount)}
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">
              Số lượng sản phẩm
            </p>
            <p className="text-2xl font-bold text-foreground">
              {order.items.length}
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">
              Cập nhật lần cuối
            </p>
            <p className="text-sm font-medium text-foreground">
              {format(new Date(order.updatedAt), "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => cancelOrder(order._id)}
              disabled={isCancelling}
            >
              {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
            </Button>
          )}
          <Button variant="outline">Liên hệ hỗ trợ</Button>
        </div>
      </div>

      {order.status !== "cancelled" && (
        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            Trạng thái đơn hàng
          </h3>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > index;
              const isCurrent = currentStep === index;

              return (
                <div key={step.status} className="flex flex-1 items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isCompleted || isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted || isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {index === 0 && "Đơn hàng vừa được tạo"}
                      {index === 1 && "Đơn hàng đã được xác nhận"}
                      {index === 2 && "Đơn hàng đang được vận chuyển"}
                      {index === 3 && "Đơn hàng đã được giao thành công"}
                    </p>
                  </div>

                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`hidden h-px flex-1 self-center sm:block ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Sản phẩm trong đơn hàng
        </h3>

        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div
              key={`${item.productId}-${item.sku}-${index}`}
              className="flex items-center justify-between rounded-lg bg-accent/50 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  ID sản phẩm: {item.productId}
                </p>
                <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Địa chỉ giao hàng
          </h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">
              {order.shippingAddress.street}
            </p>
            <p className="text-foreground">
              {order.shippingAddress.state}, {order.shippingAddress.city}
            </p>
            <p className="text-foreground">{order.shippingAddress.zipCode}</p>
            <p className="text-foreground">{order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Thông tin đơn hàng
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Trạng thái hiện tại:{" "}
              <span className="font-medium text-foreground">
                {statusInfo.label}
              </span>
            </p>
            <p className="text-muted-foreground">
              Ngày tạo:{" "}
              <span className="font-medium text-foreground">
                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
              </span>
            </p>
            <p className="text-muted-foreground">
              Cập nhật gần nhất:{" "}
              <span className="font-medium text-foreground">
                {format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm")}
              </span>
            </p>
            <p className="text-muted-foreground">
              Tổng tiền:{" "}
              <span className="font-medium text-foreground">
                {formatPrice(order.totalAmount)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Ghi chú đơn hàng
          </h3>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {order.notes}
          </p>
        </div>
      )}
    </div>
  );
}