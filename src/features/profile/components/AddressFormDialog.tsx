"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { addressSchema } from "../types/address.interface";
import type { Address, CreateAddressInput } from "../types/address.interface";
import { useForm } from "@tanstack/react-form";

interface AddressFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressInput) => void;
  isLoading?: boolean;
  editAddress?: Address | null;
}

const emptyForm: CreateAddressInput = {
  recipientName: "",
  phone: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  isDefault: false,
};

export function AddressFormDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
  editAddress,
}: AddressFormDialogProps) {
  const form = useForm({
    defaultValues: editAddress ? { ...editAddress } : emptyForm,
    validators: {
      onChange: addressSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
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
            <div className="grid grid-cols-2 gap-3">
              <form.Field name="recipientName">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Tên người nhận</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="phone">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Số điện thoại</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="0912345678"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="street">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Địa chỉ (số nhà, tên đường)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="123 Đường Nguyễn Huệ"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <div className="grid grid-cols-3 gap-3">
              <form.Field name="ward">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Phường/Xã</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Phường Bến Nghé"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="district">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Quận/Huyện</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Quận 1"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="city">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Tỉnh/Thành</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="TP. Hồ Chí Minh"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="isDefault">
              {(field) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-normal cursor-pointer"
                    >
                      Đặt làm địa chỉ mặc định
                    </FieldLabel>
                  </div>
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="orange" disabled={isLoading}>
              {editAddress ? "Lưu thay đổi" : "Thêm địa chỉ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
