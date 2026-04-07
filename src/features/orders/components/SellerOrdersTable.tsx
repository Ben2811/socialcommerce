"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/shared";
import type { Order } from "../types/order";
import { statusConfig } from "../constants/seller-orders";
import { formatCreatedAt } from "../utils/formatting";

interface SellerOrdersTableProps {
  orders: Order[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "_id",
    header: "Mã đơn hàng",
    cell: ({ row }) => <span className="font-semibold">#{row.getValue("_id")}</span>,
    size: 150,
  },
  {
    accessorKey: "user",
    header: "Khách hàng",
    cell: ({ row }) => {
      const order = row.original;
      const buyerName = order.user?.displayName ?? order.user?.email ?? "Khách hàng";
      return <span>{buyerName}</span>;
    },
    size: 200,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusInfo = statusConfig[status as keyof typeof statusConfig];
      return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      );
    },
    size: 150,
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => formatPrice(row.getValue("totalAmount") as number),
    size: 120,
  },
  {
    accessorKey: "shippingAddress",
    header: "Thành phố",
    cell: ({ row }) => {
      const address = row.original.shippingAddress;
      return <span>{address?.city ?? "N/A"}</span>;
    },
    size: 150,
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => formatCreatedAt(row.getValue("createdAt")),
    size: 180,
  },
];

export function SellerOrdersTable({
  orders,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
}: SellerOrdersTableProps) {
  const pagination: PaginationState = {
    pageIndex: currentPage - 1,
    pageSize: 10,
  };

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(pagination);
        onPageChange(newPagination.pageIndex + 1);
      }
    },
    pageCount: totalPages,
  });

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-semibold text-foreground"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-foreground"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
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