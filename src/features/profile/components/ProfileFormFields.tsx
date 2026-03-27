"use client";

import { User, Mail, Phone, MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UpdateProfileInput } from "@/features/profile/types/user.interface";

interface ProfileFormFieldsProps {
  user: {
    username: string;
    email: string;
    phonenumber?: string;
    address?: string;
  };
  form: UpdateProfileInput;
  errors: Record<string, string>;
  isEditing: boolean;
  onFieldChange: (field: keyof UpdateProfileInput, value: string) => void;
}

export function ProfileFormFields({
  user,
  form,
  errors,
  isEditing,
  onFieldChange,
}: ProfileFormFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <FormField
            icon={<User className="w-4 h-4" />}
            label="Tên người dùng"
            value={user.username}
            editValue={form.username ?? ""}
            isEditing={isEditing}
            error={errors.username}
            onChange={(v) => onFieldChange("username", v)}
          />
          <FormField
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={user.email}
            editValue={form.email ?? ""}
            isEditing={isEditing}
            inputType="email"
            error={errors.email}
            onChange={(v) => onFieldChange("email", v)}
          />
          <FormField
            icon={<Phone className="w-4 h-4" />}
            label="Số điện thoại"
            value={user.phonenumber || "—"}
            editValue={form.phonenumber ?? ""}
            isEditing={isEditing}
            placeholder="Nhập số điện thoại"
            error={errors.phonenumber}
            onChange={(v) => onFieldChange("phonenumber", v)}
          />
          <FormField
            icon={<MapPin className="w-4 h-4" />}
            label="Địa chỉ"
            value={user.address || "—"}
            editValue={form.address ?? ""}
            isEditing={isEditing}
            placeholder="Nhập địa chỉ"
            error={errors.address}
            onChange={(v) => onFieldChange("address", v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FormField({
  icon,
  label,
  value,
  editValue,
  isEditing,
  inputType = "text",
  placeholder,
  error,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editValue: string;
  isEditing: boolean;
  inputType?: string;
  placeholder?: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </Label>
      {!isEditing ? (
        <p className="text-sm font-medium pl-5.5">{value}</p>
      ) : (
        <div className="space-y-1">
          <Input
            type={inputType}
            value={editValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
