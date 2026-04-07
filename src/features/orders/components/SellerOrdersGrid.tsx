"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "../types/order";
import { SellerOrderCard } from "./SellerOrderCard";

interface SellerOrdersGridProps {
  orders: Order[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function SellerOrdersGrid({
  orders,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
}: SellerOrdersGridProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <SellerOrderCard
            key={order._id}
            order={order as Order & { user?: { displayName?: string; email?: string } }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages} • {totalItems} đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <Button
              id="seller-orders-prev-btn"
              variant="outline"
              size="sm"
              disabled={!hasPrevious || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <Button
              id="seller-orders-next-btn"
              variant="outline"
              size="sm"
              disabled={!hasNext || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              className="gap-1"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}