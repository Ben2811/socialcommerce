"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { BaseResponse } from "@/types/global.types";
import type { User, UpdateProfileInput } from "@/features/profile/types/user.interface";
import { userService } from "@/features/profile/services/users.service";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";

async function getToken(): Promise<string | null> {
  return getCookies(tokenType.accessToken);
}

function unauthorizedResponse<T>(): BaseResponse<T> {
  return {
    success: false,
    data: null as T,
    message: "Bạn cần đăng nhập để thực hiện thao tác này",
  };
}

export async function getCurrentUser(): Promise<BaseResponse<User>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<User>();
  return userService.getCurrentUser(token);
}

export async function updateCurrentUser(
  input: UpdateProfileInput,
): Promise<BaseResponse<User>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<User>();
  return userService.updateCurrentUser(input, token);
}

export async function uploadImage(
  formData: FormData,
): Promise<BaseResponse<{ url: string }>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<{ url: string }>();

  const url = new URLBuilder().addPath("api/images").addParam("upload").build();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        data: null as unknown as { url: string },
        message: (err as { message?: string }).message || "Tải ảnh thất bại",
      };
    }
    const data = await response.json() as { url: string };
    return { success: true, data, message: "Tải ảnh thành công" };
  } catch {
    return {
      success: false,
      data: null as unknown as { url: string },
      message: "Lỗi khi tải ảnh lên",
    };
  }
}
