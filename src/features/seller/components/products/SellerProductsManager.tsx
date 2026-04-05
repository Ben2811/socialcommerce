"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import {
  useCreateSellerProduct,
  useDeleteSellerProduct,
  useSellerProducts,
  useUpdateSellerProduct,
  useUpdateSellerProductStock,
} from "@/features/seller/hooks/useSellerProducts";
import type {
  CreateSellerProductInput,
  SellerProduct,
  SellerProductStatus,
  UpdateSellerProductInput,
  UpdateSellerProductStockInput,
} from "@/features/seller/types/product";
import { DeleteSellerProductDialog } from "./DeleteSellerProductDialog";
import { SellerProductFormDialog } from "./SellerProductFormDialog";
import { SellerProductsHeader } from "./SellerProductsHeader";
import { SellerProductsTable } from "./SellerProductsTable";
import { SellerStockDialog } from "./SellerStockDialog";

const LIMIT = 10;

type StatusFilter = "all" | SellerProductStatus;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function SellerProductsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const normalizedSearchTerm = searchTerm.trim();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  const [stockOpen, setStockOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState<SellerProduct | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<SellerProduct | null>(
    null,
  );

  const { data: productsData, isLoading, error } = useSellerProducts(
    page,
    LIMIT,
    statusFilter === "all" ? undefined : statusFilter,
    normalizedSearchTerm.length > 0 ? normalizedSearchTerm : undefined,
  );

  const createMutation = useCreateSellerProduct();
  const updateMutation = useUpdateSellerProduct();
  const updateStockMutation = useUpdateSellerProductStock();
  const deleteMutation = useDeleteSellerProduct();

  const products = productsData?.items ?? [];
  const totalItems = productsData?.totalItems ?? 0;
  const totalPages = productsData?.totalPages ?? 1;

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    updateStockMutation.isPending;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: SellerProduct) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleUpdateStock = (product: SellerProduct) => {
    setStockProduct(product);
    setStockOpen(true);
  };

  const handleDeleteProduct = (product: SellerProduct) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const handleSubmitCreate = async (input: CreateSellerProductInput) => {
    try {
      await createMutation.mutateAsync(input);
      toast.success("Đã tạo sản phẩm mới, đang chờ admin duyệt");
      setFormOpen(false);
      setPage(1);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tạo sản phẩm"));
    }
  };

  const handleSubmitUpdate = async (
    productId: string,
    input: UpdateSellerProductInput,
  ) => {
    try {
      await updateMutation.mutateAsync({ productId, input });
      toast.success("Đã cập nhật sản phẩm và chuyển về chờ duyệt");
      setFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể cập nhật sản phẩm"));
    }
  };

  const handleSubmitStock = async (
    productId: string,
    input: UpdateSellerProductStockInput,
  ) => {
    try {
      await updateStockMutation.mutateAsync({ productId, input });
      toast.success("Đã cập nhật tồn kho và chuyển về chờ duyệt");
      setStockOpen(false);
      setStockProduct(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể cập nhật tồn kho"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteMutation.mutateAsync(deletingProduct._id);
      toast.success("Đã xóa sản phẩm");
      setDeleteOpen(false);
      setDeletingProduct(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể xóa sản phẩm"));
    }
  };

  const handleStatusFilterChange = (nextStatus: StatusFilter) => {
    setStatusFilter(nextStatus);
    setPage(1);
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearchTerm(nextSearch);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <SellerProductsHeader
          totalItems={totalItems}
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          onAddProduct={handleAddProduct}
        />

        <SellerProductsTable
          products={products}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onEdit={handleEditProduct}
          onUpdateStock={handleUpdateStock}
          onDelete={handleDeleteProduct}
          isLoading={isLoading}
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            {getErrorMessage(error, "Lỗi khi tải dữ liệu sản phẩm")}
          </div>
        )}
      </div>

      <SellerProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingProduct={editingProduct}
        onSubmitCreate={handleSubmitCreate}
        onSubmitUpdate={handleSubmitUpdate}
        isLoading={isMutating}
      />

      <SellerStockDialog
        open={stockOpen}
        onOpenChange={setStockOpen}
        product={stockProduct}
        onSubmit={handleSubmitStock}
        isLoading={updateStockMutation.isPending}
      />

      <DeleteSellerProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={deletingProduct}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </main>
  );
}
