"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/features/shared";
import type { Order, OrderStatus } from "../types/order";

interface OrderListItemProps {
  order: Order;
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

function getOrderLinkId(order: Order): string {
  return order.id || (order as { _id?: string })._id || "";
}

export function OrderListItem({ order }: OrderListItemProps) {
  const statusInfo = statusConfig[order.status];
  const orderLinkId = getOrderLinkId(order);
  const content = (
    <div className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-3">
          <h3 className="truncate text-sm font-semibold">
            Đơn hàng #{orderLinkId}
          </h3>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <p className="text-muted-foreground">Số lượng sản phẩm</p>
            <p className="font-medium text-foreground">{order.items.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ngày đặt hàng</p>
            <p className="font-medium text-foreground">
              {format(new Date(order.createdAt), "dd/MM/yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="mb-1 text-xs text-muted-foreground">Tổng cộng</p>
        <p className="text-lg font-bold">{formatPrice(order.totalAmount)}</p>
      </div>
    </div>
  );

  if (!orderLinkId) {
    return content;
  }

  return <Link href={`/orders/${orderLinkId}`}>{content}</Link>;
}