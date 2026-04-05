"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMyOrders } from "../hooks/useOrders";
import { OrderListItem } from "./OrderListItem";

interface OrdersListProps {
  pageSize?: number;
}

export function OrdersList({ pageSize = 10 }: OrdersListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useMyOrders(currentPage, pageSize);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-red-500">
          {error instanceof Error ? error.message : "Failed to load orders"}
        </p>
        <Button onClick={() => setCurrentPage(1)}>Try Again</Button>
      </div>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="mb-4 text-muted-foreground">No orders yet</p>
        <p className="text-sm text-muted-foreground">
          Your orders will appear here once you make a purchase.
        </p>
      </div>
    );
  }

  const totalPages = data.totalPages || 1;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {data.items.map((order) => (
          <OrderListItem key={order._id} order={order} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevious}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}