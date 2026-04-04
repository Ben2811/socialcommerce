"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  SellerProduct,
  SellerProductStatus,
} from "@/features/seller/types/product";
import { SellerProductsActions } from "./SellerProductsActions";

interface SellerProductsTableProps {
  products: SellerProduct[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: "all" | SellerProductStatus;
  onStatusFilterChange: (status: "all" | SellerProductStatus) => void;
  onEdit: (product: SellerProduct) => void;
  onUpdateStock: (product: SellerProduct) => void;
  onDelete: (product: SellerProduct) => void;
  isLoading?: boolean;
}

function getStatusLabel(status: SellerProductStatus) {
  if (status === "approved") return "Đã duyệt";
  if (status === "rejected") return "Từ chối";
  return "Chờ duyệt";
}

function getStatusVariant(status: SellerProductStatus) {
  if (status === "approved") {
    return "default";
  }

  if (status === "rejected") {
    return "destructive";
  }

  return "secondary";
}

export function SellerProductsTable({
  products,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onEdit,
  onUpdateStock,
  onDelete,
  isLoading,
}: SellerProductsTableProps) {
  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 px-6 py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription className="mt-1">
              {products.length} sản phẩm hiển thị theo bộ lọc hiện tại
            </CardDescription>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên sản phẩm, danh mục..."
                className="pl-10"
                value={searchTerm}
                aria-label="Tìm kiếm sản phẩm theo tên hoặc danh mục"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <NativeSelect
              className="w-full sm:w-48"
              value={statusFilter}
              aria-label="Lọc sản phẩm theo trạng thái"
              onChange={(e) =>
                onStatusFilterChange(e.target.value as "all" | SellerProductStatus)
              }
            >
              <NativeSelectOption value="all">Tất cả trạng thái</NativeSelectOption>
              <NativeSelectOption value="pending">Chờ duyệt</NativeSelectOption>
              <NativeSelectOption value="approved">Đã duyệt</NativeSelectOption>
              <NativeSelectOption value="rejected">Từ chối</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 py-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Đang tải sản phẩm...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Không tìm thấy sản phẩm phù hợp
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4 w-16">Hình ảnh</TableHead>
                  <TableHead className="px-6 py-4">Tên sản phẩm</TableHead>
                  <TableHead className="px-6 py-4">Danh mục</TableHead>
                  <TableHead className="px-6 py-4">Giá hiển thị</TableHead>
                  <TableHead className="px-6 py-4">Tồn kho</TableHead>
                  <TableHead className="px-6 py-4">Trạng thái</TableHead>
                  <TableHead className="px-6 py-4 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product._id}
                    className="border-border/40 hover:bg-muted/40"
                  >
                    <TableCell className="px-6 py-3">
                      <div className="relative size-10 rounded-md overflow-hidden border border-border/50 bg-muted shrink-0">
                        {product.imageUrls?.[0] ? (
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-muted-foreground text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 font-medium max-w-[220px] truncate">
                      {product.name}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {product.category?.name ?? "-"}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {product.displayPrice.toLocaleString("vi-VN")}₫
                    </TableCell>

                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {product.stock ?? "-"}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <Badge variant={getStatusVariant(product.status)}>
                        {getStatusLabel(product.status)}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-right">
                      <SellerProductsActions
                        product={product}
                        onEdit={onEdit}
                        onUpdateStock={onUpdateStock}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
