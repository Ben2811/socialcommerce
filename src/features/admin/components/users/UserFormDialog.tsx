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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { User } from "../../types/user";
import { createUserFormSchema, updateUserFormSchema } from "../../types/user";
import type { CreateUserInput, UpdateUserInput } from "../../types/user";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  onSubmitCreate: (input: CreateUserInput) => Promise<void>;
  onSubmitUpdate: (userId: string, input: UpdateUserInput) => Promise<void>;
  isLoading?: boolean;
}

export function UserFormDialog({ open, ...props }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <UserFormInner
            key={props.editingUser?._id ?? "new"}
            {...props}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function UserFormInner({
  onOpenChange,
  editingUser,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading,
}: Omit<UserFormDialogProps, "open">) {
  const isEditing = !!editingUser;

  const form = useForm({
    defaultValues: {
      username: editingUser?.username ?? "",
      email: editingUser?.email ?? "",
      password: "",
      phonenumber: editingUser?.phonenumber ?? "",
      address: editingUser?.address ?? "",
    },
    validators: {
      onChange: isEditing ? updateUserFormSchema : createUserFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await onSubmitUpdate(editingUser._id, {
          username: value.username,
          email: value.email,
          phonenumber: value.phonenumber || undefined,
          address: value.address || undefined,
        });
      } else {
        await onSubmitCreate({
          username: value.username,
          email: value.email,
          password: value.password,
        });
      }
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
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
          <form.Field name="username">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Tên người dùng</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nhập tên người dùng"
                  disabled={isLoading}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nhập email"
                  disabled={isLoading}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          {!isEditing && (
            <form.Field name="password">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    disabled={isLoading}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          )}

          {isEditing && (
            <>
              <form.Field name="phonenumber">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Số điện thoại</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      disabled={isLoading}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="address">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Địa chỉ</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Nhập địa chỉ"
                      disabled={isLoading}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </>
          )}
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
                : "Thêm người dùng"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
