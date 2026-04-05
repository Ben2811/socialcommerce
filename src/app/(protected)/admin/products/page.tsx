"use client";

import { useState } from "react";
import {
  useAdminProducts,
  useUpdateAdminProductStatus,
  useDeleteAdminProduct,
} from "@/features/admin/hooks/useAdminProducts";
import { ProductsHeader } from "@/features/admin/components/products/ProductsHeader";
import { ProductsTable } from "@/features/admin/components/products/ProductsTable";
import { DeleteProductDialog } from "@/features/admin/components/products/DeleteProductForm";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import type { AdminProduct } from "@/features/admin/types/product";

const LIMIT = 10;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(
    null,
  );

  const { data: productsData, isLoading, error } = useAdminProducts(page, LIMIT);
  const products = productsData?.items ?? [];
  const totalPages = productsData?.totalPages ?? 1;
  const totalItems = productsData?.totalItems ?? 0;

  const updateStatusMutation = useUpdateAdminProductStatus();
  const deleteProductMutation = useDeleteAdminProduct();

  const handleUpdateStatus = async (
    productId: string,
    status: "approved" | "rejected",
  ) => {
    await updateStatusMutation.mutateAsync({ productId, input: { status } });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId) ?? null;
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    await deleteProductMutation.mutateAsync(deletingProduct._id);
    setDeleteOpen(false);
    setDeletingProduct(null);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,248,237,0.88)_0%,rgba(255,255,255,1)_22%,rgba(247,248,252,1)_100%)] text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <ProductsHeader totalItems={totalItems} />

        <ProductsTable
          products={products}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteProduct}
          isLoading={isLoading}
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại.
          </div>
        )}
      </div>

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={deletingProduct}
        onConfirm={handleConfirmDelete}
        isLoading={deleteProductMutation.isPending}
      />
    </main>
  );
}
