"use client";

import { useState, useEffect } from "react";
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
import type { AdminCategory, CreateCategoryInput, UpdateCategoryInput } from "@/features/admin/types/category";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null);

  const { data: categoriesData, isLoading, error } = useAdminCategories();
  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

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
