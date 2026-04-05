"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductsActions } from "./ProductsActions";
import type { AdminProduct } from "../../types/product";

interface ProductsTableProps {
  products: AdminProduct[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onUpdateStatus: (productId: string, status: "approved" | "rejected") => void;
  onDelete: (productId: string) => void;
  isLoading?: boolean;
}

export function ProductsTable({
  products,
  searchTerm,
  onSearchChange,
  onUpdateStatus,
  onDelete,
  isLoading,
}: ProductsTableProps) {
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
      <CardHeader className="border-b border-border/60 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription className="mt-1">
              {filteredProducts.length} sản phẩm được tìm thấy
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, danh mục..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 py-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Đang tải dữ liệu...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Không tìm thấy sản phẩm
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
                  <TableHead className="px-6 py-4 text-right">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    className="border-border/40 hover:bg-[#fafafa]"
                  >
                    <TableCell className="px-6 py-3">
                      <div className="relative size-10 rounded-md overflow-hidden border border-border/50 bg-gray-50 shrink-0">
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
                    <TableCell className="px-6 py-4 font-medium max-w-[200px] truncate">
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
                      <Badge
                        className={
                          product.status === "approved"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : product.status === "rejected"
                              ? "bg-red-100 text-red-600 hover:bg-red-100"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {product.status === "approved"
                          ? "Đã duyệt"
                          : product.status === "rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <ProductsActions
                        product={product}
                        onUpdateStatus={onUpdateStatus}
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
