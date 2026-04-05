"use client";

import { useState } from "react";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "@/features/admin/hooks/useAdminCategories";
import { CategoriesHeader } from "@/features/admin/components/categories/CategoriesHeader";
import { CategoriesTable } from "@/features/admin/components/categories/CategoriesTable";
import { CategoryFormDialog } from "@/features/admin/components/categories/CategoryFormDialog";
import { DeleteCategoryDialog } from "@/features/admin/components/categories/DeleteCategoryForm";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import type { AdminCategory, CreateCategoryInput, UpdateCategoryInput } from "@/features/admin/types/category";

const LIMIT = 10;

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null);

  const { data: categoriesData, isLoading, error } = useAdminCategories(page, LIMIT);
  const categories = categoriesData?.items ?? [];
  const totalPages = categoriesData?.totalPages ?? 1;

  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId) ?? null;
    setDeletingCategory(category);
    setDeleteOpen(true);
  };

  const handleSubmitCreate = async (input: CreateCategoryInput) => {
    await createMutation.mutateAsync(input);
    setFormOpen(false);
  };

  const handleSubmitUpdate = async (categoryId: string, input: UpdateCategoryInput) => {
    await updateMutation.mutateAsync({ categoryId, input });
    setFormOpen(false);
    setEditingCategory(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    await deleteMutation.mutateAsync(deletingCategory._id);
    setDeleteOpen(false);
    setDeletingCategory(null);
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,248,237,0.88)_0%,rgba(255,255,255,1)_22%,rgba(247,248,252,1)_100%)] text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <CategoriesHeader categories={categories} onAddCategory={handleAddCategory} />

        <CategoriesTable
          categories={categories}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          isLoading={isLoading}
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Lỗi khi tải dữ liệu danh mục. Vui lòng thử lại.
          </div>
        )}
      </div>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingCategory={editingCategory}
        onSubmitCreate={handleSubmitCreate}
        onSubmitUpdate={handleSubmitUpdate}
        isLoading={isMutating}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deletingCategory}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </main>
  );
}
