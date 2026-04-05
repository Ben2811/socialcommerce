"use client";

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
import { CategoriesActions } from "./CategoriesActions";
import type { AdminCategory } from "../../types/category";

interface CategoriesTableProps {
  categories: AdminCategory[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (category: AdminCategory) => void;
  onDelete: (categoryId: string) => void;
  isLoading?: boolean;
}

export function CategoriesTable({
  categories,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  isLoading,
}: CategoriesTableProps) {
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
      <CardHeader className="border-b border-border/60 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách danh mục</CardTitle>
            <CardDescription className="mt-1">
              {filtered.length} danh mục được tìm thấy
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, slug..."
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
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Không tìm thấy danh mục</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Tên danh mục</TableHead>
                  <TableHead className="px-6 py-4">Slug</TableHead>
                  <TableHead className="px-6 py-4">Mô tả</TableHead>
                  <TableHead className="px-6 py-4">Cấp</TableHead>
                  <TableHead className="px-6 py-4">Trạng thái</TableHead>
                  <TableHead className="px-6 py-4 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((category) => (
                  <TableRow
                    key={category._id}
                    className="border-border/40 hover:bg-[#fafafa]"
                  >
                    <TableCell className="px-6 py-4 font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {category.slug}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground max-w-50 truncate">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {category.level ?? 0}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={
                          category.isActive !== false
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }
                      >
                        {category.isActive !== false ? "Hoạt động" : "Ẩn"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <CategoriesActions
                        category={category}
                        onEdit={onEdit}
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
