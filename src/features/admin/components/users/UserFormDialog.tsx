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
import type { User } from "../../types/user";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "../../types/user";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  onSubmitCreate: (input: CreateUserInput) => Promise<void>;
  onSubmitUpdate: (userId: string, input: UpdateUserInput) => Promise<void>;
  isLoading?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  editingUser,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading,
}: UserFormDialogProps) {
  const isEditing = !!editingUser;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phonenumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (editingUser) {
        setForm({
          username: editingUser.username,
          email: editingUser.email,
          password: "",
          phonenumber: editingUser.phonenumber ?? "",
          address: editingUser.address ?? "",
        });
      } else {
        setForm({ username: "", email: "", password: "", phonenumber: "", address: "" });
      }
      setErrors({});
    }
  }, [open, editingUser]);

  function validate() {
    const schema = isEditing ? updateUserSchema : createUserSchema;
    const result = schema.safeParse(form);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        if (!next[field]) next[field] = issue.message;
      }
      return next;
    }
    return {};
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    if (isEditing) {
      await onSubmitUpdate(editingUser._id, {
        username: form.username,
        email: form.email,
        phonenumber: form.phonenumber || undefined,
        address: form.address || undefined,
      });
    } else {
      await onSubmitCreate({
        username: form.username,
        email: form.email,
        password: form.password,
      });
    }
  }

  function onChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Tên người dùng</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => onChange("username", e.target.value)}
              placeholder="Nhập tên người dùng"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="Nhập email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {!isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => onChange("password", e.target.value)}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          {isEditing && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="phonenumber">Số điện thoại</Label>
                <Input
                  id="phonenumber"
                  value={form.phonenumber}
                  onChange={(e) => onChange("phonenumber", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  placeholder="Nhập địa chỉ"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

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
                  : "Thêm người dùng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
