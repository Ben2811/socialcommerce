"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { BaseResponse } from "@/types/global.types";
import type { Address, CreateAddressInput, UpdateAddressInput } from "@/features/profile/types/address.interface";
import { addressService } from "@/features/profile/services/address.service";

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

export async function getAddresses(): Promise<BaseResponse<Address[]>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<Address[]>();
  return addressService.getAddresses(token);
}

export async function getDefaultAddress(): Promise<BaseResponse<Address | null>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<Address | null>();
  return addressService.getDefaultAddress(token);
}

export async function addAddress(input: CreateAddressInput): Promise<BaseResponse<Address>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<Address>();
  return addressService.addAddress(input, token);
}

export async function updateAddress(id: string, input: UpdateAddressInput): Promise<BaseResponse<Address>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<Address>();
  return addressService.updateAddress(id, input, token);
}

export async function deleteAddress(id: string): Promise<BaseResponse<boolean>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<boolean>();
  return addressService.deleteAddress(id, token);
}

export async function setDefaultAddress(id: string): Promise<BaseResponse<Address>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<Address>();
  return addressService.setDefaultAddress(id, token);
}
