"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useCurrentUser, useUpdateProfile } from "../hooks/useProfile";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { uploadImage } from "@/actions/profile/profile";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileFormFields } from "./ProfileFormFields";
import { ProfileImages } from "./ProfileImages";
import { profileFormSchema } from "@/features/profile/types/user.interface";
import type { UpdateProfileInput, ProfileFormData } from "@/features/profile/types/user.interface";

export function ProfileCard() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const { setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      phonenumber: "",
      address: "",
    } satisfies ProfileFormData,
    validators: { onChange: profileFormSchema },
    onSubmit: async ({ value }) => {
      const payload: UpdateProfileInput = {
        ...value,
        phonenumber: value.phonenumber || undefined,
        address: value.address || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : [],
      };
      const updated = await updateProfile.mutateAsync(payload);
      if (updated) setUser(updated);
      setIsEditing(false);
    },
  });

  const formValues = useStore(form.store, (state) => state.values);
  const fieldMeta = useStore(form.store, (state) => state.fieldMeta);

  function handleEdit() {
    if (!user) return;
    form.setFieldValue("username", user.username ?? "");
    form.setFieldValue("email", user.email ?? "");
    form.setFieldValue("phonenumber", user.phonenumber ?? "");
    form.setFieldValue("address", user.address ?? "");
    setImageUrls(user.imageUrls ?? []);
    setIsEditing(true);
  }

  function handleCancel() {
    form.reset();
    setIsEditing(false);
  }

  function handleSave() {
    void form.handleSubmit();
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

    setImageUrls((prev) => [...prev, res.data.url]);
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function setAsAvatar(index: number) {
    if (index === 0) return;
    setImageUrls((prev) => {
      const imgs = [...prev];
      const [picked] = imgs.splice(index, 1);
      return [picked, ...imgs];
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

  const derivedErrors: Record<string, string> = {
    username: (fieldMeta.username?.errors?.[0] as string | undefined) || "",
    email: (fieldMeta.email?.errors?.[0] as string | undefined) || "",
    phonenumber: (fieldMeta.phonenumber?.errors?.[0] as string | undefined) || "",
    address: (fieldMeta.address?.errors?.[0] as string | undefined) || "",
  };

  const avatarSrc = (isEditing ? imageUrls[0] : user.imageUrls?.[0]) ?? "";
  const displayImages = isEditing ? imageUrls : (user.imageUrls ?? []);

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
          form={formValues as UpdateProfileInput}
          errors={derivedErrors}
          isEditing={isEditing}
          onFieldChange={(field, value) =>
            form.setFieldValue(field as keyof ProfileFormData, value as string)
          }
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