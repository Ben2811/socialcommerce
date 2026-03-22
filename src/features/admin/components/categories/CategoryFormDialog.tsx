"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type {
  AdminCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/category";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: AdminCategory | null;
  onSubmitCreate: (input: CreateCategoryInput) => Promise<void>;
  onSubmitUpdate: (categoryId: string, input: UpdateCategoryInput) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  editingCategory,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading,
}: CategoryFormDialogProps) {
  const isEditing = !!editingCategory;

  const [form, setForm] = useState({
    name: "",
    description: "",
    slug: "",
    imageUrl: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (editingCategory) {
        setForm({
          name: editingCategory.name,
          description: editingCategory.description,
          slug: editingCategory.slug,
          imageUrl: editingCategory.imageUrl ?? "",
          isActive: editingCategory.isActive !== false,
        });
      } else {
        setForm({ name: "", description: "", slug: "", imageUrl: "", isActive: true });
      }
      setErrors({});
    }
  }, [open, editingCategory]);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Tên danh mục không được để trống";
    if (!form.slug.trim()) next.slug = "Slug không được để trống";
    if (!form.description.trim()) next.description = "Mô tả không được để trống";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      slug: form.slug,
      imageUrl: form.imageUrl || undefined,
      isActive: form.isActive,
    };

    if (isEditing) {
      await onSubmitUpdate(editingCategory._id, payload);
    } else {
      await onSubmitCreate(payload);
    }
  }

  function onChange(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && typeof value === "string" && !isEditing) {
        next.slug = generateSlug(value);
      }
      return next;
    });
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Nhập tên danh mục"
              disabled={isLoading}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => onChange("slug", e.target.value)}
              placeholder="ten-danh-muc"
              disabled={isLoading}
            />
            {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Nhập mô tả danh mục"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">URL hình ảnh (tùy chọn)</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => onChange("imageUrl", e.target.value)}
              placeholder="https://..."
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) => onChange("isActive", checked)}
              disabled={isLoading}
            />
            <Label htmlFor="isActive">Hoạt động</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#f6a313] text-white hover:bg-[#eb9800]"
            >
              {isLoading
                ? "Đang xử lý..."
                : isEditing
                  ? "Lưu thay đổi"
                  : "Thêm danh mục"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
