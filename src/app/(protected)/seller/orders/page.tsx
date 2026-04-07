"use client";

import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  ClipboardList,
  LayoutGrid,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSellerOrders } from "@/features/orders/hooks/useOrders";
import { SELLER_ORDERS_PAGE_SIZE } from "@/features/orders/constants/seller-orders";
import { SellerOrdersGrid, SellerOrdersTable } from "@/features/orders";

type ViewMode = "grid" | "table";

export default function SellerOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const { data, isLoading, error, refetch } = useSellerOrders(
    currentPage,
    SELLER_ORDERS_PAGE_SIZE,
  );

  const totalPages = data?.totalPages ?? 1;

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
        <div className="flex items-center gap-3">
          {data && (
            <div className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
              {data.totalItems} đơn hàng
            </div>
          )}
          {!isLoading && !error && data && data.items.length > 0 && (
            <div className="flex gap-2 rounded-lg border border-border bg-muted/30 p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
                title="Xem dạng lưới"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 p-0"
                title="Xem dạng bảng"
              >
                <Table2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
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
              {error instanceof Error
                ? error.message
                : "Không thể tải danh sách đơn hàng"}
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
            <h2 className="text-lg font-semibold text-foreground/80">
              Chưa có đơn đặt hàng
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Khi khách hàng đặt mua sản phẩm của bạn, đơn hàng sẽ xuất hiện tại
              đây.
            </p>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <SellerOrdersGrid
          orders={data.items}
          totalItems={data.totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      ) : (
        <SellerOrdersTable
          orders={data.items}
          totalItems={data.totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
