"use client";

import { Calendar, MapPin, User } from "lucide-react";
import { formatPrice } from "@/features/shared";
import type { Order } from "../types/order";
import { statusConfig } from "../constants/seller-orders";
import { formatCreatedAt } from "../utils/formatting";

interface SellerOrderCardProps {
  order: Order & { user?: { displayName?: string; email?: string } };
}

export function SellerOrderCard({ order }: SellerOrderCardProps) {
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