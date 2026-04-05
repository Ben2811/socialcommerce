"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { AdminCategory } from "../../types/category";
import { categoryFormSchema } from "../../types/category";
import type { CreateCategoryInput, UpdateCategoryInput } from "../../types/category";

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

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: AdminCategory | null;
  onSubmitCreate: (input: CreateCategoryInput) => Promise<void>;
  onSubmitUpdate: (categoryId: string, input: UpdateCategoryInput) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryFormDialog({ open, ...props }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <CategoryFormInner
            key={props.editingCategory?._id ?? "new"}
            {...props}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CategoryFormInner({
  onOpenChange,
  editingCategory,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading,
}: Omit<CategoryFormDialogProps, "open">) {
  const isEditing = !!editingCategory;

  const form = useForm({
    defaultValues: {
      name: editingCategory?.name ?? "",
      description: editingCategory?.description ?? "",
      slug: editingCategory?.slug ?? "",
      imageUrl: editingCategory?.imageUrl ?? "",
      isActive: editingCategory?.isActive ?? true,
    },
    validators: { onChange: categoryFormSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        description: value.description,
        slug: value.slug,
        imageUrl: value.imageUrl || undefined,
        isActive: value.isActive,
      };
      if (isEditing) {
        await onSubmitUpdate(editingCategory._id, payload);
      } else {
        await onSubmitCreate(payload);
      }
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup className="grid gap-4">
          <form.Field name="name">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Tên danh mục</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (!isEditing) {
                      form.setFieldValue("slug", generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Nhập tên danh mục"
                  disabled={isLoading}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="slug">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="ten-danh-muc"
                  disabled={isLoading}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Mô tả</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nhập mô tả danh mục"
                  disabled={isLoading}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="imageUrl">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  URL hình ảnh (tùy chọn)
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://..."
                  disabled={isLoading}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="isActive">
            {(field) => (
              <Field>
                <div className="flex items-center gap-3">
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    disabled={isLoading}
                  />
                  <FieldLabel htmlFor={field.name}>Hoạt động</FieldLabel>
                </div>
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" variant="orange" disabled={isLoading}>
            {isLoading
              ? "Đang xử lý..."
              : isEditing
                ? "Lưu thay đổi"
                : "Thêm danh mục"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
