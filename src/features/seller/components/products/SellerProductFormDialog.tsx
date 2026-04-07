"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import Image from "next/image";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { categoriesService } from "@/features/categories/services/categories.service";
import type { Category } from "@/features/categories/types";
import {
  createSellerProductSchema,
  updateSellerProductSchema,
  type CreateSellerProductInput,
  type SellerProduct,
  type UpdateSellerProductInput,
} from "@/features/seller/types/product";
import { uploadSellerProductImage } from "@/actions/seller/products";

type VariantFormState = {
  sku: string;
  attributes?: Record<string, string>;
  price: string;
  stock: string;
};

type ProductFormState = {
  name: string;
  description: string;
  displayPrice: string;
  categoryId: string;
  stock: string;
  inStock: boolean;
  imageUrls: string[];
  variants: VariantFormState[];
};

const EMPTY_VARIANT: VariantFormState = {
  sku: "",
  price: "",
  stock: "",
};

function createInitialFormState(product?: SellerProduct | null): ProductFormState {
  const variants =
    product?.variants && product.variants.length > 0
      ? product.variants.map((variant) => ({
          sku: variant.sku ?? "",
          attributes: variant.attributes,
          price: variant.price !== undefined ? String(variant.price) : "",
          stock: variant.stock !== undefined ? String(variant.stock) : "",
        }))
      : [{ ...EMPTY_VARIANT }];

  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    displayPrice:
      product?.displayPrice !== undefined ? String(product.displayPrice) : "",
    categoryId: product?.category?._id ?? product?.categoryId ?? "",
    stock: product?.stock !== undefined ? String(product.stock) : "",
    inStock: product?.inStock ?? true,
    imageUrls: [...(product?.imageUrls ?? [])],
    variants,
  };
}

interface SellerProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: SellerProduct | null;
  onSubmitCreate: (input: CreateSellerProductInput) => Promise<void>;
  onSubmitUpdate: (id: string, input: UpdateSellerProductInput) => Promise<void>;
  isLoading?: boolean;
}

export function SellerProductFormDialog({
  open,
  onOpenChange,
  editingProduct,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading,
}: SellerProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-hide max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        {open && (
          <SellerProductFormInner
            key={editingProduct?._id ?? "new"}
            editingProduct={editingProduct}
            onOpenChange={onOpenChange}
            onSubmitCreate={onSubmitCreate}
            onSubmitUpdate={onSubmitUpdate}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SellerProductFormInner({
  onOpenChange,
  editingProduct,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading,
}: Omit<SellerProductFormDialogProps, "open">) {
  const isEditing = !!editingProduct;
  const [error, setError] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: createInitialFormState(editingProduct),
    onSubmit: async (values) => {
      setError(null);

      const payloadCandidate = {
        name: values.value.name,
        description: values.value.description.trim() || undefined,
        displayPrice:
          values.value.displayPrice.trim() === ""
            ? Number.NaN
            : Number(values.value.displayPrice),
        categoryId: values.value.categoryId,
        stock:
          values.value.stock.trim() === ""
            ? undefined
            : Number(values.value.stock),
        inStock: values.value.inStock,
        imageUrls: values.value.imageUrls,
        variants: values.value.variants.map((variant) => ({
          sku: variant.sku.trim(),
          attributes: variant.attributes,
          price:
            variant.price.trim() === "" ? Number.NaN : Number(variant.price),
          stock:
            variant.stock.trim() === "" ? undefined : Number(variant.stock),
        })),
      };

      if (isEditing) {
        const parsed = updateSellerProductSchema.safeParse(payloadCandidate);
        if (!parsed.success) {
          setError(
            parsed.error.issues[0]?.message ?? "Dữ liệu sản phẩm không hợp lệ",
          );
          return;
        }

        if (!editingProduct?._id) {
          setError("Không tìm thấy sản phẩm để cập nhật");
          return;
        }

        try {
          await onSubmitUpdate(editingProduct._id, parsed.data);
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Không thể cập nhật sản phẩm",
          );
        }
        return;
      }

      const parsed = createSellerProductSchema.safeParse(payloadCandidate);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Dữ liệu sản phẩm không hợp lệ");
        return;
      }

      try {
        await onSubmitCreate(parsed.data);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Không thể tạo sản phẩm",
        );
      }
    },
  });

  const values = useStore(form.store, (state) => state.values);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useQuery<Category[]>({
    queryKey: ["seller-product-categories"],
    queryFn: async () => {
      const response = await categoriesService.getCategories();
      if (!response.success) {
        throw new Error(response.message || "Không thể tải danh mục");
      }
      return response.data ?? [];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    });

  const isCategoryMissing = useMemo(() => {
    if (!values.categoryId) return false;
    return !categories.some((category) => category._id === values.categoryId);
  }, [categories, values.categoryId]);

  const handleVariantChange = (
    index: number,
    key: keyof VariantFormState,
    value: string,
  ) => {
    const nextVariants = [...values.variants];
    nextVariants[index] = {
      ...nextVariants[index],
      [key]: value,
    };

    form.setFieldValue("variants", nextVariants);
  };

  const addVariant = () => {
    form.setFieldValue("variants", [...values.variants, { ...EMPTY_VARIANT }]);
  };

  const removeVariant = (index: number) => {
    if (values.variants.length <= 1) return;

    form.setFieldValue(
      "variants",
      values.variants.filter((_, idx) => idx !== index),
    );
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setError(null);
    setIsUploadingImages(true);

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await uploadSellerProductImage(formData);
        if (!response.success || !response.data?.url) {
          setError(
            response.message || `Không thể tải ảnh \"${file.name}\" lên Cloudinary`,
          );
          continue;
        }

        uploadedUrls.push(response.data.url);
      }
    } finally {
      setIsUploadingImages(false);
      event.target.value = "";
    }

    if (uploadedUrls.length === 0) return;

    form.setFieldValue(
      "imageUrls",
      Array.from(new Set([...values.imageUrls, ...uploadedUrls])),
    );
  };

  const removeImage = (index: number) => {
    form.setFieldValue(
      "imageUrls",
      values.imageUrls.filter((_, idx) => idx !== index),
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-5"
      >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Tên sản phẩm
              </label>
              <Input
                id="name"
                value={values.name}
                onChange={(e) => form.setFieldValue("name", e.target.value)}
                placeholder="Nhập tên sản phẩm"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Danh mục
              </label>
              <NativeSelect
                id="category"
                value={values.categoryId}
                onChange={(e) => form.setFieldValue("categoryId", e.target.value)}
                disabled={isLoading || isLoadingCategories}
                className="w-full"
              >
                <NativeSelectOption value="">Chọn danh mục</NativeSelectOption>
                {categories.map((category) => (
                  <NativeSelectOption key={category._id} value={category._id}>
                    {category.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {isCategoryMissing && (
                <p className="text-xs text-muted-foreground">
                  Danh mục hiện tại không còn tồn tại. Vui lòng chọn lại.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="displayPrice" className="text-sm font-medium">
                Giá hiển thị
              </label>
              <Input
                id="displayPrice"
                type="number"
                min={0}
                value={values.displayPrice}
                onChange={(e) =>
                  form.setFieldValue("displayPrice", e.target.value)
                }
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">
                Tồn kho tổng
              </label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={values.stock}
                onChange={(e) => form.setFieldValue("stock", e.target.value)}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="inStock" className="text-sm font-medium">
                Trạng thái kho
              </label>
              <div className="flex h-10 items-center gap-3 rounded-md border px-3">
                <Switch
                  id="inStock"
                  checked={values.inStock}
                  onCheckedChange={(checked) =>
                    form.setFieldValue("inStock", checked)
                  }
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">
                  {values.inStock ? "Đang còn hàng" : "Hết hàng"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Mô tả
            </label>
            <Textarea
              id="description"
              rows={3}
              value={values.description}
              onChange={(e) => form.setFieldValue("description", e.target.value)}
              placeholder="Mô tả sản phẩm"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm font-medium">Hình ảnh sản phẩm</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={isLoading || isUploadingImages}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploadingImages}
              >
                <Upload className="size-4" />
                {isUploadingImages ? "Đang tải ảnh..." : "Chọn ảnh"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Ảnh sẽ được tải lên Cloudinary và lưu URL tự động vào sản phẩm.
            </p>

            {values.imageUrls.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                Chưa có ảnh nào. Hãy bấm Chọn ảnh để tải lên.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {values.imageUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`Ảnh sản phẩm ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                        Ảnh chính
                      </span>
                    )}
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="destructive"
                      className="absolute right-2 top-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                      onClick={() => removeImage(index)}
                      disabled={isLoading || isUploadingImages}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Biến thể sản phẩm</h3>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={addVariant}
                disabled={isLoading}
              >
                <Plus className="size-4" />
                Thêm biến thể
              </Button>
            </div>

            <div className="space-y-3">
              {values.variants.map((variant, index) => (
                <div
                  key={`variant-${index}`}
                  className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]"
                >
                  <Input
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(index, "sku", e.target.value)
                    }
                    placeholder="SKU"
                    disabled={isLoading}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    placeholder="Giá"
                    disabled={isLoading}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(index, "stock", e.target.value)
                    }
                    placeholder="Tồn kho"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeVariant(index)}
                    disabled={isLoading || values.variants.length <= 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">
            Khi seller cập nhật sản phẩm, trạng thái sẽ quay về chờ duyệt để admin
            kiểm tra lại.
          </p>
      

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading || isUploadingImages}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading || isUploadingImages}>
            {isLoading
              ? "Đang xử lý..."
              : isEditing
                ? "Lưu thay đổi"
                : "Thêm sản phẩm"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
