"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { sellerProductsService } from "@/features/seller/services/products.service";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type {
  CreateSellerProductInput,
  SellerProduct,
  SellerProductStatus,
  UpdateSellerProductInput,
  UpdateSellerProductStockInput,
} from "@/features/seller/types/product";
import type { BaseResponse, PaginationResponse } from "@/types/global.types";

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

export async function getSellerProducts(
  page = 1,
  limit = 10,
  status?: SellerProductStatus,
  search?: string,
): Promise<BaseResponse<PaginationResponse<SellerProduct>>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<PaginationResponse<SellerProduct>>();

  return sellerProductsService.getProducts({ page, limit, status, search }, token);
}

export async function createSellerProduct(
  input: CreateSellerProductInput,
): Promise<BaseResponse<SellerProduct>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<SellerProduct>();

  return sellerProductsService.createProduct(input, token);
}

export async function updateSellerProduct(
  id: string,
  input: UpdateSellerProductInput,
): Promise<BaseResponse<SellerProduct>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<SellerProduct>();

  return sellerProductsService.updateProduct(id, input, token);
}

export async function updateSellerProductStock(
  id: string,
  input: UpdateSellerProductStockInput,
): Promise<BaseResponse<SellerProduct>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<SellerProduct>();

  return sellerProductsService.updateProductStock(id, input, token);
}

export async function deleteSellerProduct(
  id: string,
): Promise<BaseResponse<boolean>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<boolean>();

  return sellerProductsService.deleteProduct(id, token);
}

export async function uploadSellerProductImage(
  formData: FormData,
): Promise<BaseResponse<{ url: string }>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<{ url: string }>();

  const url = new URLBuilder().addPath(API_ENDPOINTS.images.upload).build();

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

    const data = (await response.json()) as { url: string };
    return { success: true, data, message: "Tải ảnh thành công" };
  } catch {
    return {
      success: false,
      data: null as unknown as { url: string },
      message: "Lỗi khi tải ảnh lên",
    };
  }
}
