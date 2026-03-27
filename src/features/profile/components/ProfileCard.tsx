"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useCurrentUser, useUpdateProfile } from "../hooks/useProfile";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { uploadImage } from "@/actions/profile/profile";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileFormFields } from "./ProfileFormFields";
import { ProfileImages } from "./ProfileImages";
import { profileSchema } from "@/features/profile/types/user.interface";
import type { UpdateProfileInput } from "@/features/profile/types/user.interface";

type ProfileFormErrors = Partial<Record<keyof UpdateProfileInput, string>>;

export function ProfileCard() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const { setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UpdateProfileInput>({});
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [uploading, setUploading] = useState(false);

  function handleEdit() {
    if (!user) return;
    setForm({
      username: user.username,
      email: user.email,
      phonenumber: user.phonenumber ?? "",
      address: user.address ?? "",
      imageUrls: user.imageUrls ?? [],
    });
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setForm({});
    setErrors({});
  }

  async function handleSave() {
    const result = profileSchema.safeParse({
      username: form.username,
      email: form.email,
      phonenumber: form.phonenumber ?? "",
      address: form.address ?? "",
    });

    if (!result.success) {
      const fieldErrors: ProfileFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ProfileFormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const payload: UpdateProfileInput = {
      ...form,
      phonenumber: form.phonenumber || undefined,
      address: form.address || undefined,
      imageUrls: (form.imageUrls ?? []).length > 0 ? form.imageUrls : [],
    };
    const updated = await updateProfile.mutateAsync(payload);
    if (updated) setUser(updated);
    setIsEditing(false);
  }

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    const res = await uploadImage(formData);
    setUploading(false);

    if (!res.success || !res.data?.url) {
      toast.error(res.message || "Tải ảnh thất bại");
      return;
    }

    setForm((prev) => ({
      ...prev,
      imageUrls: [...(prev.imageUrls ?? []), res.data.url],
    }));
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      imageUrls: (prev.imageUrls ?? []).filter((_, i) => i !== index),
    }));
  }

  function setAsAvatar(index: number) {
    if (index === 0) return;
    setForm((prev) => {
      const imgs = [...(prev.imageUrls ?? [])];
      const [picked] = imgs.splice(index, 1);
      return { ...prev, imageUrls: [picked, ...imgs] };
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center text-muted-foreground">
            Không thể tải thông tin người dùng.
          </CardContent>
        </Card>
      </div>
    );
  }

  const avatarSrc = (isEditing ? form.imageUrls?.[0] : user.imageUrls?.[0]) ?? "";
  const displayImages = isEditing ? (form.imageUrls ?? []) : (user.imageUrls ?? []);

  return (
    <div className="min-h-screen bg-muted/30 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-4">
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          avatarSrc={avatarSrc}
          isPending={updateProfile.isPending}
          isUploading={uploading}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <ProfileFormFields
          user={user}
          form={form}
          errors={errors}
          isEditing={isEditing}
          onFieldChange={(field, value) => setForm((p) => ({ ...p, [field]: value }))}
        />

        <ProfileImages
          displayImages={displayImages}
          isEditing={isEditing}
          uploading={uploading}
          onFileUpload={handleFileUpload}
          onRemoveImage={removeImage}
          onSetAsAvatar={setAsAvatar}
        />
      </div>
    </div>
  );
}